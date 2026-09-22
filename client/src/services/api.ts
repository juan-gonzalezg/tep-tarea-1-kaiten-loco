import type { MenuItem, Order } from '../types.js';
import staticMenu from '../data/menu.json';

const API_BASE = '/api';

// Local storage keys for hybrid persistence (used in Cloudflare Pages when backend is offline)
const STORAGE_KEY_ORDERS = 'kaiten_loco_orders';
const STORAGE_KEY_USERS = 'kaiten_loco_users';

function getLocalUsers(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Default seed user
  return [
    {
      id: 'usr-demo',
      email: 'cliente@kaitenloco.es',
      firstName: 'Carlos',
      lastNamePaternal: 'Pérez',
      lastNameMaternal: 'Gómez',
      hasSecondLastName: true,
      phone: '4821',
      passwordHash: 'Jupiter1SalmonX'
    }
  ];
}

function saveLocalUsers(users: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export async function fetchMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    if (res.ok) return await res.json();
  } catch {
    // Cloudflare Pages / Offline fallback
  }
  return staticMenu as MenuItem[];
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) return await res.json();
    const data = await res.json();
    throw new Error(data.error || 'Error en el login');
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback to localStorage
    const users = getLocalUsers();
    const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user || user.passwordHash !== password) {
      throw new Error('Credenciales inválidas o contraseña rechazada por no complacer a los ancestros del sushi.');
    }
    return {
      message: 'Login exitoso en modo offline/Cloudflare.',
      token: 'hostile-token-' + user.id,
      user
    };
  }
}

export async function registerUser(payload: {
  email: string;
  password: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  hasSecondLastName: boolean;
  phone: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    const data = await res.json();
    throw new Error(data.error || 'Error en el registro');
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback to localStorage
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      throw new Error('Este correo electrónico ya está sufriendo en nuestro sistema.');
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      email: payload.email,
      firstName: payload.firstName,
      lastNamePaternal: payload.lastNamePaternal,
      lastNameMaternal: payload.lastNameMaternal,
      hasSecondLastName: payload.hasSecondLastName,
      phone: payload.phone,
      passwordHash: payload.password
    };
    users.push(newUser);
    saveLocalUsers(users);
    return {
      message: 'Usuario registrado con éxito en la pesadilla de Kaiten Loco (localStorage).',
      user: newUser
    };
  }
}

export async function createOrder(payload: {
  userId: string;
  tableNumber: number;
  items: { item: MenuItem; quantity: number }[];
  sauces: any;
  survey?: any;
  deliveryDetails: any;
}): Promise<{ message: string; order: Order }> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    const data = await res.json();
    throw new Error(data.error || 'Error al procesar el pedido');
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback to localStorage
    let subtotal = 0;
    payload.items.forEach((it) => {
      subtotal += (it.item.priceYen || 120) * (it.quantity || 1);
    });
    const taxYen = Math.round(subtotal * 0.1);
    const totalYen = subtotal + taxYen;

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      userId: payload.userId || 'anon',
      tableNumber: payload.tableNumber || 7,
      items: payload.items,
      sauces: payload.sauces,
      survey: payload.survey,
      deliveryDetails: payload.deliveryDetails,
      totalYen,
      taxYen,
      status: 'ON_CONVEYOR_BELT',
      paid: false,
      createdAt: new Date().toISOString()
    };
    const orders = getLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);

    return {
      message: 'Orden colocada en el carril exprés de Kaiten Loco (localStorage).',
      order: newOrder
    };
  }
}

export async function fetchOrders(userId?: string): Promise<Order[]> {
  try {
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    const res = await fetch(`${API_BASE}/orders`, { headers });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  // Fallback to localStorage
  const orders = getLocalOrders();
  if (userId) {
    return orders.filter((o) => o.userId === userId);
  }
  return orders;
}

export async function processPayment(orderId: string, paymentMethod: string, cardSliderVerification: string) {
  try {
    const res = await fetch(`${API_BASE}/payment/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentMethod, cardSliderVerification })
    });
    if (res.ok) return await res.json();
    const data = await res.json();
    throw new Error(data.error || 'Error en el cobro');
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    // Fallback to localStorage
    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].paid = true;
      orders[idx].status = 'COMPLETED';
      orders[idx].paymentMethod = paymentMethod;
      saveLocalOrders(orders);
      return {
        message: 'Cobro ejecutado con éxito e irreversiblemente debitado.',
        receipt: {
          orderId: orders[idx].id,
          paidAt: new Date().toISOString(),
          amountYen: orders[idx].totalYen,
          taxYen: orders[idx].taxYen,
          status: 'COBRADO',
          verificationProof: cardSliderVerification || 'OK-HOSTILE-99'
        }
      };
    }
    throw new Error('La orden se ha extraviado en la cinta transportadora.');
  }
}

export async function fetchChefSuggestions() {
  try {
    const res = await fetch(`${API_BASE}/suggestions`);
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }
  return {
    blogTitle: 'Blog del Gran Maestro de Kaiten Loco: Secretos de la Cinta Giratoria y el Arroz',
    articles: [
      {
        id: 1,
        title: 'Por qué no debes pedir la salsa dulce en el bocado de calamar',
        author: 'Chef Andrés Gómez',
        snippet: 'El equilibrio entre el vinagre de arroz y la frescura marina se destruye por completo si no respetas el orden sagrado de la cinta.',
        date: '2026-09-18'
      },
      {
        id: 2,
        title: 'La física de las botellas con canica en los restaurantes de cinta',
        author: 'Consejo Gastronómico',
        snippet: 'Aprende a presionar el tapón con dos pulgares sin derramar el 80% del gas sobre tu mesa de comensal.',
        date: '2026-09-12'
      }
    ]
  };
}
