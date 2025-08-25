// Variables globales
let currentView = 'home';
let isMenuOpen = false;
let viewHistory = [];
let previousViews = ['home']; // Nuevo array para llevar registro de vistas anteriores
let currentCategory = null; // Nueva variable para mantener registro de la categoría actual
let basicActions = null;
let foodDrinks = null;
let emotionsSensations = null;
let familyRelations = null;
let usefulPhrases = null;
let places = null;
let commonObjects = null;
let commonQuestions = null;
let greetingsIntroductions = null;

// Variables globales para los juegos
let quizAlphabet = null;
let quizNumbers = null;
let memoryGame = null;

// Función para cerrar el menú
function closeMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (sideMenu && menuOverlay) {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
        
        // Añadir clase para animación de salida
        sideMenu.style.transform = 'translateX(-100%)';
    }
}

// Event Listeners cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const sideMenu = document.getElementById('sideMenu');
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const navItems = document.querySelectorAll('.nav-item, .menu-item');
    const contentViews = document.querySelectorAll('.content-view');
    
    // Función para abrir el menú
    function openMenu() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
        
        // Añadir clase para animación de entrada
        sideMenu.style.transform = 'translateX(0)';
    }
    
    // Eventos para abrir y cerrar el menú
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
    });
    
    closeMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });
    
    menuOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });
    
    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !sideMenu.contains(e.target) && e.target !== menuBtn) {
            closeMenu();
        }
    });
    
    // Manejar navegación en la barra inferior y menú lateral
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const section = item.dataset.section;
            
            // Actualizar elementos activos en la navegación
            navItems.forEach(ni => {
                if (ni.dataset.section === section) {
                    ni.classList.add('active');
                } else {
                    ni.classList.remove('active');
                }
            });
            
            // Navegar a la sección y cerrar el menú
            navigateToSection(section);
            closeMenu();
        });
    });

    // Inicializar categorías
    initCategories();
    
    // Configurar reconocimiento de gestos
    setupGestureRecognition();
    
    // Configurar el botón de retroceso del navegador
    setupBackButtonBehavior();
    
    // Verificar si los elementos se están seleccionando correctamente
    console.log('Menu Button:', menuBtn);
    console.log('Close Menu Button:', closeMenuBtn);
    console.log('Side Menu:', sideMenu);
    console.log('Menu Overlay:', menuOverlay);
});

// Configuración de reconocimiento de gestos
function setupGestureRecognition() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('Error: mainContent element not found');
        return;
    }
    
    const hammer = new Hammer(mainContent);
    
    hammer.on('swipeleft swiperight', function(ev) {
        if (currentView !== 'home') {
            if (ev.type === 'swiperight') {
                navigateBack();
            }
        }
    });
    
    // Gestos para el menú lateral
    const body = document.body;
    const sideMenuHammer = new Hammer(body);
    
    sideMenuHammer.on('swiperight', (e) => {
        if (e.center.x < 50 && !isMenuOpen) {
            const menuBtn = document.getElementById('menuBtn');
            if (menuBtn) menuBtn.click();
        }
    });
    
    sideMenuHammer.on('swipeleft', () => {
        if (isMenuOpen) {
            const closeMenuBtn = document.getElementById('closeMenuBtn');
            if (closeMenuBtn) closeMenuBtn.click();
        }
    });
}

// Configuración del comportamiento del botón atrás
function setupBackButtonBehavior() {
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.view) {
            if (previousViews.length > 0) {
                const lastView = previousViews.pop();
                if (lastView === 'detail') {
                    // Si estamos volviendo desde un detalle, volver a la última categoría
                    const lastCategory = previousViews[previousViews.length - 1];
                    changeView(lastCategory || 'home', true);
                } else {
                    changeView(lastView, true);
                }
            } else {
                changeView(event.state.view, true);
            }
        } else {
            changeView('home', true);
        }
    });
}

// Inicializa categorías con efectos visuales
function initCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        // Añadir efecto hover con sombra y elevación
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = 'var(--shadow-sm)';
        });

        // Añadir efecto click
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
    
    // Inicializar accesos rápidos
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.95)';
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// Función para navegar a una sección específica
function navigateToSection(section) {
    // Guardar vista actual en historial
    if (currentView && currentView !== section) {
        previousViews.push(currentView);
    }

    // Ocultar todas las vistas
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar la vista seleccionada
    const selectedView = document.getElementById(`${section}View`);
    if (selectedView) {
        selectedView.classList.add('active');
        loadSectionContent(section);
    }

    // Actualizar el menú lateral
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });

    // Actualizar vista actual
    currentView = section;

    // Cerrar el menú si está abierto
    closeMenu();

    // Actualizar historial del navegador solo si no es una navegación back
    if (!viewHistory.includes(section)) {
        history.pushState({ view: section }, '', `#${section}`);
    }
}

// Función para cargar el contenido de una sección
function loadSectionContent(section) {
    switch(section) {
        case 'alfabeto':
            generateAlphabetContent();
            break;
        case 'numeros':
            generateNumbersContent();
            break;
        case 'saludos':
            generateGreetingsContent();
            break;
        case 'practica':
            generatePracticeContent();
            break;
        case 'acciones':
            generateActionsContent();
            break;
        case 'alimentos':
            generateFoodDrinksContent();
            break;
        case 'emociones':
            generateEmotionsContent();
            break;
        case 'familia':
            generateFamilyRelationsContent();
            break;
        case 'frases':
            generateUsefulPhrasesContent();
            break;
        case 'lugares':
            generatePlacesContent();
            break;
        case 'objetos':
            generateCommonObjectsContent();
            break;
        case 'preguntas':
            generateCommonQuestionsContent();
            break;
        case 'detalles':
            generateDetailsContent();
            break;
    }
}

// Función para mostrar el detalle de una seña
function showSignDetail(section, itemId) {
    currentSection = section;
    currentItemId = itemId;
    navigateToSection('details');
}

// Función para limpiar event listeners cuando se cambia de vista
function cleanupEventListeners() {
    // Limpiar event listeners específicos de cada vista
    const oldContent = document.querySelector('.content-view.active');
    if (oldContent) {
        // Clonar y reemplazar elementos con event listeners
        const buttons = oldContent.querySelectorAll('button, video, .action-item');
        buttons.forEach(button => {
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
        });

        // Remover event listeners de videos
        const videos = oldContent.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.removeAttribute('src');
            video.load();
        });
    }
}

// Modificar la función changeView para manejar mejor el historial
function changeView(section, isPopState = false) {
    if (section === 'profile') return;
    
    const previousView = document.querySelector('.content-view.active');
    const nextView = document.getElementById(`${section}View`);
    
    if (!nextView) return;
    
    // Limpiar event listeners antes de cambiar de vista
    cleanupEventListeners();
    
    // Actualizar navegación activa
    const navItems = document.querySelectorAll('.nav-item:not([data-section="profile"]), .menu-item:not([data-section="profile"])');
    navItems.forEach(item => {
        if (item.dataset.section === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Remover la clase active del view anterior
    if (previousView) {
        previousView.classList.remove('active');
        // Limpiar contenido si es necesario
        if (previousView !== nextView) {
            const videos = previousView.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
                video.removeAttribute('src');
                video.load();
            });
        }
    }
    
    // Activar nueva vista
    nextView.classList.add('active');
    
    // Actualizar vista actual
    currentView = section;
    
    // Inicializar elementos después del cambio de vista
    setTimeout(() => {
        initializeSectionElements(section);
    }, 100);
}

// Función para cargar el contenido de cada sección
function loadSectionContent(section) {
    const view = document.getElementById(`${section}View`);
    if (!view) return;
    
    switch(section) {
        case 'alfabeto':
            view.innerHTML = generateAlphabetContent();
            break;
        case 'numeros':
            view.innerHTML = generateNumbersContent();
            break;
        case 'acciones':
            view.innerHTML = generateActionsContent();
            break;
        case 'alimentos':
            view.innerHTML = generateFoodDrinksContent();
            break;
        case 'emociones':
            view.innerHTML = generateEmotionsSensationsContent();
            break;
        case 'familia':
            view.innerHTML = generateFamilyRelationsContent();
            break;
        case 'frases':
            view.innerHTML = generateUsefulPhrasesContent();
            break;
        case 'lugares':
            view.innerHTML = generatePlacesContent();
            break;
        case 'objetos':
            view.innerHTML = generateCommonObjectsContent();
            break;
        case 'preguntas':
            view.innerHTML = generateCommonQuestionsContent();
            break;
        case 'saludos':
            view.innerHTML = generateGreetingsIntroductionsContent();
            break;
        case 'practica':
            view.innerHTML = generatePracticeContent();
            break;
        case 'detalles':
            view.innerHTML = generateDetailsContent();
            break;
        case 'search':
            view.innerHTML = generateSearchContent();
            break;
    }

    // Inicializar elementos específicos de la sección
    initializeSectionElements(section);
}

// Generadores de contenido específico
function generateAlphabetContent() {
    const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Alfabeto en LSC</h2>
        </div>
        <div class="letters-container">
            <div class="letters-grid">
                ${letters.map(letter => `
                    <div class="letter-card" onclick="showLetterDetail('${letter}')">
                        <div class="letter-preview">
                            <span>${letter}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateNumbersContent() {
    const numbers = Array.from({length: 11}, (_, i) => i);
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Números en LSC</h2>
        </div>
        <div class="numbers-grid">
            ${numbers.map(number => `
                <div class="number-card" onclick="showNumberDetail(${number})">
                    <div class="number-preview">
                        <span>${number}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateGreetingsIntroductionsContent() {
    if (!greetingsIntroductions) {
        greetingsIntroductions = new GreetingsIntroductions();
    }
    
    const items = greetingsIntroductions.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Saludos y Presentaciones en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para saludar y presentarte en Lengua de Señas Colombiana.</p>
                <p>Selecciona una expresión para ver su video y practicar.</p>
            </div>
            <div class="actions-list greetings-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showGreetingIntroductionDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function generatePracticeContent() {
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Práctica</h2>
        </div>
        <div class="practice-options">
            <div class="practice-card" onclick="startQuiz('alfabeto')">
                <div class="practice-icon">
                    <i class="bi bi-alphabet"></i>
                </div>
                <h3>Quiz del Alfabeto</h3>
                <p>Pon a prueba tu conocimiento del alfabeto en LSC</p>
            </div>
            <div class="practice-card" onclick="startQuiz('numeros')">
                <div class="practice-icon">
                    <i class="bi bi-123"></i>
                </div>
                <h3>Quiz de Números</h3>
                <p>Practica los números en LSC</p>
            </div>
            <div class="practice-card" onclick="startMemoryGame()">
                <div class="practice-icon">
                    <i class="bi bi-grid-3x3-gap"></i>
                </div>
                <h3>Juego de Memoria</h3>
                <p>Encuentra las parejas de señas</p>
            </div>
        </div>
    `;
}

function generateDetailsContent() {
    return `
        <div class="section-header">
            <h2>Acerca de</h2>
        </div>
        <div class="about-container">
            <div class="about-logo-section">
                <img src="assets/images/icons/Logo.png" alt="Logo LSC" class="about-logo">
            </div>
            
            <div class="about-content">
                <h3>Aprende LSC</h3>
                <p class="app-version">Versión 1.0.0</p>
                
                <div class="about-description">
                    <p>¡Bienvenid@ a SEÑAAP-LSC!</p>
                    <p>SEÑAPP LSC es una aplicación interactiva diseñada para acercarte a la Lengua de Señas Colombiana (LSC) de una manera fácil y divertida. Con este recurso educativo, podrás aprender el alfabeto, numeros, frases y situaciones cotidianas en LSC, facilitando la comunicación entre personas con discapacidad auditiva (PcD), sus familiares, docentes y cualquier persona interesada en mejorar la inclusión y la comunicación interpersonal.</p>
                    <p>Nuestra misión es brindar una herramienta accesible y dinámica que contribuya a derribar barreras en la comunicación y promueva la inclusión de la comunidad sorda en diferentes espacios de la sociedad.</p>
                    <p>(SEÑAPP LSC)© 2025 es un producto del Tercer Laboratorio de Innovación Educativa "Herramientas didácticas para una generación digital", convocado por La Cátedra UNESCO Movimiento Educativo Abierto para América Latina del Tecnológico de Monterrey y la Especialización en Pedagogía de la Facultad de Ciencias Sociales y Humanidades de la Corporación Universitaria Autónoma del Cauca, con apoyo del Centro Universitario de la Universidad Autónoma del Estado de México - Texcoco, la Universidad Francisco de Paula Santander y la Universidad Filadelfia de México. En el marco del proyecto educativo "Herramientas didácticas para una generación digital"</p>
                </div>

                <div class="about-team">
                    <h4>Promotoras:</h4>
                    <div class="team-members">
                        <p>Angelica Rengifo Velasco</p>
                        <p>Royer Danovic Medina Rengifo</p>
                        <p>Ángel David Benavides Pino</p>
                        <p>Luisa Fernanda Ibarra Perez</p>
                        <p>Leidy Muñoz Ledezma</p>
                        <p>Karen Stefanny Navia Rivas</p>
                        <p>Kelly Bridney Guerra Rios</p>
                        <p>Mayra Isabel Hurtado Ordoñez</p>
                        <p>Juan David Vargas Muños</p>
                        <p>Jhon Ferney Rodríguez Castaño</p>
                        <p>Lida Maritza Erazo Escobar</p>
                        <p>Estefanía Blandón</p>
                        <p>Kelly Sánchez</p>
                    </div>
                </div>
                <div class="about-team">
                    <h4>Desarrolladores</h4>
                    <div class="team-members">
                        <p>Royer Danovic Medina Rengifo</p>
                        <p>Ángel David Benavides Pino</p>
                    </div>
                </div>

                <div class="about-mentor">
                    <h4>Mentor/a:</h4>
                    <div class="mentor-members">
                        <p>Kelly Sánchez: Magister</p>
                        <p>Luz Marina Chalapud Narváez</p>
                    </div>
                </div>

                <div class="about-contact">
                    <h4>Contacto</h4>
                    <div class="contact-info">
                        <p>leidy.munoz.l@uniautonoma.edu.co</p>
                        <p>angelica.rengifo.v@uniautnoma.edu.co</p>
                        <p>luisa.ibarra.p@uniautonoma.edu.co</p>
                        <p>karen.navia.r@uniautonoma.edu.co</p>
                        <p>kelly.guerra.r@uniautonoma.edu.co</p>
                    </div>
                </div>

                <div class="about-footer">
                    <p>Gracias por ser parte de este viaje hacia una comunicación más inclusiva. ¡Explora, aprende y comparte con SEÑAAP-LSC!</p>
                </div>
            </div>
        </div>
    `;
}

function generateSearchContent() {
    return `
        <div class="section-header">
            <h2>Buscar</h2>
        </div>
        <div class="search-container">
            <div class="search-box">
                <i class="bi bi-search"></i>
                <input type="text" placeholder="Buscar señas, palabras..." class="search-input">
            </div>
            <div class="search-results">
                <p class="empty-state">Usa la barra de búsqueda para encontrar señas</p>
            </div>
        </div>
    `;
}

// Funciones de navegación
function navigateBack() {
    if (previousViews.length > 1) {
        // Obtener la vista anterior
        const prevView = previousViews.pop();
        
        // Si estamos en una vista de detalle, volvemos a la categoría correspondiente
        if (prevView === 'detail') {
            // Obtener la última categoría visitada
            const lastCategory = previousViews[previousViews.length - 1];
            if (lastCategory) {
                navigateToSection(lastCategory);
            } else {
                navigateToSection('home');
            }
        } else {
            // Si no estamos en detalle, volvemos a la vista anterior
            navigateToSection(prevView);
        }
    } else {
        // Si no hay historial, volver a la pantalla de inicio
        navigateToSection('home');
    }
}

// Funciones de interacción para detalles de contenido
function showLetterDetail(letter) {
    const detailView = document.getElementById('detailView');
    if (!detailView) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    detailView.innerHTML = generateLetterDetailContent(letter);
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'letter', id: letter }, '', `#detail-letter-${letter}`);
    
    // Cambiar a vista de detalle
    changeView('detail');
}

function showNumberDetail(number) {
    const detailView = document.getElementById('detailView');
    if (!detailView) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    detailView.innerHTML = generateNumberDetailContent(number);
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'number', id: number }, '', `#detail-number-${number}`);
    
    // Cambiar a vista de detalle
    changeView('detail');
}

function showGreetingIntroductionDetail(id) {
    if (!greetingsIntroductions) {
        greetingsIntroductions = new GreetingsIntroductions();
    }
    
    const item = greetingsIntroductions.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'greeting', id: id }, '', `#detail-greeting-${id}`);
    
    changeView('detail');
}

// Generadores de contenido detallado
function generateLetterDetailContent(letter) {
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Letra ${letter}</h2>
        </div>
        <div class="detail-view">
            <div class="detail-info">
                <h3>Letra ${letter}</h3>
                <p>Instrucciones para realizar la seña:</p>
                <p>1. Posiciona tu mano como se muestra en la imagen</p>
                <img src="assets/images/alfablanco/${letter}2.png" alt="Seña de la letra ${letter}" class="sign-image">
            </div>
        </div>
    `;
}

function generateNumberDetailContent(number) {
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Número ${number}</h2>
        </div>
        <div class="detail-view">
            <div class="detail-info">
                <h3>Número ${number}</h3>
                <p>Instrucciones para realizar la seña:</p>
                <p>1. Posiciona tu mano como se muestra en la imagen</p>
                <img src="assets/images/numeros/${number}.png" alt="Seña del número ${number}" class="sign-image">
            </div>
        </div>
    `;
}

function generateGreetingDetailContent(greetingId) {
    const greetingsMap = {
        'hola': 'Hola',
        'buenos_dias': 'Buenos días',
        'buenas_tardes': 'Buenas tardes',
        'buenas_noches': 'Buenas noches',
        'adios': 'Adiós',
        'gracias': 'Gracias'
    };
    
    const greetingText = greetingsMap[greetingId] || greetingId;
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${greetingText}</h2>
        </div>
        <div class="detail-view">
            <div class="video-container">
                <div class="video-placeholder">
                    <i class="bi bi-hand-index-thumb"></i>
                    <p>Video de "${greetingText}" en LSC</p>
                </div>
            </div>
            <div class="detail-info">
                <h3>${greetingText}</h3>
                <p>Instrucciones para realizar la seña:</p>
                <p>1. Posiciona tu mano en forma de...</p>
                <div class="action-buttons">
                    <button class="action-btn">
                        <i class="bi bi-play-fill"></i> Ver Video
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Funciones para iniciar la práctica
function startQuiz(type) {
    const practiceView = document.getElementById('practicaView');
    if (!practiceView) {
        console.error('No se encontró el elemento practicaView');
        return;
    }

    let quiz;
    switch(type) {
        case 'alfabeto':
            if (!quizAlphabet) {
                quizAlphabet = new QuizAlphabet();
            }
            quiz = quizAlphabet;
            break;
        case 'numeros':
            if (!quizNumbers) {
                quizNumbers = new QuizNumbers();
            }
            quiz = quizNumbers;
            break;
        default:
            console.error('Tipo de quiz no válido:', type);
            return;
    }

    // Iniciar el quiz y mostrar la primera pregunta
    practiceView.innerHTML = quiz.start();

    // Agregar event listeners para las opciones y navegación
    addQuizEventListeners(quiz);

    // Actualizar historial
    history.pushState({ view: 'practica', subview: 'quiz', type: type }, '', `#quiz-${type}`);
}

// Función auxiliar para agregar event listeners al quiz
function addQuizEventListeners(quiz) {
    const practiceView = document.getElementById('practicaView');
    if (!practiceView) return;

    const optionButtons = practiceView.querySelectorAll('.option');
    const prevButton = practiceView.querySelector('#prevQuestionBtn');
    const nextButton = practiceView.querySelector('#nextQuestionBtn');

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answer = this.dataset.option;
            practiceView.innerHTML = quiz.selectOption(answer);
            addQuizEventListeners(quiz);
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const newContent = quiz.previousQuestion();
            if (newContent) {
                practiceView.innerHTML = newContent;
                addQuizEventListeners(quiz);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const newContent = quiz.nextQuestion();
            if (newContent) {
                practiceView.innerHTML = newContent;
                addQuizEventListeners(quiz);
            }
        });
    }
}

function startMemoryGame() {
    const practiceView = document.getElementById('practicaView');
    if (!practiceView) {
        console.error('No se encontró el elemento practicaView');
        return;
    }

    // Iniciar nuevo juego
    if (!memoryGame) {
        memoryGame = new MemoryGame();
    }

    // Mostrar el juego
    practiceView.innerHTML = memoryGame.start();

    // Actualizar historial
    history.pushState({ view: 'practica', subview: 'memory' }, '', '#memory-game');
}

// Función para inicializar elementos específicos de cada sección
function initializeSectionElements(section) {
    try {
        if (section === 'acciones') {
            const actionItems = document.querySelectorAll('.action-item');
            actionItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const actionId = item.getAttribute('data-action-id');
                    if (actionId) {
                        showActionDetail(actionId);
                    }
                });
            });
        }

        // Inicializar controles de video
        const videoControls = document.querySelectorAll('.video-controls button');
        videoControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Inicializar botones de práctica
        const practiceButtons = document.querySelectorAll('.practice-btn');
        practiceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
    } catch (error) {
        console.error('Error al inicializar elementos:', error);
    }
}

function loadNumbersView() {
    const numbersContent = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Números</h2>
        </div>
        <div class="numbers-grid">
            ${Array.from({length: 11}, (_, i) => `
                <div class="number-card" onclick="loadNumberDetail(${i})">
                    <div class="number-preview">
                        <span>${i}</span>
                        <div class="play-indicator">
                            <i class="bi bi-play-fill"></i>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('numbersView').innerHTML = numbersContent;
}

function generateActionsContent() {
    if (!basicActions) {
        basicActions = new BasicActions();
    }
    
    const actions = basicActions.getAllActions();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Acciones Básicas en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las acciones básicas más comunes en Lengua de Señas Colombiana.</p>
                <p>Selecciona una acción para ver su video y practicar.</p>
            </div>
            <div class="actions-list">
                ${actions.map(action => `
                    <div class="action-item" onclick="showActionDetail('${action.id}')">
                        <div class="action-content">
                            <h3>${action.text}</h3>
                            <p class="action-description">Ver video de la seña para "${action.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showActionDetail(actionId) {
    if (!basicActions) {
        basicActions = new BasicActions();
    }

    const action = basicActions.getActionById(actionId);
    if (!action) return;
    
    const detailView = document.getElementById('detailView');
    if (!detailView) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    // Limpiar event listeners antes de cambiar el contenido
    cleanupEventListeners();
    
    detailView.innerHTML = generateActionDetailContent(action);
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'action', id: actionId }, '', `#detail-action-${actionId}`);
    
    // Cambiar a vista de detalle
    changeView('detail');

    // Inicializar el video después de mostrar el contenido
    setTimeout(() => {
        const video = document.getElementById('actionVideo');
        if (video) {
            video.addEventListener('ended', function() {
                this.currentTime = 0;
            });
        }
    }, 100);
}

function generateActionDetailContent(action) {
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${action.text}</h2>
        </div>
        <div class="detail-view">
            <div class="video-section">
                <div class="video-container">
                    <video id="actionVideo" controls>
                        <source src="${action.videoPath}" type="video/mp4">
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
                <div class="video-controls">
                    <button class="control-btn" onclick="document.getElementById('actionVideo').play()">
                        <i class="bi bi-play-fill"></i>
                        Reproducir
                    </button>
                    <button class="control-btn" onclick="document.getElementById('actionVideo').pause()">
                        <i class="bi bi-pause-fill"></i>
                        Pausar
                    </button>
                    <button class="control-btn" onclick="document.getElementById('actionVideo').currentTime = 0">
                        <i class="bi bi-arrow-counterclockwise"></i>
                        Reiniciar
                    </button>
                </div>
            </div>
            <div class="detail-info">
                <div class="info-section">
                    <h3>Instrucciones</h3>
                    <div class="instruction-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <p>Observa el video detenidamente</p>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <p>Practica el movimiento siguiendo el ejemplo</p>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <p>Repite la acción hasta dominarla</p>
                        </div>
                    </div>
                </div>
                <div class="practice-section">
                    <h3>Práctica</h3>
                    <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                    <div class="practice-controls">
                        <button class="practice-btn" onclick="navigateBack()">
                            <i class="bi bi-arrow-left"></i>
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateFoodDrinksContent() {
    if (!foodDrinks) {
        foodDrinks = new FoodDrinks();
    }
    
    const items = foodDrinks.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Bebidas y Alimentos en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para bebidas y alimentos comunes en Lengua de Señas Colombiana.</p>
                <p>Selecciona un elemento para ver su video y practicar.</p>
            </div>
            <div class="actions-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showFoodDrinkDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showFoodDrinkDetail(id) {
    if (!foodDrinks) {
        foodDrinks = new FoodDrinks();
    }
    
    const item = foodDrinks.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'fooddrink', id: id }, '', `#detail-fooddrink-${id}`);
    
    changeView('detail');
}

function generateEmotionsSensationsContent() {
    if (!emotionsSensations) {
        emotionsSensations = new EmotionsSensations();
    }
    
    const items = emotionsSensations.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Emociones y Sensaciones en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para expresar emociones y sensaciones en Lengua de Señas Colombiana.</p>
                <p>Selecciona una emoción o sensación para ver su video y practicar.</p>
            </div>
            <div class="actions-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showEmotionSensationDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showEmotionSensationDetail(id) {
    if (!emotionsSensations) {
        emotionsSensations = new EmotionsSensations();
    }
    
    const item = emotionsSensations.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'emotion', id: id }, '', `#detail-emotion-${id}`);
    
    changeView('detail');
}

function generateFamilyRelationsContent() {
    if (!familyRelations) {
        familyRelations = new FamilyRelations();
    }
    
    const items = familyRelations.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Familia y Relaciones en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para identificar a los miembros de la familia y expresar relaciones en Lengua de Señas Colombiana.</p>
                <p>Selecciona una relación familiar para ver su video y practicar.</p>
            </div>
            <div class="actions-list family-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showFamilyRelationDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showFamilyRelationDetail(id) {
    if (!familyRelations) {
        familyRelations = new FamilyRelations();
    }
    
    const item = familyRelations.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'family', id: id }, '', `#detail-family-${id}`);
    
    changeView('detail');
}

function generateUsefulPhrasesContent() {
    if (!usefulPhrases) {
        usefulPhrases = new UsefulPhrases();
    }
    
    const items = usefulPhrases.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Frases Útiles en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende frases comunes y útiles en Lengua de Señas Colombiana.</p>
                <p>Selecciona una frase para ver su video y practicar.</p>
            </div>
            <div class="actions-list phrases-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showUsefulPhraseDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showUsefulPhraseDetail(id) {
    if (!usefulPhrases) {
        usefulPhrases = new UsefulPhrases();
    }
    
    const item = usefulPhrases.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'phrase', id: id }, '', `#detail-phrase-${id}`);
    
    changeView('detail');
}

function generatePlacesContent() {
    if (!places) {
        places = new Places();
    }
    
    const items = places.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Lugares en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para identificar lugares comunes en Lengua de Señas Colombiana.</p>
                <p>Selecciona un lugar para ver su video y practicar.</p>
            </div>
            <div class="actions-list places-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showPlaceDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showPlaceDetail(id) {
    if (!places) {
        places = new Places();
    }
    
    const item = places.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'place', id: id }, '', `#detail-place-${id}`);
    
    changeView('detail');
}

function generateCommonObjectsContent() {
    if (!commonObjects) {
        commonObjects = new CommonObjects();
    }
    
    const items = commonObjects.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Objetos Comunes en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para identificar objetos comunes en Lengua de Señas Colombiana.</p>
                <p>Selecciona un objeto para ver su video y practicar.</p>
            </div>
            <div class="actions-list objects-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showCommonObjectDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}

function showCommonObjectDetail(id) {
    if (!commonObjects) {
        commonObjects = new CommonObjects();
    }
    
    const item = commonObjects.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'object', id: id }, '', `#detail-object-${id}`);
    
    changeView('detail');
}

function generateCommonQuestionsContent() {
    if (!commonQuestions) {
        commonQuestions = new CommonQuestions();
    }
    
    const items = commonQuestions.getAllItems();
    
    return `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>Preguntas Comunes en LSC</h2>
        </div>
        <div class="actions-container">
            <div class="actions-description">
                <p>Aprende las señas para hacer preguntas comunes en Lengua de Señas Colombiana.</p>
                <p>Selecciona una pregunta para ver su video y practicar.</p>
            </div>
            <div class="actions-list questions-list">
                ${items.map(item => `
                    <div class="action-item" onclick="showCommonQuestionDetail('${item.id}')">
                        <div class="action-content">
                            <h3>${item.text}</h3>
                            <p class="action-description">Ver video de la seña para "${item.text}"</p>
                        </div>
                        <div class="action-controls">
                            <button class="watch-btn">
                                <i class="bi bi-play-circle"></i>
                                Ver video
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="actions-navigation">
                <button class="nav-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                    Volver al inicio
                </button>
            </div>
        </div>
    `;
}
function showCommonQuestionDetail(id) {
    if (!commonQuestions) {
        commonQuestions = new CommonQuestions();
    }
    
    const item = commonQuestions.getItemById(id);
    if (!item) return;
    
    // Guardar la vista actual antes de cambiar
    if (currentView !== 'detail') {
        previousViews.push(currentView);
    }
    
    const detailView = document.getElementById('detailView');
    detailView.innerHTML = `
        <div class="section-header">
            <button class="back-btn" onclick="navigateBack()">
                <i class="bi bi-arrow-left"></i>
            </button>
            <h2>${item.text}</h2>
        </div>
        <div class="detail-content">
            <div class="video-container">
                <video id="itemVideo" controls>
                    <source src="${item.videoPath}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <div class="video-controls">
                <button class="control-btn primary" onclick="document.getElementById('itemVideo').play()">
                    <i class="bi bi-play-fill"></i>
                    Reproducir
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').pause()">
                    <i class="bi bi-pause-fill"></i>
                    Pausar
                </button>
                <button class="control-btn" onclick="document.getElementById('itemVideo').currentTime = 0">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Reiniciar
                </button>
            </div>
            <div class="practice-section">
                <h3>Práctica</h3>
                <p>Repite el video las veces necesarias hasta que te sientas seguro/a de poder realizar la seña correctamente.</p>
                <div class="practice-controls">
                    <button class="practice-btn" onclick="navigateBack()">
                        <i class="bi bi-arrow-left"></i>
                        Volver a la lista
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Actualizar historial
    history.pushState({ view: 'detail', type: 'question', id: id }, '', `#detail-question-${id}`);
    
    changeView('detail');
}

// Funciones para navegación desde acceso rápido
function navigateToEmotionAndShowDetail(id) {
    // Primero navegar a la categoría de emociones
    navigateToSection('emociones');
    // Luego mostrar el detalle
    setTimeout(() => {
        showEmotionSensationDetail(id);
    }, 100);
}

function navigateToFamilyAndShowDetail(id) {
    // Primero navegar a la categoría de familia
    navigateToSection('familia');
    // Luego mostrar el detalle
    setTimeout(() => {
        showFamilyRelationDetail(id);
    }, 100);
}

function navigateToPhraseAndShowDetail(id) {
    // Primero navegar a la categoría de frases
    navigateToSection('frases');
    // Luego mostrar el detalle
    setTimeout(() => {
        showUsefulPhraseDetail(id);
    }, 100);
}

function navigateToPlaceAndShowDetail(id) {
    // Primero navegar a la categoría de lugares
    navigateToSection('lugares');
    // Luego mostrar el detalle
    setTimeout(() => {
        showPlaceDetail(id);
    }, 100);
}

function navigateToObjectAndShowDetail(id) {
    // Primero navegar a la categoría de objetos
    navigateToSection('objetos');
    // Luego mostrar el detalle
    setTimeout(() => {
        showCommonObjectDetail(id);
    }, 100);
}

function navigateToQuestionAndShowDetail(id) {
    // Primero navegar a la categoría de preguntas
    navigateToSection('preguntas');
    // Luego mostrar el detalle
    setTimeout(() => {
        showCommonQuestionDetail(id);
    }, 100);
}

