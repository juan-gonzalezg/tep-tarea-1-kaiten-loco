import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { User, MenuItem, Order, SauceSelection } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.resolve(process.cwd(), 'src/data/db.json');
const MENU_PATH = path.resolve(process.cwd(), 'src/data/menu.json');

interface Database {
  users: User[];
  orders: Order[];
}

function readDb(): Database {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial: Database = { users: [], orders: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return { users: [], orders: [] };
  }
}

function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function readMenu(): MenuItem[] {
  try {
    const raw = fs.readFileSync(MENU_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading menu:', err);
    return [];
  }
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Kaiten Loco Hostile Core operational' });
});

// Menu
app.get('/api/menu', (req: Request, res: Response) => {
  const menu = readMenu();
  res.json(menu);
});

// Secret password validator helper
export function validateHostilePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Debe contener al menos 8 caracteres.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Debe contener al menos 1 número.' };
  }
  const planets = ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'júpiter', 'saturno', 'urano', 'neptuno', 'pluton', 'plutón'];
  const lower = password.toLowerCase();
  const hasPlanet = planets.some(p => lower.includes(p));
  if (!hasPlanet) {
    return { valid: false, error: 'Debe contener el nombre de un planeta del sistema solar (ej: Jupiter, Marte).' };
  }
  // No consecutive vowels (a, e, i, o, u, á, é, í, ó, ú)
  if (/[aeiouáéíóú]{2}/i.test(password)) {
    return { valid: false, error: 'No puede contener dos vocales consecutivas.' };
  }
  // Roman numeral (I, V, X, L, C, D, M)
  if (!/[IVXLCDM]/.test(password)) {
    return { valid: false, error: 'Debe contener al menos un número romano en mayúscula (I, V, X, L, C, D o M).' };
  }
  // Fish name in Spanish or romaji
  const fishes = [
    'atun', 'atún', 'salmon', 'salmón', 'langostino', 'calamar', 'anguila',
    'pulpo', 'vieira', 'erizo', 'trucha', 'maguro', 'sake', 'ebi', 'ika', 'unagi', 'toro'
  ];
  const hasFish = fishes.some(f => lower.includes(f));
  if (!hasFish) {
    return { valid: false, error: 'Debe contener el nombre en español de un pescado o marisco (ej: Salmon, Atun, Langostino, Calamar, Anguila).' };
  }
  return { valid: true };
}

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, firstName, lastNamePaternal, lastNameMaternal, hasSecondLastName, phone } = req.body;

  if (!email || !password || !firstName || !lastNamePaternal || !phone) {
    res.status(400).json({ error: 'Faltan campos obligatorios para su registro tortuoso.' });
    return;
  }

  const passCheck = validateHostilePassword(password);
  if (!passCheck.valid) {
    res.status(422).json({ error: passCheck.error });
    return;
  }

  const db = readDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'Este correo electrónico ya está sufriendo en nuestro sistema.' });
    return;
  }

  const newUser: User = {
    id: 'usr-' + Date.now(),
    email,
    firstName,
    lastNamePaternal,
    lastNameMaternal,
    hasSecondLastName: !!hasSecondLastName,
    phone,
    passwordHash: password, // For simulation
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({
    message: 'Usuario registrado con éxito en la pesadilla de Kaiten Loco.',
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastNamePaternal: newUser.lastNamePaternal,
      phone: newUser.phone
    }
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = readDb();

  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || user.passwordHash !== password) {
    res.status(401).json({ error: 'Credenciales inválidas o contraseña rechazada por no complacer a los ancestros del sushi.' });
    return;
  }

  res.json({
    message: 'Login exitoso. Bienvenido al conveyor belt.',
    token: 'hostile-token-' + user.id,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastNamePaternal: user.lastNamePaternal,
      lastNameMaternal: user.lastNameMaternal,
      phone: user.phone
    }
  });
});

// Orders: Get user orders
app.get('/api/orders', (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const db = readDb();
  if (!userId) {
    // Return all or recent if no user specified
    res.json(db.orders);
    return;
  }
  const userOrders = db.orders.filter(o => o.userId === userId);
  res.json(userOrders);
});

// Orders: Create new order
app.post('/api/orders', (req: Request, res: Response) => {
  const { userId, tableNumber, items, sauces, survey, deliveryDetails } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'No ha seleccionado ningún plato de la cinta giratoria.' });
    return;
  }

  let subtotal = 0;
  items.forEach((it: any) => {
    subtotal += (it.item.priceYen || 120) * (it.quantity || 1);
  });
  const taxYen = Math.round(subtotal * 0.1);
  const totalYen = subtotal + taxYen;

  const newOrder: Order = {
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
    userId: userId || 'anon',
    tableNumber: tableNumber || Math.floor(1 + Math.random() * 24),
    items,
    sauces: sauces || {
      shoyuNormal: true,
      shoyuSweet: false,
      wasabiExtra: false,
      gariGinger: true,
      matchaPowderDrops: 2
    },
    survey,
    deliveryDetails: deliveryDetails || {
      firstName: 'Cliente',
      lastNamePaternal: 'Desesperado',
      phone: '0000'
    },
    totalYen,
    taxYen,
    status: 'ON_CONVEYOR_BELT',
    paid: false,
    createdAt: new Date().toISOString()
  };

  const db = readDb();
  db.orders.unshift(newOrder);
  writeDb(db);

  res.status(201).json({
    message: 'Orden colocada en el carril exprés de Kaiten Loco.',
    order: newOrder
  });
});

// Payment: Process payment
app.post('/api/payment/process', (req: Request, res: Response) => {
  const { orderId, paymentMethod, cardSliderVerification } = req.body;
  const db = readDb();

  const orderIndex = db.orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    res.status(404).json({ error: 'La orden se ha extraviado en la cinta transportadora.' });
    return;
  }

  db.orders[orderIndex].paid = true;
  db.orders[orderIndex].status = 'COMPLETED';
  db.orders[orderIndex].paymentMethod = paymentMethod || 'Tarjeta Kaiten Loco Pay';
  writeDb(db);

  res.json({
    message: 'Cobro ejecutado con éxito e irreversiblemente debitado.',
    receipt: {
      orderId: db.orders[orderIndex].id,
      paidAt: new Date().toISOString(),
      amountYen: db.orders[orderIndex].totalYen,
      taxYen: db.orders[orderIndex].taxYen,
      status: 'COBRADO',
      verificationProof: cardSliderVerification || 'OK-HOSTILE-99'
    }
  });
});

// Chef suggestions / blog for the elusive "Atrás" redirect
app.get('/api/suggestions', (req: Request, res: Response) => {
  res.json({
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
  });
});

app.listen(PORT, () => {
  console.log(`🍣 Servidor Backend Kaiten Loco ejecutándose en http://localhost:${PORT}`);
});
