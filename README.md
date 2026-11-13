# La Casa del Airbag — dos propuestas web 2027

Dos experiencias visuales diferentes para que el cliente elija. **No se fusionan**.

| Propuesta | Publicación | Dirección |
|---|---|---|
| SRS EXPERT | https://project35491.websitepublisher.ai/index.html | Fotografía de tablero a pantalla completa, estética oscura premium, tratamiento cálido, servicios editoriales |
| SRS LAB | https://project35481.websitepublisher.ai/index.html | Base mineral clara, imágenes fotográficas superpuestas, catálogo de piezas y navegación directa |

## Cambios del 13 de noviembre de 2026

- Se eliminaron por completo de las páginas publicadas las figuras geométricas 3D y Three.js, incluidos sus assets y código compartido anteriores.
- Fotografías coherentes de interiores, tableros y volantes con archivo local en WebsitePublisher. La imagen del módulo SRS se creó con Workers AI (FLUX) y está rotulada como ilustrativa, no como pieza real del negocio.
- Textos centrados en lo que pregunta un cliente: **tableros, airbags, módulos SRS, cinturones, pretensores, cintas y kits**, en lugar de eslóganes técnicos abstractos.
- Formularios `cotizacion_srs` conservados, captura de leads en WebsitePublisher y enlace a **un único WhatsApp: +593 98 721 9221**.
- Los chats web ahora llaman al Worker desplegado `lca-agent.eddyflores100.workers.dev`, con Cloudflare Workers AI, herramientas comerciales, respuesta contextual y un límite de consultas por IP. El enlace de WhatsApp se envía **solo si el usuario decide abrirlo y enviarlo**.
- SEO de página: title, meta description, Open Graph, canonical, etiquetas alt, Schema.org AutoPartsStore, contenido semántico y enlaces a privacidad/términos.
- Browser Rendering Cloudflare: captura de escritorio de ambas propuestas y captura móvil de SRS LAB comprobadas.
- La herramienta Launch Check de WebsitePublisher informó 100/100 en ambos proyectos, pero advierte que siguen bloqueados para indexación y requieren plan apto y autorización del dueño para dominio/SEO públicos.

## Alcance y límites

**Las fotografías son ilustrativas**, no testimonios visuales de reparaciones realizadas por el taller. Conviene sustituirlas por fotografía profesional autorizada del propio negocio antes de la entrega definitiva.

La navegación 3D fue eliminada deliberadamente. La profundidad ahora usa composición de imágenes, capas, contraste, iluminación, sombras y transiciones CSS que respetan preferencias de movimiento reducido.

**WhatsApp automático entrante/saliente:** la integración Meta WhatsApp Cloud API todavía no se ha activado para este proyecto. Los dos sitios tienen botones click-to-chat y permiten preparar solicitudes de WhatsApp; no afirman enviar mensajes autónomamente.

**MCP remoto:** `worker/lca-agent.js` expone `/mcp` para información comercial pública y preparación de borradores; no da acceso a datos personales ni modifica pedidos.

**Operación del agente:** el Worker está desplegado con AI binding y rate limiting; su modelo se probó por Cloudflare. La prueba E2E del chat desde navegador debe verificarse antes de prometer disponibilidad permanente.

**Número:** el contacto oficial publicado en algunos directorios difiere del número usado previamente en este proyecto. El cliente debe confirmar el número de WhatsApp antes de lanzar la marca definitiva.

## Estructura

```
sites/
  srs-expert/index.html
  srs-expert/photo-expert.css
  srs-expert/privacidad.html
  srs-expert/terminos.html
  srs-lab/index.html
  srs-lab/photo-lab.css
  srs-lab/privacidad.html
  srs-lab/terminos.html
shared/photo-site.js
worker/lca-agent.js
mcp-server/ # herramienta stdio de consulta, separada del Worker remoto
```

Las imágenes se alojan en los proyectos WebsitePublisher (`/images/2027/`); ver `photo-assets-2027.json`.

## Seguridad automotriz

La información publicada y las respuestas de IA son consultas comerciales y no reemplazan diagnóstico, instalación ni revisión profesional de sistemas airbag SRS. No se publican instrucciones para manipular ni desactivar componentes de seguridad.
