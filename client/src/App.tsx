import { useState, useEffect } from 'react';
import type { MenuItem, OrderItem, Order } from './types.js';
import { initHostileAudio, playHoverBeep, playHarshBuzz } from './sound/soundEffects.js';
import { HostileHeader } from './components/HostileHeader.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { MicroScreensCheckout } from './pages/MicroScreensCheckout.js';
import { PaymentPage } from './pages/PaymentPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { RecipeBlogPage } from './pages/RecipeBlogPage.js';
import { InvoiceModal } from './components/InvoiceModal.js';

export function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [tableNumber, setTableNumber] = useState<number>(7);
  const [cart, setCart] = useState<OrderItem[]>([
    // Seed initial plate for instant action
    {
      item: {
        id: 'sush-01',
        name: 'Atún Rojo Clásico',
        japaneseName: 'Atún Maguro Fresco',
        category: 'Nigiri',
        plateColor: 'yellow',
        priceYen: 120,
        description: 'El clásico bocado de atún rojo de Kaiten Loco cortado a mano.',
        emoji: '🍣',
        calories: 82,
        stock: 50
      },
      quantity: 2
    }
  ]);

  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  // Attempt audio initialization
  useEffect(() => {
    const handleGesture = () => {
      initHostileAudio();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.item.id === item.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, { item, quantity }];
    });
  };

  const handleNavigate = (tab: string) => {
    playHoverBeep(1000, 0.04);
    window.scrollTo(0, 0);
    setActiveTab(tab);
  };

  const handleLogout = () => {
    playHarshBuzz();
    setCurrentUser(null);
    alert('Sesión cerrada. Regresando al catálogo.');
    setActiveTab('catalog');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HostileHeader
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((acc, it) => acc + it.quantity, 0)}
        tableNumber={tableNumber}
        onTableChange={setTableNumber}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* BODY CONTENT ROUTED BY TAB */}
      <main style={{ flex: 1, padding: '8px' }}>
        {activeTab === 'catalog' && (
          <CatalogPage
            cart={cart}
            onAddToCart={handleAddToCart}
            onGoToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {activeTab === 'checkout' && (
          <MicroScreensCheckout
            cart={cart}
            tableNumber={tableNumber}
            onProceedToPayment={(details) => {
              setDeliveryDetails(details);
              handleNavigate('payment');
            }}
            onGoToBlog={() => handleNavigate('blog')}
            onResetOrder={() => {
              setCart([]);
              handleNavigate('catalog');
            }}
          />
        )}

        {activeTab === 'payment' && (
          <PaymentPage
            cart={cart}
            tableNumber={tableNumber}
            deliveryDetails={
              deliveryDetails || {
                firstName: currentUser?.firstName || 'Invitado',
                lastNamePaternal: currentUser?.lastNamePaternal || 'Anon',
                phone: currentUser?.phone || '1234',
                sauces: {
                  shoyuNormal: true,
                  shoyuSweet: false,
                  wasabiExtra: false,
                  gariGinger: true,
                  matchaPowderDrops: 2
                },
                survey: {
                  rating: 5,
                  willingToReturn: true,
                  comments: 'Sin comentarios'
                }
              }
            }
            currentUser={currentUser}
            onPaymentSuccess={(order, receipt) => {
              setLastCompletedOrder(order);
              setLastReceipt(receipt);
              setShowInvoiceModal(true);
              setCart([]); // Cleared upon successful billing
            }}
            onCancelToCatalog={() => handleNavigate('catalog')}
            onGoToBlog={() => handleNavigate('blog')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            currentUser={currentUser}
            onSelectOrderReceipt={(order) => {
              setLastCompletedOrder(order);
              setShowInvoiceModal(true);
            }}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              handleNavigate('catalog');
            }}
            onGoToRegister={() => handleNavigate('register')}
          />
        )}

        {activeTab === 'register' && (
          <RegisterPage
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              handleNavigate('catalog');
            }}
            onGoToLogin={() => handleNavigate('login')}
          />
        )}

        {activeTab === 'blog' && (
          <RecipeBlogPage
            onResumeOrder={() => {
              // Resumes to where user was
              if (cart.length > 0) {
                handleNavigate(deliveryDetails ? 'payment' : 'checkout');
              } else {
                handleNavigate('catalog');
              }
            }}
          />
        )}
      </main>

      {/* INVOICE RECEIPT MODAL */}
      {showInvoiceModal && (
        <InvoiceModal
          order={lastCompletedOrder}
          receipt={lastReceipt}
          onClose={() => setShowInvoiceModal(false)}
          onOrderAgain={() => {
            setShowInvoiceModal(false);
            handleNavigate('catalog');
          }}
        />
      )}

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '3px solid #ff0000',
          backgroundColor: '#fffae6',
          padding: '16px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#666',
          marginTop: '40px'
        }}
      >
        <div>
          🍣 Kaiten Loco - Sushi en Cinta © 2026. Todos los derechos reservados. Diseñado para desorientar y entretener.
        </div>
        <div style={{ marginTop: '4px', fontSize: '9px', color: '#999' }}>
          Tecnología: TypeScript + React (Vite) + Node.js Express + Web Audio API.
        </div>
      </footer>
    </div>
  );
}

export default App;
