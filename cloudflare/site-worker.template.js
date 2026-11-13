/* AliceLabs LLC — La Casa del Airbag Cloudflare Worker, generated from GitHub */
const SITE_TYPE=__LCA_TYPE__;
const SITE_HTML=__LCA_HTML__;
const BASE_CSS=__LCA_CSS__;
const EXTRA_CSS=__LCA_EXTRA__;
const SITE_JS=__LCA_JS__;
const PRIVACY_HTML=__LCA_PRIVACY__;
const TERMS_HTML=__LCA_TERMS__;
const LLM_TEXT=__LCA_LLMS__;
const AGENT_ORIGIN="https://lca-agent.eddyflores100.workers.dev";
const ASSET_FILES=new Set(["dashboard-premium.jpg","dashboard-modern.jpg","airbag-dashboard.jpg","dashboard-detail.jpg","steering-wheel.jpg","srs-module-studio.jpg"]);
const json=(payload,status=200)=>new Response(JSON.stringify(payload),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
const baseSecurity={"x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","x-frame-options":"DENY","permissions-policy":"geolocation=(),camera=(),microphone=(self)","content-security-policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' "+AGENT_ORIGIN+"; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests"};
function page(content,type,html=false){const headers=new Headers(baseSecurity);headers.set("content-type",type);headers.set("cache-control",html?"no-store":"public,max-age=3600");if(html)headers.set("x-robots-tag","noindex,nofollow");return new Response(content,{headers})}
function valid(str,max){return typeof str==="string"&&str.trim().length>0&&str.trim().length<=max}
async function submit(req,env){
const url=new URL(req.url),origin=req.headers.get("origin");
if(origin&&origin!==url.origin)return json({ok:false,error:"Origen no autorizado"},403);
if(!req.headers.get("content-type")?.includes("application/json"))return json({ok:false,error:"Formato no aceptado"},415);
if(Number(req.headers.get("content-length")||"0")>4096)return json({ok:false,error:"Solicitud demasiado grande"},413);
let data;try{const content=await req.text();if(content.length>4096)return json({ok:false,error:"Solicitud demasiado grande"},413);data=JSON.parse(content)}catch{return json({ok:false,error:"Datos inválidos"},400)}
if(typeof data!=="object"||!data)return json({ok:false,error:"Datos inválidos"},400);
if(data.website)return json({ok:true,received:false});
if(!valid(data.marca,65)||!valid(data.modelo,65)||!valid(data.componente,120)||!Number.isInteger(data.anio)||data.anio<1980||data.anio>2028)return json({ok:false,error:"Comprueba marca, modelo, año y componente"},400);
if(data.nombre&&!valid(data.nombre,90))return json({ok:false,error:"Nombre inválido"},400);
if(data.telefono&&!valid(data.telefono,32))return json({ok:false,error:"Teléfono inválido"},400);
if(env.QUOTE_LIMIT){const ip=req.headers.get("cf-connecting-ip")||"unknown";const verdict=await env.QUOTE_LIMIT.limit({key:ip});if(!verdict.success)return json({ok:false,error:"Límite de solicitudes. Reintenta más tarde."},429)}
const id=crypto.randomUUID();
try{await env.LEADS_DB.prepare("INSERT INTO cotizaciones (id,variante,marca,modelo,anio,componente,nombre,telefono) VALUES (?,?,?,?,?,?,?,?)").bind(id,SITE_TYPE,data.marca.trim(),data.modelo.trim(),data.anio,data.componente.trim(),String(data.nombre||"").trim(),String(data.telefono||"").trim()).run();return json({ok:true,request_id:id},201)}catch{return json({ok:false,error:"No se pudo registrar; usa WhatsApp"},503)}
}
export default {async fetch(req,env){
const url=new URL(req.url),path=url.pathname;
if(path==="/api/health"&&req.method==="GET")return json({ok:true,site:SITE_TYPE,provider:"Cloudflare Workers",storage:!!env.ASSETS,database:!!env.LEADS_DB,agent:AGENT_ORIGIN,whatsappAutomatic:false});
if(path==="/api/quote"&&req.method==="POST")return submit(req,env);
if(req.method!=="GET"&&req.method!=="HEAD")return json({error:"Método no permitido"},405);
if(path==="/"||path==="/index.html")return page(SITE_HTML,"text/html; charset=utf-8",true);
if(path==="/privacidad.html")return page(PRIVACY_HTML,"text/html; charset=utf-8",true);
if(path==="/terminos.html")return page(TERMS_HTML,"text/html; charset=utf-8",true);
if(path==="/css/photo-expert.css"||path==="/css/photo-base.css")return page(BASE_CSS,"text/css; charset=utf-8");
if(path==="/css/photo-lab.css")return page(EXTRA_CSS,"text/css; charset=utf-8");
if(path==="/js/photo-site.js")return page(SITE_JS,"application/javascript; charset=utf-8");
if(path==="/llms.txt")return page(LLM_TEXT,"text/plain; charset=utf-8");
if(path==="/robots.txt")return page("User-agent: *\nDisallow: /\n","text/plain; charset=utf-8");
if(path==="/favicon.svg")return page('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#10201d"/><text x="40" y="53" text-anchor="middle" fill="#efb67e" font-family="sans-serif" font-weight="bold" font-size="43">S</text></svg>',"image/svg+xml");
if(path.startsWith("/images/2027/")){const file=path.split("/").pop();if(!ASSET_FILES.has(file))return json({error:"No encontrado"},404);const obj=await env.ASSETS.get("images/2027/"+file);if(!obj)return json({error:"Imagen no disponible"},404);return new Response(obj.body,{headers:{"content-type":"image/jpeg","cache-control":"public,max-age=86400","x-content-type-options":"nosniff"}})}
return json({error:"No encontrado"},404)
}};
