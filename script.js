// Blog EcoConciencia Joven - JavaScript Functionality
// =====================================================

class EcoBlog {
    constructor() {
        this.currentSection = 'home';
        this.quizData = this.initializeQuizData();
        this.currentQuizQuestion = 0;
        this.quizAnswers = [];
        this.ideas = this.loadIdeas();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSection('home');
        this.initializeCollaborationWall();
        this.addAccessibilityFeatures();
        this.ensureProperInitialPosition(); // Add this line
    }


    setupEventListeners() {
        // Navigation menu events
        document.querySelectorAll('[data-section]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Quiz functionality
        const startQuizBtn = document.getElementById('start-quiz');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => this.startQuiz());
        }

        const quizBackBtn = document.getElementById('quiz-back');
        const quizNextBtn = document.getElementById('quiz-next');
        
        if (quizBackBtn) quizBackBtn.addEventListener('click', () => this.previousQuizQuestion());
        if (quizNextBtn) quizNextBtn.addEventListener('click', () => this.nextQuizQuestion());

        // Collaboration wall functionality
        const submitIdeaBtn = document.getElementById('submit-idea');
        const openCollaborationBtn = document.getElementById('open-collaboration');
        
        if (submitIdeaBtn) {
            submitIdeaBtn.addEventListener('click', () => this.submitIdea());
        }
        
        if (openCollaborationBtn) {
            openCollaborationBtn.addEventListener('click', () => this.toggleCollaborationWall());
        }

        // Video play button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('play-button') || e.target.closest('.play-button')) {
                this.playVideo();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Smooth scroll for internal links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    showSection(sectionName, updateHistory = true) {
        this.showLoading();
        
        setTimeout(() => {
            // Hide all sections
            document.querySelectorAll('.section-template').forEach(section => {
                section.classList.remove('active');
            });
    
            // Show selected section
            const targetSection = document.getElementById(`${sectionName}-template`);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionName;
                
                // Update URL without page reload (only if updateHistory is true)
                if (updateHistory) {
                    history.pushState({ section: sectionName }, '', `#${sectionName}`);
                }
                
                // Update navigation active state
                this.updateNavigationState(sectionName);
                
                // Scroll to content area instead of top of page
                this.scrollToContent();
                
                // Initialize section-specific functionality
                this.initializeSectionFeatures(sectionName);
                
                // Announce section change for screen readers
                this.announceToScreenReader(`Navegando a ${this.getSectionTitle(sectionName)}`);
            }
            
            this.hideLoading();
        }, 300);
    }

    showLoading() {
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.classList.add('show');
        }
    }

    hideLoading() {
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.classList.remove('show');
        }
    }

    scrollToContent() {
    const mainContent = document.getElementById('main-content');
    const headerHeight = 80; // Height of your fixed header
    
    if (mainContent) {
        // Calculate the position to scroll to (just below the header)
        const targetPosition = mainContent.offsetTop - headerHeight;
        
        // Smooth scroll to the calculated position
        window.scrollTo({ 
            top: Math.max(0, targetPosition), 
            behavior: 'smooth' 
        });
        
        // Alternative approach: scroll to main content directly
        // mainContent.scrollIntoView({ 
        //     behavior: 'smooth', 
        //     block: 'start' 
        // });
        }
    }
    
    updateNavigationState(activeSection) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection) {
                item.classList.add('active');
            }
        });
    }

    initializeSectionFeatures(sectionName) {
        switch(sectionName) {
            case 'activities':
                this.initializeActivitiesSection();
                break;
            case 'video':
                this.initializeVideoSection();
                break;
            case 'strategies':
                this.initializeStrategiesAnimations();
                break;
            case 'footprint':
                this.initializeFootprintAnimations();
                break;
        }
    }

    // Quiz Functionality
    initializeQuizData() {
        return [
            {
                question: "¿Cierras el grifo mientras te cepillas los dientes?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "agua"
            },
            {
                question: "¿Apagas las luces al salir de una habitación?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "energia"
            },
            {
                question: "¿Separas la basura para reciclar en tu hogar?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "residuos"
            },
            {
                question: "¿Con qué frecuencia usas transporte público o bicicleta?",
                options: ["Muy frecuentemente", "Frecuentemente", "Poco frecuente", "Nunca"],
                points: [3, 2, 1, 0],
                category: "transporte"
            },
            {
                question: "¿Desconectas los aparatos electrónicos cuando no los usas?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "energia"
            },
            {
                question: "¿Prefieres productos con menos empaque o empaque reciclable?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "consumo"
            },
            {
                question: "¿Reutilizas objetos antes de desecharlos?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "residuos"
            },
            {
                question: "¿Tomas duchas cortas para ahorrar agua?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "agua"
            },
            {
                question: "¿Prefieres documentos digitales en lugar de impresos?",
                options: ["Siempre", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "papel"
            },
            {
                question: "¿Participas en actividades ambientales de tu comunidad?",
                options: ["Frecuentemente", "A veces", "Rara vez", "Nunca"],
                points: [3, 2, 1, 0],
                category: "participacion"
            }
        ];
    }

    startQuiz() {
        this.currentQuizQuestion = 0;
        this.quizAnswers = [];
        
        const activitiesContainer = document.querySelector('.activities-container');
        const quizContainer = document.getElementById('quiz-container');
        
        if (activitiesContainer && quizContainer) {
            activitiesContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            this.showQuizQuestion();
        }
    }

    showQuizQuestion() {
        const question = this.quizData[this.currentQuizQuestion];
        const quizContent = document.getElementById('quiz-content');
        const progressFill = document.getElementById('progress-fill');
        const questionCounter = document.getElementById('question-counter');
        const quizBackBtn = document.getElementById('quiz-back');
        const quizNextBtn = document.getElementById('quiz-next');

        if (!question || !quizContent) return;

        // Update progress
        const progress = ((this.currentQuizQuestion + 1) / this.quizData.length) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (questionCounter) questionCounter.textContent = `${this.currentQuizQuestion + 1} / ${this.quizData.length}`;

        // Create question HTML
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h4>${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option">
                            <input type="radio" name="quiz-answer" value="${index}">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Update button states
        if (quizBackBtn) {
            quizBackBtn.disabled = this.currentQuizQuestion === 0;
        }
        
        if (quizNextBtn) {
            quizNextBtn.textContent = this.currentQuizQuestion === this.quizData.length - 1 ? 'Finalizar' : 'Siguiente';
        }

        // Pre-select previous answer if exists
        if (this.quizAnswers[this.currentQuizQuestion] !== undefined) {
            const radioBtn = quizContent.querySelector(`input[value="${this.quizAnswers[this.currentQuizQuestion]}"]`);
            if (radioBtn) radioBtn.checked = true;
        }
    }

    nextQuizQuestion() {
        const selectedAnswer = document.querySelector('input[name="quiz-answer"]:checked');
        
        if (selectedAnswer) {
            this.quizAnswers[this.currentQuizQuestion] = parseInt(selectedAnswer.value);
            
            if (this.currentQuizQuestion < this.quizData.length - 1) {
                this.currentQuizQuestion++;
                this.showQuizQuestion();
            } else {
                this.finishQuiz();
            }
        } else {
            this.showNotification('Por favor, selecciona una respuesta', 'warning');
        }
    }

    previousQuizQuestion() {
        if (this.currentQuizQuestion > 0) {
            this.currentQuizQuestion--;
            this.showQuizQuestion();
        }
    }

    finishQuiz() {
        const results = this.calculateQuizResults();
        this.showQuizResults(results);
    }

    calculateQuizResults() {
        let totalScore = 0;
        const categoryScores = {};

        this.quizAnswers.forEach((answerIndex, questionIndex) => {
            const question = this.quizData[questionIndex];
            const points = question.points[answerIndex];
            totalScore += points;

            if (!categoryScores[question.category]) {
                categoryScores[question.category] = { score: 0, max: 0 };
            }
            categoryScores[question.category].score += points;
            categoryScores[question.category].max += Math.max(...question.points);
        });

        const maxScore = this.quizData.length * 3;
        const percentage = Math.round((totalScore / maxScore) * 100);

        let level = '';
        let message = '';
        let recommendations = [];

        if (percentage >= 80) {
            level = '¡Guardián del Planeta! 🌍';
            message = 'Excelente trabajo. Eres un verdadero líder ambiental.';
            recommendations = [
                'Continúa inspirando a otros con tu ejemplo',
                'Considera liderar proyectos ambientales en tu comunidad',
                'Comparte tus conocimientos con amigos y familia'
            ];
        } else if (percentage >= 60) {
            level = 'Eco-Warrior en Desarrollo 🌱';
            message = 'Buen trabajo. Estás en el camino correcto hacia la sostenibilidad.';
            recommendations = [
                'Trabaja en ser más consistente con tus hábitos verdes',
                'Explora nuevas formas de reducir tu huella ecológica',
                'Únete a grupos ambientales locales'
            ];
        } else if (percentage >= 40) {
            level = 'Aprendiz Verde 🌿';
            message = 'Tienes potencial. Es hora de intensificar tus esfuerzos ambientales.';
            recommendations = [
                'Comienza con cambios pequeños pero consistentes',
                'Edúcate más sobre prácticas sostenibles',
                'Establece metas ambientales semanales'
            ];
        } else {
            level = 'Futuro Eco-Héroe 🌟';
            message = 'Todo héroe tiene un comienzo. ¡Es tu momento de brillar!';
            recommendations = [
                'Comienza con un hábito verde a la vez',
                'Lee más sobre el impacto ambiental',
                'Busca inspiración en historias de éxito ambiental'
            ];
        }

        return {
            totalScore,
            maxScore,
            percentage,
            level,
            message,
            recommendations,
            categoryScores
        };
    }

    showQuizResults(results) {
        const quizContent = document.getElementById('quiz-content');
        const quizControls = document.querySelector('.quiz-controls');

        if (!quizContent) return;

        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="result-header">
                    <h3>¡Resultados de tu Evaluación!</h3>
                    <div class="result-score">
                        <div class="score-circle">
                            <span class="score-number">${results.percentage}%</span>
                        </div>
                        <div class="score-level">${results.level}</div>
                    </div>
                </div>
                
                <div class="result-message">
                    <p>${results.message}</p>
                </div>
                
                <div class="result-recommendations">
                    <h4>🎯 Recomendaciones para mejorar:</h4>
                    <ul>
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="result-categories">
                    <h4>📊 Tu rendimiento por área:</h4>
                    <div class="categories-grid">
                        ${Object.entries(results.categoryScores).map(([category, data]) => {
                            const categoryPercentage = Math.round((data.score / data.max) * 100);
                            const categoryName = this.getCategoryName(category);
                            return `
                                <div class="category-result">
                                    <div class="category-name">${categoryName}</div>
                                    <div class="category-bar">
                                        <div class="category-fill" style="width: ${categoryPercentage}%"></div>
                                    </div>
                                    <div class="category-percentage">${categoryPercentage}%</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        if (quizControls) {
            quizControls.innerHTML = `
                <button class="btn-primary" onclick="ecoBlog.restartQuiz()">
                    <i class="fas fa-redo"></i>
                    Repetir Cuestionario
                </button>
                <button class="btn-secondary" onclick="ecoBlog.backToActivities()">
                    <i class="fas fa-arrow-left"></i>
                    Volver a Actividades
                </button>
            `;
        }

        // Add CSS for quiz results
        this.addQuizResultsStyles();
        
        // Show success notification
        this.showNotification('¡Cuestionario completado! Revisa tus resultados.', 'success');
    }

    getCategoryName(category) {
        const categories = {
            'agua': '💧 Uso del Agua',
            'energia': '⚡ Consumo Energético',
            'residuos': '♻️ Gestión de Residuos',
            'transporte': '🚲 Transporte Sostenible',
            'consumo': '🛒 Consumo Responsable',
            'papel': '📄 Uso del Papel',
            'participacion': '🤝 Participación Comunitaria'
        };
        return categories[category] || category;
    }

    addQuizResultsStyles() {
        if (!document.getElementById('quiz-results-styles')) {
            const styles = document.createElement('style');
            styles.id = 'quiz-results-styles';
            styles.textContent = `
                .quiz-results {
                    text-align: center;
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .result-header {
                    margin-bottom: 2rem;
                }
                
                .result-score {
                    margin: 1.5rem 0;
                }
                
                .score-circle {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-green), var(--light-green));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    animation: gentle-pulse 2s ease-in-out infinite;
                }
                
                .score-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: white;
                }
                
                .score-level {
                    font-size: 1.3rem;
                    color: var(--primary-green);
                    font-weight: bold;
                }
                
                .result-message {
                    background: var(--light-gray);
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    margin: 1.5rem 0;
                }
                
                .result-recommendations {
                    text-align: left;
                    margin: 1.5rem 0;
                }
                
                .result-recommendations h4 {
                    color: var(--primary-green);
                    margin-bottom: 1rem;
                }
                
                .result-recommendations ul {
                    list-style: none;
                    padding: 0;
                }
                
                .result-recommendations li {
                    background: #f0f8e8;
                    margin: 0.5rem 0;
                    padding: 0.75rem;
                    border-radius: var(--border-radius-small);
                    border-left: 3px solid var(--accent-green);
                }
                
                .result-categories {
                    text-align: left;
                    margin-top: 2rem;
                }
                
                .result-categories h4 {
                    color: var(--primary-green);
                    margin-bottom: 1rem;
                }
                
                .categories-grid {
                    display: grid;
                    gap: 1rem;
                }
                
                .category-result {
                    display: grid;
                    grid-template-columns: 1fr 2fr auto;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    padding: 1rem;
                    border-radius: var(--border-radius-small);
                    box-shadow: var(--shadow-light);
                }
                
                .category-name {
                    font-weight: 600;
                    color: var(--primary-green);
                }
                
                .category-bar {
                    height: 8px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .category-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-green), var(--light-green));
                    transition: width 1s ease-out;
                    border-radius: 4px;
                }
                
                .category-percentage {
                    font-weight: bold;
                    color: var(--primary-green);
                    min-width: 40px;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    restartQuiz() {
        this.startQuiz();
    }

    backToActivities() {
        const activitiesContainer = document.querySelector('.activities-container');
        const quizContainer = document.getElementById('quiz-container');
        
        if (activitiesContainer && quizContainer) {
            activitiesContainer.style.display = 'grid';
            quizContainer.style.display = 'none';
        }
    }

    // Collaboration Wall Functionality
    initializeCollaborationWall() {
        this.renderIdeas();
    }

    loadIdeas() {
        // In a real application, this would load from a database
        // For demo purposes, we'll use some sample ideas
        return [
            {
                id: 1,
                content: "¿Qué tal si creamos un huerto vertical en el aula usando botellas de plástico recicladas? Podríamos plantar hierbas aromáticas y verduras pequeñas.",
                author: "Ana M.",
                timestamp: new Date(Date.now() - 86400000), // 1 day ago
                likes: 12,
                liked: false
            },
            {
                id: 2,
                content: "Propongo organizar un 'Día sin plástico' mensual en el colegio, donde todos traigamos nuestros almuerzos en contenedores reutilizables.",
                author: "Carlos R.",
                timestamp: new Date(Date.now() - 172800000), // 2 days ago
                likes: 8,
                liked: true
            },
            {
                id: 3,
                content: "¿Y si instalamos estaciones de reciclaje creativas en cada salón? Podríamos decorarlas con arte hecho de materiales reciclados.",
                author: "Lucia P.",
                timestamp: new Date(Date.now() - 259200000), // 3 days ago
                likes: 15,
                liked: false
            }
        ];
    }

    submitIdea() {
        const ideaInput = document.getElementById('idea-input');
        const ideaText = ideaInput.value.trim();

        if (ideaText) {
            const newIdea = {
                id: this.ideas.length + 1,
                content: ideaText,
                author: "Tú",
                timestamp: new Date(),
                likes: 0,
                liked: false
            };

            this.ideas.unshift(newIdea);
            ideaInput.value = '';
            this.renderIdeas();
            this.showNotification('¡Idea publicada exitosamente!', 'success');
            
            // Animate the new idea
            setTimeout(() => {
                const firstIdea = document.querySelector('.idea-item');
                if (firstIdea) {
                    firstIdea.style.animation = 'slideInFromTop 0.5s ease-out';
                }
            }, 100);
        } else {
            this.showNotification('Por favor, escribe tu idea antes de publicar', 'warning');
        }
    }

    renderIdeas() {
        const ideasContainer = document.getElementById('ideas-container');
        if (!ideasContainer) return;

        ideasContainer.innerHTML = this.ideas.map(idea => `
            <div class="idea-item" data-idea-id="${idea.id}">
                <div class="idea-content">${idea.content}</div>
                <div class="idea-meta">
                    <span class="idea-author">Por: ${idea.author}</span>
                    <span class="idea-time">${this.formatTimeAgo(idea.timestamp)}</span>
                    <span class="idea-likes ${idea.liked ? 'liked' : ''}" onclick="ecoBlog.toggleIdeaLike(${idea.id})">
                        <i class="fas fa-heart"></i>
                        <span>${idea.likes}</span>
                    </span>
                </div>
            </div>
        `).join('');
    }

    toggleIdeaLike(ideaId) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (idea) {
            if (idea.liked) {
                idea.likes--;
                idea.liked = false;
            } else {
                idea.likes++;
                idea.liked = true;
            }
            this.renderIdeas();
        }
    }

    toggleCollaborationWall() {
        const collaborationWall = document.getElementById('collaboration-wall');
        if (collaborationWall) {
            const isVisible = collaborationWall.style.display !== 'none';
            collaborationWall.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                collaborationWall.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'hace un momento';
    }

    // Video Functionality
    playVideo() {
        this.showNotification('En una implementación real, aquí se reproduciría el video educativo', 'info');
        // In a real implementation, this would open a video player or redirect to a video platform
    }

    // Section-specific Initializations
    initializeActivitiesSection() {
        // Add any specific animations or interactions for activities
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });
    }

    initializeVideoSection() {
        // Add video section specific functionality
        const videoPlaceholder = document.querySelector('.video-placeholder');
        if (videoPlaceholder) {
            videoPlaceholder.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            videoPlaceholder.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    }

    initializeStrategiesAnimations() {
        // Animate strategy cards on scroll
        const strategyCards = document.querySelectorAll('.strategy-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        strategyCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });
    }

    initializeFootprintAnimations() {
        // Animate statistics on scroll
        const statCards = document.querySelectorAll('.stat-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-stat');
                }
            });
        });

        statCards.forEach(card => observer.observe(card));
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification styles if not already present
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    max-width: 400px;
                    background: white;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-heavy);
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    animation: slideInRight 0.3s ease-out;
                    border-left: 4px solid var(--primary-green);
                }
                
                .notification-success {
                    border-left-color: var(--success);
                }
                
                .notification-error {
                    border-left-color: var(--danger);
                }
                
                .notification-warning {
                    border-left-color: var(--warning);
                }
                
                .notification-info {
                    border-left-color: var(--ocean-blue);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                
                .notification-content i {
                    font-size: 1.2rem;
                }
                
                .notification-success i {
                    color: var(--success);
                }
                
                .notification-error i {
                    color: var(--danger);
                }
                
                .notification-warning i {
                    color: var(--warning);
                }
                
                .notification-info i {
                    color: var(--ocean-blue);
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--gray);
                    font-size: 1.1rem;
                    padding: 0.25rem;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-fast);
                }
                
                .notification-close:hover {
                    background: var(--light-gray);
                    color: var(--dark-gray);
                }
                
                .notification.fade-out {
                    animation: fadeOut 0.3s ease-out;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
                
                @media (max-width: 480px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Keyboard Navigation
    handleKeyboardNavigation(e) {
        // ESC key to close modals/overlays
        if (e.key === 'Escape') {
            const quizContainer = document.getElementById('quiz-container');
            if (quizContainer && quizContainer.style.display !== 'none') {
                this.backToActivities();
            }
        }

        // Number keys for quick navigation (1-6 for sections)
        if (e.key >= '1' && e.key <= '6' && !e.target.matches('input, textarea')) {
            const sections = ['home', 'sustainability', 'footprint', 'strategies', 'video', 'activities'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                this.showSection(sections[sectionIndex]);
            }
        }
    }

    // Accessibility Features
    addAccessibilityFeatures() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-green);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add ARIA labels and roles where needed
        this.enhanceAccessibility();

        // Announce section changes for screen readers
        this.createScreenReaderAnnouncer();
    }

    enhanceAccessibility() {
        // Add ARIA labels to navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const sectionName = item.getAttribute('data-section');
            item.setAttribute('aria-label', `Navegar a ${this.getSectionTitle(sectionName)}`);
        });

        // Add main landmark
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
        }

        // Add navigation landmark
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.setAttribute('role', 'navigation');
            navbar.setAttribute('aria-label', 'Navegación principal');
        }
    }

    createScreenReaderAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    getSectionTitle(sectionName) {
        const titles = {
            'home': 'Inicio',
            'sustainability': '¿Qué es la Sostenibilidad?',
            'footprint': 'Nuestra Huella Ecológica',
            'strategies': 'Estrategias Sostenibles',
            'video': 'Video Destacado',
            'activities': 'Actividades Interactivas'
        };
        return titles[sectionName] || sectionName;
    }

    // Handle browser back/forward buttons
    handleBrowserNavigation() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false); // Don't update history on browser navigation
            } else {
                // Handle initial page load or hash navigation
                const hash = window.location.hash.substring(1);
                if (hash && document.getElementById(`${hash}-template`)) {
                    this.showSection(hash, false); // Don't update history on initial load
                }
            }
        });
    
        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(`${hash}-template`)) {
                this.showSection(hash, false); // Don't update history on initial load
            } else {
                // If no hash, ensure we're at the top and show home
                this.scrollToContent();
            }
        });
    }

    ensureProperInitialPosition() {
        // Wait for the page to fully load, then ensure proper positioning
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.scrollToContent();
            }, 100);
        });
    }
    
    // Initialize lazy loading for images
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Performance monitoring
    logPerformanceMetrics() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
            });
        }
    }
}

// Additional utility functions for animations and effects
function addCustomAnimationStyles() {
    if (!document.getElementById('custom-animations')) {
        const styles = document.createElement('style');
        styles.id = 'custom-animations';
        styles.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out backwards;
            }
            
            .animate-stat {
                animation: bounceIn 0.8s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes bounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0.3);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.05);
                }
                70% {
                    transform: scale(0.9);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes slideInFromTop {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Initialize the blog when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add custom animation styles
    addCustomAnimationStyles();
    
    // Initialize the blog
    window.ecoBlog = new EcoBlog();
    
    // Handle browser navigation
    ecoBlog.handleBrowserNavigation();
    
    // Initialize lazy loading
    ecoBlog.initializeLazyLoading();
    
    // Log performance metrics in development
    if (window.location.hostname === 'localhost') {
        ecoBlog.logPerformanceMetrics();
    }
    
    console.log('🌱 EcoConciencia Joven blog initialized successfully!');
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
