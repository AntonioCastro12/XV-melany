# Invitación de XV años — Melany Deniss

Invitación digital responsive, construida con React, TypeScript y CSS.

## Personalización

La información editable está concentrada en `app/invitation-data.ts`: año, teléfono de WhatsApp, lugares, horarios, rutas de fotografías, música, enlaces de mapas y mesa de regalos.

Las fotografías se colocan en `public/images` y la canción en `public/music`. Cada carpeta incluye los nombres esperados.

El pase personalizado acepta parámetros de URL:

`?invitado=Familia%20Castro&lugares=4`

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
