import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

const WA_NUMBER = '51902216717'

function waMensajeCarrito(items) {
  const lista = items.map(item => {
    const talla = item.talla ? `${item.talla.ml}ml — S/ ${item.talla.precio}` : `Sellado — S/ ${Number(item.producto.precio).toFixed(0)}`
    return `🦈 *${item.producto.nombre}*\n   ${talla}`
  }).join('\n\n')
  return encodeURIComponent(
    `Hola! Me interesan estos productos de DDS Parfums:\n\n${lista}\n\n¿Están disponibles? ¿Cómo puedo pedirlos?`
  )
}

function waMensajeUnico(producto, talla) {
  const precio = talla ? `${talla.ml}ml — S/ ${talla.precio}` : `Sellado — S/ ${Number(producto.precio).toFixed(0)}`
  return encodeURIComponent(
    `Hola! 🦈 Me interesa este producto de DDS Parfums:\n\n*${producto.nombre}*\n${precio}\n\n¿Está disponible? ¿Cómo puedo pedirlo?`
  )
}

function getTallas(producto) {
  const tallas = []
  if (producto.precio_3ml) tallas.push({ ml: 3, precio: producto.precio_3ml })
  if (producto.precio_5ml) tallas.push({ ml: 5, precio: producto.precio_5ml })
  if (producto.precio_10ml) tallas.push({ ml: 10, precio: producto.precio_10ml })
  if (producto.precio_30ml) tallas.push({ ml: 30, precio: producto.precio_30ml })
  return tallas
}

function LogoFlor() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 10 6 10 9C10 10.7 10.9 12 12 12C13.1 12 14 10.7 14 9C14 6 12 2 12 2Z" fill="#b8923a" opacity="0.9"/>
      <path d="M12 22C12 22 10 18 10 15C10 13.3 10.9 12 12 12C13.1 12 14 13.3 14 15C14 18 12 22 12 22Z" fill="#b8923a" opacity="0.9"/>
      <path d="M2 12C2 12 6 10 9 10C10.7 10 12 10.9 12 12C12 13.1 10.7 14 9 14C6 14 2 12 2 12Z" fill="#b8923a" opacity="0.9"/>
      <path d="M22 12C22 12 18 10 15 10C13.3 10 12 10.9 12 12C12 13.1 13.3 14 15 14C18 14 22 12 22 12Z" fill="#b8923a" opacity="0.9"/>
      <path d="M4.2 4.2C4.2 4.2 7.5 6.5 9.2 8.2C10.4 9.4 10.4 10.6 9.2 11.8C8 13 6.5 12.7 5.5 11.5C3.8 9.8 4.2 4.2 4.2 4.2Z" fill="#b8923a" opacity="0.6"/>
      <path d="M19.8 19.8C19.8 19.8 16.5 17.5 14.8 15.8C13.6 14.6 13.6 13.4 14.8 12.2C16 11 17.5 11.3 18.5 12.5C20.2 14.2 19.8 19.8 19.8 19.8Z" fill="#b8923a" opacity="0.6"/>
      <path d="M4.2 19.8C4.2 19.8 6.5 16.5 8.2 14.8C9.4 13.6 10.6 13.6 11.8 14.8C13 16 12.7 17.5 11.5 18.5C9.8 20.2 4.2 19.8 4.2 19.8Z" fill="#b8923a" opacity="0.6"/>
      <path d="M19.8 4.2C19.8 4.2 17.5 7.5 15.8 9.2C14.6 10.4 13.4 10.4 12.2 9.2C11 8 11.3 6.5 12.5 5.5C14.2 3.8 19.8 4.2 19.8 4.2Z" fill="#b8923a" opacity="0.6"/>
      <circle cx="12" cy="12" r="2" fill="#b8923a"/>
    </svg>
  )
}

function FotoPlaceholder({ categoria, genero }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: genero === 'Mujer'
        ? 'linear-gradient(135deg, #f0e0e8 0%, #f8eef2 50%, #e8d5de 100%)'
        : genero === 'Nicho'
        ? 'linear-gradient(135deg, #1a1410 0%, #2a1f10 50%, #1a1410 100%)'
        : 'linear-gradient(135deg, #e8e0d5 0%, #f0ebe2 50%, #e0d8cc 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
    }}>
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="18" rx="8" ry="14" stroke="#b8923a" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M24 32 L24 42" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <path d="M18 38 L30 38" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="24" cy="18" r="4" fill="#b8923a" opacity="0.15"/>
      </svg>
      <span style={{ fontSize: '10px', color: '#9a9088', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '0 12px' }}>
        {categoria}
      </span>
    </div>
  )
}

// Modal de detalle del producto
function ProductoModal({ producto, onClose, onAgregarCarrito, enCarrito }) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
  const tallas = getTallas(producto)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (tallas.length > 0) setTallaSeleccionada(tallas[0])
    return () => { document.body.style.overflow = '' }
  }, [])

  const esNicho = producto.categoria === 'Nicho'
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMensajeUnico(producto, tallaSeleccionada)}`

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,12,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
      <div className="fade-in" style={{ background: 'var(--ivory)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '560px', margin: '0 auto', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ width: '100%', height: '260px', position: 'relative', flexShrink: 0 }}>
          {producto.foto_url ? (
            <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FotoPlaceholder categoria={producto.categoria} genero={producto.genero} />
          )}
          <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', width: '32px', height: '32px', background: 'rgba(15,14,12,0.5)', borderRadius: '50%', color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', display: 'flex', gap: '6px' }}>
            <span style={{ background: esNicho ? 'var(--gold)' : 'white', color: esNicho ? 'white' : 'var(--gold)', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{producto.categoria}</span>
            {producto.genero && <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 500 }}>{producto.genero}</span>}
          </div>
        </div>

        <div style={{ padding: '22px 22px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, lineHeight: 1.2, flex: 1, paddingRight: '10px' }}>{producto.nombre}</h2>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--gold)', whiteSpace: 'nowrap' }}>S/ {Number(producto.precio).toFixed(0)}</div>
          </div>

          {producto.descripcion && <p style={{ color: 'var(--text-soft)', fontSize: '13px', lineHeight: 1.7, marginBottom: '18px' }}>{producto.descripcion}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {producto.notas_aromaticas && (
              <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>🌸 Notas aromáticas</div>
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>{producto.notas_aromaticas}</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {producto.ocasion && (
                <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>✨ Ocasión</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>{producto.ocasion}</div>
                </div>
              )}
              {producto.duracion && (
                <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>⏱ Duración</div>
                  <div style={{ fontSize: '12px', color: 'var(--text)' }}>{producto.duracion}</div>
                </div>
              )}
            </div>
          </div>

          {/* Selector de talla */}
          {tallas.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>Elige tu talla</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tallas.map(t => (
                  <button key={t.ml} onClick={() => setTallaSeleccionada(t)} style={{ padding: '8px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, background: tallaSeleccionada?.ml === t.ml ? 'var(--gold)' : 'white', color: tallaSeleccionada?.ml === t.ml ? 'white' : 'var(--text-soft)', border: `1.5px solid ${tallaSeleccionada?.ml === t.ml ? 'var(--gold)' : 'var(--stone)'}` }}>
                    {t.ml}ml — S/ {t.precio}
                  </button>
                ))}
                <button onClick={() => setTallaSeleccionada(null)} style={{ padding: '8px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, background: !tallaSeleccionada ? 'var(--gold)' : 'white', color: !tallaSeleccionada ? 'white' : 'var(--text-soft)', border: `1.5px solid ${!tallaSeleccionada ? 'var(--gold)' : 'var(--stone)'}` }}>
                  Sellado — S/ {Number(producto.precio).toFixed(0)}
                </button>
              </div>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => { onAgregarCarrito(producto, tallaSeleccionada); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', padding: '14px',
                background: enCarrito ? 'var(--ivory-dark)' : 'var(--text)',
                color: enCarrito ? 'var(--gold)' : 'white',
                borderRadius: '14px', fontSize: '14px', fontWeight: 600,
                border: enCarrito ? '2px solid var(--gold)' : 'none',
              }}
            >
              {enCarrito ? '✓ En tu pedido' : '🛒 Agregar al pedido'}
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', background: '#25D366', color: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Solo este producto
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Panel carrito
function CarritoPanel({ carrito, onEliminar, onClose }) {
  const total = carrito.reduce((s, i) => s + (i.talla ? Number(i.talla.precio) : Number(i.producto.precio)), 0)
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMensajeCarrito(carrito)}`

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,12,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
      <div className="fade-in" style={{ background: 'var(--ivory)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '560px', margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--stone)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400 }}>Tu pedido</h3>
            <p style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{carrito.length} producto{carrito.length !== 1 ? 's' : ''} seleccionado{carrito.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', fontSize: '22px', color: 'var(--text-soft)', padding: '4px' }}>×</button>
        </div>

        <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {carrito.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: 'var(--ivory-dark)', borderRadius: '10px' }}>
              {item.producto.foto_url && (
                <img src={item.producto.foto_url} alt={item.producto.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{item.producto.nombre}</div>
                <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>
                  {item.talla ? `${item.talla.ml}ml` : 'Sellado'}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                  S/ {item.talla ? item.talla.precio : Number(item.producto.precio).toFixed(0)}
                </div>
                <button onClick={() => onEliminar(idx)} style={{ background: 'none', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '2px', textDecoration: 'underline' }}>
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 22px 32px', borderTop: '1px solid var(--stone)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Total estimado</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 500, color: 'var(--gold)' }}>S/ {total.toFixed(0)}</span>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', background: '#25D366', color: 'white', borderRadius: '14px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Enviar pedido por WhatsApp 🦈
          </a>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '10px' }}>
            Se enviará la lista completa a WhatsApp
          </p>
        </div>
      </div>
    </div>
  )
}

function ProductoCard({ producto, onClick, enCarrito }) {
  const tallas = getTallas(producto)
  const precioDesde = tallas.length > 0 ? Math.min(...tallas.map(t => t.precio)) : Number(producto.precio)
  const esNicho = producto.categoria === 'Nicho'

  return (
    <div onClick={onClick} style={{ background: 'white', borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: esNicho ? '0 2px 16px rgba(184,146,58,0.15)' : '0 2px 12px rgba(26,23,20,0.06)', border: enCarrito ? '2px solid var(--gold)' : esNicho ? '1px solid rgba(184,146,58,0.3)' : 'none', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,23,20,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = esNicho ? '0 2px 16px rgba(184,146,58,0.15)' : '0 2px 12px rgba(26,23,20,0.06)' }}
    >
      {enCarrito && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--gold)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', zIndex: 2, fontWeight: 700 }}>✓</div>
      )}
      <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative' }}>
        {producto.foto_url ? (
          <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <FotoPlaceholder categoria={producto.categoria} genero={producto.genero} />
        )}
        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ background: esNicho ? 'var(--gold)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontWeight: 600, color: esNicho ? 'white' : 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{producto.categoria}</span>
          {producto.subcategoria && <span style={{ background: 'rgba(0,0,0,0.45)', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', color: 'rgba(255,255,255,0.9)' }}>{producto.subcategoria}</span>}
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 500, lineHeight: 1.3, marginBottom: '4px' }}>{producto.nombre}</h3>
        {producto.ocasion && <p style={{ fontSize: '11px', color: 'var(--warm-gray)', marginBottom: '8px', lineHeight: 1.4 }}>{producto.ocasion.split(',')[0]}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {tallas.length > 0 && <div style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>Desde</div>}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 500, color: 'var(--gold)' }}>S/ {precioDesde}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--warm-gray)', textDecoration: 'underline' }}>Ver más</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [generoFiltro, setGeneroFiltro] = useState('Todos')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [carrito, setCarrito] = useState([]) // [{producto, talla}]
  const [mostrarCarrito, setMostrarCarrito] = useState(false)

  useEffect(() => { cargarProductos() }, [])

  async function cargarProductos() {
    const { data } = await supabase.from('catalogo_productos').select('*').eq('disponible', true).order('orden').order('nombre')
    setProductos(data || [])
    setCargando(false)
  }

  function agregarCarrito(producto, talla) {
    const yaEsta = carrito.findIndex(i => i.producto.id === producto.id && i.talla?.ml === talla?.ml)
    if (yaEsta >= 0) {
      setCarrito(prev => prev.filter((_, idx) => idx !== yaEsta))
    } else {
      setCarrito(prev => [...prev, { producto, talla }])
    }
  }

  function eliminarDelCarrito(idx) {
    setCarrito(prev => prev.filter((_, i) => i !== idx))
  }

  function estaEnCarrito(producto) {
    return carrito.some(i => i.producto.id === producto.id)
  }

  const generos = ['Todos', 'Hombre', 'Mujer']
  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))]
  const productosFiltrados = productos.filter(p => {
    const matchGenero = generoFiltro === 'Todos' || p.genero === generoFiltro
    const matchCat = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro
    const matchBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchGenero && matchCat && matchBusqueda
  })

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--stone)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <LogoFlor />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1 }}>DDS <span style={{ color: 'var(--gold)' }}>Parfums</span></div>
              <div style={{ fontSize: '9px', color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Día de Suerte · Ica</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {carrito.length > 0 && (
              <button onClick={() => setMostrarCarrito(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--gold)', color: 'white', padding: '8px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, position: 'relative' }}>
                🛒 Pedido
                <span style={{ background: 'white', color: 'var(--gold)', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{carrito.length}</span>
              </button>
            )}
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#25D366', color: 'white', padding: '8px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escríbenos
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f0e0c 0%, #2a1f10 100%)', color: 'white', textAlign: 'center', padding: '60px 20px 50px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 30% 50%, #b8923a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #b8923a 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: '540px', margin: '0 auto' }}>
          {/* Logo grande DDS */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(72px, 18vw, 110px)', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--gold-light, #d4aa5a)', lineHeight: 1, marginBottom: '4px' }}>
            DDS
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 300, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '0.02em', color: 'white' }}>
            Fragancias que <em style={{ fontStyle: 'italic', color: '#d4aa5a' }}>te definen</em>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>
            Perfumes sellados y decants de marcas árabes, de diseñador y nicho.<br />
            Ica, Perú · Pedidos por WhatsApp
          </p>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#d4aa5a', color: '#0f0e0c', padding: '13px 28px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em' }}>
            Hacer un pedido 🦈
          </a>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--stone)', padding: '14px 20px', position: 'sticky', top: '58px', zIndex: 90 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder="🔍 Buscar perfume..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: '7px 14px', borderRadius: '50px', border: '1.5px solid var(--stone)', fontSize: '13px', background: 'var(--ivory)', color: 'var(--text)', outline: 'none', minWidth: '160px', flex: '1' }} />
          <div style={{ display: 'flex', gap: '5px' }}>
            {generos.map(g => (
              <button key={g} onClick={() => setGeneroFiltro(g)} style={{ padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: generoFiltro === g ? '#0f0e0c' : 'white', color: generoFiltro === g ? 'white' : 'var(--text-soft)', border: `1.5px solid ${generoFiltro === g ? '#0f0e0c' : 'var(--stone)'}` }}>
                {g}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {categorias.map(c => (
              <button key={c} onClick={() => setCategoriaFiltro(c)} style={{ padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: categoriaFiltro === c ? 'var(--gold)' : 'white', color: categoriaFiltro === c ? 'white' : 'var(--text-soft)', border: `1.5px solid ${categoriaFiltro === c ? 'var(--gold)' : 'var(--stone)'}` }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 16px 100px' }}>
        <div style={{ fontSize: '12px', color: 'var(--warm-gray)', marginBottom: '16px' }}>
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
        </div>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--warm-gray)' }}>Cargando catálogo...</div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--warm-gray)' }}>Sin productos para esta búsqueda</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {productosFiltrados.map(p => (
              <ProductoCard key={p.id} producto={p} onClick={() => setSeleccionado(p)} enCarrito={estaEnCarrito(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante carrito */}
      {carrito.length > 0 && !mostrarCarrito && (
        <button onClick={() => setMostrarCarrito(true)} style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#25D366', color: 'white', borderRadius: '50px', padding: '14px 24px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100, whiteSpace: 'nowrap' }}>
          🛒 Ver pedido ({carrito.length})
          <span style={{ background: 'white', color: '#25D366', borderRadius: '12px', padding: '1px 8px', fontSize: '12px', fontWeight: 800 }}>
            S/ {carrito.reduce((s, i) => s + (i.talla ? Number(i.talla.precio) : Number(i.producto.precio)), 0).toFixed(0)}
          </span>
        </button>
      )}

      {/* Footer */}
      <footer style={{ background: '#0f0e0c', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '28px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: '#d4aa5a', marginBottom: '4px' }}>DDS</div>
        <p style={{ fontSize: '12px', marginBottom: '4px' }}>Día de Suerte · Ica, Perú</p>
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#25D366', textDecoration: 'none' }}>+51 902 216 717</a>
      </footer>

      {/* Modales */}
      {seleccionado && (
        <ProductoModal
          producto={seleccionado}
          onClose={() => setSeleccionado(null)}
          onAgregarCarrito={agregarCarrito}
          enCarrito={estaEnCarrito(seleccionado)}
        />
      )}
      {mostrarCarrito && (
        <CarritoPanel
          carrito={carrito}
          onEliminar={eliminarDelCarrito}
          onClose={() => setMostrarCarrito(false)}
        />
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        :root { --gold-light: #d4aa5a; }
      `}</style>
    </div>
  )
}
