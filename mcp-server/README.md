# La Casa del Airbag — MCP comercial

Servidor MCP para clientes compatibles que pueden ejecutar procesos locales por **stdio**. Implementado con el SDK oficial de Model Context Protocol v2 (2026), sin exponer credenciales y sin inventar stock ni precios.

## Funciones

- `business_profile`: ficha comercial y URL de las dos propuestas.
- `component_categories`: categorías de consulta.
- `prepare_quote`: genera un borrador de enlace WhatsApp; **no** envía mensajes, registra leads ni diagnostica.

## Ejecución

Requiere Node.js 22+ y conexión a internet para instalar las dependencias.

```bash
npm install
npm run check
npm start
```

Para usarlo en un host MCP local, configurar el comando `node` con el argumento `--experimental-strip-types` y la ruta absoluta a `src/server.ts` (o compilar antes con TypeScript). Este paquete **no** es un endpoint HTTP público, ni se publica por subirlo a GitHub.

## Pendiente para MCP remoto productivo

Desplegar el servidor con transporte Streamable HTTP, HTTPS, límites de uso, validación de Origin y autenticación/OAuth cuando se exponen datos no públicos o acciones. El agente de WhatsApp necesita configuración oficial de Meta Cloud API y un backend coordinador; este proyecto no finge que ya envía mensajes.

**Seguridad:** no usar el asistente para instrucciones de manipulación o desactivación de sistemas SRS. Compatibilidad, precios, disponibilidad y reparaciones requieren intervención profesional.
