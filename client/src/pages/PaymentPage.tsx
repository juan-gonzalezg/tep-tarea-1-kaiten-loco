import React, { useState, useEffect } from 'react';
import type { OrderItem, SauceSelection, SatisfactionSurvey, Order } from '../types.js';
import { createOrder, processPayment } from '../services/api.js';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';
import { ByzantineModal } from '../components/ByzantineModal.js';
import { HypersensitiveSlider, FakeHyperlink, ChaoticText } from '../components/TortureInputs.js';

export const PaymentPage: React.FC<{
  cart: OrderItem[];
  tableNumber: number;
  deliveryDetails: {
    firstName: string;
    lastNamePaternal: string;
    lastNameMaternal?: string;
    phone: string;
    sauces: SauceSelection;
    survey: SatisfactionSurvey;
  };
  currentUser: any;
  onPaymentSuccess: (order: Order, receipt: any) => void;
  onCancelToCatalog: () => void;
  onGoToBlog: () => void;
}> = ({
  cart,
  tableNumber,
  deliveryDetails,
  currentUser,
  onPaymentSuccess,
  onCancelToCatalog,
  onGoToBlog
}) => {
  const [isByzantineModalOpen, setIsByzantineModalOpen] = useState(false);
  const [isConfirmBannerClicked, setIsConfirmBannerClicked] = useState(false);
  const [cardSliderVerification, setCardSliderVerification] = useState(777);
  const [cardType, setCardType] = useState('Tarjeta de Puntos Kaiten Loco');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasLayoutShiftOccurred, setHasLayoutShiftOccurred] = useState(false);

  // Subtotal & taxes
  const subtotal = cart.reduce((acc, it) => acc + it.item.priceYen * it.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  // Intercept browser back button (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Force user back to Step 1 without deleting data
      e.preventDefault();
      alert('⚠️ Ha usado el botón "Atrás" del navegador nativo. El protocolo de Kaiten Loco lo devuelve al Paso 1 (Selección de piezas) para volver a pasar todo el túnel.');
      onCancelToCatalog();
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onCancelToCatalog]);

  // Actual payment execution after navigating the Byzantine Modal
  const executeFinalPayment = async () => {
    setIsByzantineModalOpen(false);
    setIsProcessing(true);

    try {
      // 1. Create order in backend
      const orderRes = await createOrder({
        userId: currentUser ? currentUser.id : 'guest-' + Date.now(),
        tableNumber,
        items: cart,
        sauces: deliveryDetails.sauces,
        survey: deliveryDetails.survey,
        deliveryDetails: {
          firstName: deliveryDetails.firstName,
          lastNamePaternal: deliveryDetails.lastNamePaternal,
          lastNameMaternal: deliveryDetails.lastNameMaternal,
          phone: deliveryDetails.phone
        }
      });

      // 2. Process simulated payment
      const paymentRes = await processPayment(
        orderRes.order.id,
        cardType,
        'VERIF-SLIDER-' + cardSliderVerification
      );

      playHoverBeep(2000, 0.2);
      onPaymentSuccess(orderRes.order, paymentRes.receipt);
    } catch (err: any) {
      playHarshBuzz();
      alert('Error en la transacción bancaria de Kaiten Loco: ' + (err.message || 'Fallo'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* BYZANTINE MODAL (Opens when clicking to pay) */}
      <ByzantineModal
        isOpen={isByzantineModalOpen}
        onCancelPayment={() => {
          // Option 1 "Aceptar": cancels and sends to catalog!
          setIsByzantineModalOpen(false);
          alert('Ha seleccionado "Aceptar", lo cual cancela la operación y reinicia el pedido.');
          onCancelToCatalog();
        }}
        onProceedPayment={() => {
          // Option 2 "Cancelar": CONTINUES WITH PAYMENT!
          executeFinalPayment();
        }}
        onCloseNothing={() => {
          // Option 3 "No": closes modal
          setIsByzantineModalOpen(false);
        }}
      />

      {/* TOP FLOATING SHAKING BANNER: Half 1 of confirm button ("Confirmar") */}
      <div
        className="shake"
        style={{
          position: 'sticky',
          top: '70px',
          zIndex: 99,
          backgroundColor: '#ffff00',
          border: '4px dashed #ff0000',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          marginBottom: '16px'
        }}
      >
        <span style={{ fontSize: '13px', fontFamily: 'Impact', color: '#ff0000' }}>
          PARTE 1 DE 2 DEL BOTÓN DE PAGO:
        </span>
        <button
          type="button"
          onClick={() => {
            playHoverBeep(1300, 0.06);
            setIsConfirmBannerClicked(true);
            alert('¡Parte 1 ("Confirmar") activada! Ahora debe localizar la Parte 2 ("Procesar cobro") al final de la tabla oculta con scroll.');
          }}
          onMouseEnter={() => playHoverBeep()}
          style={{
            backgroundColor: isConfirmBannerClicked ? '#00cc00' : '#ff0055',
            color: '#fff',
            border: '2px solid #000',
            fontFamily: 'Impact',
            fontSize: '15px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          {isConfirmBannerClicked ? '✓ CONFIRMACIÓN 1/2 REGISTRADA' : '1. CONFIRMAR (CLIC AQUÍ)'}
        </button>
      </div>

      {/* DELIBERATE CUMULATIVE LAYOUT SHIFT (CLS) */}
      <div
        className={`layout-shift-spacer ${hasLayoutShiftOccurred ? 'expanded' : ''}`}
        style={{ height: hasLayoutShiftOccurred ? '90px' : '0px' }}
      >
        {hasLayoutShiftOccurred && (
          <div>
            🍣 ¡PUBLICIDAD INVASIVA DE ÚLTIMO MILISEGUNDO! PRUEBE EL TÉ VERDE HELADO ARTESANAL POR SOLO $90. (EL CONTENIDO SE DESPLAZÓ)
          </div>
        )}
      </div>

      {/* TITLE & HEADER OF PAYMENT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Comic Sans MS', color: '#e60012' }}>
          Paso 3: Liquidación de Cuenta y Mesa #{tableNumber}
        </h2>

        {/* HOSTILE 'ATRÁS' BUTTON: SENDS TO CHEF RECIPE BLOG */}
        <button
          type="button"
          onClick={() => {
            playHarshBuzz();
            alert('El botón "Atrás" lo está desviando a los artículos del Maestro de Kaiten Loco.');
            onGoToBlog();
          }}
          onMouseEnter={() => playHoverBeep()}
          style={{
            backgroundColor: '#e2e2e2',
            border: '1px solid #777',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ◄ Atrás (Desvío gastronómico)
        </button>
      </div>

      {/* CLIENT SUMMARY */}
      <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '12px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 6px 0', fontFamily: 'Papyrus' }}>Comensal Validado:</h4>
        <div style={{ fontSize: '13px' }}>
          <strong>Nombre:</strong> {deliveryDetails.firstName} {deliveryDetails.lastNamePaternal}{' '}
          {deliveryDetails.lastNameMaternal || ''} | <strong>Teléfono Slider:</strong> #{deliveryDetails.phone}
        </div>
      </div>

      {/* HORIZONTAL HIDDEN SCROLL TABLE FOR ITEMS BREAKDOWN */}
      <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '16px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontFamily: 'Impact' }}>
          Desglose de Platos en Cinta (Tabla con Scroll Horizontal Forzado):
        </h3>
        <p style={{ fontSize: '11px', color: '#666' }}>
          Desplace horizontalmente la siguiente caja para inspeccionar los precios y encontrar la Parte 2 del botón de cobro.
        </p>

        <div className="torture-horizontal-scroll" style={{ width: '100%', maxWidth: '100%' }}>
          <table style={{ width: '900px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#000', color: '#fff' }}>
                <th style={{ padding: '6px' }}>Plato</th>
                <th style={{ padding: '6px' }}>Color Plato</th>
                <th style={{ padding: '6px' }}>Precio Unitario</th>
                <th style={{ padding: '6px' }}>Cantidad</th>
                <th style={{ padding: '6px' }}>Subtotal</th>
                <th style={{ padding: '6px' }}>Acción Crítica Oculta</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((it) => (
                <tr key={it.item.id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '6px' }}>{it.item.emoji} {it.item.name}</td>
                  <td style={{ padding: '6px' }}>{it.item.plateColor}</td>
                  <td style={{ padding: '6px' }}>¥{it.item.priceYen}</td>
                  <td style={{ padding: '6px' }}>{it.quantity}</td>
                  <td style={{ padding: '6px' }}>¥{it.item.priceYen * it.quantity}</td>
                  <td style={{ padding: '6px', color: '#999', fontSize: '10px' }}>Inerte</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ padding: '6px', textAlign: 'right' }}>Impuesto Consumo (10%):</td>
                <td style={{ padding: '6px' }}>¥{tax}</td>
                <td></td>
              </tr>
              <tr style={{ backgroundColor: '#ffffcc', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ padding: '6px', textAlign: 'right' }}>TOTAL FINAL:</td>

                {/* CAMOUFLAGED CELL BUTTON:
                    The real payment trigger is a table cell "Total: ¥X (clic aquí para debitar)" in plain black text with default cursor!
                */}
                <td
                  colSpan={2}
                  style={{
                    padding: '8px',
                    color: '#000000',
                    cursor: 'default',
                    border: '2px dashed #ff0000',
                    userSelect: 'none'
                  }}
                  onClick={() => {
                    playHoverBeep(1700, 0.08);
                    setIsByzantineModalOpen(true);
                  }}
                  onMouseEnter={() => {
                    playHoverBeep();
                    // Deliberate CLS trigger when hovering close to total!
                    if (!hasLayoutShiftOccurred) {
                      setHasLayoutShiftOccurred(true);
                    }
                  }}
                  title="Celda interactiva camuflada de cobro directo"
                >
                  Total: ¥{total.toLocaleString()} (clic aquí para debitar)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PARTE 2 DE 2 DEL BOTÓN DE PAGO: "Procesar cobro" */}
        <div style={{ marginTop: '14px', textAlign: 'right' }}>
          <button
            type="button"
            className="btn-primary-disguised-disabled"
            onClick={() => {
              if (!isConfirmBannerClicked) {
                playHarshBuzz();
                alert('Debe presionar primero la Parte 1 ("Confirmar") en el banner amarillo flotante de arriba.');
                return;
              }
              playHoverBeep(1500, 0.08);
              setIsByzantineModalOpen(true);
            }}
            onMouseEnter={() => {
              playHoverBeep();
              if (!hasLayoutShiftOccurred) {
                setHasLayoutShiftOccurred(true);
              }
            }}
          >
            2. Procesar cobro (Parte 2/2)
          </button>
        </div>
      </div>

      {/* CARD SELECTION TORTURE */}
      <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontFamily: 'Comic Sans MS' }}>
          Método de Pago y Cripto-Deslizador de Seguridad:
        </h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {['Tarjeta de Puntos Kaiten Loco', 'Tarjeta de Débito Hostil', 'Billetes Físicos en Caja'].map((method) => (
            <label key={method} style={{ fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="cardTypeRadio"
                checked={cardType === method}
                onChange={() => setCardType(method)}
              />
              {' '}{method}
            </label>
          ))}
        </div>

        <HypersensitiveSlider
          value={cardSliderVerification}
          onChange={(val) => setCardSliderVerification(val)}
          min={100}
          max={999}
          label="Código de Seguridad CVV (Ajuste a ciegas)"
        />
      </div>

      {/* TRAP BUTTON: "BORRAR TODO Y REINICIAR" WHERE SUBMIT IS EXPECTED */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fffae6',
          padding: '16px',
          border: '3px ridge #ff0055'
        }}
      >
        <div>
          <FakeHyperlink text="Reclamar seguro contra atragantamiento con pulpo" />
        </div>

        {/* GIANT FLASHY TRAP BUTTON EXACTLY WHERE USER LOOKS */}
        <button
          type="button"
          className="btn-destructive-hyper-flashy"
          onClick={() => {
            playHarshBuzz();
            alert('¡BOTÓN TRAMPA ACTIVADO! Ha pulsado el botón llamativo en lugar del botón gris o la celda camuflada. Todo el pedido ha sido descartado.');
            onCancelToCatalog();
          }}
          onMouseEnter={() => playHoverBeep()}
        >
          BORRAR TODO Y REINICIAR ORDEN
        </button>
      </div>

      {isProcessing && (
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#ff0000', fontWeight: 'bold' }}>
          <ChaoticText text="Procesando cobro en el sistema bancario de Kaiten Loco..." />
        </div>
      )}
    </div>
  );
};
