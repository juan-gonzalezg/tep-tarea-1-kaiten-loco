import React, { useState } from 'react';
import { registerUser } from '../services/api.js';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';
import {
  HypersensitiveSlider,
  TortureDatePicker,
  ChaoticText,
  FakeHyperlink
} from '../components/TortureInputs.js';

export const RegisterPage: React.FC<{
  onRegisterSuccess: (user: any) => void;
  onGoToLogin: () => void;
}> = ({ onRegisterSuccess, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastNamePaternal, setLastNamePaternal] = useState('');
  const [lastNameMaternal, setLastNameMaternal] = useState('');
  const [hasSecondLastName, setHasSecondLastName] = useState(true);
  const [phoneSlider, setPhoneSlider] = useState(3419);
  const [birthDate, setBirthDate] = useState(new Date(2026, 0, 1));

  // Hostile revealed password rules tracking
  const [revealedRuleIndex, setRevealedRuleIndex] = useState(0);
  const [hostileError, setHostileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ALL_RULES = [
    'Regla 1: La contraseña debe tener al menos 8 caracteres y contener al menos un número.',
    'Regla 2: La contraseña debe contener el nombre de un planeta del sistema solar (ej: Jupiter, Marte, Saturno).',
    'Regla 3: Por motivos fonéticos, la contraseña NO puede contener dos vocales consecutivas (ej: "io", "ea", "ou").',
    'Regla 4: La contraseña debe incluir al menos un número romano en mayúscula (I, V, X, L, C, D, M).',
    'Regla 5: La contraseña debe contener el nombre de un pescado o marisco (ej: Salmon, Atun, Langostino, Calamar, Anguila, Pulpo).'
  ];

  const validatePasswordClient = (pass: string): { ok: boolean; failedRuleIdx: number; msg: string } => {
    if (pass.length < 8 || !/\d/.test(pass)) {
      return { ok: false, failedRuleIdx: 0, msg: ALL_RULES[0] };
    }
    const planets = ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'júpiter', 'saturno', 'urano', 'neptuno', 'pluton', 'plutón'];
    const lower = pass.toLowerCase();
    if (!planets.some((p) => lower.includes(p))) {
      return { ok: false, failedRuleIdx: 1, msg: ALL_RULES[1] };
    }
    if (/[aeiouáéíóú]{2}/i.test(pass)) {
      return { ok: false, failedRuleIdx: 2, msg: ALL_RULES[2] };
    }
    if (!/[IVXLCDM]/.test(pass)) {
      return { ok: false, failedRuleIdx: 3, msg: ALL_RULES[3] };
    }
    const fishes = [
      'atun', 'atún', 'salmon', 'salmón', 'langostino', 'calamar', 'anguila',
      'pulpo', 'vieira', 'erizo', 'trucha', 'maguro', 'sake', 'ebi', 'ika', 'unagi', 'toro'
    ];
    if (!fishes.some((f) => lower.includes(f))) {
      return { ok: false, failedRuleIdx: 4, msg: ALL_RULES[4] };
    }
    return { ok: true, failedRuleIdx: 5, msg: '¡Contraseña aprobada por los ancestros!' };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastNamePaternal) {
      playHarshBuzz();
      setHostileError('Faltan campos obligatorios para registrar su identidad.');
      return;
    }

    const check = validatePasswordClient(password);
    if (!check.ok) {
      playHarshBuzz();
      // Reveal rules progressively
      if (check.failedRuleIdx >= revealedRuleIndex) {
        setRevealedRuleIndex(check.failedRuleIdx + 1);
      }
      setHostileError(`REQUISITO SECRETO REVELADO: ${check.msg}`);
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        email,
        password,
        firstName,
        lastNamePaternal,
        lastNameMaternal: hasSecondLastName ? lastNameMaternal : undefined,
        hasSecondLastName,
        phone: phoneSlider.toString()
      });
      playHoverBeep(1800, 0.15);
      alert('¡Registro exitoso! Ya puede ordenar en Kaiten Loco.');
      onRegisterSuccess(res.user);
    } catch (err: any) {
      playHarshBuzz();
      setHostileError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleClearTrap = () => {
    playHarshBuzz();
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastNamePaternal('');
    setLastNameMaternal('');
    setPhoneSlider(5000);
    alert('¡FORMULARIO VACIADO! Todos sus datos han desaparecido.');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '24px', backgroundColor: '#fff', border: '4px solid #000', boxShadow: '8px 8px 0 #ffaa00' }}>
      <h2 style={{ fontFamily: 'Impact', color: '#e60012', textAlign: 'center', margin: '0 0 8px 0' }}>
        REGISTRO DE NUEVO CLIENTE KAITEN LOCO
      </h2>

      <p style={{ fontSize: '12px', textAlign: 'center', color: '#555' }}>
        <ChaoticText text="Complete los formularios de tortura operativa para crear su perfil en el restaurante." />
      </p>

      {/* ERROR ALERT */}
      {hostileError && (
        <div
          className="blink-fast"
          style={{
            backgroundColor: '#ff0000',
            color: '#fff',
            padding: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '16px',
            border: '2px dashed yellow'
          }}
        >
          🚨 {hostileError}
        </div>
      )}

      {/* REVEALED RULES LIST */}
      {revealedRuleIndex > 0 && (
        <div style={{ backgroundColor: '#fffae6', border: '2px solid #ffaa00', padding: '10px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#a00', marginBottom: '4px' }}>
            Reglas de Contraseña Desbloqueadas Hasta Ahora:
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px' }}>
            {ALL_RULES.slice(0, revealedRuleIndex).map((rule, idx) => (
              <li key={idx} style={{ margin: '2px 0' }}>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Primer Nombre:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onMouseEnter={() => playHoverBeep()}
              placeholder="Ej: Kenji"
              style={{ width: '100%', padding: '8px', border: '2px solid black' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Apellido Paterno:
            </label>
            <input
              type="text"
              value={lastNamePaternal}
              onChange={(e) => setLastNamePaternal(e.target.value)}
              onMouseEnter={() => playHoverBeep()}
              placeholder="Ej: Tanaka"
              style={{ width: '100%', padding: '8px', border: '2px solid black' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasSecondLastName}
              onChange={(e) => setHasSecondLastName(e.target.checked)}
            />
            {' '}¿Posee segundo apellido?
          </label>
          {hasSecondLastName && (
            <input
              type="text"
              value={lastNameMaternal}
              onChange={(e) => setLastNameMaternal(e.target.value)}
              onMouseEnter={() => playHoverBeep()}
              placeholder="Segundo apellido (materno)"
              style={{ width: '100%', padding: '8px', marginTop: '6px', border: '2px solid black' }}
            />
          )}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Correo Electrónico:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onMouseEnter={() => playHoverBeep()}
            placeholder="usuario@kaitenloco.es"
            style={{ width: '100%', padding: '8px', border: '2px solid black' }}
          />
        </div>

        {/* HOSTILE PASSWORD INPUT */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Contraseña Secreta (Requisitos no revelados por adelantado):
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onMouseEnter={() => playHoverBeep()}
            placeholder="Escriba a ciegas y pruebe..."
            style={{ width: '100%', padding: '8px', border: '2px solid black', backgroundColor: '#fffffa' }}
          />
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            (Ejemplo válido que cumple todas las reglas: <code>Jupiter1SalmonX</code>)
          </div>
        </div>

        {/* PHONE SLIDER */}
        <HypersensitiveSlider
          value={phoneSlider}
          onChange={(val) => setPhoneSlider(val)}
          min={0}
          max={9999}
          label="Teléfono Móvil (Slider Hipersensible 0-9999)"
        />

        {/* TORTURE DATE PICKER FOR BIRTHDATE */}
        <div style={{ margin: '14px 0' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
            Fecha de Nacimiento (Calendario sin salto de año - Clic individual por mes):
          </label>
          <TortureDatePicker
            selectedDate={birthDate}
            onChange={(d) => setBirthDate(d)}
          />
          <div style={{ fontSize: '11px', color: '#555' }}>
            Fecha seleccionada: {birthDate.toLocaleDateString()}
          </div>
        </div>

        {/* BUTTONS WITH TRAP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          {/* TRAP BUTTON */}
          <button
            type="button"
            className="btn-destructive-hyper-flashy"
            onClick={handleClearTrap}
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '12px !important', padding: '10px 16px !important' }}
          >
            RESTABLECER Y BORRAR TODO
          </button>

          {/* REAL SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-disguised-disabled"
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '13px', padding: '10px 20px' }}
          >
            {loading ? 'Validando secretos...' : 'Registrarme en Kaiten Loco (Gris)'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px dotted #ccc', paddingTop: '10px' }}>
        <span style={{ fontSize: '12px' }}>¿Ya tiene cuenta? </span>
        <button
          type="button"
          onClick={() => {
            playHoverBeep(1100, 0.05);
            onGoToLogin();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#0000ee',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Iniciar sesión directamente
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <FakeHyperlink text="Condiciones de esclavitud de sushi en Japón (No Clic)" />
      </div>
    </div>
  );
};
