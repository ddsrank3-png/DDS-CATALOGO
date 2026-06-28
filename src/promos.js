// =============================================
// SISTEMA DE PROMOS DDS PARFUMS
// =============================================

// Precios especiales Versace Eros / Eros Flame en combos diseñador
const VERSACE_PRECIOS = { 3: 18, 5: 32, 10: 65 }

// Promos árabes
const PROMOS_ARABE = {
  3: [
    { cantidad: 2, precio: 22, descuento: 2 },
    { cantidad: 3, precio: 32, descuento: 4 },
    { cantidad: 5, precio: 50, descuento: 10 },
  ],
  5: [
    { cantidad: 2, precio: 32, descuento: 4 },
    { cantidad: 3, precio: 45, descuento: 9 },
    { cantidad: 5, precio: 75, descuento: 15 },
  ],
  10: [
    { cantidad: 2, precio: 55, descuento: 5 },
    { cantidad: 3, precio: 80, descuento: 10 },
    { cantidad: 5, precio: 130, descuento: 20 },
  ],
}

// Promos diseñador
const PROMOS_DISEÑADOR = {
  3: [
    { cantidad: 2, precio: 40, descuento: 8 },
    { cantidad: 3, precio: 60, descuento: 12 },
    { cantidad: 5, precio: 100, descuento: 20 },
  ],
  5: [
    { cantidad: 2, precio: 65, descuento: 13 },
    { cantidad: 3, precio: 95, descuento: 22 },
    { cantidad: 5, precio: 165, descuento: 30 },
  ],
  10: [
    { cantidad: 2, precio: 130, descuento: 20 },
    { cantidad: 3, precio: 190, descuento: 35 },
    { cantidad: 5, precio: 315, descuento: 60 },
  ],
}

const CLOUD_NOMBRES = ['cloud', 'ariana']
const VERSACE_NOMBRES = ['versace eros']

function esCloud(nombre) {
  const n = nombre.toLowerCase()
  return CLOUD_NOMBRES.every(k => n.includes(k))
}

function esVersace(nombre) {
  const n = nombre.toLowerCase()
  return n.includes('versace eros')
}

function esDecantArabe(item) {
  return item.talla && item.producto.categoria === 'Árabe' && !esCloud(item.producto.nombre)
}

function esDecantDiseñador(item) {
  return item.talla && item.producto.categoria === 'Diseñador' && !esCloud(item.producto.nombre)
}

// Precio unitario de un item en el carrito (respetando Versace especial)
function precioUnitarioBase(item, ml) {
  if (esVersace(item.producto.nombre) && VERSACE_PRECIOS[ml]) {
    return VERSACE_PRECIOS[ml]
  }
  return item.talla ? Number(item.talla.precio) : Number(item.producto.precio)
}

// Calcula las promos aplicables al carrito
export function calcularPromos(carrito) {
  // Agrupar decants por ml
  const mls = [3, 5, 10]
  let resultado = {
    promoInfo: null,      // info de promo activa
    descuentoTotal: 0,
    totalConDescuento: 0,
    totalSinDescuento: 0,
    itemsDetalle: [],     // precio por item con promo aplicada
    mensajePromo: null,
    proximaPromo: null,
  }

  // Total sin descuento
  const totalSinDesc = carrito.reduce((s, item) => {
    return s + (item.talla ? Number(item.talla.precio) : Number(item.producto.precio))
  }, 0)
  resultado.totalSinDescuento = totalSinDesc

  // Separar decants árabe y diseñador por ml
  for (const ml of mls) {
    const arabes = carrito.filter(i => esDecantArabe(i) && i.talla?.ml === ml)
    const diseñadores = carrito.filter(i => esDecantDiseñador(i) && i.talla?.ml === ml)
    const clouds = carrito.filter(i => esCloud(i.producto.nombre) && i.talla?.ml === ml)

    // Promos árabes puras
    if (arabes.length >= 2 && diseñadores.length === 0) {
      const promos = PROMOS_ARABE[ml]
      if (promos) {
        const promoActiva = [...promos].reverse().find(p => arabes.length >= p.cantidad)
        const proximaPromo = promos.find(p => arabes.length < p.cantidad)
        if (promoActiva) {
          const totalNormal = arabes.reduce((s, i) => s + Number(i.talla.precio), 0)
          const totalPromo = promoActiva.precio
          resultado.descuentoTotal += totalNormal - totalPromo
          resultado.promoInfo = { tipo: 'Árabe', ml, ...promoActiva }
          resultado.mensajePromo = `🦈 ¡Promo activa! ${promoActiva.cantidad} decants ${ml}ml árabes = S/ ${promoActiva.precio} (ahorras S/ ${promoActiva.descuento})`
          if (proximaPromo) {
            const faltan = proximaPromo.cantidad - arabes.length
            resultado.proximaPromo = `Agrega ${faltan} decant${faltan > 1 ? 's' : ''} más y lleva ${proximaPromo.cantidad} por S/ ${proximaPromo.precio} 🔥`
          }
        } else if (arabes.length === 1) {
          const promo = promos[0]
          resultado.proximaPromo = `🌟 Agrega 1 decant árabe ${ml}ml más y activa promo: 2 por S/ ${promo.precio} (descuento S/ ${promo.descuento})`
        }
      }
    }

    // Promos diseñador puras
    if (diseñadores.length >= 2 && arabes.length === 0) {
      const promos = PROMOS_DISEÑADOR[ml]
      if (promos) {
        const promoActiva = [...promos].reverse().find(p => diseñadores.length >= p.cantidad)
        const proximaPromo = promos.find(p => diseñadores.length < p.cantidad)

        // Precio especial Versace
        const totalNormal = diseñadores.reduce((s, i) => {
          return s + precioUnitarioBase(i, ml)
        }, 0)

        if (promoActiva) {
          resultado.descuentoTotal += totalNormal - promoActiva.precio
          resultado.promoInfo = { tipo: 'Diseñador', ml, ...promoActiva }
          resultado.mensajePromo = `🦈 ¡Promo activa! ${promoActiva.cantidad} decants ${ml}ml diseñador = S/ ${promoActiva.precio} (ahorras S/ ${promoActiva.descuento})`
          if (proximaPromo) {
            const faltan = proximaPromo.cantidad - diseñadores.length
            resultado.proximaPromo = `Agrega ${faltan} decant${faltan > 1 ? 's' : ''} más y lleva ${proximaPromo.cantidad} por S/ ${proximaPromo.precio} 🔥`
          }
        } else if (diseñadores.length === 1) {
          const promo = promos[0]
          resultado.proximaPromo = `🌟 Agrega 1 decant diseñador ${ml}ml más y activa promo: 2 por S/ ${promo.precio} (descuento S/ ${promo.descuento})`
        }
      }
    }

    // Mix árabe + diseñador → 50% del descuento
    if (arabes.length > 0 && diseñadores.length > 0) {
      const totalMix = arabes.length + diseñadores.length
      if (totalMix >= 2) {
        const promoArabeRef = PROMOS_ARABE[ml]?.find(p => p.cantidad === Math.min(totalMix, 5) || p.cantidad <= totalMix)
        const promoDisRef = PROMOS_DISEÑADOR[ml]?.find(p => p.cantidad === Math.min(totalMix, 5) || p.cantidad <= totalMix)
        if (promoArabeRef || promoDisRef) {
          const descRef = promoDisRef ? promoDisRef.descuento : promoArabeRef?.descuento || 0
          const descuento50 = Math.floor(descRef * 0.5)
          if (descuento50 > 0) {
            resultado.descuentoTotal += descuento50
            resultado.mensajePromo = `⚡ Combo mix árabe + diseñador: descuento del 50% aplicado (- S/ ${descuento50})`
            resultado.proximaPromo = `Tip: usa solo árabes o solo diseñador para el descuento completo`
          }
        }
      }
    }

    // Aviso 1 solo decant árabe (todavía no activa promo)
    if (arabes.length === 1 && diseñadores.length === 0 && !resultado.proximaPromo) {
      const promo = PROMOS_ARABE[ml]?.[0]
      if (promo) {
        resultado.proximaPromo = `🌟 Agrega 1 decant árabe ${ml}ml más y activa promo: 2 por S/ ${promo.precio} (ahorras S/ ${promo.descuento})`
      }
    }

    if (diseñadores.length === 1 && arabes.length === 0 && !resultado.proximaPromo) {
      const promo = PROMOS_DISEÑADOR[ml]?.[0]
      if (promo) {
        resultado.proximaPromo = `🌟 Agrega 1 decant diseñador ${ml}ml más y activa promo: 2 por S/ ${promo.precio} (ahorras S/ ${promo.descuento})`
      }
    }
  }

  resultado.totalConDescuento = Math.max(0, totalSinDesc - resultado.descuentoTotal)
  return resultado
}

export function waMensajeCarritoConPromo(carrito, promoData) {
  const lista = carrito.map(item => {
    const talla = item.talla ? `${item.talla.ml}ml — S/ ${item.talla.precio}` : `Sellado — S/ ${Number(item.producto.precio).toFixed(0)}`
    return `🦈 *${item.producto.nombre}*\n   ${talla}`
  }).join('\n\n')

  let promoTexto = ''
  if (promoData.descuentoTotal > 0) {
    promoTexto = `\n\n🎉 *Promo aplicada:* -S/ ${promoData.descuentoTotal.toFixed(0)}\n💰 *Total con descuento: S/ ${promoData.totalConDescuento.toFixed(0)}*`
  }

  return encodeURIComponent(
    `Hola! 🦈 Quiero hacer este pedido en DDS Parfums:\n\n${lista}${promoTexto}\n\n¿Están disponibles? ¿Cómo coordino el pago?`
  )
}
