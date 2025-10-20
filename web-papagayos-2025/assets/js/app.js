/* app.js - navegación, mapa, carrusel, stories, sw register */

/* ========== Menú hamburguesa ========== */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-hamb');
  const nav = document.getElementById('main-nav');
  btn.addEventListener('click', () => {
    if (nav.style.display === 'flex') {
      nav.style.display = '';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '6px';
      nav.style.padding = '12px';
    }
  });

  // smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile nav
        if (window.innerWidth < 900) nav.style.display = '';
      }
    });
  });

  initCarousel();
  initMap();
  loadStories();
});

/* ========== CAROUSEL dinámico (detecta 01..19 + 1118.jpg) ========== */
function initCarousel(){
  const track = document.getElementById('carousel-track');
  const dots = document.getElementById('carousel-dots');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  if(!track) return;

  const images = [];
  // attempt to load 01..19 and 1118.jpg
  const names = [];
  for(let i=1;i<=19;i++){
    const pad = i < 10 ? '0'+i : i.toString();
    names.push(`${pad}.jpg`);
    names.push(`${pad}.png`);
    names.push(`${pad}.webp`);
  }
  names.push('1118.jpg');

  let idx = 0;

  // helper to check if image exists by trying to load it
  function checkAndPush(path){
    return new Promise((res) => {
      const img = new Image();
      img.src = path;
      img.onload = () => res(path);
      img.onerror = () => res(null);
    });
  }

  // sequentially test names to avoid parallel spam; stop after first match per index slot
  (async () => {
    for (let i=0;i<names.length;i++){
      const path = `assets/images/${names[i]}`;
      const ok = await checkAndPush(path);
      if(ok){
        images.push(path);
      }
      // keep scanning, collect many images found
    }

    // if no images found, add a placeholder (the hero)
    if(images.length === 0){
      images.push('assets/images/1118.jpg');
    }

    // create slides
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Galería ${i+1}`;
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.style.minWidth = '100%';
      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.dataset.index = i;
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dots.appendChild(dot);
    });

    // controls
    prev && prev.addEventListener('click', ()=>goTo(idx-1));
    next && next.addEventListener('click', ()=>goTo(idx+1));

    // autoplay
    let autoplay = setInterval(()=> goTo(idx+1), 4000);

    // functions
    function update(){
      track.style.transform = `translateX(-${idx*100}%)`;
      // dots
      dots.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      const active = dots.querySelector(`button[data-index="${idx}"]`);
      if(active) active.classList.add('active');
    }

    function goTo(i){
      if(i < 0) i = images.length - 1;
      if(i >= images.length) i = 0;
      idx = i;
      update();
      // reset autoplay
      clearInterval(autoplay);
      autoplay = setInterval(()=> goTo(idx+1), 4000);
    }

    // initial style
    track.style.display = 'flex';
    track.style.transition = 'transform 0.6s ease';
  })();
}

/* ========== STORIES (paranormal) ========== */
function loadStories(){
  const storiesData = [
    {
      title: 'Bola de luz blanca',
      meta: 'Invierno de 2023 — Ruta 1 (El Recuerdo → Palo Verde)',
      text: 'Dos amigos viajaban temprano rumbo a una jineteada cuando, al salir del pueblo, vieron una esfera blanca que pareció acompañarlos en la ruta hasta perderse en Palo Verde. El miedo se mezcló con la extrañeza, y la sensación de ser observados quedó como recuerdo.'
    },
    {
      title: 'Mujer de blanco',
      meta: 'Aproximadamente 2008 — Barranca de Palo Colorado',
      text: 'Un jinete sintió el peso de alguien en su anca: era una mujer vestida de blanco. Galopó hasta El Recuerdo; al detenerse, la figura había desaparecido.'
    },
    {
      title: 'Luz amarilla en La Academia',
      meta: '6 de mayo de 2025 — Entrada de La Academia',
      text: 'Un vecino que volvía a caballo desde el campo se encontró con una luz amarilla que apareció y desapareció al ser observada. Fue un fenómeno visual, silencioso, que lo dejó marcado.'
    },
    {
      title: 'El camino del cementerio',
      meta: 'Relatos varios — zona del cementerio',
      text: 'Una yegua se alteró pasando el cementerio; en la zona se alzan cruces de antiguas tragedias y se relata la aparición de un perro negro de ojos rojos que persiguió a viajeros.'
    },
    {
      title: 'Luz en la cancha de jineteada',
      meta: '15 de mayo — madrugada',
      text: 'Dos hombres en moto vieron una luz intensa como la de un vehículo que los siguió unos metros y luego se desvaneció sin rastro. Desde entonces, muchos prefieren no mirar atrás en ese tramo.'
    }
  ];

  const container = document.getElementById('stories');
  if(!container) return;
  storiesData.forEach(s => {
    const art = document.createElement('article');
    art.className = 'story';
    art.innerHTML = `<h4>${s.title}</h4><p class="meta" style="color:#6b7a6e;margin:6px 0;font-size:0.95rem">${s.meta}</p><p>${s.text}</p>`;
    container.appendChild(art);
  });
}

/* ========== MAP (Leaflet) ========== */
function initMap(){
  const mapEl = document.getElementById('map');
  if(!mapEl) return;

  // load Leaflet CSS/JS dynamically if not present
  const Lcss = document.createElement('link');
  Lcss.rel = 'stylesheet';
  Lcss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(Lcss);

  const Lscript = document.createElement('script');
  Lscript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  Lscript.onload = () => {
    const coords = [
      {id:'oficina',name:'Oficina de Turismo',lat:-32.675917,lon:-64.98275},
      {id:'aux',name:'Sala de primeros auxilios',lat:-32.67443869375519,lon:-64.98917874386407},
      {id:'bomberos',name:'Cuartel de Bomberos',lat:-32.674775098481895,lon:-64.99223512095541},
      {id:'policia',name:'Destacamento policial',lat:-32.675435315762094,lon:-64.9905628812799},
      {id:'municipal',name:'Municipalidad',lat:-32.675435315762094,lon:-64.9905628812799},
      {id:'escuela',name:'Escuela',lat:-32.67597265361397,lon:-64.98618015174158},
      {id:'camping_mun',name:'Camping Municipal',lat:-32.676357593243154,lon:-64.98015725138869},
      {id:'camping_arroyo',name:'Camping del arroyo',lat:-32.68005204140041,lon:-64.96943673568968},
      {id:'cancha',name:'Cancha de fútbol',lat:-32.67796412673282,lon:-64.98037849998963},
      {id:'club',name:'Club',lat:-32.674457526733015,lon:-64.98865830443928},
      {id:'sum',name:'SUM municipal',lat:-32.67410531648981,lon:-64.98946296716358},
      {id:'sendero',name:'Sendero principal',lat:-32.68166593499375,lon:-64.96792188822933}
    ];

    const map = L.map('map').setView([-32.6759,-64.9845],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19, attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);

    const controls = document.getElementById('map-controls');
    coords.forEach(p => {
      const marker = L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<strong>${p.name}</strong>`);
      const btn = document.createElement('button');
      btn.className = 'map-btn';
      btn.textContent = p.name;
      btn.addEventListener('click', () => {
        map.flyTo([p.lat,p.lon],16,{duration:1.2});
        marker.openPopup();
      });
      controls.appendChild(btn);
    });
  };
  document.body.appendChild(Lscript);
}

/* ========== SERVICE WORKER registration (also present in HTML inline, but safe to keep) ========== */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW registration failed:', err));
  });
}

