import React, { useState, useEffect } from 'react';
import { playHarshBuzz } from '../sound/soundEffects.js';

const SPINNER_MESSAGES = [
  'Optimizando arroz shari...',
  'Afilando cuchillo yanagiba...',
  'Contando granos de sésamo...',
  'Calibrando velocidad de la cinta giratoria...',
  'Verificando temperatura del atún rojo...',
  'Discutiendo con el maestro itamae...',
  'Comprobando rotación de salsa de soja...'
];

export const FakeSpinner: React.FC<{
  isLoading: boolean;
  onFinish: () => void;
  durationMs?: number;
}> = ({ isLoading, onFinish, durationMs = 1500 }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    window.scrollTo(0, 0);
    playHarshBuzz();
    setMsgIndex(Math.floor(Math.random() * SPINNER_MESSAGES.length));

    const timer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isLoading, durationMs, onFinish]);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}
    >
      <div
        className="plate-rotating"
        style={{ fontSize: '72px' }}
      >
        🍣
      </div>
      <div
        className="blink"
        style={{
          fontFamily: 'Comic Sans MS, cursive',
          fontSize: '22px',
          color: '#e60012',
          fontWeight: 'bold'
        }}
      >
        {SPINNER_MESSAGES[msgIndex]}
      </div>
      <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Courier New' }}>
        POR FAVOR ESPERE: PROHIBIDO CERRAR LA VENTANA O RESPIRAR FUERTE
      </div>
    </div>
  );
};
