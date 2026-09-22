import React, { useState } from 'react';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';

// Alphabetical numbers list
const SPANISH_ALPHABETICAL_NUMBERS = [
  { label: 'Cero (0)', value: 0 },
  { label: 'Cinco (5)', value: 5 },
  { label: 'Cuatro (4)', value: 4 },
  { label: 'Diez (10)', value: 10 },
  { label: 'Dos (2)', value: 2 },
  { label: 'Nueve (9)', value: 9 },
  { label: 'Ocho (8)', value: 8 },
  { label: 'Seis (6)', value: 6 },
  { label: 'Siete (7)', value: 7 },
  { label: 'Tres (3)', value: 3 },
  { label: 'Uno (1)', value: 1 },
];

export const AlphabeticalNumberSelect: React.FC<{
  value: number;
  onChange: (val: number) => void;
  id?: string;
  name?: string;
}> = ({ value, onChange, id, name }) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => {
        playHoverBeep(700, 0.05);
        onChange(Number(e.target.value));
      }}
      onMouseEnter={() => playHoverBeep()}
      style={{
        padding: '6px',
        backgroundColor: '#ffffdd',
        border: '2px solid #000',
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: '13px',
        cursor: 'pointer'
      }}
    >
      {SPANISH_ALPHABETICAL_NUMBERS.map((opt) => (
        <option key={opt.label} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

// Hypersensitive slider without numeric value
export const HypersensitiveSlider: React.FC<{
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}> = ({ value, onChange, min = 0, max = 9999, label = 'Deslizador de Alta Sensibilidad' }) => {
  return (
    <div style={{ margin: '10px 0', padding: '8px', border: '1px dotted red' }}>
      <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>
        {label} <span style={{ color: '#bbb' }}>(Valor oculto por seguridad criptográfica)</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => {
          playHoverBeep(300 + (Number(e.target.value) % 1000), 0.02);
          onChange(Number(e.target.value));
        }}
        onMouseEnter={() => playHoverBeep()}
        style={{ width: '100%', cursor: 'crosshair', accentColor: '#ff0000' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#999' }}>
        <span>Mínimo Absoluto</span>
        <span>Máximo Especulativo</span>
      </div>
    </div>
  );
};

// Torture Date Picker: Month-by-month back/forward clicks, no year jump
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const TortureDatePicker: React.FC<{
  selectedDate: Date;
  onChange: (date: Date) => void;
}> = ({ selectedDate, onChange }) => {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());

  const handlePrevMonth = () => {
    playHoverBeep(600, 0.03);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    playHoverBeep(800, 0.03);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <div
      style={{
        border: '3px ridge #ffaa00',
        backgroundColor: '#fffdf0',
        padding: '10px',
        maxWidth: '280px',
        margin: '8px 0',
        boxShadow: '4px 4px 0 #000'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <button
          type="button"
          onClick={handlePrevMonth}
          onMouseEnter={() => playHoverBeep()}
          style={{ cursor: 'pointer', background: '#e0e0e0', border: '1px solid #999', fontSize: '12px' }}
        >
          ◄ Mes anterior
        </button>
        <span style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'Papyrus, fantasy' }}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          onMouseEnter={() => playHoverBeep()}
          style={{ cursor: 'pointer', background: '#e0e0e0', border: '1px solid #999', fontSize: '12px' }}
        >
          Mes siguiente ►
        </button>
      </div>
      <p style={{ fontSize: '9px', color: '#a00', margin: '2px 0 6px 0', textAlign: 'center' }}>
        ⚠️ Para cambiar de año, debe retroceder o avanzar 12 meses de manera secuencial.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const isSelected =
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                playHoverBeep(1200, 0.04);
                onChange(new Date(currentYear, currentMonth, day));
              }}
              onMouseEnter={() => playHoverBeep()}
              style={{
                padding: '4px 2px',
                fontSize: '11px',
                border: '1px solid #ddd',
                backgroundColor: isSelected ? '#ff0055' : '#fff',
                color: isSelected ? '#fff' : '#000',
                cursor: 'pointer'
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Chaotic text: alternating 6 fonts & random font sizes
const FONTS = [
  'Comic Sans MS, cursive',
  'Papyrus, fantasy',
  'Impact, sans-serif',
  'Brush Script MT, cursive',
  'Courier New, monospace',
  'Times New Roman, serif'
];

const SIZES = ['11px', '22px', '13px', '18px', '10px', '26px', '14px'];

export const ChaoticText: React.FC<{ text: string; baseColor?: string }> = ({ text, baseColor }) => {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, i) => {
        const font = FONTS[i % FONTS.length];
        const size = SIZES[i % SIZES.length];
        return (
          <span
            key={i}
            style={{
              fontFamily: font,
              fontSize: size,
              color: baseColor || undefined,
              display: 'inline-block',
              margin: '0 2px'
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

// Fake Hyperlink: looks clickable and underlined in blue, but is totally inert
export const FakeHyperlink: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span
      className="fake-hyperlink"
      onClick={() => playHarshBuzz()}
      onMouseEnter={() => playHoverBeep(1600, 0.02)}
      title="Este enlace no hace absolutamente nada"
    >
      {text}
    </span>
  );
};

// Disguised Action Button: authentic click action disguised as plain text
export const DisguisedButton: React.FC<{
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ text, onClick, style }) => {
  return (
    <button
      type="button"
      className="real-action-disguised"
      onClick={() => {
        playHoverBeep(900, 0.05);
        onClick();
      }}
      onMouseEnter={() => playHoverBeep(1000, 0.01)}
      style={style}
    >
      {text}
    </button>
  );
};
