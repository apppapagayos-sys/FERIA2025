// Esperamos que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
    // Seleccionamos el botón de abrir/cerrar la barra lateral
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    // Agregamos el evento de clic al botón de la barra lateral
    toggleButton.addEventListener('click', function(event) {
        // Alternamos la clase 'open' para abrir o cerrar la barra lateral
        sidebar.classList.toggle('open');
        // Detenemos la propagación para que el clic en el botón no se registre en el documento
        event.stopPropagation();
    });

    // Detecta clics en cualquier parte del documento
    document.addEventListener('click', function(event) {
        // Si el sidebar está abierto y el clic ocurrió fuera de él, lo cerramos
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });
});
