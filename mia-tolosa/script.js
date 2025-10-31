const MOVIES = [
  {
    id: 'm1',
    title: 'Ciclo Familiar: Aventura en la Sierra',
    desc: 'Una película para toda la familia que celebra la naturaleza local.',
    duration: '1h 25m',
    price: 600,
    showtimes: [
      {id: 's1', date: '2025-11-14', time: '20:30', place: 'Plaza Central'},
      {id: 's2', date: '2025-11-21', time: '20:30', place: 'Plaza Central'}
    ],
    img: 'assets/01.jpeg'
  },
  {
    id: 'm2',
    title: 'Ciclo Documental: Ríos y Sierras',
    desc: 'Documental sobre el patrimonio natural de la región.',
    duration: '0h 55m',
    price: 400,
    showtimes: [
      {id: 's3', date: '2025-11-15', time: '20:30', place: 'Plaza Central'}
    ],
    img: 'assets/02.jpeg'
  },
  {
    id: 'm3',
    title: 'Cine Local: Historias de Papagayos',
    desc: 'Cortometrajes realizados por la comunidad.',
    duration: '1h 0m',
    price: 300,
    showtimes: [
      {id: 's4', date: '2025-11-22', time: '20:30', place: 'Plaza Central'}
    ],
    img: 'assets/03.jpeg'
  }
];

let CART = JSON.parse(localStorage.getItem('cine_cart') || '[]');
const moviesListEl = document.getElementById('moviesList');
const cartListEl = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const ticketPanel = document.getElementById('ticketPanel');
const nextShowEl = document.getElementById('nextShow');

function priceFormat(n){ return '$' + n.toLocaleString('es-AR'); }
function saveCart(){ localStorage.setItem('cine_cart', JSON.stringify(CART)); renderCart(); }

function renderMovies(){
  moviesListEl.innerHTML = '';
  MOVIES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${m.img}" alt="${m.title}" class="movie-img">
      <h4>${m.title}</h4>
      <div class="movie-meta">${m.duration} • ${m.desc}</div>
      <div style="margin-top:10px">
        <strong>Funciones:</strong><br>
        ${m.showtimes.map(s => `<button class="btn showtime-btn" data-m="${m.id}" data-s="${s.id}">${s.date} · ${s.time}</button>`).join(' ')}
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <div style="font-weight:800">${priceFormat(m.price)}</div>
        <button class="btn" data-add="${m.id}">Agregar al carrito</button>
      </div>
    `;
    moviesListEl.appendChild(card);
  });

  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addToCartByMovie(btn.getAttribute('data-add')));
  });

  document.querySelectorAll('.showtime-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      openShowDetails(btn.getAttribute('data-m'), btn.getAttribute('data-s'));
      document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
    });
  });
}

function addToCartByMovie(movieId){
  const movie = MOVIES.find(m => m.id === movieId);
  if(!movie) return;
  const show = movie.showtimes[0];
  CART.push({
    id: Date.now().toString(),
    movieId: movie.id,
    title: movie.title,
    showId: show.id,
    date: show.date,
    time: show.time,
    qty: 1,
    price: movie.price
  });
  saveCart();
  alert('Entrada agregada al carrito.');
}

function renderCart(){
  cartListEl.innerHTML = '';
  if(CART.length === 0){ cartListEl.innerHTML = '<li class="muted">El carrito está vacío.</li>'; cartTotalEl.textContent='Total: $0'; return; }
  let total = 0;
  CART.forEach(ci => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ci.title} — ${ci.date} ${ci.time} x${ci.qty}</span><span>${priceFormat(ci.price * ci.qty)} <button class="btn small remove" data-id="${ci.id}">X</button></span>`;
    cartListEl.appendChild(li);
    total += ci.price * ci.qty;
  });
  cartTotalEl.textContent = 'Total: ' + priceFormat(total);
  document.querySelectorAll('.remove').forEach(b => b.addEventListener('click',()=>{CART=CART.filter(x=>x.id!==b.dataset.id);saveCart();}));
}

document.getElementById('clearCart').addEventListener('click', ()=>{if(confirm('Vaciar carrito?')){CART=[];saveCart();}});
document.getElementById('checkoutBtn').addEventListener('click', ()=>{if(CART.length===0){alert('Carrito vacío');return;}openModalCheckout();});

function openShowDetails(mid,sid){
  const movie = MOVIES.find(m=>m.id===mid);
  const show = movie.showtimes.find(s=>s.id===sid);
  ticketPanel.innerHTML = `
    <h4>${movie.title}</h4>
    <div class="muted">${movie.duration} • ${movie.desc}</div>
    <p>Función: <strong>${show.date} ${show.time}</strong></p>
    <label>Cantidad</label><input type="number" id="qty" min="1" max="10" value="1">
    <button class="btn btn-primary" id="addThis">Agregar al carrito</button>`;
  document.getElementById('addThis').addEventListener('click',()=>{
    const q=parseInt(document.getElementById('qty').value||'1');
    CART.push({id:Date.now().toString(),movieId:movie.id,title:movie.title,showId:show.id,date:show.date,time:show.time,qty:q,price:movie.price});
    saveCart();alert('Agregado.');
  });
}

/* Modal */
const modal=document.getElementById('modal'), modalContent=document.getElementById('modalContent'), modalClose=document.getElementById('modalClose');
modalClose.addEventListener('click',()=>modal.classList.add('hidden'));
function openModalCheckout(){
  const total=CART.reduce((s,i)=>s+i.price*i.qty,0);
  modalContent.innerHTML=`
  <h3>Finalizar compra</h3>
  <ul>${CART.map(i=>`<li>${i.title} - ${i.date} ${i.time} x${i.qty}</li>`).join('')}</ul>
  <p><strong>Total: ${priceFormat(total)}</strong></p>
  <label>Nombre</label><input id="ch_name"><label>Email</label><input id="ch_email">
  <div style="text-align:right;margin-top:10px"><button class="btn btn-primary" id="confirm">Confirmar</button></div>`;
  modal.classList.remove('hidden');
  document.getElementById('confirm').addEventListener('click',()=>{alert('Compra simulada. ¡Gracias!');CART=[];saveCart();modal.classList.add('hidden');});
}

/* Contacto */
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('contactMsg').textContent='Mensaje enviado (simulado). ¡Gracias!';
  e.target.reset();
});

/* Navegación */
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>{document.getElementById(b.dataset.target).scrollIntoView({behavior:'smooth'});}))

renderMovies();
renderCart();

/* Próxima función */
function setNextShow(){
  let next=null;
  MOVIES.forEach(m=>m.showtimes.forEach(s=>{
    const dt=new Date(s.date+'T'+s.time+':00');
    if(!next||dt<next.dt) next={movie:m,show:s,dt};
  }));
  if(next){nextShowEl.textContent=`${next.show.date} · ${next.show.time} — ${next.movie.title}`;}
}
setNextShow();
