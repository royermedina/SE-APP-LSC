class Quiz {
    constructor(type) {
        this.type = type;
        this.score = 0;
        this.currentQuestion = 0;
        this.questions = [];
        this.isFinished = false;
        this.answers = [];
        this.userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    }

    // Método para iniciar el quiz
    start() {
        this.score = 0;
        this.currentQuestion = 0;
        this.isFinished = false;
        this.loadQuestions();
        this.answers = Array(this.questions.length).fill(null);
        return this.generateQuizUI();
    }

    // Método para cargar las preguntas (debe ser implementado por las clases hijas)
    loadQuestions() {
        throw new Error('loadQuestions debe ser implementado por la clase hija');
    }

    // Método para generar la UI del quiz
    generateQuizUI() {
        const typeTitle = this.type === 'alfabeto' ? 'Alfabeto' : 'Números';
        
        return `
            <div class="section-header">
                <button class="back-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h2>Quiz de ${typeTitle}</h2>
                <div class="quiz-progress">
                    Pregunta <span id="currentQuestionNum">${this.currentQuestion + 1}</span> de ${this.questions.length}
                </div>
            </div>
            <div class="quiz-container">
                <div id="quizContent" class="quiz-content">
                    ${this.generateQuestionUI()}
                </div>
                <div class="quiz-navigation">
                    <button id="prevQuestionBtn" class="nav-btn" ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        <i class="bi bi-arrow-left"></i> Anterior
                    </button>
                    <button id="nextQuestionBtn" class="nav-btn">
                        ${this.currentQuestion === this.questions.length - 1 ? 'Finalizar <i class="bi bi-check-lg"></i>' : 'Siguiente <i class="bi bi-arrow-right"></i>'}
                    </button>
                </div>
                <div id="quizResults" class="quiz-results" style="display: none;">
                    <h3>Resultados del Quiz</h3>
                    <div class="score-container">
                        <div class="score">
                            <span id="correctAnswers">0</span>/<span id="totalQuestions">${this.questions.length}</span>
                        </div>
                        <div class="score-label">Respuestas correctas</div>
                    </div>
                    <div class="result-actions">
                        <button class="action-btn" onclick="startQuiz('${this.type}')">
                            <i class="bi bi-arrow-repeat"></i> Intentar de nuevo
                        </button>
                        <button class="action-btn secondary" onclick="navigateToSection('practica')">
                            <i class="bi bi-list-check"></i> Otros ejercicios
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Método para generar la UI de una pregunta
    generateQuestionUI() {
        const question = this.questions[this.currentQuestion];
        if (!question) return '';

        return `
            <div class="quiz-question" data-index="${this.currentQuestion}">
                <h3>${question.question}</h3>
                <div class="question-image">
                    <img src="${question.imageUrl}" alt="Seña para la pregunta" class="sign-image">
                </div>
                <div class="options-container">
                    ${question.options.map((option, i) => `
                        <div class="option ${this.answers[this.currentQuestion] === option ? 'selected' : ''}" 
                             data-option="${option}">
                            <span class="option-marker">${String.fromCharCode(65 + i)}</span>
                            <span class="option-text">${option}</span>
                        </div>
                    `).join('')}
                </div>
                ${this.answers[this.currentQuestion] ? this.generateFeedbackUI(this.currentQuestion) : ''}
            </div>
        `;
    }

    // Método para generar la UI de retroalimentación
    generateFeedbackUI(questionIndex) {
        const question = this.questions[questionIndex];
        const isCorrect = this.answers[questionIndex] === question.correctAnswer;

        return `
            <div class="feedback-container">
                <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                    <i class="bi bi-${isCorrect ? 'check' : 'x'}-circle"></i>
                    ${isCorrect ? '¡Correcto!' : `Incorrecto. La respuesta correcta es: ${question.correctAnswer}`}
                </div>
            </div>
        `;
    }

    // Método para seleccionar una opción
    selectOption(option) {
        this.answers[this.currentQuestion] = option;
        return this.generateQuestionUI();
    }

    // Método para ir a la pregunta anterior
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            return this.generateQuizUI();
        }
        return null;
    }

    // Método para ir a la siguiente pregunta
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            return this.generateQuizUI();
        } else {
            return this.finish();
        }
    }

    // Método para finalizar el quiz
    finish() {
        this.isFinished = true;
        let correctCount = 0;
        this.answers.forEach((answer, index) => {
            if (answer === this.questions[index].correctAnswer) {
                correctCount++;
            }
        });
        this.score = correctCount;
        this.updateProgress();
        return this.generateResultsUI();
    }

    // Método para generar la UI de resultados
    generateResultsUI() {
        return `
            <div class="quiz-results">
                <h3>Resultados del Quiz</h3>
                <div class="score-container">
                    <div class="score">
                        <span>${this.score}</span>/<span>${this.questions.length}</span>
                    </div>
                    <div class="score-label">Respuestas correctas</div>
                </div>
                <div class="result-actions">
                    <button class="action-btn" onclick="startQuiz('${this.type}')">
                        <i class="bi bi-arrow-repeat"></i> Intentar de nuevo
                    </button>
                    <button class="action-btn secondary" onclick="navigateToSection('practica')">
                        <i class="bi bi-list-check"></i> Otros ejercicios
                    </button>
                </div>
            </div>
        `;
    }

    // Método para actualizar el progreso del usuario
    updateProgress() {
        if (!this.userProgress[this.type]) {
            this.userProgress[this.type] = {
                completed: 0,
                bestScore: 0
            };
        }

        this.userProgress[this.type].completed++;
        this.userProgress[this.type].bestScore = Math.max(
            this.userProgress[this.type].bestScore,
            this.score
        );

        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
        this.updateProgressUI();
    }

    // Método para actualizar la UI de progreso
    updateProgressUI() {
        const progressBar = document.querySelector(`.category-card[onclick="navigateToSection('${this.type}')"] .progress-bar`);
        const progressCount = document.querySelector(`.category-card[onclick="navigateToSection('${this.type}')"] .category-progress span`);
        
        if (progressBar && progressCount) {
            const total = this.type === 'alfabeto' ? 27 : 10;
            const percentage = Math.min(100, (this.userProgress[this.type].bestScore / total) * 100);
            
            progressBar.style.width = `${percentage}%`;
            progressCount.textContent = `${this.userProgress[this.type].bestScore || 0}/${total}`;
        }
    }

    // Método para mezclar un array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Exportar la clase
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quiz;
} 