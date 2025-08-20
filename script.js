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

    // ===== INICIO: LÓGICA PARA PARALLAX EN "ESTRATEGIAS" =====
    
    const strategyBlocks = document.querySelectorAll('.strategy-block');

    // Opciones para el observador: la animación se dispara cuando el 15% del elemento es visible
    const observerOptions = {
        root: null, // Observa en relación con el viewport
        threshold: 0.15 
    };

    const strategyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento está entrando en la pantalla...
            if (entry.isIntersecting) {
                // ...añadimos la clase que activa la animación CSS.
                entry.target.classList.add('is-visible');
                // Dejamos de observar este elemento para que la animación no se repita.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Le decimos al observador que vigile cada uno de los bloques de estrategia.
    strategyBlocks.forEach(block => {
        strategyObserver.observe(block);
    });
    // ===== FIN: LÓGICA PARA PARALLAX EN "ESTRATEGIAS" =====

    const spheres = document.querySelectorAll('.sphere');
    const descriptions = document.querySelectorAll('.sphere-description');
    const defaultMessage = document.getElementById('default-message');
    
    // Function to set active sphere
    function setActiveSphere(sphereId) {
        // Update the spheres visual state
        spheres.forEach(s => {
            if (s.id === sphereId) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    
        // Hide default message
        if (defaultMessage) {
            defaultMessage.classList.remove('active');
        }
    
        // Update the descriptions
        descriptions.forEach(d => {
            if (d.dataset.sphere === sphereId) {
                d.classList.add('active');
            } else {
                d.classList.remove('active');
            }
        });
    }
    
    // FIXED: No default active sphere - users must click first
    // Remove the automatic setActiveSphere('environment') call
    
    // Add click events to spheres
    spheres.forEach(sphere => {
        sphere.addEventListener('click', () => {
            setActiveSphere(sphere.id);
        });
    });

    // ===== FIN: LÓGICA PARA GRÁFICO DE ESFERAS =====

    // ===== INICIO: LÓGICA PARA EL QUIZ INTERACTIVO =====

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizOverlay = document.getElementById('quiz-overlay');
    const closeQuizBtn = document.getElementById('close-quiz-btn');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');
    const quizForm = document.getElementById('quiz-form');
    
    const questionsContainer = document.getElementById('quiz-questions-container');
    const resultsContainer = document.getElementById('quiz-results-container');
    
    const scoreSpan = document.getElementById('quiz-score');
    const resultTitle = document.getElementById('quiz-result-title');
    const feedbackP = document.getElementById('quiz-feedback');
    const tipsP = document.getElementById('quiz-tips');
    
    // Función para abrir el quiz
    startQuizBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quizOverlay.classList.add('is-active');
    });
    
    // Función para cerrar el quiz
    function closeQuiz() {
        quizOverlay.classList.remove('is-active');
        // Resetea el quiz para la próxima vez
        quizForm.reset();
        resultsContainer.style.display = 'none';
        questionsContainer.style.display = 'block';
        // ===== CAMBIO: Elimina todas las selecciones al cerrar =====
        quizForm.querySelectorAll('.is-selected').forEach(label => label.classList.remove('is-selected'));
    }
    closeQuizBtn.addEventListener('click', closeQuiz);
    retakeQuizBtn.addEventListener('click', closeQuiz);
    
    // ===== INICIO CAMBIO: Lógica para el resaltado persistente =====
    const allRadioButtons = quizForm.querySelectorAll('input[type="radio"]');
    
    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            // 1. Obtiene el nombre del grupo de la pregunta (ej. "q1")
            const groupName = event.target.name;
    
            // 2. Encuentra todos los labels DENTRO de ese grupo
            const labelsInGroup = quizForm.querySelectorAll(`input[name="${groupName}"]`);
    
            // 3. Elimina la clase 'is-selected' de todos los labels en ese grupo
            labelsInGroup.forEach(input => {
                input.parentElement.classList.remove('is-selected');
            });
    
            // 4. Añade la clase 'is-selected' solo al label del radio button que fue seleccionado
            event.target.parentElement.classList.add('is-selected');
        });
    });
    // ===== FIN CAMBIO =====
    
    // Lógica para calcular y mostrar los resultados
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        let totalScore = 0;
        const checkedInputs = quizForm.querySelectorAll('input[type="radio"]:checked');
        
        // Validar que todas las preguntas fueron respondidas
        const totalQuestions = 15; // Ajusta si cambias el número de preguntas
        if (checkedInputs.length < totalQuestions) {
            alert("Por favor, responde todas las preguntas antes de ver los resultados.");
            return;
        }
    
        checkedInputs.forEach(input => {
            totalScore += parseInt(input.value);
        });
    
        scoreSpan.textContent = totalScore;
    
        let resultData = {};
    
        if (totalScore >= 15 && totalScore <= 25) {
            resultData = {
                title: "Principiante Verde",
                feedback: "¡Gracias por dar el primer paso hacia una EcoConciencia! Hay muchas oportunidades para que tus acciones diarias marquen una gran diferencia. Tu viaje hacia la sostenibilidad apenas comienza, y cada pequeño cambio cuenta.",
                tips: "Consejos: Empieza por acciones sencillas como separar residuos básicos (papel, plástico) y asegúrate de cerrar siempre el grifo y apagar las luces. ¡Explora la sección 'Estrategias Sostenibles' para más ideas!"
            };
        } else if (totalScore >= 26 && totalScore <= 35) {
            resultData = {
                title: "Eco-Aprendiz",
                feedback: "¡Vas por un excelente camino! Ya tienes una base sólida de prácticas sostenibles. Ahora es el momento de profundizar tu compromiso y explorar nuevas formas de impacto.",
                tips: "Consejos: Intenta hacer una evaluación de los desechos que generas para mejorar tu reciclaje. Explora la captación de agua de lluvia y prefiere siempre los documentos digitales para reducir el uso de papel. ¡Tu participación inspira a otros!"
            };
        } else if (totalScore >= 36 && totalScore <= 45) {
            resultData = {
                title: "Guardián del Planeta",
                feedback: "¡Felicidades, eres un verdadero Guardián del Planeta! Tu compromiso con la sostenibilidad es ejemplar y tus acciones demuestran una profunda conciencia ambiental. Eres un líder y agente de cambio.",
                tips: "Consejos: Continúa fomentando la participación en tu comunidad. Promueve activamente la integración de la sostenibilidad en los planes de estudio y alienta el uso de materiales sostenibles. ¡Sigue sembrando futuro!"
            };
        }
    
        resultTitle.textContent = resultData.title;
        feedbackP.textContent = resultData.feedback;
        tipsP.textContent = resultData.tips;
    
        // Oculta las preguntas y muestra los resultados
        questionsContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
    });
    // ===== FIN: LÓGICA PARA EL QUIZ INTERACTIVO =====
});
