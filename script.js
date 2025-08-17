document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Función para mostrar la sección basada en el hash de la URL
    const showSectionFromHash = () => {
        const hash = window.location.hash || '#inicio';
        
        // Ocultar todas las secciones
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Quitar la clase 'active' de todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Encontrar la sección y el enlace correspondientes y activarlos
        const targetSection = document.querySelector(hash);
        const targetLink = document.querySelector(`a[href="${hash}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }
        if (targetLink) {
            targetLink.classList.add('active');
        }
    };

    // Añadir evento de clic a cada enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir el comportamiento de anclaje por defecto
            const targetId = link.getAttribute('href');
            
            // Actualizar el hash de la URL sin recargar la página
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                window.location.hash = targetId;
            }
            
            // Mostrar la sección correcta
            showSectionFromHash();
        });
    });

    // Escuchar cambios en el hash (para botones de retroceso/avance del navegador)
    window.addEventListener('popstate', showSectionFromHash);

    // Mostrar la sección inicial al cargar la página
    showSectionFromHash();
});
