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
  ["Sala de Primeros Auxilios", -32.67443869375519, -64.98917874386407],
  ["Cuartel de Bomberos", -32.674775098481895, -64.99223512095541],
  ["Municipalidad", -32.675435315762094, -64.9905628812799],
  ["Camping Municipal", -32.676357593243154, -64.98015725138869],
  ["Sendero Principal", -32.68166593499375, -64.96792188822933],
];

lugares.forEach(([nombre, lat, lon]) => {
  L.marker([lat, lon]).addTo(map).bindPopup(`<strong>${nombre}</strong>`);
});

// Centrar el mapa en el punto elegido
function centrarMapa(lat, lon) {
  map.setView([lat, lon], 15);
}
