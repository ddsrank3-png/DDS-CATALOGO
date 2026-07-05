import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'
import { calcularPromos, waMensajeCarritoConPromo } from './promos.js'
import Admin from './Admin.jsx'

const ADMIN_PASSWORD = '071221'
const TOQUES_REQUERIDOS = 5

const WA_NUMBER = '51902216717'
const REDES = {
  tiktok: 'https://www.tiktok.com/@dds.parfums.ica?_r=1&_t=ZS-97l173VnaPl',
  instagram: '',
  facebook: '',
}

function waMensajeUnico(producto, talla) {
  const precio = talla ? `${talla.ml}ml — S/ ${talla.precio}` : `Sellado — S/ ${Number(producto.precio).toFixed(0)}`
  return encodeURIComponent(`Hola! 🦈 Me interesa este producto de DDS Parfums:\n\n*${producto.nombre}*\n${precio}\n\n¿Está disponible? ¿Cómo puedo pedirlo?`)
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
    <div style={{ width: '100%', height: '100%', background: genero === 'Mujer' ? 'linear-gradient(135deg, #f0e0e8 0%, #f8eef2 50%, #e8d5de 100%)' : genero === 'Nicho' ? 'linear-gradient(135deg, #1a1410 0%, #2a1f10 50%, #1a1410 100%)' : 'linear-gradient(135deg, #e8e0d5 0%, #f0ebe2 50%, #e0d8cc 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="18" rx="8" ry="14" stroke="#b8923a" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M24 32 L24 42" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <path d="M18 38 L30 38" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="24" cy="18" r="4" fill="#b8923a" opacity="0.15"/>
      </svg>
      <span style={{ fontSize: '10px', color: '#9a9088', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '0 12px' }}>{categoria}</span>
    </div>
  )
}

// Banner de promo
function PromoBanner({ promoData }) {
  if (!promoData.mensajePromo && !promoData.proximaPromo) return null
  const tieneDescuento = promoData.descuentoTotal > 0

  return (
    <div style={{
      background: tieneDescuento ? 'linear-gradient(135deg, #1a3a1a 0%, #0f2a0f 100%)' : 'linear-gradient(135deg, #1a1a3a 0%, #0f0f2a 100%)',
      border: `1px solid ${tieneDescuento ? '#4caf7d' : '#5a5aaf'}`,
      borderRadius: '12px', padding: '14px 16px', marginBottom: '16px',
      animation: 'fadeIn 0.3s ease',
    }}>
      {promoData.mensajePromo && (
        <div style={{ fontSize: '13px', fontWeight: 600, color: tieneDescuento ? '#4caf7d' : '#9090df', marginBottom: promoData.proximaPromo ? '6px' : '0' }}>
          {promoData.mensajePromo}
        </div>
      )}
      {promoData.proximaPromo && (
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {promoData.proximaPromo}
        </div>
      )}
    </div>
  )
}

// Modal producto
function ProductoModal({ producto, onClose, onAgregarCarrito, enCarrito }) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
  const tallas = getTallas(producto)
  const esCloud = producto.nombre.toLowerCase().includes('cloud') && producto.nombre.toLowerCase().includes('ariana')

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
          {producto.foto_url ? <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FotoPlaceholder categoria={producto.categoria} genero={producto.genero} />}
          <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', width: '32px', height: '32px', background: 'rgba(15,14,12,0.5)', borderRadius: '50%', color: 'white', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', display: 'flex', gap: '6px' }}>
            <span style={{ background: esNicho ? 'var(--gold)' : 'white', color: esNicho ? 'white' : 'var(--gold)', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>{producto.categoria}</span>
            {esCloud && <span style={{ background: '#ff6b9d', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>🌸 PROMO ACTIVA</span>}
            {producto.genero && <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '10px' }}>{producto.genero}</span>}
          </div>
        </div>

        <div style={{ padding: '22px 22px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 400, lineHeight: 1.2, flex: 1, paddingRight: '10px' }}>{producto.nombre}</h2>
            <div style={{ textAlign: 'right' }}>
              {producto.precio_original && Number(producto.precio_original) > Number(producto.precio) && (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>S/ {Number(producto.precio_original).toFixed(0)}</div>
              )}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--gold)', whiteSpace: 'nowrap' }}>S/ {Number(producto.precio).toFixed(0)}</div>
              {producto.precio_original && Number(producto.precio_original) > Number(producto.precio) && (
                <div style={{ fontSize: '11px', background: '#e05c5c', color: 'white', borderRadius: '4px', padding: '1px 6px', marginTop: '2px' }}>
                  -{Math.round((1 - Number(producto.precio)/Number(producto.precio_original))*100)}% OFF
                </div>
              )}
            </div>
          </div>

          {esCloud && (
            <div style={{ background: 'linear-gradient(135deg, #ff6b9d22, #ff6b9d11)', border: '1px solid #ff6b9d44', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#ff6b9d' }}>
              🌸 Este perfume ya viene con precio especial en decants — no aplica a combos de promos adicionales.
            </div>
          )}

          {producto.descripcion && <p style={{ color: 'var(--text-soft)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>{producto.descripcion}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {producto.notas_aromaticas && (
              <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>🌸 Notas aromáticas</div>
                <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>{producto.notas_aromaticas}</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {producto.ocasion && <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}><div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>✨ Ocasión</div><div style={{ fontSize: '12px' }}>{producto.ocasion}</div></div>}
              {producto.duracion && <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '12px 14px' }}><div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>⏱ Duración</div><div style={{ fontSize: '12px' }}>{producto.duracion}</div></div>}
            </div>
          </div>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => { onAgregarCarrito(producto, tallaSeleccionada); onClose() }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: enCarrito ? 'var(--ivory-dark)' : 'var(--text)', color: enCarrito ? 'var(--gold)' : 'white', borderRadius: '14px', fontSize: '14px', fontWeight: 600, border: enCarrito ? '2px solid var(--gold)' : 'none' }}>
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

// Panel carrito con promos
function CarritoPanel({ carrito, onEliminar, onClose }) {
  const promoData = calcularPromos(carrito)
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMensajeCarritoConPromo(carrito, promoData)}`

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,12,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
      <div className="fade-in" style={{ background: 'var(--ivory)', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '560px', margin: '0 auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--stone)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400 }}>Tu pedido</h3>
            <p style={{ fontSize: '12px', color: 'var(--warm-gray)', marginTop: '2px' }}>{carrito.length} producto{carrito.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', fontSize: '22px', color: 'var(--text-soft)', padding: '4px' }}>×</button>
        </div>

        <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Banner de promo */}
          <PromoBanner promoData={promoData} />

          {/* Items */}
          {carrito.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: 'var(--ivory-dark)', borderRadius: '10px' }}>
              {item.producto.foto_url && <img src={item.producto.foto_url} alt={item.producto.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }}>{item.producto.nombre}</div>
                <div style={{ fontSize: '11px', color: 'var(--warm-gray)', marginTop: '2px' }}>
                  {item.talla ? `Decant ${item.talla.ml}ml` : 'Sellado'} · {item.producto.categoria}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                  S/ {item.talla ? item.talla.precio : Number(item.producto.precio).toFixed(0)}
                </div>
                <button onClick={() => onEliminar(idx)} style={{ background: 'none', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '2px', textDecoration: 'underline' }}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Totales y botón */}
        <div style={{ padding: '16px 22px 32px', borderTop: '1px solid var(--stone)' }}>
          {promoData.descuentoTotal > 0 ? (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--warm-gray)', marginBottom: '4px' }}>
                <span>Subtotal</span>
                <span>S/ {promoData.totalSinDescuento.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4caf7d', fontWeight: 600, marginBottom: '8px' }}>
                <span>🎉 Descuento promo</span>
                <span>- S/ {promoData.descuentoTotal.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '24px' }}>S/ {promoData.totalConDescuento.toFixed(0)}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>Total estimado</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 500, color: 'var(--gold)' }}>S/ {promoData.totalSinDescuento.toFixed(0)}</span>
            </div>
          )}

          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '16px', background: '#25D366', color: 'white', borderRadius: '14px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Enviar pedido por WhatsApp 🦈
          </a>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--warm-gray)', marginTop: '10px' }}>
            {promoData.descuentoTotal > 0 ? '✓ Descuento incluido en el mensaje' : 'Se enviará la lista completa a WhatsApp'}
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
  const esCloud = producto.nombre.toLowerCase().includes('cloud') && producto.nombre.toLowerCase().includes('ariana')

  return (
    <div onClick={onClick} style={{ background: 'white', borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: esNicho ? '0 2px 16px rgba(184,146,58,0.15)' : '0 2px 12px rgba(26,23,20,0.06)', border: enCarrito ? '2px solid var(--gold)' : esNicho ? '1px solid rgba(184,146,58,0.3)' : 'none', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,23,20,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = esNicho ? '0 2px 16px rgba(184,146,58,0.15)' : '0 2px 12px rgba(26,23,20,0.06)' }}
    >
      {enCarrito && <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--gold)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', zIndex: 2, fontWeight: 700 }}>✓</div>}
      {esCloud && !enCarrito && <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#ff6b9d', color: 'white', borderRadius: '12px', padding: '2px 7px', fontSize: '9px', fontWeight: 700, zIndex: 2 }}>🌸 PROMO</div>}
      <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative' }}>
        {producto.foto_url ? <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FotoPlaceholder categoria={producto.categoria} genero={producto.genero} />}
        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ background: esNicho ? 'var(--gold)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontWeight: 600, color: esNicho ? 'white' : 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{producto.categoria}</span>
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 500, lineHeight: 1.3, marginBottom: '4px' }}>{producto.nombre}</h3>
        {producto.ocasion && <p style={{ fontSize: '11px', color: 'var(--warm-gray)', marginBottom: '8px' }}>{producto.ocasion.split(',')[0]}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {tallas.length > 0 && <div style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>Desde</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 500, color: 'var(--gold)' }}>S/ {precioDesde}</span>
              {producto.precio_original && Number(producto.precio_original) > Number(precioDesde) && (
                <span style={{ fontSize: '12px', color: 'var(--warm-gray)', textDecoration: 'line-through' }}>S/ {Number(producto.precio_original).toFixed(0)}</span>
              )}
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--warm-gray)', textDecoration: 'underline' }}>Ver más</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [productos, setProductos] = useState([])
  const [mostrarAdmin, setMostrarAdmin] = useState(false)
  const [mostrarPasswordAdmin, setMostrarPasswordAdmin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const toquesRef = useRef(0)
  const timerRef = useRef(null)
  const [cargando, setCargando] = useState(true)
  const [generoFiltro, setGeneroFiltro] = useState('Todos')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [carrito, setCarrito] = useState([])
  const [mostrarCarrito, setMostrarCarrito] = useState(false)

  useEffect(() => { cargarProductos() }, [])

  function handleLogoToque() {
    toquesRef.current += 1
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => { toquesRef.current = 0 }, 2000)
    if (toquesRef.current >= TOQUES_REQUERIDOS) {
      toquesRef.current = 0
      setMostrarPasswordAdmin(true)
      setPasswordInput('')
      setPasswordError(false)
    }
  }

  function verificarPassword() {
    if (passwordInput === ADMIN_PASSWORD) {
      setMostrarPasswordAdmin(false)
      setMostrarAdmin(true)
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

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

  const promoData = calcularPromos(carrito)
  const generos = ['Todos', 'Hombre', 'Mujer']
  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))]
  const productosFiltrados = productos.filter(p => {
    const matchGenero = generoFiltro === 'Todos' || p.genero === generoFiltro
    const matchCat = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro
    const matchBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchGenero && matchCat && matchBusqueda
  })

  if (mostrarAdmin) {
    return <Admin onSalir={() => setMostrarAdmin(false)} />
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--stone)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'default' }} onClick={handleLogoToque}>
            <LogoFlor />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1 }}>DDS <span style={{ color: 'var(--gold)' }}>Parfums</span></div>
              <div style={{ fontSize: '9px', color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Día de Suerte · Ica</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {carrito.length > 0 && (
              <button onClick={() => setMostrarCarrito(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: promoData.descuentoTotal > 0 ? '#4caf7d' : 'var(--gold)', color: 'white', padding: '8px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>
                {promoData.descuentoTotal > 0 ? '🎉' : '🛒'} Pedido
                <span style={{ background: 'white', color: promoData.descuentoTotal > 0 ? '#4caf7d' : 'var(--gold)', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{carrito.length}</span>
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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(72px, 18vw, 110px)', fontWeight: 600, letterSpacing: '0.08em', color: '#d4aa5a', lineHeight: 1, marginBottom: '4px' }}>DDS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 300, lineHeight: 1.2, marginBottom: '16px', color: 'white' }}>
            Fragancias que <em style={{ fontStyle: 'italic', color: '#d4aa5a' }}>te definen</em>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>
            Perfumes sellados y decants de marcas árabes, de diseñador y nicho.<br />Ica, Perú · Pedidos por WhatsApp
          </p>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#d4aa5a', color: '#0f0e0c', padding: '13px 28px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            Hacer un pedido 🦈
          </a>
        </div>
      </div>

      {/* Banner promo global (si hay items en carrito) */}
      {carrito.length > 0 && (promoData.mensajePromo || promoData.proximaPromo) && (
        <div style={{ background: promoData.descuentoTotal > 0 ? '#0a2a0a' : '#0a0a2a', padding: '10px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', fontSize: '13px', color: promoData.descuentoTotal > 0 ? '#4caf7d' : '#8888dd', fontWeight: 500 }}>
            {promoData.mensajePromo || promoData.proximaPromo}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--stone)', padding: '14px 20px', position: 'sticky', top: '58px', zIndex: 90 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder="🔍 Buscar perfume..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: '7px 14px', borderRadius: '50px', border: '1.5px solid var(--stone)', fontSize: '13px', background: 'var(--ivory)', color: 'var(--text)', outline: 'none', minWidth: '160px', flex: '1' }} />
          <div style={{ display: 'flex', gap: '5px' }}>
            {generos.map(g => <button key={g} onClick={() => setGeneroFiltro(g)} style={{ padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: generoFiltro === g ? '#0f0e0c' : 'white', color: generoFiltro === g ? 'white' : 'var(--text-soft)', border: `1.5px solid ${generoFiltro === g ? '#0f0e0c' : 'var(--stone)'}` }}>{g}</button>)}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {categorias.map(c => <button key={c} onClick={() => setCategoriaFiltro(c)} style={{ padding: '7px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: categoriaFiltro === c ? 'var(--gold)' : 'white', color: categoriaFiltro === c ? 'white' : 'var(--text-soft)', border: `1.5px solid ${categoriaFiltro === c ? 'var(--gold)' : 'var(--stone)'}` }}>{c}</button>)}
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
            {productosFiltrados.map(p => <ProductoCard key={p.id} producto={p} onClick={() => setSeleccionado(p)} enCarrito={estaEnCarrito(p)} />)}
          </div>
        )}
      </div>

      {/* Botón flotante */}
      {carrito.length > 0 && !mostrarCarrito && (
        <button onClick={() => setMostrarCarrito(true)} style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: promoData.descuentoTotal > 0 ? '#4caf7d' : '#25D366', color: 'white', borderRadius: '50px', padding: '14px 24px', fontWeight: 700, fontSize: '14px', boxShadow: `0 4px 20px ${promoData.descuentoTotal > 0 ? 'rgba(76,175,125,0.5)' : 'rgba(37,211,102,0.4)'}`, display: 'flex', alignItems: 'center', gap: '10px', zIndex: 100, whiteSpace: 'nowrap' }}>
          {promoData.descuentoTotal > 0 ? '🎉' : '🛒'} Ver pedido ({carrito.length})
          <span style={{ background: 'white', color: promoData.descuentoTotal > 0 ? '#4caf7d' : '#25D366', borderRadius: '12px', padding: '1px 8px', fontSize: '12px', fontWeight: 800 }}>
            S/ {promoData.totalConDescuento.toFixed(0)}
          </span>
        </button>
      )}

      {/* Footer */}
      <footer style={{ background: '#0f0e0c', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '32px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: '#d4aa5a', marginBottom: '4px' }}>DDS</div>
        <p style={{ fontSize: '12px', marginBottom: '16px' }}>Día de Suerte · Ica, Perú</p>
        
        {/* Redes sociales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '16px' }}>
          {/* WhatsApp */}
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          {/* TikTok */}
          {REDES.tiktok && (
            <a href={REDES.tiktok} target="_blank" rel="noopener noreferrer" title="TikTok" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg>
            </a>
          )}
          {/* Instagram */}
          {REDES.instagram && (
            <a href={REDES.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          )}
          {/* Facebook */}
          {REDES.facebook && (
            <a href={REDES.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          )}
        </div>
        
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#25D366', textDecoration: 'none' }}>+51 902 216 717</a>
      </footer>

      {seleccionado && <ProductoModal producto={seleccionado} onClose={() => setSeleccionado(null)} onAgregarCarrito={agregarCarrito} enCarrito={estaEnCarrito(seleccionado)} />}
      {mostrarCarrito && <CarritoPanel carrito={carrito} onEliminar={eliminarDelCarrito} onClose={() => setMostrarCarrito(false)} />}
      {mostrarPasswordAdmin && (
        <div onClick={e => e.target === e.currentTarget && setMostrarPasswordAdmin(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1f', border: '1px solid #c9a84c44', borderRadius: '14px', padding: '28px 24px', width: '280px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '22px', color: '#c9a84c', marginBottom: '6px' }}>DDS</div>
            <div style={{ fontSize: '12px', color: '#5a5560', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Acceso admin</div>
            <input type="password" placeholder="Contraseña" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setPasswordError(false) }} onKeyDown={e => e.key === 'Enter' && verificarPassword()} style={{ width: '100%', padding: '10px 12px', background: '#0d0d0f', border: `1px solid ${passwordError ? '#e05c5c' : '#3a3a42'}`, borderRadius: '8px', color: '#f0ede8', fontSize: '14px', outline: 'none', textAlign: 'center', marginBottom: '8px' }} autoFocus />
            {passwordError && <div style={{ fontSize: '12px', color: '#e05c5c', marginBottom: '8px' }}>Contraseña incorrecta</div>}
            <button onClick={verificarPassword} style={{ width: '100%', padding: '10px', background: '#c9a84c', color: '#0d0d0f', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>Entrar</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: '.fade-in{animation:fadeIn 0.3s ease forwards}@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}'}} />
    </>
    </div>
  )
}
