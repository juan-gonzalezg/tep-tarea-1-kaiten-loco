import React from 'react';
import type { Order } from '../types.js';
import { playHoverBeep } from '../sound/soundEffects.js';
import { ChaoticText } from './TortureInputs.js';

export const InvoiceModal: React.FC<{
  order: Order | null;
  receipt?: any;
  onClose: () => void;
  onOrderAgain: () => void;
}> = ({ order, receipt, onClose, onOrderAgain }) => {
  if (!order) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '5px double #ff0055',
          padding: '24px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '10px 10px 0 #ffff00'
        }}
      >
        {/* BANNER WITH DESTRUCTIVE YELLOW-ON-WHITE CONTRAST */}
        <div
          className="contrast-destructive-yellow"
          style={{
            padding: '12px',
            border: '2px solid #ffff00',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>
            🍣 FACTURA OFICIAL DE COBRO KAITEN LOCO 🍣
          </h2>
          <div style={{ fontSize: '12px' }}>
            ORDEN #{order.id} • REGISTRO FISCAL KAITEN-LOCO-99
          </div>
        </div>

        <div style={{ fontSize: '12px', marginBottom: '14px' }}>
          <div><strong>Mesa Asignada:</strong> #{order.tableNumber}</div>
          <div>
            <strong>Cliente:</strong> {order.deliveryDetails.firstName} {order.deliveryDetails.lastNamePaternal}{' '}
            {order.deliveryDetails.lastNameMaternal || ''}
          </div>
          <div><strong>Teléfono Deslizador:</strong> #{order.deliveryDetails.phone}</div>
          <div><strong>Fecha de Débito:</strong> {new Date(order.createdAt).toLocaleString()}</div>
          <div><strong>Método:</strong> {order.paymentMethod || 'Tarjeta Kaiten Loco Pay'}</div>
          {receipt?.verificationProof && (
            <div><strong>Comprobante Criptográfico:</strong> {receipt.verificationProof}</div>
          )}
        </div>

        <div style={{ borderTop: '2px dashed #000', borderBottom: '2px dashed #000', padding: '10px 0', margin: '12px 0' }}>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
            Platos Consumidos en la Cinta:
          </div>
          {order.items.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '4px 0' }}>
              <span>{it.item.emoji} {it.item.name} x{it.quantity}</span>
              <span>¥{it.item.priceYen * it.quantity}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '6px' }}>
            <span>Impuesto al Consumo (10%):</span>
            <span>¥{order.taxYen}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', fontFamily: 'Impact', marginTop: '8px' }}>
            <span>TOTAL DEBITADO:</span>
            <span>¥{order.totalYen.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ margin: '12px 0', fontSize: '11px', color: '#888' }}>
          <ChaoticText text="Gracias por su visita a Kaiten Loco. Por favor limpie su mesa y devuelva los platos apilados según su color." />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            type="button"
            className="btn-primary-disguised-disabled"
            onClick={() => {
              playHoverBeep(1100, 0.05);
              onClose();
            }}
            onMouseEnter={() => playHoverBeep()}
          >
            Cerrar Recibo (Gris)
          </button>

          <button
            type="button"
            className="btn-destructive-hyper-flashy"
            onClick={() => {
              playHoverBeep(1600, 0.08);
              onOrderAgain();
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
          >
            VOLVER A LA CINTA Y COMER MÁS
          </button>
        </div>
      </div>
    </div>
  );
};
