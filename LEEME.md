# DDS Parfums — Catálogo (paquete completo)

Catálogo de perfumes/decants sobre tu plantilla maestra estándar.
**Sin preorden ni consolidado** (apagados desde `config.js`). Todo lo demás activo:
catálogo con búsqueda/filtros (Árabe · Diseñador · Nicho + género), control de stock,
promociones (combos y **escala 2/3/5 por precio fijo**), registro de ventas + recibos,
biblioteca de notas, panel Ajustes y PWA (instalable).

## Montar la tienda
1. **Supabase**: crea el proyecto DDS. En SQL Editor corre `setup_supabase.sql`.
   Este SQL es SOLO de DDS (sin preorden/consolidado) y es seguro re-ejecutarlo:
   agrega solo lo que falte y no borra datos. Si antes te salió el error
   `column "estado" does not exist`, esta versión ya lo corrige.
   En Storage crea el bucket **productos** (público).
2. **config.js**: pon tu `SUPABASE_URL` y `SUPABASE_ANON_KEY` de DDS (están como TU-PROYECTO/…).
   Lo demás (WhatsApp, TikTok, colores dorados, textos) ya viene con los datos de DDS.
3. **GitHub / hosting**: sube todos los archivos + la carpeta `icons/`.
4. Abre el catálogo y haz **recarga forzada** la primera vez.

## Entrar al panel admin
Toca **5 veces** el logo (o abre `admin.html`). Ahí cargas productos, fotos, notas,
promociones, ventas y editas los textos del catálogo (pestaña Ajustes).

## Promo "escala" (lo que antes era árabe/diseñador 2/3/5)
Panel → **Promociones → Nueva → 📈 Escala por cantidad**. Eliges categoría (ej. Árabe),
tallas (ej. 5ml) y agregas tramos: 2 → S/32, 3 → S/45, 5 → S/75. El catálogo toma
solo el mejor tramo alcanzado y avisa el siguiente ("agrega 1 más y lleva 3 por S/45").
Para una escala mixta (árabe + diseñador juntos) deja la categoría en **Todas**.

## Nota sobre tus productos actuales (del catálogo React viejo)
El catálogo nuevo usa el esquema estándar `productos` (con `presentaciones`, que ya
incluye multi-talla y precio mayorista). Carga tus productos desde el panel, o si prefieres
migrar automáticamente los del proyecto viejo, pásame las columnas reales de tu tabla
`catalogo_productos` y te armo el script de migración exacto.
