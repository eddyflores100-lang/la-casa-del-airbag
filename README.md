# La Casa del Airbag — dos propuestas web premium

Proyecto de demostración comercial con **dos plantillas distintas** para que el cliente elija una sola identidad final:

| Propuesta | Sitio | Código |
|---|---|---|
| SRS EXPERT | https://project35491.websitepublisher.ai/ | `sites/srs-expert/index.html` |
| SRS LAB | https://project35481.websitepublisher.ai/ | `sites/srs-lab/index.html` |

Ambas usan el **mismo WhatsApp comercial: +593 98 721 9221**.

## Entregado (13-11-2026)

- Rediseño visual independiente 2027 para cada marca, tipografía y símbolos SVG originales.
- Home responsive, categorías de componentes, preguntas frecuentes, formularios y llamadas a WhatsApp.
- Formularios preexistentes `cotizacion_srs` en WebsitePublisher, conectados al sistema de leads de cada proyecto.
- Asistentes web `srs-expert` y `srs-lab` creados con instrucciones de seguridad, historial firmado y límites de consultas.
- SEO de página: títulos, descripciones, canonical, Open Graph, accesibilidad, imágenes con `alt`, datos estructurados `AutoPartsStore` y `WebSite`.
- Páginas de privacidad y términos, archivo `llms.txt` opcional por sitio. El archivo `llms.txt` no mejora por sí solo el posicionamiento en Google.
- Servidor MCP de consulta comercial por `stdio` en `mcp-server/` (código listo para instalar/probar, NO desplegado como endpoint remoto).

## Pendientes para operación real

1. **La indexación está bloqueada deliberadamente** por configuración global `force_noindex`. El propietario debe autorizar explícitamente que el sitio sea indexable; conviene indexar solo la propuesta elegida para evitar duplicación de marca.
2. **Los agentes de IA no generan respuestas aún:** falta `openai_api_key` en Vault de **ambos proyectos** y comprobar la llamada real del asistente. Sin clave se muestra mensaje alternativo.
3. **WhatsApp automático bidireccional no está conectado:** el número único necesita Cloud API de Meta, credenciales, suscripción webhook y servicio de orquestación. Los botones WhatsApp funcionan como enlaces iniciados por el visitante.
4. **MCP por HTTP remoto** necesita despliegue, pruebas, controles de acceso y validaciones. El servidor incluido expone solo lectura y preparación de enlace, sin enviar mensajes ni almacenar datos.
5. Faltan ensayos visuales en navegadores reales, revisión del cliente y conexión de dominio definitivo.

## Documentación y recursos

- `assets/`: imágenes y tipografías exportadas de la versión anterior.
- `assets-manifest.json`: URLs de origen de esos recursos.
- `mcp-server/README.md`: instalación del servidor MCP de consulta.

## Principio de seguridad

No dar diagnósticos, garantizar compatibilidades ni publicar instrucciones para manipular airbags, pretensores o módulos SRS. Los componentes requieren verificación por especialistas.
