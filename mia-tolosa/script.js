/* script.js - interacciones para Cine Smile */
/* Copiar color al portapapeles */
function copyColor(hex){

if(!hex) return;
if(navigator.clipboard && navigator.clipboard.writeText){
navigator.clipboard.writeText(hex).then(()=>{
showToast('Color ' + hex + ' copiado al portapapeles');
}).catch(()=>{ showToast('No se pudo copiar el color') });
} else {
// Fallback
const input = document.createElement('input');
input.value = hex; document.body.appendChild(input);
input.select();
try{ document.execCommand('copy'); showToast('Color ' + hex + ' copiado al portapapeles'); }
catch(e){ showToast('No se pudo copiar el color'); }
input.remove();
}
}
/* Mensajes rápidos al usuario */
function showToast(msg){
// simple alert alternativa no intrusiva
const el = document.createElement('div');
el.textContent = msg;
el.style.position = 'fixed';
el.style.right = '18px';
el.style.bottom = '18px';
el.style.padding = '10px 14px';
el.style.background = 'rgba(0,0,0,0.8)';
el.style.color = '#fff';
el.style.borderRadius = '8px';
el.style.zIndex = 9999;
el.style.fontWeight = 700;
document.body.appendChild(el);
setTimeout(()=> el.style.opacity = '0.0', 2200);
setTimeout(()=> el.remove(), 2700);
}
/* Formulario de contacto - manejo simple en frontend */
function handleContact(e){
e.preventDefault();
const form = e.target;
const data = new FormData(form);
const nombre = data.get('nombre') || '';
const email = data.get('email') || '';
const mensaje = data.get('mensaje') || '';
const feedback = document.getElementById('contact-feedback');

// Validación básica
if(!nombre.trim() || !email.trim() || !mensaje.trim()){
feedback.textContent = 'Por favor completá todos los campos.';
return;
}
// Simular envío (aquí podés integrar mail API o backend)
feedback.textContent = 'Gracias, tu mensaje fue recibido (simulado). Nos pondremos en
contacto.';
form.reset();
showToast('Mensaje enviado (simulado)');
}
/* Reset del formulario */
function resetForm(){
const form = document.getElementById('contact-form');
if(form) form.reset();
}
/* Descargar el HTML actual (útil para prototipado) */
function downloadHTML(){
const html = '<!doctype html>\n' + document.documentElement.outerHTML;
const blob = new Blob([html], {type:'text/html'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'cine-smile-prototipo.html';
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);
}
/* Atar el atajo Ctrl+S / Cmd+S para descargar prototipo (solo en entorno local) */
document.addEventListener('keydown', function(e){
if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
e.preventDefault();
downloadHTML();
}
});
