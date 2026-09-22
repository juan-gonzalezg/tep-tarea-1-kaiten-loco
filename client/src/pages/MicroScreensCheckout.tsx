import React, { useState } from 'react';
import type { OrderItem, SauceSelection, SatisfactionSurvey } from '../types.js';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';
import {
  AlphabeticalNumberSelect,
  HypersensitiveSlider
} from '../components/TortureInputs.js';
import { FakeSpinner } from '../components/FakeSpinner.js';

export const MicroScreensCheckout: React.FC<{
  cart: OrderItem[];
  tableNumber: number;
  onProceedToPayment: (orderDetails: {
    firstName: string;
    lastNamePaternal: string;
    lastNameMaternal?: string;
    phone: string;
    sauces: SauceSelection;
    survey: SatisfactionSurvey;
  }) => void;
  onGoToBlog: () => void;
  onResetOrder: () => void;
}> = ({ cart: _cart, tableNumber: _tableNumber, onProceedToPayment, onGoToBlog, onResetOrder }) => {
  // Micro-screens: 'A' (firstName) -> 'B' (lastNamePaternal) -> 'C' (secondLastName) -> 'D' (phone) -> '2.1' (sauces) -> '2.2' (survey) -> '2.3' (audioPhone)
  const [currentStep, setCurrentStep] = useState<string>('A');
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [nextPendingStep, setNextPendingStep] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastNamePaternal, setLastNamePaternal] = useState('');
  const [hasSecondLastName, setHasSecondLastName] = useState<'yes' | 'no' | null>(null);
  const [lastNameMaternal, setLastNameMaternal] = useState('');
  const [certifiedNoSecondLastName, setCertifiedNoSecondLastName] = useState(false);
  const [phoneSlider, setPhoneSlider] = useState(4821);

  // Surprise steps states
  const [sauces, setSauces] = useState<SauceSelection>({
    shoyuNormal: true,
    shoyuSweet: false,
    wasabiExtra: false,
    gariGinger: true,
    matchaPowderDrops: 2
  });
  const [surveyRating, setSurveyRating] = useState(5);
  const [surveyWilling, setSurveyWilling] = useState(true);
  const [surveyComment, setSurveyComment] = useState('');
  const [audioConfirmationPlayed, setAudioConfirmationPlayed] = useState(false);

  // Inverted logic checkbox
  const [invertedCheckbox, setInvertedCheckbox] = useState(false);

  // Hostile errors
  const [hostileError, setHostileError] = useState<string | null>(null);

  // Progress percentage calculation with regression!
  const getProgress = () => {
    switch (currentStep) {
      case 'A': return { pct: 20, label: 'Paso 1 de 3 (33%)' };
      case 'B': return { pct: 35, label: 'Paso 1.5 de 3 (50%)' };
      case 'C': return { pct: 50, label: 'Paso 2 de 3 (60%)' };
      case 'D': return { pct: 60, label: 'Paso 2.1 de 3 (75%... casi listo)' };
      // SURPRISE REGRESSION!
      case '2.1': return { pct: 40, label: '⚠️ REGRESIÓN: Paso 2.1 no anunciado (40%)' };
      case '2.2': return { pct: 45, label: '⚠️ REGRESIÓN: Paso 2.2 Encuesta preventiva (45%)' };
      case '2.3': return { pct: 55, label: '⚠️ REGRESIÓN: Paso 2.3 Audio de validación (55%)' };
      default: return { pct: 50, label: 'Paso Indeterminado' };
    }
  };

  const triggerStepTransition = (next: string) => {
    setNextPendingStep(next);
    setIsSpinnerLoading(true);
  };

  const handleSpinnerDone = () => {
    setIsSpinnerLoading(false);
    if (nextPendingStep) {
      setCurrentStep(nextPendingStep);
      setNextPendingStep(null);
    }
    window.scrollTo(0, 0);
  };

  const handleResetTrap = () => {
    playHarshBuzz();
    setFirstName('');
    setLastNamePaternal('');
    setLastNameMaternal('');
    setHasSecondLastName(null);
    setCertifiedNoSecondLastName(false);
    setPhoneSlider(5000);
    setCurrentStep('A');
    alert('¡TRAMPA ACTIVADA! Se ha borrado todo el formulario sin confirmación. Debe comenzar de nuevo.');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '16px' }}>
      <FakeSpinner isLoading={isSpinnerLoading} onFinish={handleSpinnerDone} />

      {/* FALSE BREADCRUMBS WITH SURPRISE REGRESSION */}
      <div
        style={{
          backgroundColor: '#fffae6',
          border: '3px solid #ff0000',
          padding: '12px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
          <span>[1. Menú de Cinta]</span>
          <span style={{ color: currentStep.startsWith('2.') ? '#e60012' : '#000' }}>
            [2. Datos Personales]
          </span>
          <span>[3. Confirmación Final]</span>
        </div>
        <div style={{ width: '100%', height: '14px', backgroundColor: '#ddd', border: '1px solid #000' }}>
          <div
            style={{
              width: `${getProgress().pct}%`,
              height: '100%',
              backgroundColor: getProgress().pct < 50 ? '#ff0055' : '#00cc00',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#a00', marginTop: '4px', textAlign: 'center', fontFamily: 'Courier New' }}>
          {getProgress().label}
        </div>
      </div>

      {/* NOMADIC BUTTON RULE:
          In Screen 2 (Datos), the real Advance action is TOP-LEFT disguised as subtitle!
          Bottom-right is the dangerous "Volver al inicio y reiniciar orden".
      */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* TOP-LEFT ADVANCE BUTTON (CAMOUFLAGED AS PAGE SUBTITLE) */}
        <div>
          <button
            type="button"
            className="real-action-disguised"
            onClick={() => {
              // Quick shortcut if user discovers the camouflage
              playHoverBeep(1500, 0.05);
              if (currentStep === 'A' && firstName.trim().length > 1) {
                triggerStepTransition('B');
              } else if (currentStep === 'B' && lastNamePaternal.trim().length > 1) {
                triggerStepTransition('C');
              } else if (currentStep === 'C' && (hasSecondLastName === 'yes' || certifiedNoSecondLastName)) {
                triggerStepTransition('D');
              } else if (currentStep === 'D') {
                triggerStepTransition('2.1');
              } else {
                playHarshBuzz();
                alert('Campos incompletos para usar el atajo del subtítulo.');
              }
            }}
            title="Haga clic aquí para avanzar si es observador"
            style={{
              fontSize: '18px',
              fontFamily: 'Comic Sans MS, cursive',
              color: '#333',
              cursor: 'default',
              userSelect: 'none'
            }}
          >
            📋 Paso 2: Protocolo Fragmentado de Validación de Cliente (Haga clic para validar)
          </button>
        </div>

        {/* HOSTILE 'ATRÁS' BUTTON: SENDS USER TO RECIPE BLOG */}
        <button
          type="button"
          onClick={() => {
            playHarshBuzz();
            onGoToBlog();
          }}
          onMouseEnter={() => playHoverBeep()}
          style={{
            backgroundColor: '#e0e0e0',
            border: '2px dotted #666',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
          title="Botón de retroceso"
        >
          ◄ Atrás (Desvío seguro)
        </button>
      </div>

      {/* ERROR ALERT */}
      {hostileError && (
        <div
          className="blink-fast"
          style={{
            backgroundColor: '#ff0000',
            color: '#fff',
            padding: '8px',
            fontWeight: 'bold',
            marginBottom: '12px',
            fontSize: '12px'
          }}
        >
          🚨 ERROR HOSTIL: {hostileError}
        </div>
      )}

      {/* MICRO-SCREEN A: FIRST NAME ONLY */}
      {currentStep === 'A' && (
        <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', boxShadow: '6px 6px 0 #ff0055' }}>
          <h3 style={{ fontFamily: 'Impact', color: '#e60012', margin: '0 0 12px 0' }}>
            MICRO-PANTALLA A: INGRESE ÚNICAMENTE SU PRIMER NOMBRE
          </h3>
          <p style={{ fontSize: '11px', color: '#666' }}>
            No ingrese apellidos, espacios adicionales ni apodos. Validación en tiempo real activada.
          </p>
          <div style={{ margin: '14px 0' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
              Primer Nombre Legal:
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                const val = e.target.value;
                setFirstName(val);
                // Hostile real-time validation on first character!
                if (val.length === 1) {
                  playHarshBuzz();
                  setHostileError('¡Un solo carácter es insuficiente para un nombre respetable en Kaiten Loco!');
                } else if (/\d/.test(val)) {
                  playHarshBuzz();
                  setHostileError('Los nombres humanos no deben contener números.');
                } else {
                  setHostileError(null);
                }
              }}
              onMouseEnter={() => playHoverBeep()}
              placeholder="Ej: Kenji"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: hostileError ? '3px solid red' : '2px solid black',
                backgroundColor: '#fffffa'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            {/* TRAP BUTTON BORRAR TODO */}
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              BORRAR TODO Y LIMPIAR
            </button>

            {/* REAL NEXT BUTTON (LOOKS DISABLED) */}
            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => {
                if (firstName.trim().length < 2) {
                  playHarshBuzz();
                  setHostileError('Debe ingresar un nombre de al menos 2 caracteres.');
                  return;
                }
                triggerStepTransition('B');
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              Continuar a Micro-Pantalla B ►
            </button>
          </div>
        </div>
      )}

      {/* MICRO-SCREEN B: PATERNAL LAST NAME */}
      {currentStep === 'B' && (
        <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', boxShadow: '6px 6px 0 #00aa00' }}>
          <h3 style={{ fontFamily: 'Impact', color: '#008800', margin: '0 0 12px 0' }}>
            MICRO-PANTALLA B: INGRESE ÚNICAMENTE SU APELLIDO PATERNO
          </h3>
          <p style={{ fontSize: '11px', color: '#666' }}>
            Este apellido se registrará en el linaje de la orden en la base de datos.
          </p>
          <div style={{ margin: '14px 0' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
              Primer Apellido (Paterno):
            </label>
            <input
              type="text"
              value={lastNamePaternal}
              onChange={(e) => {
                const val = e.target.value;
                setLastNamePaternal(val);
                if (val.length === 1) {
                  playHarshBuzz();
                  setHostileError('Un apellido paterno no puede constar de una sola letra.');
                } else {
                  setHostileError(null);
                }
              }}
              onMouseEnter={() => playHoverBeep()}
              placeholder="Ej: Tanaka"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: hostileError ? '3px solid red' : '2px solid black',
                backgroundColor: '#fffffa'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              RESTABLECER FORMULARIO
            </button>

            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => {
                if (lastNamePaternal.trim().length < 2) {
                  playHarshBuzz();
                  setHostileError('Debe ingresar un apellido paterno válido.');
                  return;
                }
                triggerStepTransition('C');
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              Continuar a Micro-Pantalla C ►
            </button>
          </div>
        </div>
      )}

      {/* MICRO-SCREEN C: SECOND LAST NAME? YES/NO */}
      {currentStep === 'C' && (
        <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', boxShadow: '6px 6px 0 #0000ff' }}>
          <h3 style={{ fontFamily: 'Impact', color: '#0000aa', margin: '0 0 12px 0' }}>
            MICRO-PANTALLA C: ¿POSEE USTED UN SEGUNDO APELLIDO?
          </h3>
          <p style={{ fontSize: '11px', color: '#666' }}>
            Por favor elija con absoluta precisión jurídica.
          </p>

          <div style={{ display: 'flex', gap: '16px', margin: '16px 0' }}>
            <label style={{ fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="secondNameRadio"
                checked={hasSecondLastName === 'yes'}
                onChange={() => {
                  playHoverBeep(800, 0.04);
                  setHasSecondLastName('yes');
                }}
              />
              {' '}Sí, tengo segundo apellido
            </label>

            <label style={{ fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="secondNameRadio"
                checked={hasSecondLastName === 'no'}
                onChange={() => {
                  playHoverBeep(500, 0.04);
                  setHasSecondLastName('no');
                }}
              />
              {' '}No, carezco de segundo apellido
            </label>
          </div>

          {hasSecondLastName === 'yes' && (
            <div style={{ margin: '14px 0' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                Segundo Apellido (Materno):
              </label>
              <input
                type="text"
                value={lastNameMaternal}
                onChange={(e) => setLastNameMaternal(e.target.value)}
                onMouseEnter={() => playHoverBeep()}
                placeholder="Ej: Sato"
                style={{ width: '100%', padding: '10px', fontSize: '16px', border: '2px solid black' }}
              />
            </div>
          )}

          {hasSecondLastName === 'no' && (
            <div style={{ backgroundColor: '#ffebe6', border: '2px dashed red', padding: '12px', margin: '14px 0' }}>
              <label style={{ fontSize: '12px', color: '#900', fontWeight: 'bold', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={certifiedNoSecondLastName}
                  onChange={(e) => {
                    playHoverBeep(1100, 0.05);
                    setCertifiedNoSecondLastName(e.target.checked);
                  }}
                />
                {' '}Certifico bajo palabra y pena de anulación de sushi que carezco de segundo apellido.
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              VACIAR FORMULARIO
            </button>

            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => {
                if (hasSecondLastName === 'yes' && lastNameMaternal.trim().length < 2) {
                  playHarshBuzz();
                  setHostileError('Ingrese su segundo apellido o certifique que no tiene.');
                  return;
                }
                if (hasSecondLastName === 'no' && !certifiedNoSecondLastName) {
                  playHarshBuzz();
                  setHostileError('Debe marcar la casilla obligatoria de certificación.');
                  return;
                }
                if (!hasSecondLastName) {
                  playHarshBuzz();
                  setHostileError('Seleccione Sí o No.');
                  return;
                }
                triggerStepTransition('D');
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              Continuar a Micro-Pantalla D ►
            </button>
          </div>
        </div>
      )}

      {/* MICRO-SCREEN D: PHONE NUMBER WITH HYPERSENSITIVE SLIDER */}
      {currentStep === 'D' && (
        <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: '20px', boxShadow: '6px 6px 0 #ffaa00' }}>
          <h3 style={{ fontFamily: 'Impact', color: '#bb6600', margin: '0 0 12px 0' }}>
            MICRO-PANTALLA D: NÚMERO DE TELÉFONO MEDIANTE DESLIZADOR
          </h3>
          <p style={{ fontSize: '11px', color: '#666' }}>
            Por motivos de seguridad cibernética, el valor numérico no se muestra. Ajuste el control deslizante hasta sentir que coincide con sus 4 dígitos preferidos.
          </p>

          <HypersensitiveSlider
            value={phoneSlider}
            onChange={(val) => setPhoneSlider(val)}
            min={0}
            max={9999}
            label="Deslizador Hipersensible de Teléfono (Paso 1 en 1)"
          />

          {/* INVERTED LOGIC CHECKBOX */}
          <div style={{ marginTop: '16px', backgroundColor: '#ffffdd', border: '1px solid #ccc', padding: '8px' }}>
            <label style={{ fontSize: '11px', color: '#222', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={invertedCheckbox}
                onChange={(e) => {
                  playHoverBeep(1300, 0.04);
                  setInvertedCheckbox(e.target.checked);
                }}
              />
              {' '}Marque aquí si no desea dejar de abstenerse de recibir correos que no sean promocionales ni ofertas de sashimi.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              BORRAR DATOS DE CONTACTO
            </button>

            {/* SURPRISE TRANSITION TO 2.1 (SAUCES) INSTEAD OF PAYMENT! */}
            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => {
                triggerStepTransition('2.1');
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              Continuar a Confirmación (Engañoso) ►
            </button>
          </div>
        </div>
      )}

      {/* SURPRISE STEP 2.1: SELECCIÓN OBLIGATORIA DE SALSAS */}
      {currentStep === '2.1' && (
        <div style={{ backgroundColor: '#fff', border: '4px solid #ff0000', padding: '20px', boxShadow: '6px 6px 0 #000' }}>
          <div className="blink-fast" style={{ color: '#e60012', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
            ⚠️ ¡PASO INTERMEDIO NO ANUNCIADO 2.1: SELECCIÓN DE SALSAS DE PRECISIÓN!
          </div>
          <p style={{ fontSize: '12px' }}>
            Pensó que iría a pagar, pero debe configurar cada mililitro de salsa antes de continuar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '14px 0' }}>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={sauces.shoyuNormal}
                onChange={(e) => setSauces({ ...sauces, shoyuNormal: e.target.checked })}
              />
              Salsa de Soja Tradicional Kaiten Loco (10ml)
            </label>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={sauces.shoyuSweet}
                onChange={(e) => setSauces({ ...sauces, shoyuSweet: e.target.checked })}
              />
              Salsa de Soja Dulce para Anguila
            </label>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={sauces.wasabiExtra}
                onChange={(e) => setSauces({ ...sauces, wasabiExtra: e.target.checked })}
              />
              Wasabi Verde Extra Picante
            </label>
            <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={sauces.gariGinger}
                onChange={(e) => setSauces({ ...sauces, gariGinger: e.target.checked })}
              />
              Jengibre Encurtido Dulce
            </label>
          </div>

          <div style={{ margin: '14px 0' }}>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
              Gotas de Té Matcha en Polvo para la Mesa:
            </label>
            <AlphabeticalNumberSelect
              value={sauces.matchaPowderDrops}
              onChange={(val) => setSauces({ ...sauces, matchaPowderDrops: val })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              DESCARTAR SALSAS
            </button>

            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => triggerStepTransition('2.2')}
              onMouseEnter={() => playHoverBeep()}
            >
              Avanzar a Paso 2.2 (Sorpresa siguiente) ►
            </button>
          </div>
        </div>
      )}

      {/* SURPRISE STEP 2.2: ENCUESTA DE SATISFACCIÓN PREVENTIVA */}
      {currentStep === '2.2' && (
        <div style={{ backgroundColor: '#fff', border: '4px solid #ff00ff', padding: '20px', boxShadow: '6px 6px 0 #000' }}>
          <div className="blink-fast" style={{ color: '#ff00ff', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
            ⚠️ ¡PASO INTERMEDIO NO ANUNCIADO 2.2: ENCUESTA DE SATISFACCIÓN PREVENTIVA!
          </div>
          <p style={{ fontSize: '12px' }}>
            Por favor evalúe el sabor del sushi que todavía no ha cocinado ni degustado.
          </p>

          <div style={{ margin: '12px 0' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Calificación Preventiva de 1 a 10 (con selector alfabético):
            </label>
            <AlphabeticalNumberSelect
              value={surveyRating}
              onChange={(val) => setSurveyRating(val)}
            />
          </div>

          <div style={{ margin: '12px 0' }}>
            <label style={{ fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={surveyWilling}
                onChange={(e) => setSurveyWilling(e.target.checked)}
              />
              {' '}Prometo solemnemente regresar a esta misma mesa de Kaiten Loco.
            </label>
          </div>

          <div style={{ margin: '12px 0' }}>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
              Comentarios preventivos sobre la textura del salmón:
            </label>
            <input
              type="text"
              value={surveyComment}
              onChange={(e) => setSurveyComment(e.target.value)}
              placeholder="Anticipo que el atún estará a temperatura ideal..."
              style={{ width: '100%', padding: '8px', border: '2px solid #555' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              ANULAR ENCUESTA
            </button>

            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => triggerStepTransition('2.3')}
              onMouseEnter={() => playHoverBeep()}
            >
              Avanzar a Paso 2.3 ►
            </button>
          </div>
        </div>
      )}

      {/* SURPRISE STEP 2.3: CONFIRMACIÓN AUDITIVA DE NÚMERO TELEFÓNICO */}
      {currentStep === '2.3' && (
        <div style={{ backgroundColor: '#fff', border: '4px solid #00aaaa', padding: '20px', boxShadow: '6px 6px 0 #000' }}>
          <div className="blink-fast" style={{ color: '#008888', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
            ⚠️ ¡PASO INTERMEDIO NO ANUNCIADO 2.3: CONFIRMACIÓN TELEFÓNICA POR FRECUENCIA!
          </div>
          <p style={{ fontSize: '12px' }}>
            Haga clic para emitir la frecuencia armónica de comprobación de sus 4 dígitos secretos.
          </p>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button
              type="button"
              onClick={() => {
                playHoverBeep(300 + phoneSlider, 0.4);
                setAudioConfirmationPlayed(true);
              }}
              style={{
                backgroundColor: '#ffff00',
                border: '3px solid #000',
                padding: '12px 20px',
                fontFamily: 'Impact',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              🔊 REPRODUCIR FRECUENCIA DE VALIDACIÓN #{phoneSlider}
            </button>
            {audioConfirmationPlayed && (
              <div style={{ color: '#00aa00', fontSize: '12px', marginTop: '8px' }}>
                ✓ Tono sintético verificado por el oscilador Kaiten Loco.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              type="button"
              className="btn-destructive-hyper-flashy"
              onClick={handleResetTrap}
              style={{ fontSize: '12px !important', padding: '8px 16px !important' }}
            >
              CANCELAR TODO
            </button>

            {/* FINAL TRANSITION TO PAYMENT */}
            <button
              type="button"
              className="btn-primary-disguised-disabled"
              onClick={() => {
                if (!audioConfirmationPlayed) {
                  playHarshBuzz();
                  alert('Debe reproducir el tono de validación antes de proceder al cobro.');
                  return;
                }
                onProceedToPayment({
                  firstName,
                  lastNamePaternal,
                  lastNameMaternal: hasSecondLastName === 'yes' ? lastNameMaternal : undefined,
                  phone: phoneSlider.toString(),
                  sauces,
                  survey: {
                    rating: surveyRating,
                    willingToReturn: surveyWilling,
                    comments: surveyComment
                  }
                });
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              PROCEDER AL PASO 3 (PAGO Y FACTURACIÓN) ►
            </button>
          </div>
        </div>
      )}

      {/* NOMADIC BUTTON: BOTTOM-RIGHT HAS "VOLVER AL INICIO Y REINICIAR ORDEN" */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button
          type="button"
          onClick={() => {
            playHarshBuzz();
            if (confirm('¿Está seguro de que desea botar toda su orden al cesto de basura?')) {
              onResetOrder();
            }
          }}
          onMouseEnter={() => playHoverBeep()}
          style={{
            backgroundColor: '#ff0033',
            color: '#fff',
            border: '2px solid #000',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'Courier New'
          }}
        >
          🗑️ Volver al inicio y reiniciar orden
        </button>
      </div>
    </div>
  );
};
