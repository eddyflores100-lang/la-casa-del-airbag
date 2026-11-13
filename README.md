# La Casa del Airbag — AliceLabs LLC

Dos propuestas distintas para revisión comercial del cliente. **La infraestructura activa está en Cloudflare; GitHub es la fuente del código.**

## Ver las páginas publicadas

| Propuesta | URL principal | Estética |
|---|---|---|
| **SRS EXPERT** | https://lca-srs-expert.eddyflores100.workers.dev/ | Fotografía oscura, editorial, elegante |
| **SRS LAB** | https://lca-srs-lab.eddyflores100.workers.dev/ | Fotografía clara y cálida, catálogo visual |

Ambas páginas tienen cuatro secciones visibles: **portada, productos/servicios, preguntas frecuentes y cotización/contacto**. Un único número de WhatsApp aparece en las dos: **+593 98 721 9221**.

## Arquitectura desplegada en Cloudflare

```
                       GitHub (source of truth)
                               |
                      Cloudflare Workers
                      /                 \
       lca-srs-expert                 lca-srs-lab
         |  |                            |  |
         |  +---- GET HTML/CSS/JS         |  +---- GET HTML/CSS/JS
         |                               |
         +---------- Cloudflare R2 -------+  imágenes locales
         +---------- Cloudflare D1 -------+  solicitudes de cotización
         |                               |
         +---------- lca-agent -----------+  Workers AI + MCP
                         |
                  Llama 3.3 70B
```

### Recursos implementados

- Workers públicos: `lca-srs-expert`, `lca-srs-lab`, `lca-agent`.
- R2: `lca-web-assets` (fotografías locales); imágenes servidas por cada Worker bajo `/images/2027/...`.
- D1: `lca-leads`; tabla `cotizaciones` con datos del vehículo y contacto proporcionado por el visitante.
- `POST /api/quote` en cada sitio: validación, honeypot, límite de solicitudes por IP y almacenamiento en D1.
- `GET /api/health`: estado público y comprobación de bindings.
- Chat web: `POST https://lca-agent.eddyflores100.workers.dev/api/chat`, con CORS solo para orígenes autorizados; modelo de Workers AI; herramientas para datos del negocio, categorías y borradores de cotizaciones.
- MCP remoto público: `https://lca-agent.eddyflores100.workers.dev/mcp` (sin acciones sobre datos personales).
- Archivos `/privacidad.html`, `/terminos.html`, `/llms.txt` y `/robots.txt`, canonicals y datos estructurados.
- **Ambas demos permanecen en `noindex`** hasta que el cliente elija una versión; no publicar ambos sitios como sedes comerciales distintas.

### Pruebas realizadas (13 noviembre 2026)

- Portadas de ambos sitios renderizadas desde Cloudflare con fotografías servidas por R2.
- Chat en SRS EXPERT: respuesta real desde Workers AI a consulta sobre tablero Kia Picanto.
- Chat en SRS LAB: respuesta real desde Workers AI a consulta sobre módulo SRS de Toyota Hilux.
- Cotización de prueba enviada por el sitio LAB: HTTP 201; registro comprobado en D1 y eliminado después de verificar.
- Workers protegidos con rate limiting y acceso CORS acotado para el agente.

## Flujo para actualizar ambos sitios

El código está en:

```
sites/srs-expert/index.html
sites/srs-expert/photo-expert.css
sites/srs-lab/index.html
sites/srs-lab/photo-base.css
sites/srs-lab/photo-lab.css
sites/*/privacidad.html
sites/*/terminos.html
shared/photo-site.js
worker/lca-agent.js
cloudflare/site-worker.template.js
cloudflare/deploy.mjs
.github/workflows/deploy-lca-cloudflare.yml
```

Para validar localmente con Node 22 o superior:

```bash
node cloudflare/deploy.mjs --check
```

Para desplegar desde un entorno autorizado:

```bash
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=faf93cd2a0d373573de0859b1cc95328 node cloudflare/deploy.mjs
```

**No guardar tokens en GitHub.** El workflow de GitHub Actions ya está preparado para publicar automáticamente tras cambios en `main`, pero requiere configurar `CLOUDFLARE_API_TOKEN` como secreto del repositorio. Sin ese secreto, valida el código y omite el despliegue.

## Límites reales

1. **WhatsApp:** los botones abren una conversación y preparan texto; la recepción/envío automático desde Meta WhatsApp Cloud API todavía no está configurada.
2. **Nombre de dominio:** actualmente usan `workers.dev`. El dominio comercial definitivo se conecta cuando el cliente elija una propuesta.
3. **Indexación:** la demo no se indexa a propósito; tras la aprobación se habilitan sitemap, Search Console y páginas SEO de producto/servicio.
4. **Fotografías:** son ilustrativas y algunas generadas con IA; no deben presentarse como trabajos ejecutados por el taller.
5. **Atención del cliente:** antes de operar públicamente, confirmar WhatsApp, dirección, años de trayectoria y procesos de respuesta a cotizaciones. El registro D1 por sí solo no envía notificaciones al taller.

Diseño, código, arquitectura y despliegue: **AliceLabs LLC**.
