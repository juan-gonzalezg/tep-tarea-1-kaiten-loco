import React, { useState, useEffect } from 'react';
import { fetchChefSuggestions } from '../services/api.js';
import { playHoverBeep } from '../sound/soundEffects.js';
import { FakeHyperlink, ChaoticText } from '../components/TortureInputs.js';

export const RecipeBlogPage: React.FC<{
  onResumeOrder: () => void;
}> = ({ onResumeOrder }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchChefSuggestions()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', border: '4px solid #000' }}>
      <div className="blink-fast" style={{ backgroundColor: '#ff0000', color: '#fff', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>
        ⚠️ DESVÍO COMPLETADO: HA SIDO TRASLADADO AL BLOG DE RECETAS Y SUGERENCIAS DEL CHEF
      </div>

      <h1 style={{ fontFamily: 'Impact', color: '#e60012', fontSize: '32px', margin: '16px 0 8px 0' }}>
        {data?.blogTitle || 'Blog Oficial del Maestro de Kaiten Loco'}
      </h1>
      <p style={{ fontSize: '13px', color: '#555', fontStyle: 'italic' }}>
        Usted presionó "Atrás" esperando retroceder al formulario, pero la sabiduría tradicional exige leer nuestros ensayos antes de comer.
      </p>

      {/* ARTICLES */}
      <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data?.articles ? (
          data.articles.map((art: any) => (
            <div key={art.id} style={{ border: '2px solid #ccc', padding: '16px', backgroundColor: '#fafafa' }}>
              <h3 style={{ fontFamily: 'Papyrus', margin: '0 0 6px 0', color: '#111' }}>
                {art.title}
              </h3>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
                Por: {art.author} | Publicado: {art.date}
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                {art.snippet}
              </p>
              <div style={{ marginTop: '8px' }}>
                <FakeHyperlink text="Continuar leyendo este ensayo de 42 páginas" />
              </div>
            </div>
          ))
        ) : (
          <div>Cargando consejos del maestro...</div>
        )}
      </div>

      {/* CHAOTIC FILLER SECTION */}
      <div style={{ padding: '16px', backgroundColor: '#ffffdd', border: '1px dashed #e60012', marginBottom: '30px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Instrucciones Sagradas para Comer Nigiri con los Dedos:</h4>
        <ChaoticText text="Nunca jamás sumerja el arroz sazonado en la salsa de soja directamente porque se desintegra la arquitectura del bocado. Gire la pieza suavemente a 45 grados y acaricie la superficie con el jengibre dulce." />
      </div>

      {/* TINY CAMOUFLAGED LINK: The only way to resume current order! */}
      <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: '9px', color: '#ccc' }}>
          Pie de página legal © 2026 Kaiten Loco S.L. Todos los derechos reservados.{' '}
        </span>
        <button
          type="button"
          onClick={() => {
            playHoverBeep(1600, 0.08);
            onResumeOrder();
          }}
          onMouseEnter={() => playHoverBeep(1200, 0.01)}
          style={{
            background: 'none',
            border: 'none',
            color: '#c4c0b4', // Super faint grey/beige camouflaged with footer
            fontSize: '9px',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
          title="El enlace de escape"
        >
          Retomar mi orden en curso
        </button>
      </div>
    </div>
  );
};
