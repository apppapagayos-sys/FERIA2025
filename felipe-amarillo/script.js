// Datos de productos (puedes editar, agregar imágenes reales)
const productsData = [
{id:1,name:'Éclat Urban',price:45,tag:'urban',img:'images/urban.jpg',desc:'Vibrante,
moderno — cítricos y maderas.'},
{id:2,name:'Éclat Sport',price:42,tag:'sport',img:'images/sport.jpg',desc:'Fresco y energético
— notas acuáticas.'},
{id:3,name:'Éclat
Classique',price:60,tag:'classique',img:'images/classique.jpg',desc:'Sofisticado — flores y
ámbar.'},
{id:4,name:'Éclat Night',price:58,tag:'night',img:'images/night.jpg',desc:'Intenso y misterioso
— cuero y pachulí.'}
];

// Render productos
const productsEl = document.getElementById('products');
function renderProducts(){
productsEl.innerHTML = productsData.map(p => `
<div class="product card">
<img src="${p.img}" alt="${p.name}">
<h4>${p.name}</h4>
<p class="small">${p.desc}</p>
<div
style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
<div class="price">$${p.price}</div>
<button class="btn" onclick="addToCart(${p.id})">Agregar</button>
</div>
</div>
`).join('');
}
renderProducts();
// Carrito simple en memoria
let cart = [];
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
function addToCart(id){
const p = productsData.find(x=>x.id===id);
const found = cart.find(i=>i.id===id);
if(found){ found.qty++; } else { cart.push({id:p.id,name:p.name,price:p.price,qty:1}); }
updateCartUI();
}
function updateCartUI(){
const totalQty = cart.reduce((s,i)=>s+i.qty,0);
const totalPrice = cart.reduce((s,i)=>s + i.qty * i.price,0);
cartCount.textContent = totalQty;
cartItems.innerHTML = cart.length ? cart.map(i=>`<div
style="display:flex;justify-content:space-between;margin-bottom:8px"><div><strong>${i.nam
e}</strong><div class="small">${i.qty} x $${i.price}</div></div><div><button class="btn"
onclick="changeQty(${i.id},-1)">-</button> <button class="btn"
onclick="changeQty(${i.id},1)">+</button></div></div>`).join('') : '<div class="small">El
carrito está vacío.</div>';
cartTotal.textContent = `$${totalPrice}`;
}
function changeQty(id,delta){
const it = cart.find(i=>i.id===id);
if(!it) return;

it.qty += delta;
if(it.qty<=0){ cart = cart.filter(x=>x.id!==id); }
updateCartUI();
}
// Modal control
document.getElementById('open-cart').addEventListener('click',()=>{
cartModal.classList.add('open'); cartModal.setAttribute('aria-hidden','false'); });
document.getElementById('close-cart').addEventListener('click',()=>{
cartModal.classList.remove('open'); cartModal.setAttribute('aria-hidden','true'); });
// Checkout (simulado)
document.getElementById('checkout').addEventListener('click',()=>{
if(cart.length===0){ alert('El carrito está vacío.'); return; }
alert('Compra simulada realizada. Gracias por elegir Éclat Essence.');
cart = [];
updateCartUI();
cartModal.classList.remove('open');
});
// Formulario de contacto (simulado)
document.getElementById('contact-form').addEventListener('submit',(e)=>{
e.preventDefault();
alert('Mensaje enviado (simulación). Nos contactaremos pronto.');
e.target.reset();
});
function scrollToSection(id){
document.getElementById(id).scrollIntoView({behavior:'smooth'}); }
