// Menú responsive
const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
});

// Desplazamiento suave
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  nav.classList.remove("show");
}

// Carrusel simple
const slides = document.querySelector(".slides");
const images = document.querySelectorAll(".slides img");
let index = 0;

document.getElementById("next").onclick = () => moveSlide(1);
document.getElementById("prev").onclick = () => moveSlide(-1);

function moveSlide(step) {
  index = (index + step + images.length) % images.length;
  slides.style.transform = `translateX(${-index * 100}%)`;
}

// Mapa Leaflet
const map = L.map("map").setView([-32.6759, -64.9845], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const lugares = [
  ["Oficina de Turismo", -32.67593912959237, -64.9827573475263],
  ["Centro de Salud", -32.67443869375519, -64.98917874386407],
  ["Cuartel de Bomberos", -32.674775098481895, -64.99223512095541],
  ["Municipalidad", -32.675435315762094, -64.9905628812799],
  ["Camping Municipal", -32.676357593243154, -64.98015725138869],
  ["Sendero Principal", -32.68166593499375, -64.96792188822933],
  ["Capilla San Pedro", -32.67490802115624, -64.98848391553396],
  ["Plaza Sarmiento", -32.67490802115624, -64.98848391553396],
  ["Policía", -32.67545456383126, -64.9904955544179],
  ["Acceso al arroyo", -32.67871522849654, -64.98240534153598],
  ["SUM Municipal",-32.67411402758061, -64.98945150465131],
  ["Campo Deportivo Club Papagayos",-32.677929942273124, -64.98046943122368],
  ["Cajero automático Banco Nación", -32.675435315762094, -64.9905628812799],
 ];

lugares.forEach(([nombre, lat, lon]) => {
  L.marker([lat, lon]).addTo(map).bindPopup(`<strong>${nombre}</strong>`);
});

// Centrar el mapa en el punto elegido
function centrarMapa(lat, lon) {
  map.setView([lat, lon], 15);
}
