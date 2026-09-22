import React, { useState } from 'react';
import { playHoverBeep } from '../sound/soundEffects.js';
import { FakeHyperlink, DisguisedButton } from './TortureInputs.js';

export const HostileHeader: React.FC<{
  activeTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  tableNumber: number;
  onTableChange?: (tbl: number) => void;
  currentUser: any;
  onLogout: () => void;
}> = ({ activeTab, onNavigate, cartCount, tableNumber, onTableChange: _onTableChange, currentUser, onLogout }) => {
  const [isFugitiveOpen, setIsFugitiveOpen] = useState(false);

  return (
    <header style={{ borderBottom: '5px double #ff0000', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* OPPOSE MARQUEE 1: Moving left */}
      <div className="marquee-container" style={{ backgroundColor: '#ffff00', color: '#ff0000', fontSize: '12px' }}>
        <span className="marquee-left">
          🍣 🔥 OFERTA LIMITADA: EL ATÚN PUEDE O NO ESTAR FRESCO HOY 🔥 COMPRE RÁPIDO O PIERDA SU SILLA 🍣 KAITEN LOCO EXPRÉS 🍣
        </span>
      </div>

      {/* OPPOSE MARQUEE 2: Moving right */}
      <div className="marquee-container" style={{ backgroundColor: '#00ffea', color: '#0000aa', fontSize: '11px' }}>
        <span className="marquee-right">
          ⚠️ AVISO LEGAL: NO NOS HACEMOS RESPONSABLES POR ESPINAS, RETARDOS EN LA CINTA O MAREOS VISUALES ⚠️ CÓDIGO DE CLIENTE: #{tableNumber * 941} ⚠️
        </span>
      </div>

      {/* MAIN NAV BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', flexWrap: 'wrap', gap: '8px' }}>
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className="plate-rotating"
            style={{ fontSize: '32px', cursor: 'wait' }}
            title="Cinta transportadora en rotación infinita"
          >
            🍥
          </div>
          <div>
            <h1
              className="blink"
              style={{
                margin: 0,
                fontSize: '26px',
                color: '#e60012',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '1px',
                textShadow: '2px 2px 0px #ffff00'
              }}
            >
              KAITEN LOCO - SUSHI EN CINTA
            </h1>
            <div style={{ fontSize: '9px', color: '#00aa00', fontFamily: 'Courier New' }}>
              RESTAURANTE DE SUSHI GIRATORIO - VERSIÓN DE TORTURA OPERATIVA V4.9
            </div>
          </div>
        </div>

        {/* FUGITIVE MENU & NAVIGATION */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* FUGITIVE DROPDOWN (Zero-delay on mouse leave) */}
          <div
            className="fugitive-menu-wrapper"
            onMouseEnter={() => {
              playHoverBeep(1100, 0.02);
              setIsFugitiveOpen(true);
            }}
            onMouseLeave={() => {
              // 0 delay: if mouse leaves 1px, vanishes immediately
              setIsFugitiveOpen(false);
            }}
          >
            <button
              type="button"
              style={{
                backgroundColor: '#ffffaa',
                border: '2px dotted #ff0000',
                padding: '4px 8px',
                fontSize: '11px',
                fontFamily: 'Comic Sans MS',
                cursor: 'pointer'
              }}
            >
              📂 Menú Secreto Kaiten Loco ▼
            </button>
            {isFugitiveOpen && (
              <div
                className="fugitive-menu-dropdown"
                onMouseLeave={() => setIsFugitiveOpen(false)}
              >
                <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px' }}>
                  (Cuidado: se cierra si se desvía 1px)
                </div>
                <div style={{ padding: '3px 0' }}>
                  <DisguisedButton text="🍣 Catálogo de Platos Giratorios" onClick={() => onNavigate('catalog')} />
                </div>
                <div style={{ padding: '3px 0' }}>
                  <DisguisedButton text="📜 Historial de Cobros y Multas" onClick={() => onNavigate('history')} />
                </div>
                <div style={{ padding: '3px 0' }}>
                  <DisguisedButton text="📖 Blog de Recetas del Maestro (Desvío)" onClick={() => onNavigate('blog')} />
                </div>
              </div>
            )}
          </div>

          {/* REAL ACTION DISGUISED AS ORDINARY TEXT */}
          <DisguisedButton
            text="[Ver Catálogo]"
            onClick={() => onNavigate('catalog')}
            style={{ fontWeight: activeTab === 'catalog' ? 'bold' : 'normal', color: '#000', fontSize: '13px' }}
          />

          {/* FAKE HYPERLINK (DOES NOTHING) */}
          <FakeHyperlink text="Promociones 50% Descuento (No Clic)" />

          {/* REAL ACTION DISGUISED AS PLAIN TEXT */}
          <DisguisedButton
            text="[Historial de Pedidos]"
            onClick={() => onNavigate('history')}
            style={{ fontWeight: activeTab === 'history' ? 'bold' : 'normal', color: '#000', fontSize: '13px' }}
          />

          {/* FAKE HYPERLINK (DOES NOTHING) */}
          <FakeHyperlink text="Atención al Cliente VIP" />

          {/* CART BADGE */}
          <button
            type="button"
            onClick={() => {
              playHoverBeep(900, 0.05);
              onNavigate('checkout');
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{
              backgroundColor: '#ffdd00',
              border: '2px solid #000',
              padding: '6px 12px',
              fontFamily: 'Impact',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🛒 Platos en Mesa:</span>
            <span
              style={{
                backgroundColor: '#ff0055',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '50%',
                fontSize: '12px'
              }}
            >
              {cartCount}
            </span>
          </button>

          {/* USER INFO & LOGOUT */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <span style={{ color: '#444' }}>Cliente: <strong>{currentUser.firstName}</strong></span>
              <button
                type="button"
                className="btn-destructive-hyper-flashy"
                onClick={onLogout}
                style={{ padding: '4px 8px !important', fontSize: '11px !important' }}
              >
                CERRAR SESIÓN
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <DisguisedButton text="[Iniciar Sesión]" onClick={() => onNavigate('login')} />
              <span>|</span>
              <DisguisedButton text="[Registrarse]" onClick={() => onNavigate('register')} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
