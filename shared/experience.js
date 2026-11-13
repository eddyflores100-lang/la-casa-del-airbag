/* La Casa del Airbag — interactive 3D / agent controller v2 */
const ROOT=document.documentElement;
const theme=ROOT.dataset.experience||'expert';
const worker='https://lca-agent.eddyflores100.workers.dev';
const stage=document.getElementById('three-stage');
const buttons=[...document.querySelectorAll('[data-object]')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let active='airbag',rotX=0,rotY=0,dragging=false,startX=0,startY=0,lastX=0,lastY=0,externalMode=0;
function selectObject(mode){active=mode;buttons.forEach(b=>{const yes=b.dataset.object===mode;b.setAttribute('aria-pressed',String(yes));b.classList.toggle('selected',yes)});const name=document.getElementById('live-part');if(name)name.textContent=({airbag:'AIRBAG · SISTEMA DE RETENCIÓN',ecu:'ECU SRS · UNIDAD DE CONTROL',belt:'PRETENSOR · SISTEMA DE CINTURÓN'})[mode]||'COMPONENTE SRS';externalMode={airbag:0,ecu:1,belt:2}[mode]||0}
buttons.forEach(b=>b.addEventListener('click',()=>selectObject(b.dataset.object)));selectObject(active);
document.querySelectorAll('[data-open-agent]').forEach(b=>b.addEventListener('click',openAgent));document.querySelectorAll('[data-open-quote]').forEach(b=>b.addEventListener('click',openQuote));document.querySelectorAll('[data-close-overlay]').forEach(b=>b.addEventListener('click',closeOverlay));
function openAgent(){const p=document.getElementById('agent-panel');if(!p)return;p.hidden=false;ROOT.classList.add('overlay-open');p.querySelector('input')?.focus()}
function openQuote(){const p=document.getElementById('quote-panel');if(!p)return;p.hidden=false;ROOT.classList.add('overlay-open');p.querySelector('input')?.focus()}
function closeOverlay(){document.getElementById('agent-panel')?.setAttribute('hidden','');document.getElementById('quote-panel')?.setAttribute('hidden','');ROOT.classList.remove('overlay-open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlay()});
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.nav)?.scrollIntoView({behavior:reduce?'instant':'smooth'})));
const agentForm=document.getElementById('agent-form'),msg=document.getElementById('agent-input'),feed=document.getElementById('agent-feed'),agentStatus=document.getElementById('agent-status');
const hist=[];let sending=false;function bubble(text,who){let el=document.createElement('div');el.className='message '+(who==='user'?'outgoing':'incoming');el.textContent=text;feed.append(el);feed.scrollTop=feed.scrollHeight}
function agentSet(t){if(agentStatus)agentStatus.textContent=t}
async function sendMessage(text){if(sending)return;text=text.trim();if(!text)return;bubble(text,'user');sending=true;agentSet('Procesando solicitud en Workers AI…');agentForm.querySelector('button[type=submit]').disabled=true;try{let ac=new AbortController();let timeout=setTimeout(()=>ac.abort(),28000);let r;try{r=await fetch(worker+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({brand:theme,message:text,history:hist.slice(-8)}),signal:ac.signal})}finally{clearTimeout(timeout)}const j=await r.json();if(!r.ok||!j.reply)throw Error(j.message||'No hay respuesta del servidor');bubble(j.reply,'assistant');if(j.action?.type==='open_whatsapp'&&typeof j.action.url==='string'&&j.action.url.startsWith('https://wa.me/593987219221?')){const link=document.createElement('a');link.href=j.action.url;link.target='_blank';link.rel='noopener';link.className='tool-link';link.textContent='REVISAR Y ENVIAR CONSULTA POR WHATSAPP ↗';feed.append(link);feed.scrollTop=feed.scrollHeight}hist.push({role:'user',content:text},{role:'assistant',content:j.reply});agentSet('Agente Cloudflare Workers AI · Respuestas comerciales orientativas')}catch(e){bubble('No pude obtener una respuesta automática en este momento. Puedes continuar por WhatsApp con el equipo de La Casa del Airbag.','assistant');agentSet('Conexión no disponible · WhatsApp habilitado')}finally{sending=false;agentForm.querySelector('button[type=submit]').disabled=false}}
if(agentForm)agentForm.addEventListener('submit',e=>{e.preventDefault();const v=msg.value;msg.value='';sendMessage(v)});
document.querySelectorAll('[data-suggest]').forEach(b=>b.addEventListener('click',()=>{openAgent();sendMessage(b.dataset.suggest)}));
const mic=document.getElementById('voice-input');if(mic){const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){mic.hidden=true}else{mic.onclick=()=>{const rec=new Speech();rec.lang='es-EC';rec.interimResults=false;rec.onresult=e=>{msg.value=e.results[0][0].transcript;msg.focus()};rec.onerror=()=>agentSet('No se pudo acceder al dictado; escribe tu consulta.');rec.start()}}}
const form=document.getElementById('lead-form'),quoteMsg=document.getElementById('quote-message');if(form)form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const f=form.elements;if(f.website.value)return;const fields={marca:f.marca.value.trim(),modelo:f.modelo.value.trim(),anio:Number(f.anio.value),componente:f.componente.value,nombre:f.nombre.value.trim(),telefono:f.telefono.value.trim()};const txt=['Hola, La Casa del Airbag. Solicitud desde '+(theme==='lab'?'SRS LAB':'SRS EXPERT'),'Marca: '+fields.marca,'Modelo: '+fields.modelo,'Año: '+fields.anio,'Componente: '+fields.componente,fields.nombre?'Nombre: '+fields.nombre:'',fields.telefono?'Teléfono: '+fields.telefono:''].filter(Boolean).join('\n');const link='https://wa.me/593987219221?text='+encodeURIComponent(txt);const submit=form.querySelector('button[type=submit]');submit.disabled=true;quoteMsg.textContent='Registrando la solicitud…';let ok=false;try{if(!window.WP)throw Error('Formulario no disponible');const res=await WP.sapi(Number(form.dataset.project)).submitForm('cotizacion_srs',fields);ok=!!res.ok}catch{}if(ok){quoteMsg.textContent='Solicitud registrada. Puedes enviarla por WhatsApp.';const a=document.getElementById('quote-wa');a.href=link;a.hidden=false}else{quoteMsg.textContent='No se pudo registrar aquí. Puedes enviar la consulta directamente por WhatsApp.';let a=document.getElementById('quote-wa');a.href=link;a.hidden=false}submit.disabled=false});
/* Real-time Three.js: procedural sculpted objects; no stock photos, no GLB dependency. */
if(stage && !reduce && matchMedia('(min-width: 1px)').matches){init3D().catch(()=>{stage.classList.add('webgl-fallback')})}else if(stage){stage.classList.add('webgl-fallback')}
async function init3D(){
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js');
const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Escultura tridimensional interactiva de componentes de seguridad');canvas.className='webgl-canvas';stage.append(canvas);
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;
const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(36,1,0.1,110);camera.position.set(0,0,12);scene.add(new THREE.AmbientLight(0xffffff,1.1));
const key=new THREE.PointLight(theme==='lab'?0xff7f43:0x8bcdff,85,35);key.position.set(6,7,9);scene.add(key);const rim=new THREE.PointLight(theme==='lab'?0xe7f8f2:0x628cff,75,40);rim.position.set(-7,-4,-6);scene.add(rim);
const root=new THREE.Group();scene.add(root);
const mat=(color,metalness=.5,roughness=.22,opts={})=>new THREE.MeshPhysicalMaterial({color,metalness,roughness,clearcoat:.75,clearcoatRoughness:.14,...opts});
const metal=mat(theme==='lab'?0x879a92:0xa8c8da,.88,.19);const copper=mat(theme==='lab'?0xff6b34:0x69baff,.55,.24,{emissive:theme==='lab'?0x611d04:0x123859,emissiveIntensity:.45});
const dark=mat(theme==='lab'?0x17211f:0x1e3345,.72,.27);const crystal=mat(theme==='lab'?0xb5eee0:0x91cbfa,.12,.08,{transparent:true,opacity:.32,side:THREE.DoubleSide,depthWrite:false});
const pieces=[];const geoG=new THREE.Group();root.add(geoG);
function mesh(geometry,material,parent=geoG){const o=new THREE.Mesh(geometry,material);parent.add(o);pieces.push(o);return o}
function ring(radius,tube,ang,matrl){const t=mesh(new THREE.TorusGeometry(radius,tube,9,128),matrl);t.rotation.set(ang,.3,ang*.37);return t}
if(theme==='expert'){
const core=mesh(new THREE.IcosahedronGeometry(1.85,5),mat(0x8199ba,.5,.28,{transparent:true,opacity:.64,flatShading:false,clearcoat:1,depthWrite:false}));core.scale.set(.98,1.08,.83);
const wire=mesh(new THREE.IcosahedronGeometry(1.93,3),new THREE.MeshBasicMaterial({color:0x86ceff,wireframe:true,transparent:true,opacity:.23}));wire.scale.set(.98,1.08,.83);
const inner=mesh(new THREE.IcosahedronGeometry(1.1,3),copper);inner.scale.set(1,1,.8);
const halo=mesh(new THREE.SphereGeometry(2.16,48,32),new THREE.MeshBasicMaterial({color:0x65bbff,transparent:true,opacity:.05,side:THREE.BackSide,depthWrite:false}));
ring(2.44,.018,.2,copper);ring(2.78,.012,1.1,metal);ring(3.08,.009,-.75,crystal);ring(2.15,.025,1.6,copper);
for(let i=0;i<12;i++){const seg=mesh(new THREE.BoxGeometry(.13,.044,.08),i%3===0?copper:metal);const a=i*Math.PI/6;seg.position.set(Math.cos(a)*2.82,Math.sin(a)*2.82,.2);seg.rotation.z=a}
}else{
const stack=new THREE.Group();geoG.add(stack);
const board=mesh(new THREE.BoxGeometry(3.42,2.34,.23),dark,stack);board.rotation.x=.07;
for(let k=-3;k<=3;k++){const layer=mesh(new THREE.BoxGeometry(3.22-k*.04,2.1-k*.03,.04), k%2?metal:dark,stack);layer.position.z=k*.29;layer.userData.layer=k;}
const chip=mesh(new THREE.BoxGeometry(1.4,1.18,.3),copper,stack);chip.position.z=.93;const chip2=mesh(new THREE.BoxGeometry(1.9,1.65,.14),metal,stack);chip2.position.z=.65;const chip3=mesh(new THREE.BoxGeometry(1.64,1.34,.16),dark,stack);chip3.position.z=1.1;
const bezel=mesh(new THREE.TorusGeometry(2.55,.024,8,112),copper);bezel.scale.set(1,.8,1);bezel.rotation.x=.35;
for(let i=0;i<18;i++){const line=mesh(new THREE.BoxGeometry(.028,.36+(.06*(i%5)),.028),i%3===0?copper:metal,stack);line.position.set(-1.5+i*.175,-.82+(i%3)*.55,1.27);line.rotation.z=.23*(i%4)}
for(let i=0;i<10;i++){const node=mesh(new THREE.SphereGeometry(.055,8,8),copper,stack);node.position.set(-1.6+i*.36,.98,1.2)}
const arch=mesh(new THREE.TorusGeometry(3.1,.012,6,128,Math.PI*1.4),crystal);arch.rotation.set(.4,.2,1.1);
}
const particles=theme==='lab'?90:130;const cloud=new Float32Array(particles*3);for(let i=0;i<particles;i++){let a=Math.random()*Math.PI*2,rad=3.2+Math.random()*2.2;cloud[i*3]=Math.cos(a)*rad;cloud[i*3+1]=(Math.random()-.5)*5.5;cloud[i*3+2]=Math.sin(a)*rad}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(cloud,3));const stars=new THREE.Points(pg,new THREE.PointsMaterial({color:theme==='lab'?0xff925c:0x83c9ff,size:theme==='lab'?.024:.022,transparent:true,opacity:.75,sizeAttenuation:true}));root.add(stars);
function resize(){const rect=stage.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<450?15:w<800?13:12;camera.updateProjectionMatrix()}
let pointerX=0,pointerY=0;stage.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startY=e.clientY;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture?.(e.pointerId)});stage.addEventListener('pointerup',()=>dragging=false);stage.addEventListener('pointercancel',()=>dragging=false);stage.addEventListener('pointermove',e=>{if(dragging){rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY}else{const b=stage.getBoundingClientRect();pointerX=((e.clientX-b.left)/b.width-.5)*.5;pointerY=((e.clientY-b.top)/b.height-.5)*.4}});
let t=0,last=performance.now(),visible=true,raf=0;const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(tick)},{threshold:0});io.observe(stage);const ro=new ResizeObserver(resize);ro.observe(stage);resize();
function tick(now){raf=0;if(document.hidden||!visible)return;let dt=Math.min((now-last)/1000,.05);last=now;t+=dt;const goal=theme==='lab'?.055:.085;geoG.rotation.y+=(rotY+pointerX-geoG.rotation.y)*.045;geoG.rotation.x+=(rotX+pointerY-geoG.rotation.x)*.045;geoG.rotation.z+=dt*goal;
const v=externalMode;
if(theme==='expert'){const scale=1+(v===1?-.13:v===2?.12:0);geoG.scale.lerp(new THREE.Vector3(scale,scale,scale),.04);for(let i=0;i<pieces.length;i++){if(pieces[i].geometry.type==='TorusGeometry')pieces[i].rotation.z+=dt*(.035+(i%3)*.02)}pieces[0].rotation.y+=dt*.06;}else{geoG.rotation.y+=dt*.12;geoG.scale.lerp(new THREE.Vector3(v===0?1:v===1?.85:1.12,v===0?1:v===1?.85:1.12,1),.04);pieces.forEach(p=>{if(p.userData.layer!==undefined){const n=p.userData.layer;const offset=v===0?1:v===1?1.65:.45;p.position.z+=(n*.29*offset-p.position.z)*.05}})}
root.position.y=Math.sin(t*.6)*.08;stars.rotation.y+=dt*.006;renderer.render(scene,camera);raf=requestAnimationFrame(tick)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}});raf=requestAnimationFrame(tick);
}
