// Lista de estudiantes (ordenados alfabéticamente por apellido)
const estudiantes = [
  "Felipe Amarillo",
  "Leonardo Andrada",
  "Ysabella Barraza",
  "Antonella Bertolini",
  "María José Bianchi",
  "Lucyla Sosa",
  "Mia Tolosa",
  "Mabel Vargas",
  "Turismo Papagayos" // agregado correctamente al final
];

// Contenedor del grid
const grid = document.getElementById("projectGrid");

// Crear dinámicamente las tarjetas
estudiantes.forEach(nombre => {
  const carpeta = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/\s+/g, "-"); // reemplaza espacios por guiones

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${nombre}</h3>
    <a href="${carpeta}/index.html" target="_blank">Ver proyecto</a>
  `;

  grid.appendChild(card);
});
