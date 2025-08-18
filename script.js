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

    const trashItems = document.querySelectorAll('.trash-item');
    const trashOverlay = document.querySelector('.trash-overlay');
    let hiddenItems = 0;

    // Solo ejecuta si encontramos los elementos de basura
    if (trashItems.length > 0 && trashOverlay) {
        trashItems.forEach(item => {
            item.addEventListener('click', () => {
                // Añade la clase para iniciar la animación de desaparición
                item.classList.add('is-hidden');
                
                // Contamos cuántos elementos se han ocultado
                hiddenItems++;
                
                // Si todos los elementos han sido ocultados...
                if (hiddenItems === trashItems.length) {
                    // ...esperamos un momento para que la última animación termine y luego ocultamos la capa.
                    setTimeout(() => {
                        trashOverlay.classList.add('is-cleared');
                    }, 500); // 500ms, igual que la duración de la transición en CSS
                }
            });
        });
    }
});
