import React, { useState, useEffect } from 'react';
import type { Order } from '../types.js';
import { fetchOrders } from '../services/api.js';
import { playHoverBeep } from '../sound/soundEffects.js';
import { ChaoticText, FakeHyperlink } from '../components/TortureInputs.js';

export const HistoryPage: React.FC<{
  currentUser: any;
  onSelectOrderReceipt: (order: Order) => void;
}> = ({ currentUser, onSelectOrderReceipt }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders(currentUser ? currentUser.id : undefined)
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 className="blink">Consultando archivo de cuentas y deudas de Kaiten Loco...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '16px' }}>
      {/* DESTRUCTIVE CONTRAST TITLE BANNER */}
      <div
        className="contrast-destructive-lime"
        style={{
          border: '4px dashed #ffff00',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        <h2 style={{ margin: '0 0 6px 0', fontSize: '26px', fontFamily: 'Impact' }}>
          HISTORIAL DE CUENTAS, CONSUMO Y SANCIONES EN MESA
        </h2>
        <p style={{ margin: 0, fontSize: '13px' }}>
          <ChaoticText text="Todos los platos retirados de la cinta quedan grabados indeleblemente en los registros contables." />
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fff', border: '2px solid #000' }}>
          <p>No se encontraron registros de órdenes para esta mesa.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: '#ffffff',
                border: '3px solid #000',
                padding: '16px',
                boxShadow: '6px 6px 0 #ffaa00'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
                <div>
                  <span style={{ fontFamily: 'Impact', fontSize: '18px', color: '#e60012' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                    Mesa #{order.tableNumber} • {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      backgroundColor: order.paid ? '#00cc00' : '#ff0055',
                      color: '#fff',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '4px'
                    }}
                  >
                    {order.paid ? 'COBRADO Y DEBITADO' : 'PENDIENTE DE PAGO'}
                  </span>
                </div>
              </div>

              {/* CLIENT DETAILS */}
              <div style={{ margin: '10px 0', fontSize: '12px' }}>
                <strong>Comensal:</strong> {order.deliveryDetails?.firstName} {order.deliveryDetails?.lastNamePaternal}{' '}
                {order.deliveryDetails?.lastNameMaternal || ''} (Tel: #{order.deliveryDetails?.phone})
              </div>

              {/* SUSHIS ORDERED */}
              <div style={{ backgroundColor: '#fffdf0', border: '1px solid #ddd', padding: '10px', margin: '8px 0' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>
                  Platos retirados de la cinta:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px' }}>
                  {order.items.map((it, idx) => (
                    <li key={idx} style={{ margin: '4px 0' }}>
                      {it.item.emoji} <strong>{it.item.name}</strong> x{it.quantity} — ¥
                      {it.item.priceYen * it.quantity} ({it.item.plateColor})
                    </li>
                  ))}
                </ul>
              </div>

              {/* SAUCES & TOTAL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  Salsas: {order.sauces?.wasabiExtra ? 'Wasabi Extra, ' : ''}
                  {order.sauces?.gariGinger ? 'Gari, ' : ''}
                  Gotas matcha: {order.sauces?.matchaPowderDrops}
                </div>

                <div style={{ fontSize: '16px', fontFamily: 'Impact', color: '#000' }}>
                  TOTAL CON IMPUESTO: ¥{order.totalYen?.toLocaleString()}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FakeHyperlink text="Solicitar reembolso judicial en Tokio" />

                <button
                  type="button"
                  className="btn-primary-disguised-disabled"
                  onClick={() => {
                    playHoverBeep(1400, 0.05);
                    onSelectOrderReceipt(order);
                  }}
                  onMouseEnter={() => playHoverBeep()}
                >
                  Ver Recibo Amarillo/Blanco ►
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
