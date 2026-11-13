import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const BUSINESS = Object.freeze({
  name: "La Casa del Airbag",
  location: "Fray Leonardo Murialdo y José Gabriel Navarro, Quito, Ecuador",
  whatsapp: "+593 98 721 9221",
  phone: "(02) 5117 760",
  proposals: {
    expert: "https://project35491.websitepublisher.ai/",
    lab: "https://project35481.websitepublisher.ai/",
  },
});
const CATEGORIES = Object.freeze([
  { id: "airbag-conductor", name: "Airbag de conductor" },
  { id: "airbag-pasajero", name: "Airbag de pasajero" },
  { id: "ecusrs", name: "Módulo ECU SRS" },
  { id: "cinturon-pretensor", name: "Cinturón o pretensor" },
  { id: "otros-componentes", name: "Otros componentes SRS" },
]);
const result = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});
const digits = (value: string) => value.replace(/[^0-9]/g, "");
const oneLine = (value: string) => value.trim().replace(/[\r\n\t]+/g, " ");
function createServer() {
  const server = new McpServer(
    { name: "la-casa-del-airbag", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );
  server.registerTool("business_profile", {
    description: "Devuelve nombre, contactos, ubicación y las dos propuestas públicas de La Casa del Airbag.",
    inputSchema: z.object({}),
  }, async () => result(BUSINESS));
  server.registerTool("component_categories", {
    description: "Categorías comerciales de componentes SRS. No contiene precio, stock ni compatibilidad.",
    inputSchema: z.object({}),
  }, async () => result({ categories: CATEGORIES, notice: "Disponibilidad y compatibilidad requieren confirmación por profesionales." }));
  server.registerTool("prepare_quote", {
    description: "Prepara un enlace de WhatsApp para una consulta comercial. No envía mensajes, no guarda datos y no diagnostica el vehículo.",
    inputSchema: z.object({
      marca: z.string().trim().min(1).max(65),
      modelo: z.string().trim().min(1).max(65),
      anio: z.number().int().min(1980).max(2028),
      componente: z.string().trim().min(1).max(100),
      variante: z.enum(["expert", "lab"]).optional(),
    }),
  }, async ({ marca, modelo, anio, componente, variante }) => {
    const texto = [
      "Hola, La Casa del Airbag. Solicito una cotización.",
      "Marca: " + oneLine(marca),
      "Modelo: " + oneLine(modelo),
      "Año: " + anio,
      "Componente: " + oneLine(componente),
      variante ? "Propuesta: " + variante.toUpperCase() : "",
    ].filter(Boolean).join("\n");
    return result({
      whatsapp_url: "https://wa.me/" + digits(BUSINESS.whatsapp) + "?text=" + encodeURIComponent(texto),
      state: "draft_only",
      message_sent: false,
      lead_saved: false,
      compatibility_verified: false,
      notice: "El usuario debe abrir el enlace y enviar la solicitud. Confirmar compatibilidad y disponibilidad con el equipo.",
    });
  });
  return server;
}
serveStdio(createServer);
