# La Casa del Airbag — dos conceptos digitales 2027

**El cliente debe elegir entre dos experiencias de marca completamente independientes, no combinar dos plantillas.**

| Concepto | Web pública | Dirección visual | Implementación |
|---|---|---|---|
| SRS EXPERT / 01 | https://project35491.websitepublisher.ai/index.html | Cinemática azul, metal translúcido, escultura orbital 3D, editorial | `sites/srs-expert/index.html` + `sites/srs-expert/immersive.css` |
| SRS LAB / 02 | https://project35481.websitepublisher.ai/index.html | Laboratorio experimental beige/grafito/naranja, ECU geométrico en capas 3D | `sites/srs-lab/index.html` + `sites/srs-lab/laboratory.css` |

**WhatsApp único:** +593 98 721 9221. Ambos diseños usan el mismo negocio, el mismo contacto y formularios con `cotizacion_srs` en sus respectivas instalaciones WebsitePublisher.

## Qué cambia en esta entrega

- Se retiraron las fotografías de los dos `index.html`. Esculturas **Three.js/WebGL procedurales** (sin GLB de terceros), iluminación física, órbitas, geometría por capas, pointer drag, selector de objetos, resize, guardas de movimiento reducido y fallback CSS.
- Interfaz de **agente real desde Cloudflare Workers AI** en cada página. Backend desplegado como `lca-agent` en la cuenta del proyecto, con URL `https://lca-agent.eddyflores100.workers.dev`.
- `POST /api/chat`: modelo `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, herramienta `get_business_info`, `list_component_categories`, `prepare_quote`, respuesta y enlace opcional para que el visitante decida si envía mensaje. No almacena ni envía mensajes por WhatsApp.
- Limitador Cloudflare `CHAT_LIMIT` de 6 solicitudes por minuto y cliente/IP por centro de datos (aproximado, según documentación Cloudflare), tamaño máximo y lista de orígenes web autorizados.
- `POST /mcp`: JSON-RPC MCP con `initialize`, `tools/list`, `tools/call` públicos para consultar ficha y preparar solicitudes sin acceder a datos privados. Código desplegado: `worker/lca-agent.js`.
- Interfaz de dictado opcional mediante Web Speech API cuando el navegador lo admite.
- SEO: metadatos por propuesta, HTML semántico, canonical, datos Schema.org, URLs de privacidad, términos y `llms.txt`; se conserva el estado **noindex** mientras el cliente elige una propuesta y su dueño no autoriza indexación.
- Assets `js/experience.js` y los CSS residen en WebsitePublisher, y su código fuente también en este repositorio.

## Validaciones realizadas — 13 noviembre 2026

- Ambos proyectos devuelven página `live` tras publicar y la API confirma que sus contenidos incluyen escena 3D, formularios, enlace al Worker y metadatos.
- Ambos JS publicados compilan sintácticamente en V8 (análisis de sintaxis).
- Cloudflare confirma Worker desplegado, subdominio público activo, binding AI y rate limiter.
- La cuenta Cloudflare completó exitosamente inferencia real y una prueba de llamada a herramientas con el modelo elegido.
- **No se ejecutó aún una prueba automatizada de navegación visual ni chat de extremo a extremo desde un navegador público**. Es una verificación pendiente, no un resultado inventado.

## Limitaciones reales

1. **WhatsApp automático:** aún no configurado para enviar y recibir mensajes desde el número real mediante Meta Cloud API; los enlaces actuales son *click-to-chat* iniciados por el visitante.
2. **Indexación:** WebsitePublisher tiene `force_noindex=true` en ambos proyectos. Solo el propietario puede autorizar que sean indexables; se aconseja indexar únicamente el diseño elegido.
3. **MCP remoto:** el Worker expone herramientas públicas sin información privada. Para operaciones personales o autenticadas, hay que añadir autorización y control de identidad.
4. **MCP stdio** en `mcp-server/` es un proyecto previo, separado del Worker remoto; requiere validación y no representa un servicio remoto por sí mismo.
5. **Demo comercial:** no asumir precios, stock, garantías o compatibilidad sin comprobación profesional. Cualquier tarea sobre sistemas de seguridad debe hacerse por personal calificado.

## Estructura

```
sites/
  srs-expert/index.html
  srs-expert/immersive.css
  srs-expert/privacidad.html
  srs-expert/terminos.html
  srs-expert/llms.txt
  srs-lab/index.html
  srs-lab/laboratory.css
  srs-lab/privacidad.html
  srs-lab/terminos.html
  srs-lab/llms.txt
shared/experience.js
worker/lca-agent.js
mcp-server/
assets/                   # Fotografías históricas conservadas en el repositorio, ya no usadas por las home
assets-manifest.json
```
