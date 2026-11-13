/* La Casa del Airbag • photographic interface & Cloudflare Workers AI */
(()=>{"use strict";
const root=document.documentElement;
const project=Number(root.dataset.project), variant=root.dataset.variant==="lab"?"lab":"expert";
const endpoint="https://lca-agent.eddyflores100.workers.dev";
const waNumber="593987219221";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const qs=s=>document.querySelector(s),qsa=s=>Array.from(document.querySelectorAll(s));
const nav=qs("#site-nav"),menu=qs("#menu-toggle");
if(menu&&nav){menu.addEventListener("click",()=>{const on=nav.classList.toggle("expanded");menu.setAttribute("aria-expanded",String(on));menu.textContent=on?"Cerrar":"Menú"});qsa("#site-nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("expanded");menu.setAttribute("aria-expanded","false");menu.textContent="Menú"}))}
const modal=qs("#assistant-modal"),screen=qs("#quote-modal");
let previousFocus=null;
function open(el){if(!el)return;previousFocus=document.activeElement;el.hidden=false;document.body.classList.add("dialog-open");const input=el.querySelector("input:not([type=hidden]),button[data-close]");input?.focus()}
function close(){[modal,screen].forEach(x=>{if(x)x.hidden=true});document.body.classList.remove("dialog-open");previousFocus?.focus?.()}
qsa("[data-assistant]").forEach(b=>b.addEventListener("click",()=>open(modal)));
qsa("[data-quote]").forEach(b=>b.addEventListener("click",()=>open(screen)));
qsa("[data-close]").forEach(b=>b.addEventListener("click",close));
[modal,screen].forEach(el=>el?.addEventListener("click",e=>{if(e.target===el)close()}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
const observer="IntersectionObserver" in window?new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -36px 0px"}):null;
qsa(".reveal").forEach(el=>{if(!reduced&&observer){el.classList.add("will-reveal");observer.observe(el)}else el.classList.add("visible")});
if(!reduced&&matchMedia("(pointer:fine)").matches){const h=qs(".hero-photo");if(h){let target=0,current=0,raf=0;const move=e=>{const r=h.getBoundingClientRect();target=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));if(!raf)raf=requestAnimationFrame(animate)};const animate=()=>{raf=0;current+=(target-current)*.06;h.style.setProperty("--pan",(current*13).toFixed(2)+"px");if(Math.abs(current-target)>.006)raf=requestAnimationFrame(animate)};h.addEventListener("pointermove",move,{passive:true});h.addEventListener("pointerleave",()=>{target=0;if(!raf)raf=requestAnimationFrame(animate)})}}
const feed=qs("#assistant-feed"),form=qs("#assistant-form"),input=qs("#assistant-input"),status=qs("#assistant-state");
let busy=false;const history=[];const safeUrl=u=>typeof u==="string"&&u.startsWith("https://wa.me/"+waNumber+"?");
function say(str,user){const div=document.createElement("p");div.className="msg "+(user?"from-user":"from-agent");div.textContent=str;feed?.append(div);if(feed)feed.scrollTop=feed.scrollHeight}
async function ask(question){const text=question?.trim();if(!text||busy)return;open(modal);say(text,true);busy=true;const submit=form?.querySelector('[type="submit"]');if(submit)submit.disabled=true;if(status)status.textContent="Consultando al agente…";
try{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),28000);let response;try{response=await fetch(endpoint+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand:variant,message:text,history:history.slice(-8)}),signal:controller.signal})}finally{clearTimeout(timeout)}
const data=await response.json();if(!response.ok||!data.reply)throw new Error(data.message||"Respuesta no disponible");
say(data.reply,false);history.push({role:"user",content:text},{role:"assistant",content:data.reply});
if(data.action?.type==="open_whatsapp"&&safeUrl(data.action.url)){const a=document.createElement("a");a.className="whatsapp-result wa-button";a.textContent="Revisar y enviar la solicitud por WhatsApp ↗";a.href=data.action.url;a.target="_blank";a.rel="noopener";feed.append(a)}
if(status)status.textContent="Agente de Cloudflare Workers AI · Información orientativa";
}catch(err){say("No pude comunicarme con el agente en este momento. Puedes escribirnos directamente por WhatsApp o completar el formulario de cotización.",false);if(status)status.textContent="El agente no está disponible temporalmente";}finally{busy=false;if(submit)submit.disabled=false}}
form?.addEventListener("submit",e=>{e.preventDefault();if(!input?.value.trim())return;const v=input.value;input.value="";ask(v)});
qsa("[data-question]").forEach(btn=>btn.addEventListener("click",()=>ask(btn.dataset.question)));
const voice=qs("#voice-dictate");if(voice){const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){voice.hidden=true}else voice.addEventListener("click",()=>{try{const s=new Speech();s.lang="es-EC";s.interimResults=false;s.onresult=e=>{input.value=e.results[0][0].transcript;input.focus()};s.onerror=()=>{if(status)status.textContent="No se pudo usar el dictado. Escribe tu consulta."};s.start()}catch{if(status)status.textContent="El dictado no está disponible en este navegador."}})}
const lead=qs("#lead-form"),leadState=qs("#lead-status"),leadWhats=qs("#lead-whatsapp");
lead?.addEventListener("submit",async e=>{e.preventDefault();if(!lead.reportValidity()||lead.elements.website.value)return;const fields={marca:lead.elements.marca.value.trim(),modelo:lead.elements.modelo.value.trim(),anio:Number(lead.elements.anio.value),componente:lead.elements.componente.value,nombre:lead.elements.nombre.value.trim(),telefono:lead.elements.telefono.value.trim()};
const msg=["Hola, La Casa del Airbag. Solicitud desde "+(variant==="lab"?"SRS LAB":"SRS EXPERT"),"Marca: "+fields.marca,"Modelo: "+fields.modelo,"Año: "+fields.anio,"Componente: "+fields.componente,fields.nombre?"Nombre: "+fields.nombre:"",fields.telefono?"Teléfono: "+fields.telefono:""].filter(Boolean).join("\n");
const href="https://wa.me/"+waNumber+"?text="+encodeURIComponent(msg);const b=lead.querySelector('button[type="submit"]');b.disabled=true;leadState.textContent="Registrando tus datos…";let sent=false;try{if(!window.WP)throw Error("Formulario fuera de servicio");const result=await WP.sapi(project).submitForm("cotizacion_srs",fields);if(!result.ok)throw Error("No se pudo guardar");sent=true}catch(err){}if(sent){leadState.textContent="Solicitud registrada. Puedes continuar la conversación en WhatsApp.";}else{leadState.textContent="No se pudo guardar aquí. Puedes enviar los datos directamente por WhatsApp."}leadWhats.href=href;leadWhats.hidden=false;b.disabled=false});
})();
