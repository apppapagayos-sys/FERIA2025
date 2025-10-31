// Datos iniciales (ahora con imágenes incluidas)
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

// Estado local
let CART = JSON.parse(localStorage.getItem('cine_cart') || '[]');
const moviesListEl = document.getElementById('moviesList');
const cartListEl = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');
const ticketPanel = document.getElementById('ticketPanel');
const nextShowEl = document.getElementById('nextShow');

function priceFormat(n){ return '$' + n.toLocaleString('es-AR'); }
function saveCart(){ localStorage.setItem('cine_cart', JSON.stringify(CART)); renderCart(); }

// Render de películas
function renderMovies(){
  moviesListEl.innerHTML = '';
  MOVIES.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src=\"${m.img}\" alt=\"${m.title}\" class=\"movie-img\">
      <h4>${m.title}</h4>
      <div class=\"movie-meta\">${m.duration} • ${m.desc}</div>
      <div style=\"margin-top:10px\">
        <div style=\"font-weight:700;margin-bottom:6px\">Funciones</div>
        ${m.showtimes.map(s => `<button class=\"btn showtime-btn\" data-m=\"${m.id}\" data-s=\"${s.id}\">${s.date} · ${s.time}</button>`).join(' ')}
      </div>
      <div style=\"margin-top:10px;display:flex;gap:8px;align-items:center\">
        <div style=\"font-weight:800\">${priceFormat(m.price)}</div>
        <button class=\"btn\" data-add=\"${m.id}\">Agregar al carrito</button>
      </div>
    `;
    moviesListEl.appendChild(card);
  });

  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-add');
      addToCartByMovie(id);
    });
  });

  document.querySelectorAll('.showtime-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const mid = btn.getAttribute('data-m');
      const sid = btn.getAttribute('data-s');
      openShowDetails(mid, sid);
      document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
    });
  });
}

// Agregar al carrito (1 ticket por defecto)
function addToCartByMovie(movieId){
  const movie = MOVIES.find(m => m.id === movieId);
  if(!movie) return;
  const show = movie.showtimes[0];
  const item = {
    id: Date.now().toString(),
    movieId: movie.id,
    title: movie.title,
    showId: show.id,
    date: show.date,
    time: show.time,
    qty: 1,
    price: movie.price
  };
  CART.push(item);
  saveCart();
  alert('Entrada agregada al carrito (simulado).');
}

// Render carrito
function renderCart(){
  cartListEl.innerHTML = '';
  if(CART.length === 0){
    cartListEl.innerHTML = '<li class=\"muted\">El carrito está vacío.</li>';
    cartTotalEl.textContent = 'Total: $0';
    return;
  }
  let total = 0;
  CART.forEach(ci => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${ci.title} — ${ci.date} ${ci.time} x${ci.qty}</span><span>${priceFormat(ci.price * ci.qty)} <button class=\"btn small remove\" data-id=\"${ci.id}\">Eliminar</button></span>`;
    cartListEl.appendChild(li);
    total += ci.price * ci.qty;
  });
  cartTotalEl.textContent = 'Total: ' + priceFormat(total);

  document.querySelectorAll('.remove').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      CART = CART.filter(x => x.id !== id);
      saveCart();
    });
  });
}

document.getElementById('clearCart').addEventListener('click', () => {
  if(confirm('Vaciar carrito?')) {
    CART = []; saveCart();
  }
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if(CART.length === 0){ alert('El carrito está vacío.'); return; }
  openModalCheckout();
});

// Mostrar detalles al seleccionar función
function openShowDetails(mid, sid){
  const movie = MOVIES.find(m => m.id === mid);
  const show = movie.showtimes.find(s => s.id === sid);
  ticketPanel.innerHTML = `
    <h4>${movie.title}</h4>
    <div class=\"muted\">${movie.duration} • ${movie.desc}</div>
    <div style=\"margin-top:10px\">Función: <strong>${show.date} ${show.time}</strong></div>
    <div style=\"margin-top:10px\">
      <label>Cantidad de entradas</label>
      <input type=\"number\" id=\"qty\" min=\"1\" max=\"10\" value=\"1\" style=\"width:80px;padding:8px;border-radius:6px;border:1px solid #ddd\">
      <div style=\"margin-top:8px\">
        <button class=\"btn btn-primary\" id=\"addThis\">Agregar al carrito</button>
      </div>
    </div>
  `;
  document.getElementById('addThis').addEventListener('click', () => {
    const q = parseInt(document.getElementById('qty').value || '1');
    const item = {
      id: Date.now().toString(),
      movieId: movie.id,
      title: movie.title,
      showId: show.id,
      date: show.date,
      time: show.time,
      qty: q,
      price: movie.price
    };
    CART.push(item);
    saveCart();
    alert(q + ' entrada(s) agregadas al carrito.');
  });
}

// Modal
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
modalClose.addEventListener('click', closeModal);

function openModalCheckout(){
  const total = CART.reduce((s,i) => s + i.price * i.qty, 0);
  modalContent.innerHTML = `
    <h3>Finalizar compra</h3>
    <p class=\"muted\">Resumen de tu pedido</p>
    <ul>
      ${CART.map(i => `<li>${i.title} — ${i.date} ${i.time} x${i.qty} — ${priceFormat(i.price * i.qty)}</li>`).join('')}
    </ul>
    <div style=\"font-weight:800\">Total: ${priceFormat(total)}</div>
    <hr>
    <h4>Datos de contacto</h4>
    <label>Nombre</label><input id=\"ch_name\">
    <label>Email</label><input id=\"ch_email\">
    <label>Teléfono (opcional)</label><input id=\"ch_phone\">
    <div style=\"margin-top:10px;display:flex;gap:8px;justify-content:flex-end\">
      <button class=\"btn\" id=\"modalCancel\">Cancelar</button>
      <button class=\"btn btn-primary\" id=\"modalConfirm\">Confirmar compra</button>
    </div>
  `;
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalConfirm').addEventListener('click', confirmPurchase);
  modal.classList.remove('hidden');
}

function closeModal(){ modal.classList.add('hidden'); modalContent.innerHTML = ''; }

function confirmPurchase(){
  const name = document.getElementById('ch_name').value.trim();
  const email = document.getElementById('ch_email').value.trim();
  if(!name || !email){ alert('Completá nombre y email.'); return; }

  const orders = JSON.parse(localStorage.getItem('cine_orders') || '[]');
  const order = {
    id: 'ORD' + Date.now(),
    buyer: { name, email, phone: document.getElementById('ch_phone').value || ''},
    items: CART,
    total: CART.reduce((s,i) => s + i.price * i.qty, 0),
    date: new Date().toISOString()
  };
  orders.push(order);
  localStorage.setItem('cine_orders', JSON.stringify(orders));

  CART = []; saveCart();
  closeModal();
  showConfirmation(order);
}

function showConfirmation(order){
  modalContent.innerHTML = `
    <h3>Compra confirmada</h3>
    <p>Gracias ${order.buyer.name}. Tu orden <strong>${order.id}</strong> fue registrada (simulado).</p>
    <p class=\"muted\">Recibirás la confirmación en: <strong>${order.buyer.email}</strong></p>
    <div style=\"margin-top:10px;display:flex;justify-content:flex-end\">
      <button class=\"btn btn-primary\" id=\"modalCloseOk\">Cerrar</button>
    </div>
  `;
  document.getElementById('modalCloseOk').addEventListener('click', closeModal);
  modal.classList.remove('hidden');
}

// Botón rápido
document.getElementById('reserveQuick').addEventListener('click', () => {
  document.getElementById('tickets').scrollIntoView({behavior:'smooth'});
});

// Contacto (simulado)
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg = document.getElementById('cmessage').value.trim();
  if(!name || !email || !msg) return;
  const contacts = JSON.parse(localStorage.getItem('cine_contacts') || '[]');
  contacts.push({id: Date.now(), name, email, msg, date: new Date().toISOString()});
  localStorage.setItem('cine_contacts', JSON.stringify(contacts));
  document.getElementById('contactMsg').textContent = 'Mensaje enviado (simulado). Gracias!';
  e.target.reset();
});

// Navegación suave
document.querySelectorAll('.nav-btn').forEach(b => {
  b.addEventListener('click', () => {
    const target = b.getAttribute('data-target');
    document.getElementById(target).scrollIntoView({behavior:'smooth'});
  });
});

// Inicialización
renderMovies();
renderCart();

// Mostrar próxima función
function setNextShow(){
  let upcoming = null;
  MOVIES.forEach(m => {
    m.showtimes.forEach(s => {
      const dt = new Date(s.date + 'T' + s.time + ':00');
      if(!upcoming || dt < upcoming.dt) upcoming = {movie: m, show: s, dt};
    });
  });
  if(upcoming){
    nextShowEl.textContent = `${upcoming.show.date} · ${upcoming.show.time} — ${upcoming.movie.title}`;
  } else nextShowEl.textContent = 'Sin funciones cargadas.';
}
setNextShow();

// Accesibilidad mínima
document.addEventListener('keydown', e => {
  if(e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
});
