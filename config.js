// ============================================================
//  CONFIGURACIÓN DEL CATÁLOGO  —  DDS PARFUMS (Día de Suerte · Ica)
//  ¡ESTE ES EL ÚNICO ARCHIVO QUE CAMBIAS PARA CADA CATÁLOGO NUEVO!
//  Rellena SOLO los valores entre comillas. No borres comillas ni comas.
// ============================================================
const CONFIG = {

  // --- Supabase (Project Settings -> API en tu proyecto DDS) ---
  //  PON AQUÍ LAS LLAVES DE TU PROYECTO SUPABASE DE DDS:
  SUPABASE_URL:      "https://cueofggreijcudpvgyip.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1ZW9mZ2dyZWlqY3VkcHZneWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTA3NTUsImV4cCI6MjA5ODIyNjc1NX0.LUySx4N8ZUTgxPmZ-6W_5GMDoo1oqMY_8Oq-FdNv2t8",

  // Bucket de imágenes de productos (créalo en Supabase > Storage, público).
  BUCKET: "productos",
  // Bucket de comprobantes (no se usa en DDS, pero se deja por compatibilidad).
  BUCKET_COMPROBANTES: "comprobantes",

  // --- Datos de la tienda ---
  TIENDA_NOMBRE:  "DDS Parfums",
  TIENDA_TAGLINE: "Día de Suerte · Ica, Perú",
  MONEDA:         "S/",

  // --- Frase debajo del nombre grande (también editable en el panel > Ajustes) ---
  HERO_SUB: "Perfumes sellados y decants de marcas árabes, de diseñador y nicho. Ica, Perú · Pedidos por WhatsApp.",

  // --- Mensaje del comprobante impreso (también editable en el panel > Ajustes) ---
  MENSAJE_GRACIAS: "¡Gracias por tu compra! 🦈",

  // --- WhatsApp para recibir pedidos (código de país 51, sin +) ---
  WHATSAPP: "51902216717",

  // --- Precio por MAYOR (minorista/mayorista automático por cantidad) ---
  //  Desde cuántos perfumes en total se activa el precio por mayor.
  //  Pon 0 si esta tienda NO usa precio por mayor. (DDS: desactivado por ahora.)
  MAYOR_MIN: 0,
  LABEL_MINORISTA: "Precio unidad",
  LABEL_MAYORISTA: "Precio por mayor",

  // --- Pago Yape (déjalo en "" si no lo usas) ---
  YAPE_NUMERO: "",
  YAPE_NOMBRE: "",

  // --- Texto de envío que se muestra en el producto ---
  ENVIO_TEXTO: "Envíos a todo el Perú · coordinamos por WhatsApp",

  // --- Banner (cinta) superior en movimiento. Lista de frases (rotan) o "" para ocultar. ---
  BANNER_ENVIO: [
    "ENVÍOS A TODO EL PERÚ",
    "DECANTS ÁRABES · DISEÑADOR · NICHO",
    "PEDIDOS POR WHATSAPP 🦈",
  ],

  // --- Texto de la PANTALLA DE CARGA (la 1ª palabra sale grande). "" = usa el logo. ---
  CARGA_TEXTO: "DDS",

  // --- Stock: umbral para mostrar "¡Últimas X!" ---
  STOCK_BAJO: 5,

  // --- Logo del encabezado (flor dorada DDS, SVG embebido) ---
  LOGO_URL: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+CjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkNGFhNWEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiODkyM2EiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAsNTIpIiBmaWxsPSJ1cmwoI2cpIj4KPHBhdGggZD0iTTAgLTMwIEMwIC0zMCAtMTAgLTEwIC0xMCA1IEMtMTAgMTMuNSAtNS41IDIwIDAgMjAgQzUuNSAyMCAxMCAxMy41IDEwIDUgQzEwIC0xMCAwIC0zMCAwIC0zMFoiIG9wYWNpdHk9IjAuOTUiLz4KPHBhdGggZD0iTTAgMzAgQzAgMzAgLTEwIDUwIC0xMCA2NSBDLTEwIDczLjUgLTUuNSA4MCAwIDgwIEM1LjUgODAgMTAgNzMuNSAxMCA2NSBDMTAgNTAgMCAzMCAwIDMwWiIgb3BhY2l0eT0iMC45NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTApIi8+CjxwYXRoIGQ9Ik0tNDAgMCBDLTQwIDAgLTIwIC0xMCAtNSAtMTAgQzMuNSAtMTAgMTAgLTUuNSAxMCAwIEMxMCA1LjUgMy41IDEwIC01IDEwIEMtMjAgMTAgLTQwIDAgLTQwIDBaIiBvcGFjaXR5PSIwLjk1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDApIi8+CjxwYXRoIGQ9Ik00MCAwIEM0MCAwIDIwIC0xMCA1IC0xMCBDLTMuNSAtMTAgLTEwIC01LjUgLTEwIDAgQy0xMCA1LjUgLTMuNSAxMCA1IDEwIEMyMCAxMCA0MCAwIDQwIDBaIiBvcGFjaXR5PSIwLjk1Ii8+CjxwYXRoIGQ9Ik0tMjggLTI4IEMtMjggLTI4IC0xMiAtMTggLTMgLTkgQzMgLTMgMyAzIC0zIDkgQy05IDE1IC0xOCAxMiAtMjQgNiBDLTMzIC0zIC0yOCAtMjggLTI4IC0yOFoiIG9wYWNpdHk9IjAuNTUiLz4KPHBhdGggZD0iTTI4IDI4IEMyOCAyOCAxMiAxOCAzIDkgQy0zIDMgLTMgLTMgMyAtOSBDOSAtMTUgMTggLTEyIDI0IC02IEMzMyAzIDI4IDI4IDI4IDI4WiIgb3BhY2l0eT0iMC41NSIvPgo8cGF0aCBkPSJNLTI4IDI4IEMtMjggMjggLTE4IDEyIC05IDMgQy0zIC0zIDMgLTMgOSAzIEMxNSA5IDEyIDE4IDYgMjQgQy0zIDMzIC0yOCAyOCAtMjggMjhaIiBvcGFjaXR5PSIwLjU1Ii8+CjxwYXRoIGQ9Ik0yOCAtMjggQzI4IC0yOCAxOCAtMTIgOSAtMyBDMyAzIC0zIDMgLTkgLTMgQy0xNSAtOSAtMTIgLTE4IC02IC0yNCBDMyAtMzMgMjggLTI4IDI4IC0yOFoiIG9wYWNpdHk9IjAuNTUiLz4KPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjYiLz4KPC9nPjwvc3ZnPg==",
  // --- Logo de la pantalla de carga ("" = usa CARGA_TEXTO) ---
  LOGO_CARGA: "",

  // ============================================================
  //  SECCIONES ACTIVAS  —  apaga lo que esta tienda no use.
  //  DDS: SIN preorden ni consolidado (se ocultan del catálogo y del panel).
  // ============================================================
  SECCIONES: {
    promos:      true,   // pestaña "Promociones" (combos/packs)
    preorden:    false,  // ← apagado en DDS
    consolidado: false,  // ← apagado en DDS (también oculta "Accesos")
  },

  // ============================================================
  //  TEMA (COLORES) — DDS: fondo claro marfil con acento DORADO.
  // ============================================================
  TEMA: {
    "bg":         "#faf7f2",
    "bg-2":       "#f0ebe2",
    "panel":      "#ffffff",
    "panel-2":    "#f0ebe2",
    "line":       "#e8e0d5",
    "line-soft":  "#f0ebe2",
    "gold-1":     "#b8923a",
    "gold-2":     "#c9a84c",
    "gold-3":     "#d4aa5a",
    "gold-deep":  "#9a7d2e",
    "gold-grad":  "#b8923a",
    "cream":      "#1a1714",
    "muted":      "#5a5450",
    "muted-2":    "#9a9088",
    "accent":     "#b8923a",
    "accent-deep":"#9a7d2e",
  },

  // --- Redes sociales (deja "" en la que no uses) ---
  REDES: {
    instagram: "",
    facebook:  "",
    tiktok:    "https://www.tiktok.com/@dds.parfums.ica",
  },

  // --- Opciones de filtros ---
  CATEGORIAS: ["Árabe", "Diseñador", "Nicho"],
  GENEROS:    ["Hombre", "Mujer", "Unisex"],

  // --- INICIO: número grande de "clientes satisfechos" ---
  CLIENTES_TEXTO: "800",

  // --- INICIO: testimonios (edítalos aquí). foto: URL opcional (déjala "" y sale ★★★★★) ---
  TESTIMONIOS: [
    { texto: "Llegó todo bien. Excelente presentación.", nombre: "Luis Martínez", foto: "" },
    { texto: "Por fin probé perfumes de esta calidad y no hay comparación.", nombre: "Marco Junior", foto: "" },
    { texto: "Siempre quise probar estos perfumes pero eran muy costosos. ¡Gracias!", nombre: "Luciano Torres", foto: "" },
    { texto: "Prueba estos perfumes a ver cuál te gusta más. Muy buenos.", nombre: "Raúl Castro", foto: "" },
  ],

  // --- INICIO: imagen de fondo por categoría en el mosaico (opcional). ---
  //  Si dejas una vacía, la tarjeta usa un fondo oscuro elegante con el nombre.
  CATEGORIA_IMAGENES: {
    // "Árabe":     "https://.../arabes.jpg",
    // "Diseñador": "https://.../disenador.jpg",
    // "Nicho":     "https://.../nicho.jpg",
  },
};
