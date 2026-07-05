import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

const CATEGORIAS = ['Árabe', 'Diseñador', 'Nicho']
const GENEROS = ['Masculino', 'Femenino', 'Unisex']
const MOMENTOS = ['Diurno', 'Nocturno', 'Versátil (día/noche)']
const TALLAS = ['3ml', '5ml', '10ml', '30ml', 'Sellado']
const MARCAS = ['Afnan', 'Lattafa', 'Armaf', 'Rasasi', 'Maison Alhambra', 'Al Haramain', 'Bharara', 'Dumont', 'Versace', 'Jean Paul Gaultier', 'Emporio Armani', 'Valentino', 'Xerjoff', 'Ariana Grande', 'Otra']

const FORM_VACIO = {
  nombre: '', marca: '', descripcion: '',
  categoria: '', genero: '', momento: '', duracion: '',
  foto_url: '',
  tallas: { '3ml': { activa: false, precio: '', precio_original: '' }, '5ml': { activa: true, precio: '', precio_original: '' }, '10ml': { activa: true, precio: '', precio_original: '' }, '30ml': { activa: false, precio: '', precio_original: '' }, 'Sellado': { activa: false, precio: '', precio_original: '' } },
  destacado: false, disponible: true,
}

export default function Admin({ onSalir }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState({ ...FORM_VACIO })
  const [editandoId, setEditandoId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { cargarProductos() }, [])

  async function cargarProductos() {
    setCargando(true)
    const { data } = await supabase.from('catalogo_productos').select('*').order('orden').order('nombre')
    setProductos(data || [])
    setCargando(false)
  }

  // Subir imagen a Supabase Storage
  async function subirImagen(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Solo se permiten imágenes'); return }
    setSubiendoFoto(true)
    const ext = file.name.split('.').pop()
    const nombre = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('perfumes').upload(nombre, file, { upsert: true })
    if (error) { alert('Error subiendo imagen: ' + error.message); setSubiendoFoto(false); return }
    const { data: urlData } = supabase.storage.from('perfumes').getPublicUrl(nombre)
    setForm(f => ({ ...f, foto_url: urlData.publicUrl }))
    setSubiendoFoto(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) subirImagen(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) subirImagen(file)
  }

  function toggleTalla(talla) {
    setForm(f => ({ ...f, tallas: { ...f.tallas, [talla]: { ...f.tallas[talla], activa: !f.tallas[talla].activa } } }))
  }

  function setPrecioTalla(talla, precio) {
    setForm(f => ({ ...f, tallas: { ...f.tallas, [talla]: { ...f.tallas[talla], precio } } }))
  }

  function limpiarForm() {
    setForm({ ...FORM_VACIO })
    setEditandoId(null)
  }

  function cargarProductoEnForm(p) {
    // Reconstruir tallas desde subcategoria y precio
    const tallas = { '3ml': { activa: false, precio: '' }, '5ml': { activa: false, precio: '' }, '10ml': { activa: false, precio: '' }, '30ml': { activa: false, precio: '' }, 'Sellado': { activa: false, precio: '' } }
    if (p.precio_3ml) tallas['3ml'] = { activa: true, precio: String(p.precio_3ml) }
    if (p.precio_5ml) tallas['5ml'] = { activa: true, precio: String(p.precio_5ml) }
    if (p.precio_10ml) tallas['10ml'] = { activa: true, precio: String(p.precio_10ml) }
    if (p.precio_30ml) tallas['30ml'] = { activa: true, precio: String(p.precio_30ml) }
    if (p.precio && p.tipo === 'Sellado') tallas['Sellado'] = { activa: true, precio: String(p.precio) }

    setForm({
      nombre: p.nombre || '',
      marca: p.subcategoria || '',
      descripcion: p.notas_aromaticas || '',
      categoria: p.categoria || '',
      genero: p.genero || '',
      momento: p.ocasion || '',
      duracion: p.duracion || '',
      foto_url: p.foto_url || '',
      tallas,
      destacado: false,
      disponible: p.disponible !== false,
    })
    setEditandoId(p.id)
    window.scrollTo(0, 0)
  }

  async function guardar() {
    if (!form.nombre.trim()) { alert('El nombre es requerido'); return }
    setGuardando(true)

    const tallasActivas = TALLAS.filter(t => form.tallas[t].activa && form.tallas[t].precio)

    if (tallasActivas.length === 0) { alert('Agrega al menos una talla con precio'); setGuardando(false); return }

    try {
      if (editandoId) {
        // Actualizar producto existente
        const talla = tallasActivas[0]
        const { error } = await supabase.from('catalogo_productos').update({
          nombre: form.nombre.trim(),
          subcategoria: form.marca,
          notas_aromaticas: form.descripcion,
          categoria: form.categoria,
          genero: form.genero,
          ocasion: form.momento,
          duracion: form.duracion || null,
          foto_url: form.foto_url || null,
          disponible: form.disponible,
          precio_3ml: form.tallas['3ml'].activa && form.tallas['3ml'].precio ? parseFloat(form.tallas['3ml'].precio) : null,
          precio_5ml: form.tallas['5ml'].activa && form.tallas['5ml'].precio ? parseFloat(form.tallas['5ml'].precio) : null,
          precio_10ml: form.tallas['10ml'].activa && form.tallas['10ml'].precio ? parseFloat(form.tallas['10ml'].precio) : null,
          precio_30ml: form.tallas['30ml'].activa && form.tallas['30ml'].precio ? parseFloat(form.tallas['30ml'].precio) : null,
          precio: parseFloat(form.tallas[talla].precio),
          precio_original: form.tallas[talla].precio_original ? parseFloat(form.tallas[talla].precio_original) : null,
          tipo: talla === 'Sellado' ? 'Sellado' : `Decant ${talla}`,
        }).eq('id', editandoId)
        if (error) throw error
      } else {
        // Crear nuevos productos (uno por talla)
        const inserts = tallasActivas.map((talla, i) => ({
          nombre: form.nombre.trim(),
          subcategoria: form.marca,
          notas_aromaticas: form.descripcion,
          categoria: form.categoria,
          genero: form.genero,
          ocasion: form.momento,
          duracion: form.duracion || null,
          foto_url: form.foto_url || null,
          disponible: form.disponible,
          precio: parseFloat(form.tallas[talla].precio),
          precio_original: form.tallas[talla].precio_original ? parseFloat(form.tallas[talla].precio_original) : null,
          tipo: talla === 'Sellado' ? 'Sellado' : `Decant ${talla}`,
          precio_3ml: form.tallas['3ml'].activa && form.tallas['3ml'].precio ? parseFloat(form.tallas['3ml'].precio) : null,
          precio_5ml: form.tallas['5ml'].activa && form.tallas['5ml'].precio ? parseFloat(form.tallas['5ml'].precio) : null,
          precio_10ml: form.tallas['10ml'].activa && form.tallas['10ml'].precio ? parseFloat(form.tallas['10ml'].precio) : null,
          precio_30ml: form.tallas['30ml'].activa && form.tallas['30ml'].precio ? parseFloat(form.tallas['30ml'].precio) : null,
          orden: 99 + i,
        }))
        const { error } = await supabase.from('catalogo_productos').insert(inserts)
        if (error) throw error
      }
      limpiarForm()
      cargarProductos()
      alert(editandoId ? '✓ Producto actualizado' : `✓ ${tallasActivas.length} producto(s) creado(s)`)
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setGuardando(false)
  }

  async function toggleVisibilidad(p) {
    await supabase.from('catalogo_productos').update({ disponible: !p.disponible }).eq('id', p.id)
    cargarProductos()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await supabase.from('catalogo_productos').delete().eq('id', id)
    cargarProductos()
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.subcategoria?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const s = {
    panel: { display: 'flex', minHeight: '100vh', background: '#111', color: '#f0ede8', fontFamily: 'Inter, sans-serif', fontSize: '13px' },
    sidebar: { width: '310px', minWidth: '310px', background: '#1a1a1a', borderRight: '1px solid #2a2a2a', padding: '20px', overflowY: 'auto', maxHeight: '100vh' },
    main: { flex: 1, padding: '20px', overflowY: 'auto', maxHeight: '100vh' },
    label: { fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' },
    input: { width: '100%', padding: '8px 10px', background: '#222', border: '1px solid #333', borderRadius: '6px', color: '#f0ede8', fontSize: '13px', outline: 'none', marginBottom: '10px' },
    select: { width: '100%', padding: '8px 10px', background: '#222', border: '1px solid #333', borderRadius: '6px', color: '#f0ede8', fontSize: '13px', outline: 'none', marginBottom: '10px' },
    btn: { padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', border: 'none' },
  }

  return (
    <div style={s.panel}>
      {/* Sidebar formulario */}
      <div style={s.sidebar}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#c9a84c', fontWeight: 700 }}>DDS Admin</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Panel de productos</div>
          </div>
          <button onClick={onSalir} style={{ ...s.btn, background: '#222', color: '#888', padding: '6px 12px', fontSize: '12px' }}>← Salir</button>
        </div>

        <div style={{ fontSize: '13px', fontWeight: 700, color: '#c9a84c', marginBottom: '14px' }}>
          {editandoId ? '✏️ Editar producto' : '✨ Nuevo producto'}
        </div>

        {/* Nombre */}
        <label style={s.label}>Nombre *</label>
        <input style={s.input} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej. 9PM" />

        {/* Marca */}
        <label style={s.label}>Marca</label>
        <input style={s.input} value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} placeholder="Ej. Afnan" list="marcas-list" />
        <datalist id="marcas-list">{MARCAS.map(m => <option key={m} value={m} />)}</datalist>

        {/* Descripción */}
        <label style={s.label}>Descripción / notas</label>
        <textarea style={{ ...s.input, resize: 'vertical', minHeight: '60px', marginBottom: '10px' }} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Manzana, canela, lavanda..." />

        {/* Categoría y Género */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={s.label}>Categoría</label>
            <select style={s.select} value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              <option value="">—</option>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Género</label>
            <select style={s.select} value={form.genero} onChange={e => setForm(f => ({ ...f, genero: e.target.value }))}>
              <option value="">—</option>
              {GENEROS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Momento de uso */}
        <label style={s.label}>Momento de uso</label>
        <select style={s.select} value={form.momento} onChange={e => setForm(f => ({ ...f, momento: e.target.value }))}>
          <option value="">—</option>
          {MOMENTOS.map(m => <option key={m}>{m}</option>)}
        </select>

        {/* Duración */}
        <label style={s.label}>Duración en piel</label>
        <input style={s.input} value={form.duracion} onChange={e => setForm(f => ({ ...f, duracion: e.target.value }))} placeholder="Ej. 6-8 horas" />

        {/* Tallas y precios */}
        <label style={s.label}>Presentaciones y precios</label>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase' }}>Talla</span>
          <span style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase' }}>Precio</span>
          <span style={{ fontSize: '10px', color: '#c9a84c', textTransform: 'uppercase' }}>Precio tachado</span>
        </div>
        {TALLAS.map(talla => (
          <div key={talla} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.tallas[talla].activa} onChange={() => toggleTalla(talla)} style={{ width: '14px', height: '14px', accentColor: '#c9a84c' }} />
              <span style={{ fontSize: '12px' }}>{talla}</span>
            </label>
            <input
              type="number"
              placeholder="S/ —"
              value={form.tallas[talla].precio}
              onChange={e => setPrecioTalla(talla, e.target.value)}
              style={{ ...s.input, marginBottom: 0, padding: '6px 8px', opacity: form.tallas[talla].activa ? 1 : 0.4 }}
              disabled={!form.tallas[talla].activa}
            />
            <input
              type="number"
              placeholder="Antes S/ —"
              value={form.tallas[talla].precio_original || ''}
              onChange={e => setForm(f => ({ ...f, tallas: { ...f.tallas, [talla]: { ...f.tallas[talla], precio_original: e.target.value } } }))}
              style={{ ...s.input, marginBottom: 0, padding: '6px 8px', opacity: form.tallas[talla].activa ? 1 : 0.3, borderColor: form.tallas[talla].precio_original ? '#c9a84c44' : '#333' }}
              disabled={!form.tallas[talla].activa}
            />
          </div>
        ))}
        <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px', lineHeight: 1.5 }}>
          Escribe el precio de las tallas que ofreces. Deja vacío las que no.<br />
          La casilla ✓ decide si esa talla aparece en el catálogo.
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.destacado} onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))} style={{ width: '15px', height: '15px', accentColor: '#c9a84c' }} />
            <span>Destacado (aparece primero)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.disponible} onChange={e => setForm(f => ({ ...f, disponible: e.target.checked }))} style={{ width: '15px', height: '15px', accentColor: '#c9a84c' }} />
            <span>Mostrar el producto en el catálogo</span>
          </label>
        </div>

        {/* Imagen */}
        <label style={s.label}>Imagen</label>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#c9a84c' : '#333'}`,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '14px',
            background: dragOver ? 'rgba(201,168,76,0.05)' : 'transparent',
            transition: 'all 0.2s',
            minHeight: '80px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {subiendoFoto ? (
            <span style={{ color: '#888' }}>Subiendo...</span>
          ) : form.foto_url ? (
            <>
              <img src={form.foto_url} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
              <span style={{ fontSize: '11px', color: '#888' }}>Toca para cambiar</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '24px' }}>📷</span>
              <span style={{ color: '#888', fontSize: '12px' }}>Toca para subir una foto<br />JPG o PNG</span>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Botones */}
        <button onClick={guardar} disabled={guardando} style={{ ...s.btn, background: '#c9a84c', color: '#111', width: '100%', marginBottom: '8px', padding: '12px' }}>
          {guardando ? 'Guardando...' : editandoId ? 'Actualizar producto' : 'Guardar producto'}
        </button>
        {editandoId && (
          <button onClick={limpiarForm} style={{ ...s.btn, background: 'transparent', border: '1px solid #333', color: '#888', width: '100%' }}>
            Cancelar edición
          </button>
        )}
      </div>

      {/* Panel principal lista */}
      <div style={s.main}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 400, color: '#f0ede8' }}>Productos</h2>
          <input
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ ...s.input, width: '220px', marginBottom: 0 }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total', value: productos.length },
            { label: 'Visibles', value: productos.filter(p => p.disponible).length },
            { label: 'Ocultos', value: productos.filter(p => !p.disponible).length },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#c9a84c' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Lista productos */}
        {cargando ? (
          <div style={{ textAlign: 'center', color: '#555', padding: '40px' }}>Cargando...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {productosFiltrados.map(p => {
              const tallas = []
              if (p.precio_3ml) tallas.push(`3ml S/ ${p.precio_3ml}`)
              if (p.precio_5ml) tallas.push(`5ml S/ ${p.precio_5ml}`)
              if (p.precio_10ml) tallas.push(`10ml S/ ${p.precio_10ml}`)
              if (p.precio_30ml) tallas.push(`30ml S/ ${p.precio_30ml}`)
              if (p.tipo === 'Sellado') tallas.push(`Sellado S/ ${p.precio}`)

              return (
                <div key={p.id} style={{ background: '#1a1a1a', border: `1px solid ${p.disponible ? '#2a2a2a' : '#1f1f1f'}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '14px', opacity: p.disponible ? 1 : 0.55 }}>
                  {/* Foto */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
                    {p.foto_url
                      ? <img src={p.foto_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🧴</div>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#f0ede8', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.nombre}</div>
                    <div style={{ fontSize: '11px', color: '#c9a84c', marginBottom: '4px' }}>
                      {[p.subcategoria, p.categoria, p.genero, p.ocasion].filter(Boolean).join(' · ')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {tallas.map((t, i) => (
                        <span key={i} style={{ marginRight: '10px' }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => toggleVisibilidad(p)} title={p.disponible ? 'Ocultar' : 'Mostrar'} style={{ background: '#222', border: '1px solid #333', borderRadius: '6px', color: p.disponible ? '#4caf7d' : '#555', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {p.disponible ? '👁' : '🙈'}
                    </button>
                    <button onClick={() => cargarProductoEnForm(p)} title="Editar" style={{ background: '#222', border: '1px solid #333', borderRadius: '6px', color: '#c9a84c', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      ✏️
                    </button>
                    <button onClick={() => eliminar(p.id)} title="Eliminar" style={{ background: '#222', border: '1px solid #333', borderRadius: '6px', color: '#e05c5c', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              )
            })}
            {productosFiltrados.length === 0 && (
              <div style={{ textAlign: 'center', color: '#555', padding: '40px' }}>No hay productos</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
