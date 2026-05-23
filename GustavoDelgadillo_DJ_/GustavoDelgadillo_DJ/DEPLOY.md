# Cómo publicar esta página en internet

## Forma más rápida: Netlify Drop

1. Descomprime este ZIP.
2. Entra a Netlify y busca **Deploy manually** o **Netlify Drop**.
3. Arrastra la carpeta `gustavo_delgadillo_web_publicable` completa.
4. Netlify te dará un link público parecido a:
   `https://nombre-del-sitio.netlify.app`
5. Abre ese link desde tu celular para confirmar que ya está en internet.

## También se puede publicar en Vercel

1. Sube la carpeta a un repositorio de GitHub.
2. Entra a Vercel.
3. Importa el repositorio.
4. Deja la configuración por defecto.
5. Publica el sitio.

## Archivos principales

- `index.html`: página principal.
- `admin.html`: panel admin separado.
- `styles.css`: estilos.
- `script.js`: lógica de formularios, cotizador, WhatsApp y admin demo.
- `assets/`: imágenes, logo y video.
- `netlify.toml`: configuración para Netlify.
- `vercel.json`: configuración para Vercel.

## Panel admin demo

Usuario: `admin`
Contraseña: `admin`

## Antes de publicar

En `script.js`, cambia el número de WhatsApp:

```js
whatsappNumber: "5215512345678"
```

por el número real en formato internacional.

## Nota importante

El panel admin actual es demo en frontend. Sirve para presentación escolar/prototipo, pero no es seguro para producción real. Para que sea profesional se necesita backend, base de datos y login seguro.


## Acceso oculto al panel admin
El botón de admin fue retirado de la página principal. Para entrar al panel, escribe manualmente `/admin.html` al final del enlace del sitio.

Ejemplo local: `http://localhost:5500/admin.html`

Ejemplo publicado: `https://tu-sitio.netlify.app/admin.html`

Usuario demo: `admin`
Contraseña demo: `admin`
