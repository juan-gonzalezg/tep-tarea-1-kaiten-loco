import React, { useState, useEffect } from 'react';
import type { MenuItem, OrderItem } from '../types.js';
import { fetchMenu } from '../services/api.js';
import { playHoverBeep, playHarshBuzz } from '../sound/soundEffects.js';
import { AlphabeticalNumberSelect, ChaoticText, FakeHyperlink } from '../components/TortureInputs.js';

export const CatalogPage: React.FC<{
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onGoToCheckout: () => void;
  cart: OrderItem[];
}> = ({ onAddToCart, onGoToCheckout, cart }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu()
      .then((items) => {
        setMenu(items);
        const initQ: Record<string, number> = {};
        items.forEach((it) => {
          initQ[it.id] = 1;
        });
        setQuantities(initQ);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Nigiri', 'Gunkan', 'Side Dishes', 'Desserts', 'Drinks'];

  const filteredMenu =
    selectedCategory === 'All'
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  const getPlateBadge = (color: string, price: number) => {
    let bg = '#ffea00';
    let label = 'Plato Amarillo';
    let text = '#000';
    if (color === 'red') {
      bg = '#e60012';
      label = 'Plato Rojo Especial';
      text = '#fff';
    } else if (color === 'black') {
      bg = '#111111';
      label = 'Plato Negro Diamante';
      text = '#ffd700';
    }
    return (
      <span
        style={{
          backgroundColor: bg,
          color: text,
          padding: '2px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          borderRadius: '12px',
          border: '1px solid #000'
        }}
      >
        {label} (¥{price})
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 className="blink">Cargando cinta transportadora Kaiten Loco...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* BANNER WITH DESTRUCTIVE CONTRAST */}
      <div
        className="contrast-destructive-yellow"
        style={{
          padding: '12px',
          border: '4px double #ff0055',
          textAlign: 'center',
          marginBottom: '16px'
        }}
      >
        <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>
          KAITEN LOCO • MENÚ OFICIAL DE PLATOS EN CINTA
        </h2>
        <p style={{ margin: 0, fontSize: '13px' }}>
          <ChaoticText text="Tome sus platos directamente del carril magnético antes de que pasen a la siguiente mesa." />
        </p>
      </div>

      {/* CATEGORY SELECTOR (FUGITIVE ZERO-DELAY BUTTONS) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
          padding: '8px',
          backgroundColor: '#fffae6',
          border: '1px solid #ccc'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold', alignSelf: 'center' }}>Filtros de Cinta:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              playHoverBeep(900, 0.05);
              setSelectedCategory(cat);
            }}
            onMouseEnter={() => playHoverBeep()}
            style={{
              padding: '6px 12px',
              backgroundColor: selectedCategory === cat ? '#ffff00' : '#ffffff',
              border: selectedCategory === cat ? '2px solid #ff0000' : '1px solid #999',
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SUSHIS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredMenu.map((item) => {
          const qty = quantities[item.id] || 1;
          const isHovered = hoveredItemId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => {
                playHoverBeep(1200, 0.03);
                setHoveredItemId(item.id);
              }}
              onMouseLeave={() => {
                // 0ms delay: vanishes immediately
                setHoveredItemId(null);
              }}
              style={{
                backgroundColor: '#ffffff',
                border: '3px solid #000',
                padding: '12px',
                position: 'relative',
                boxShadow: isHovered ? '8px 8px 0px #ff0055' : '4px 4px 0px #000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '38px' }}>{item.emoji}</span>
                  {getPlateBadge(item.plateColor, item.priceYen)}
                </div>

                <h3
                  style={{
                    margin: '8px 0 2px 0',
                    fontSize: '16px',
                    fontFamily: 'Impact, sans-serif',
                    color: '#e60012'
                  }}
                >
                  {item.name}
                </h3>
                <div style={{ fontSize: '11px', color: '#666', fontFamily: 'Papyrus, fantasy', marginBottom: '8px' }}>
                  {item.japaneseName} • {item.calories} kcal
                </div>

                {/* ZERO DELAY HOVER DETAILS */}
                {isHovered && (
                  <div
                    style={{
                      backgroundColor: '#ffffcc',
                      border: '1px dashed #f00',
                      padding: '6px',
                      fontSize: '11px',
                      marginBottom: '8px'
                    }}
                  >
                    <strong>Detalles del Maestro Cocinero:</strong> {item.description}
                  </div>
                )}
              </div>

              {/* TORTURE QUANTITY & INVERTED BUTTONS */}
              <div style={{ marginTop: '12px', borderTop: '1px dotted #ccc', paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '11px', fontFamily: 'Comic Sans MS' }}>
                    Cantidad alfabética:
                  </label>
                  <AlphabeticalNumberSelect
                    value={qty}
                    onChange={(val) => {
                      setQuantities({ ...quantities, [item.id]: val });
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                  {/* REAL ACTION: styled like a dull disabled button */}
                  <button
                    type="button"
                    className="btn-primary-disguised-disabled"
                    onClick={() => {
                      if (qty <= 0) {
                        playHarshBuzz();
                        alert('Seleccione al menos una pieza con el selector alfabético.');
                        return;
                      }
                      playHoverBeep(1400, 0.08);
                      onAddToCart(item, qty);
                    }}
                    onMouseEnter={() => playHoverBeep()}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Tomar del plato (¥{item.priceYen * qty})
                  </button>

                  {/* TRAP DESTRUCTIVE BUTTON: vibrant and flashy */}
                  <button
                    type="button"
                    onClick={() => {
                      playHarshBuzz();
                      setQuantities({ ...quantities, [item.id]: 0 });
                    }}
                    onMouseEnter={() => playHoverBeep()}
                    style={{
                      background: '#ff0055',
                      color: '#fff',
                      border: '1px solid #000',
                      fontSize: '10px',
                      padding: '4px 6px',
                      cursor: 'pointer'
                    }}
                    title="Restablece la cantidad a cero"
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM NOMADIC ACTION: In Screen 1 (Catalog), next button is at BOTTOM RIGHT */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fffae6',
          padding: '16px',
          border: '3px ridge #ffaa00'
        }}
      >
        <div>
          <FakeHyperlink text="Descargar catálogo en PDF ilegible (45MB)" />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Total de piezas ordenadas actualmente: {cart.reduce((acc, it) => acc + it.quantity, 0)}
          </div>
        </div>

        {/* BOTTOM RIGHT BUTTON */}
        <button
          type="button"
          onClick={() => {
            if (cart.length === 0) {
              playHarshBuzz();
              alert('Su mesa está vacía. Tome al menos un plato de sushi de la cinta.');
              return;
            }
            playHoverBeep(1000, 0.08);
            onGoToCheckout();
          }}
          onMouseEnter={() => playHoverBeep()}
          style={{
            backgroundColor: '#ffdd00',
            border: '3px solid #000',
            padding: '12px 24px',
            fontSize: '16px',
            fontFamily: 'Impact, sans-serif',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #000'
          }}
        >
          AVANZAR A DATOS DEL CLIENTE ►
        </button>
      </div>
    </div>
  );
};
