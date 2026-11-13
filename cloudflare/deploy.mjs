/**
 * AliceLabs LLC / La Casa del Airbag
 * Reproducible deployment of two proposal sites and one Workers AI agent.
 * Node 20+, built-in fetch/FormData only. No WebsitePublisher dependency.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const read=async path=>readFile(resolve(ROOT,path),"utf8");
const CDN=/https:\/\/cdn\.websitepublisher\.ai\/custom\/wid\d+\//g;
const sites=[
 {name:"lca-srs-expert",variant:"expert",from:"35491",folder:"srs-expert",base:"photo-expert.css",extra:null,namespace:"12582"},
 {name:"lca-srs-lab",variant:"lab",from:"35481",folder:"srs-lab",base:"photo-base.css",extra:"photo-lab.css",namespace:"12583"}
];
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"faf93cd2a0d373573de0859b1cc95328";
const apiToken=process.env.CLOUDFLARE_API_TOKEN||"";
const host=s=>\`https://\${s.name}.eddyflores100.workers.dev\`;
const replaceUrls=text=>text.replace(CDN,"/").replaceAll("https://project35491.websitepublisher.ai","https://lca-srs-expert.eddyflores100.workers.dev").replaceAll("https://project35481.websitepublisher.ai","https://lca-srs-lab.eddyflores100.workers.dev");
async function compile(s){
 const p=\`sites/\${s.folder}/\`;
 let [template,html,base,extra,frontend,privacy,terms,llms]=await Promise.all([
  read("cloudflare/site-worker.template.js"),read(p+"index.html"),read(p+s.base),s.extra?read(p+s.extra):Promise.resolve(""),
  read("shared/photo-site.js"),read(p+"privacidad.html"),read(p+"terminos.html"),read(p+"llms.txt")]);
 html=replaceUrls(html).replace(/<link rel="preconnect" href="https:\/\/cdn\.websitepublisher\.ai">/g,"").replace(/<script src="https:\/\/cdn\.websitepublisher\.ai\/js\/sapi-client\.js"><\/script>/g,"");
 base=replaceUrls(base);extra=replaceUrls(extra);privacy=replaceUrls(privacy).replace("Los datos recibidos en el formulario pueden almacenarse en la infraestructura del proveedor de alojamiento.","Las solicitudes enviadas mediante el formulario se almacenan en Cloudflare D1 para gestionar y dar seguimiento a las cotizaciones.");
 terms=replaceUrls(terms);llms=replaceUrls(llms);
 const old='if(!window.WP)throw Error("Formulario fuera de servicio");const result=await WP.sapi(project).submitForm("cotizacion_srs",fields);if(!result.ok)throw Error("No se pudo guardar");sent=true';
 const updated='const response=await fetch("/api/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...fields,website:lead.elements.website.value})});const result=await response.json();if(!response.ok||!result.ok)throw Error("No se pudo guardar");sent=true';
 if(!frontend.includes(old))throw Error("Missing expected legacy form call: update transform");
 frontend=frontend.replace(old,updated);
 if([html,base,extra].some(s=>s.includes("websitepublisher"))||frontend.includes("WP.sapi"))throw Error("A legacy hosting reference remains");
 const values={TYPE:s.variant,HTML:html,CSS:base,EXTRA:extra,JS:frontend,PRIVACY:privacy,TERMS:terms,LLMS:llms};
 for(const [key,value] of Object.entries(values))template=template.replace(\`__LCA_\${key}__\`,JSON.stringify(value));
 if(template.includes("__LCA_"))throw Error("Unfilled template token");
 return template;
}
async function deploy(name,code,bindings){
 const url=\`https://api.cloudflare.com/client/v4/accounts/\${account}/workers/scripts/\${name}\`;
 const form=new FormData();
 form.append("metadata",new Blob([JSON.stringify({main_module:"worker.js",bindings,compatibility_date:"2026-11-01"})],{type:"application/json"}));
 form.append("worker.js",new Blob([code],{type:"application/javascript+module"}),"worker.js");
 const r=await fetch(url,{method:"PUT",headers:{Authorization:\`Bearer \${apiToken}\`},body:form});
 const body=await r.json().catch(()=>({}));
 if(!r.ok||!body.success)throw Error(\`Deploy \${name}: HTTP \${r.status} \${JSON.stringify(body.errors||body).slice(0,1200)}\`);
 console.log(\`Deployed \${name}: \${code.length} bytes\`);
}
for(const s of sites){
 const code=await compile(s);
 console.log(\`Validated \${s.name} (\${code.length} bytes)\`);
 if(process.argv.includes("--check"))continue;
 if(!apiToken)throw Error("Set CLOUDFLARE_API_TOKEN in GitHub Actions secrets");
 await deploy(s.name,code,[
  {type:"r2_bucket",name:"ASSETS",bucket_name:"lca-web-assets"},
  {type:"d1",name:"LEADS_DB",database_id:"7a942073-1ca6-491f-bfba-fb90cdad0a3e"},
  {type:"ratelimit",name:"QUOTE_LIMIT",namespace_id:s.namespace,simple:{limit:4,period:60}}
 ]);
}
if(!process.argv.includes("--check")){
 if(!apiToken)throw Error("Set CLOUDFLARE_API_TOKEN");
 await deploy("lca-agent",await read("worker/lca-agent.js"),[
 {type:"ai",name:"AI"},
 {type:"ratelimit",name:"CHAT_LIMIT",namespace_id:"12581",simple:{limit:6,period:60}}
 ]);
}
