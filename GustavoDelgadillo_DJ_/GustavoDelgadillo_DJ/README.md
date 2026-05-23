# Gustavo Delgadillo — Landing Page DJ

Prototipo web listo para abrir en el navegador.

## Cómo usarlo rápido
1. Descomprime el `.zip`.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. Para entrar al panel administrador, escribe `admin.html` manualmente al final de la URL.
4. En `script.js`, cambia:
   - `whatsappNumber`
   - `instagramUrl`
   - `mercadoPagoUrl`
   - `googleCalendarUrl`
5. Sustituye las fotos de ejemplo dentro de la carpeta `assets/` si tienes fotos oficiales de cabinas o eventos.

## Acceso administrador demo
- Usuario: `admin`
- Contraseña: `admin`

> Nota: este login es únicamente para prototipo frontend. Para producción se debe implementar autenticación real desde backend.

## Qué incluye
- Landing page con CTA a WhatsApp e Instagram.
- Formulario de leads con validación básica y limpieza de texto.
- Formulario de contratación de eventos.
- Cotizador con precios base CDMX.
- Sección de paquetes DJ y Premium.
- Catálogo de cabinas/mesas DJ.
- FAQs.
- Blog para SEO.
- Sección lista para reseñas de Google Business/Facebook.
- Panel administrador separado en `admin.html`.
- Login demo con usuario y contraseña.
- Tabla de leads y solicitudes.
- Filtro por tipo de registro.
- Exportación CSV.
- Opción para borrar registros demo.

## Precios configurados
- Servicio DJ: $5,500 por 5 horas.
- Premium: $7,500 por 5 horas.
- Hora extra: $1,200.
- Anticipo sugerido: $1,500.
- 100-200 personas: +$3,000.
- 200-300 personas: +$5,500.
- 300 o más: +$7,500.

## Importante para producción
Este paquete es un frontend funcional. Para usarlo de forma real se recomienda agregar:
- Backend con Express o Flask.
- Base de datos MongoDB.
- Login seguro para administrador.
- Integración real con Mercado Pago.
- Integración real con Google Calendar.
- Integración real de reseñas Google Business/Facebook.
- Google Analytics y Hotjar.


## Actualización de catálogo
- Se agregaron 5 imágenes reales de cabinas DJ al catálogo.
- Cada cabina incluye botón de compra por WhatsApp.
- El panel de admin separado permanece en `admin.html` con usuario `admin` y contraseña `admin`.


## Acceso oculto al panel admin
El enlace visible al panel admin fue retirado de la landing page. El archivo sigue existiendo y se puede abrir escribiendo `admin.html` al final del enlace.

Local: `http://localhost:5500/admin.html`
Publicado: `https://tu-sitio.netlify.app/admin.html`

Usuario: `admin`
Contraseña: `admin`


## Reseñas agregables
- La sección de reseñas ahora incluye un formulario para agregar nombre, tipo de evento, calificación y comentario.
- Las reseñas se muestran automáticamente en la página.
- En esta versión demo se guardan con localStorage del navegador.
- El panel admin también muestra y exporta las reseñas guardadas.
