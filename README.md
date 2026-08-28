# Invitación de XV años — Melany Deniss

Invitación digital responsive, construida con React, TypeScript y CSS.

## Personalización

La información editable está concentrada en `app/invitation-data.ts`: año, teléfono de WhatsApp, lugares, horarios, rutas de fotografías, música, enlaces de mapas y mesa de regalos.

Las fotografías se colocan en `public/images` y la canción en `public/music`. Cada carpeta incluye los nombres esperados.

El pase personalizado acepta parámetros de URL:

`?invitado=Familia%20Castro&lugares=4`

## Generador para el organizador

Abre la invitación agregando `?organizador=1` al dominio para mostrar el panel privado de envío. Ahí puedes escribir el nombre o familia, el número de lugares y el WhatsApp del invitado. El panel genera el enlace personalizado y abre WhatsApp con el mensaje y los pases incluidos.

Ejemplo local:

`http://localhost:3000/?organizador=1`

Este panel no aparece en los enlaces normales enviados a los invitados.

## Música

La invitación incluye `public/music/melany-instrumental.wav`, una pieza instrumental original que inicia al tocar **Abrir invitación**. Puede reemplazarse por otra canción conservando la ruta configurada en `app/invitation-data.ts`.

## Desarrollo local

```bash
npm install
npm run dev
```

## Verificación

```bash
npm run build
```

## Publicación en Netlify

El proyecto está preparado para que lo despliegues desde tu propia cuenta de Netlify.

1. Sube esta carpeta a tu repositorio de GitHub, GitLab o Bitbucket.
2. En Netlify selecciona **Add new project** y conecta el repositorio.
3. Netlify leerá automáticamente `netlify.toml` y usará `npm run build` con `.next` como directorio de publicación.

No es necesario configurar manualmente el dominio dentro del código: Netlify proporciona la variable `URL` y la invitación la utiliza para sus metadatos sociales.
