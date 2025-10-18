// Animación de aparición suave
window.addEventListener('load', () => {
  document.body.style.opacity = 1;
});

// Desplazamiento suave entre secciones
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Botón de agradecimiento
function mostrarAgradecimiento() {
  alert("Gracias por contactarte con Tambo El Caranday 🧡");
}

