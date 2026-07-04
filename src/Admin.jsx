import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'

const CATEGORIAS = ['Árabe', 'Diseñador', 'Nicho']
const GENEROS = ['Hombre', 'Mujer', 'Unisex']
const SUBCATEGORIAS = ['Nocturnos', 'Versátil', 'Día']

export default function Admin({ onSalir }) {
  const [tab, setTab] = useState('productos')
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [nuevoForm, setNuevoForm] = useState({
    nombre: '', categoria: 'Árabe', genero: 'Hombre', subcategoria: 'Versátil',
    precio: '', precio_3ml: '', precio_5ml: '', precio_10ml: '', precio_30ml: '',
    descripcion: '', notas_aromaticas: '', ocasion: '', duracion: '', foto_url: '', orden: 99
  })

  useEffect(() => { cargarProductos() }, [])

  async function cargarProductos() {
    setCargando(true)
    const { data } = await supabase.from('catalogo_productos').select('*').order('orden').order('nombre')
    setProductos(data || [])
    setCargando(false)
  }

  function iniciarEdicion(p) {
    setEditando(p.id)
    setForm({ ...p })
  }

  function cancelarEdicion() {
    setEditando(null)
    setForm({})
  }

  async function guardarEdicion() {
    setGuardando(true)
    const { error } = await supabase.from('catalogo_productos').update({
      nombre: form.nombre,
      categoria: form.categoria,
      genero: form.genero,
      subcategoria: form.subcategoria,
      precio: parseFloat(form.precio) || 0,
      precio_3ml: form.precio_3ml ? parseFloat(form.precio_3ml) : null,
      precio_5ml: form.precio_5ml ? parseFloat(form.precio_5ml) : null,
      precio_10ml: form.precio_10ml ? parseFloat(form.precio_10ml) : null,
      precio_30ml: form.precio_30ml ? parseFloat(form.precio_30ml) : null,
      descripcion: form.descripcion,
      notas_aromaticas: form.notas_aromaticas,
      ocasion: form.ocasion,
      duracion: form.duracion,
      foto_url: form.foto_url,
      disponible: form.disponible,
      orden: parseInt(form.orden) || 99,
    }).eq('id', editando)
    if (error) alert('Error: ' + error.message)
    else { cancelarEdicion(); cargarProductos() }
    setGuardando(false)
  }

  async function toggleDisponible(p) {
    await supabase.from('catalogo_productos').update({ disponible: !p.disponible }).eq('id', p.id)
    cargarProductos()
  }

  async function agregarProducto() {
    if (!nuevoForm.nombre || !nuevoForm.precio) { alert('Nombre y precio son requeridos'); return }
    setGuardando(true)
    const { error } = await supabase.from('catalogo_productos').insert({
      ...nuevoForm,
      precio: parseFloat(nuevoForm.precio) || 0,
      precio_3ml: nuevoForm.precio_3ml ? parseFloat(nuevoForm.precio_3ml) : null,
      precio_5ml: nuevoForm.precio_5ml ? parseFloat(nuevoForm.precio_5ml) : null,
      precio_10ml: nuevoForm.precio_10ml ? parseFloat(nuevoForm.precio_10ml) : null,
      precio_30ml: nuevoForm.precio_30ml ? parseFloat(nuevoForm.precio_30ml) : null,
      disponible: true,
    })
    if (error) alert('Error: ' + error.message)
    else {
      setMostrarNuevo(false)
      setNuevoForm({ nombre: '', categoria: 'Árabe', genero: 'Hombre', subcategoria: 'Versátil', precio: '', precio_3ml: '', precio_5ml: '', precio_10ml: '', precio_30ml: '', descripcion: '', notas_aromaticas: '', ocasion: '', duracion: '', foto_url: '', orden: 99 })
      cargarProductos()
    }
    setGuardando(false)
  }

  const inputStyle = { width: '100%', padding: '8px 10px', background: '#1e1e24', border: '1px solid #3a3a42', borderRadius: '6px', color: '#f0ede8', fontSize: '13px', outline: 'none' }
  const labelStyle = { fontSize: '11px', color: '#9a9299', display: 'block', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }

  function FormProducto({ data, onChange, onGuardar, onCancelar, titulo }) {
    return (
      <div style={{ background: '#242429', border: '1px solid #c9a84c44', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#c9a84c', marginBottom: '16px' }}>{titulo}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Nombre</label>
            <input style={inputStyle} value={data.nombre || ''} onChange={e => onChange({ ...data, nombre: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Categoría</label>
            <select style={inputStyle} value={data.categoria || 'Árabe'} onChange={e => onChange({ ...data, categoria: e.target.value })}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Género</label>
            <select style={inputStyle} value={data.genero || 'Hombre'} onChange={e => onChange({ ...data, genero: e.target.value })}>
              {GENEROS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Subcategoría</label>
            <select style={inputStyle} value={data.subcategoria || ''} onChange={e => onChange({ ...data, subcategoria: e.target.value })}>
              <option value="">-</option>
              {SUBCATEGORIAS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Orden</label>
            <input type="number" style={inputStyle} value={data.orden || ''} onChange={e => onChange({ ...data, orden: e.target.value })} />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Precios</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[['precio', 'Sellado'], ['precio_3ml', '3ml'], ['precio_5ml', '5ml'], ['precio_10ml', '10ml'], ['precio_30ml', '30ml']].map(([key, lbl]) => (
              <div key={key}>
                <label style={{ ...labelStyle, fontSize: '10px' }}>{lbl}</label>
                <input type="number" style={{ ...inputStyle, padding: '6px 8px' }} value={data[key] || ''} onChange={e => onChange({ ...data, [key]: e.target.value })} placeholder="S/" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '12px' }}>
          {[['descripcion', 'Descripción', true], ['notas_aromaticas', 'Notas aromáticas', true], ['ocasion', 'Ocasión', false], ['duracion', 'Duración', false], ['foto_url', 'URL de foto', false]].map(([key, lbl, isTextarea]) => (
            <div key={key}>
              <label style={labelStyle}>{lbl}</label>
              {isTextarea
                ? <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={data[key] || ''} onChange={e => onChange({ ...data, [key]: e.target.value })} />
                : <input style={inputStyle} value={data[key] || ''} onChange={e => onChange({ ...data, [key]: e.target.value })} />
              }
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onGuardar} disabled={guardando} style={{ padding: '9px 20px', background: '#c9a84c', color: '#0d0d0f', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>
            {guardando ? 'Guardando...' : '✓ Guardar'}
          </button>
          <button onClick={onCancelar} style={{ padding: '9px 16px', background: 'transparent', border: '1px solid #3a3a42', color: '#9a9299', borderRadius: '8px', fontSize: '13px' }}>
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0f', color: '#f0ede8', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
      {/* Header admin */}
      <div style={{ background: '#1a1a1f', borderBottom: '1px solid #3a3a42', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#c9a84c' }}>DDS</span>
          <span style={{ fontSize: '12px', color: '#5a5560', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Panel Admin</span>
        </div>
        <button onClick={onSalir} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #3a3a42', color: '#9a9299', borderRadius: '6px', fontSize: '12px' }}>
          ← Volver al catálogo
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>
        {/* Stats rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Total productos', value: productos.length },
            { label: 'Activos', value: productos.filter(p => p.disponible).length },
            { label: 'Inactivos', value: productos.filter(p => !p.disponible).length },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#1a1a1f', border: '1px solid #3a3a42', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#5a5560', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#c9a84c' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Botón agregar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button onClick={() => setMostrarNuevo(!mostrarNuevo)} style={{ padding: '9px 18px', background: mostrarNuevo ? 'transparent' : '#c9a84c', color: mostrarNuevo ? '#9a9299' : '#0d0d0f', border: mostrarNuevo ? '1px solid #3a3a42' : 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px' }}>
            {mostrarNuevo ? 'Cancelar' : '+ Nuevo producto'}
          </button>
        </div>

        {/* Formulario nuevo producto */}
        {mostrarNuevo && (
          <FormProducto
            data={nuevoForm}
            onChange={setNuevoForm}
            onGuardar={agregarProducto}
            onCancelar={() => setMostrarNuevo(false)}
            titulo="Agregar nuevo producto"
          />
        )}

        {/* Lista de productos */}
        {cargando ? (
          <div style={{ textAlign: 'center', color: '#5a5560', padding: '40px' }}>Cargando...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {productos.map(p => (
              <div key={p.id}>
                {editando === p.id ? (
                  <FormProducto
                    data={form}
                    onChange={setForm}
                    onGuardar={guardarEdicion}
                    onCancelar={cancelarEdicion}
                    titulo={`Editando: ${p.nombre}`}
                  />
                ) : (
                  <div style={{ background: '#1a1a1f', border: `1px solid ${p.disponible ? '#3a3a42' : '#2a2a2a'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', opacity: p.disponible ? 1 : 0.5 }}>
                    {p.foto_url && <img src={p.foto_url} alt={p.nombre} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                      <div style={{ fontSize: '11px', color: '#5a5560' }}>
                        {p.categoria} · {p.genero} · S/ {Number(p.precio).toFixed(0)}
                        {p.precio_3ml && ` · 3ml: S/${p.precio_3ml}`}
                        {p.precio_5ml && ` · 5ml: S/${p.precio_5ml}`}
                        {p.precio_10ml && ` · 10ml: S/${p.precio_10ml}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => iniciarEdicion(p)} style={{ padding: '6px 12px', background: '#2e2e35', border: '1px solid #3a3a42', color: '#c9a84c', borderRadius: '6px', fontSize: '12px' }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => toggleDisponible(p)} style={{ padding: '6px 12px', background: p.disponible ? '#2a1010' : '#0a2a0a', border: `1px solid ${p.disponible ? '#5a2020' : '#204a20'}`, color: p.disponible ? '#e05c5c' : '#4caf7d', borderRadius: '6px', fontSize: '12px' }}>
                        {p.disponible ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
