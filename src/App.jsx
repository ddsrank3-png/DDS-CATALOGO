import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

const WA_NUMBER = '51902216717'

function waMensaje(producto) {
  return encodeURIComponent(
    `Hola! 🌸 Me interesa este producto de DDS Parfums:\n\n` +
    `*${producto.nombre}*\n` +
    `Precio: S/ ${Number(producto.precio).toFixed(2)}\n\n` +
    `¿Está disponible? ¿Cómo puedo pedirlo?`
  )
}

function waLink(producto) {
  return `https://wa.me/${WA_NUMBER}?text=${waMensaje(producto)}`
}

// Icono flor SVG como logo
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

// Placeholder elegante cuando no hay foto
function FotoPlaceholder({ nombre, categoria }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #e8e0d5 0%, #f0ebe2 50%, #e0d8cc 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
    }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="18" rx="8" ry="14" stroke="#b8923a" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M24 32 L24 44" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <path d="M18 38 L30 38" stroke="#b8923a" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="24" cy="18" r="4" fill="#b8923a" opacity="0.2"/>
        <path d="M16 16 C14 12 16 6 20 8" stroke="#b8923a" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M32 16 C34 12 32 6 28 8" stroke="#b8923a" strokeWidth="1" fill="none" opacity="0.4"/>
      </svg>
      <span style={{ fontSize: '11px', color: '#9a9088', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '0 12px' }}>
        {categoria}
      </span>
    </div>
  )
}

// Modal de detalle del producto
function ProductoModal({ producto, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,14,12,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex', alignItems: 'flex-end',
        padding: '0',
      }}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--ivory)',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '560px',
          margin: '0 auto',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Foto */}
        <div style={{ width: '100%', height: '280px', position: 'relative', flexShrink: 0 }}>
          {producto.foto_url ? (
            <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FotoPlaceholder nombre={producto.nombre} categoria={producto.categoria} />
          )}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '14px', right: '14px',
              width: '32px', height: '32px',
              background: 'rgba(15,14,12,0.5)',
              borderRadius: '50%',
              color: 'white',
              fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
          <div style={{
            position: 'absolute', bottom: '14px', left: '14px',
            background: 'var(--gold)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {producto.categoria}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '24px 24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, lineHeight: 1.2, flex: 1, paddingRight: '12px' }}>
              {producto.nombre}
            </h2>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 500, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
              S/ {Number(producto.precio).toFixed(2)}
            </div>
          </div>

          {producto.descripcion && (
            <p style={{ color: 'var(--text-soft)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              {producto.descripcion}
            </p>
          )}

          {/* Ficha técnica */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {producto.notas_aromaticas && (
              <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '5px' }}>
                  🌸 Notas aromáticas
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text)' }}>{producto.notas_aromaticas}</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {producto.ocasion && (
                <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '5px' }}>✨ Ocasión</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>{producto.ocasion}</div>
                </div>
              )}
              {producto.duracion && (
                <div style={{ background: 'var(--ivory-dark)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, marginBottom: '5px' }}>⏱ Duración</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>{producto.duracion}</div>
                </div>
              )}
            </div>
          </div>

          {/* Botón WhatsApp */}
          <a
            href={waLink(producto)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px',
              background: '#25D366',
              color: 'white',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

// Tarjeta de producto
function ProductoCard({ producto, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 12px rgba(26,23,20,0.06)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,23,20,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,23,20,0.06)' }}
    >
      {/* Foto */}
      <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative' }}>
        {producto.foto_url ? (
          <img src={producto.foto_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <FotoPlaceholder nombre={producto.nombre} categoria={producto.categoria} />
        )}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--gold)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {producto.categoria}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 500, lineHeight: 1.3, marginBottom: '6px' }}>
          {producto.nombre}
        </h3>
        {producto.ocasion && (
          <p style={{ fontSize: '12px', color: 'var(--warm-gray)', marginBottom: '10px', lineHeight: 1.4 }}>
            {producto.ocasion}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, color: 'var(--gold)' }}>
            S/ {Number(producto.precio).toFixed(2)}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--warm-gray)', textDecoration: 'underline' }}>Ver detalles</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    const { data } = await supabase
      .from('catalogo_productos')
      .select('*')
      .eq('disponible', true)
      .order('orden')
      .order('nombre')
    setProductos(data || [])
    setCargando(false)
  }

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))]
  const productosFiltrados = filtro === 'Todos' ? productos : productos.filter(p => p.categoria === filtro)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--stone)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoFlor />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1 }}>
                DDS <span style={{ color: 'var(--gold)' }}>Parfums</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--warm-gray)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Día de Suerte · Ica
              </div>
            </div>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#25D366', color: 'white',
              padding: '8px 16px', borderRadius: '50px',
              fontSize: '13px', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escríbenos
          </a>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--black) 0%, #2a1f10 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '60px 24px 50px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle at 30% 50%, #b8923a 0%, transparent 60%), radial-gradient(circle at 70% 50%, #b8923a 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '16px' }}>
            Colección exclusiva
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 8vw, 58px)', fontWeight: 300, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Fragancias que<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>te definen</em>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '28px' }}>
            Perfumes y decants de marcas de lujo al alcance de todos.<br />
            Envíos en Ica y pedidos por WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--gold)', color: 'var(--black)',
              padding: '13px 28px', borderRadius: '50px',
              fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.04em',
            }}
          >
            Hacer un pedido
          </a>
        </div>
      </div>

      {/* Catálogo */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                fontSize: '13px',
                fontWeight: 500,
                background: filtro === cat ? 'var(--gold)' : 'white',
                color: filtro === cat ? 'white' : 'var(--text-soft)',
                border: `1.5px solid ${filtro === cat ? 'var(--gold)' : 'var(--stone)'}`,
                letterSpacing: '0.02em',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--warm-gray)' }}>
            Cargando catálogo...
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--warm-gray)' }}>
            Sin productos disponibles
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {productosFiltrados.map(p => (
              <ProductoCard key={p.id} producto={p} onClick={() => setSeleccionado(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--black)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <LogoFlor />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>DDS Parfums</span>
        </div>
        <p style={{ fontSize: '12px', marginBottom: '4px' }}>Día de Suerte · Ica, Perú</p>
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#25D366', textDecoration: 'none' }}>
          +51 902 216 717
        </a>
      </footer>

      {/* Modal */}
      {seleccionado && (
        <ProductoModal producto={seleccionado} onClose={() => setSeleccionado(null)} />
      )}
    </div>
  )
}
