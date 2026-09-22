import React, { useState, useEffect } from 'react';
import { playHoverBeep, playHarshBuzz, playCountdownTick } from '../sound/soundEffects.js';

export const ByzantineModal: React.FC<{
  isOpen: boolean;
  onCancelPayment: () => void; // Triggered when clicking "Aceptar"
  onProceedPayment: () => void; // Triggered when clicking "Cancelar"!
  onCloseNothing: () => void; // Triggered when clicking "No"
}> = ({ isOpen, onCancelPayment, onProceedPayment, onCloseNothing }) => {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playHarshBuzz();
          setIsResetting(true);
          setTimeout(() => {
            setIsResetting(false);
          }, 800);
          return 30; // Resets countdown, does not cancel order!
        }
        if (prev <= 10) {
          playCountdownTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        className={secondsLeft < 10 ? 'shake' : ''}
        style={{
          backgroundColor: '#fffbe6',
          border: '5px ridge #ff0000',
          padding: '24px',
          maxWidth: '520px',
          width: '90%',
          position: 'relative',
          boxShadow: '10px 10px 0px #000'
        }}
      >
        {/* 8x8px CAMOUFLAGED FAKE/TINY CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => {
            playHarshBuzz();
            alert('¡Esta X minúscula era una trampa! Se ha agregado Wasabi adicional a su orden.');
          }}
          title="X"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            padding: 0,
            fontSize: '6px',
            lineHeight: '6px',
            backgroundColor: '#fffbe6',
            color: '#ebdca4', // Camouflaged with background
            border: 'none',
            cursor: 'pointer'
          }}
        >
          x
        </button>

        {/* FALSE URGENCY COUNTDOWN */}
        <div
          className="blink-fast"
          style={{
            backgroundColor: '#ff0000',
            color: '#ffff00',
            padding: '8px',
            fontWeight: 900,
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '14px',
            fontFamily: 'Impact, sans-serif',
            border: '2px dashed yellow'
          }}
        >
          ⏰ TIENE {secondsLeft} SEGUNDOS ANTES DE QUE SU SUSHI SEA LIBERADO A OTRO CLIENTE
        </div>

        {isResetting && (
          <div style={{ backgroundColor: '#ffdd00', padding: '6px', textAlign: 'center', fontSize: '11px', color: '#a00' }}>
            🔄 ¡Tiempo agotado! Recargando cinta transportadora y reordenando campos...
          </div>
        )}

        <h3
          style={{
            fontFamily: 'Comic Sans MS, cursive',
            color: '#111',
            fontSize: '20px',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          ¿Desea no interrumpir el proceso de no confirmación?
        </h3>

        <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', fontStyle: 'italic', marginBottom: '20px' }}>
          Considere cuidadosamente su respuesta lógica antes de proceder o abstenerse de no cancelar.
        </p>

        {/* PARADOXICAL OPTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px', flexWrap: 'wrap' }}>
          {/* BOTÓN 1: "Aceptar" -> Cancela la operación y vuelve al inicio */}
          <button
            type="button"
            className="btn-destructive-hyper-flashy"
            onClick={() => {
              playHarshBuzz();
              onCancelPayment();
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '14px !important', padding: '10px 16px !important' }}
          >
            Aceptar
          </button>

          {/* BOTÓN 2: "Cancelar" -> CONTINÚA CON EL PAGO */}
          <button
            type="button"
            className="btn-primary-disguised-disabled"
            onClick={() => {
              playHoverBeep(1200, 0.08);
              onProceedPayment();
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '14px', padding: '10px 16px', border: '2px solid #bbb' }}
          >
            Cancelar
          </button>

          {/* BOTÓN 3: "No" -> Cierra el modal sin hacer nada */}
          <button
            type="button"
            onClick={() => {
              playHoverBeep();
              onCloseNothing();
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{
              backgroundColor: '#ffffaa',
              border: '2px solid #555',
              padding: '10px 16px',
              fontFamily: 'Courier New',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            No
          </button>
        </div>

        {/* REAL CLOSE LINK: Microscópico y humillante al pie */}
        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <button
            type="button"
            onClick={onCloseNothing}
            style={{
              background: 'none',
              border: 'none',
              color: '#d4cfb0', // Super light grey/yellow camouflaged
              fontSize: '8px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            No gracias, prefiero perder dinero y pasar hambre
          </button>
        </div>
      </div>
    </div>
  );
};
