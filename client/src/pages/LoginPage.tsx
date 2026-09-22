import React, { useState } from 'react';
import { loginUser } from '../services/api.js';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';
import { ChaoticText, FakeHyperlink } from '../components/TortureInputs.js';

export const LoginPage: React.FC<{
  onLoginSuccess: (user: any) => void;
  onGoToRegister: () => void;
}> = ({ onLoginSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hostileError, setHostileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      playHarshBuzz();
      setHostileError('Debe llenar todos los campos de tormento.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      playHoverBeep(1800, 0.1);
      onLoginSuccess(res.user);
    } catch (err: any) {
      playHarshBuzz();
      setHostileError(err.message || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  const handleClearTrap = () => {
    playHarshBuzz();
    setEmail('');
    setPassword('');
    alert('¡BOTÓN TRAMPA ACTIVADO! Se han borrado sus credenciales sin diálogo de confirmación.');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '30px auto', padding: '24px', backgroundColor: '#fff', border: '4px solid #ff0000', boxShadow: '8px 8px 0 #000' }}>
      <h2 style={{ fontFamily: 'Impact', color: '#e60012', textAlign: 'center', margin: '0 0 10px 0' }}>
        ACCESO DE CLIENTES A KAITEN LOCO
      </h2>

      <p style={{ fontSize: '12px', textAlign: 'center', color: '#444' }}>
        <ChaoticText text="Ingrese sus credenciales de comensal para acceder a la cinta giratoria." />
      </p>

      {/* HOSTILE REAL-TIME ERROR */}
      {hostileError && (
        <div
          className="blink-fast"
          style={{
            backgroundColor: '#ff0000',
            color: '#fff',
            padding: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}
        >
          🚨 {hostileError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
            Correo Electrónico:
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              // Hostile real-time error on first character
              if (val.length === 1) {
                playHarshBuzz();
                setHostileError('¡El primer carácter ingresado no conforma un correo válido!');
              } else if (val.length > 1 && !val.includes('@')) {
                setHostileError('Falta el símbolo arroba (@). Escriba más rápido.');
              } else {
                setHostileError(null);
              }
            }}
            onMouseEnter={() => playHoverBeep()}
            placeholder="cliente@kaitenloco.es"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: hostileError ? '2px solid red' : '2px solid black',
              backgroundColor: '#fffffa'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
            Contraseña Secreta de Pescado y Planetas:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (val.length === 1) {
                playHarshBuzz();
                setHostileError('Una contraseña de un solo carácter ofende las tradiciones culinarias.');
              } else {
                setHostileError(null);
              }
            }}
            onMouseEnter={() => playHoverBeep()}
            placeholder="••••••••••••"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '2px solid black',
              backgroundColor: '#fffffa'
            }}
          />
          <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
            (Demostración rápida de credencial válida: <code>cliente@kaitenloco.es</code> / <code>Jupiter1SalmonX</code>)
          </div>
        </div>

        {/* INVERTED BUTTONS AND TRAP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          {/* TRAP BUTTON BORRAR TODO (Where user expects submit) */}
          <button
            type="button"
            className="btn-destructive-hyper-flashy"
            onClick={handleClearTrap}
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '13px !important', padding: '10px 18px !important' }}
          >
            BORRAR TODO / RESETEAR
          </button>

          {/* REAL SUBMIT (Looks disabled) */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-disguised-disabled"
            onMouseEnter={() => playHoverBeep()}
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión (Gris)'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px dotted #ccc', paddingTop: '12px' }}>
        <span style={{ fontSize: '12px' }}>¿No tiene cuenta todavía? </span>
        <button
          type="button"
          onClick={() => {
            playHoverBeep(1200, 0.05);
            onGoToRegister();
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
          Crear cuenta con validación hostil de contraseña
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <FakeHyperlink text="¿Olvidó su contraseña? Haga clic aquí para no recibir ayuda" />
      </div>
    </div>
  );
};
