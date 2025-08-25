class QuizNumbers extends Quiz {
    constructor() {
        super('numeros');
        this.numbers = Array.from({length: 11}, (_, i) => i); // 0 al 10
        this.questionsPerQuiz = 8;
        this.optionsPerQuestion = 4;
    }

    getImageUrl(number) {
        return `assets/images/numeros/${number}.png`;
    }

    // Implementación del método para cargar preguntas
    loadQuestions() {
        const shuffledNumbers = this.shuffleArray([...this.numbers]);
        this.questions = shuffledNumbers.slice(0, this.questionsPerQuiz).map(number => ({
            number: number,
            question: `¿Qué número representa esta seña?`,
            imageUrl: this.getImageUrl(number),
            options: this.generateOptions(number),
            correctAnswer: number.toString() // Convertir a string para consistencia
        }));
    }

    // Método para generar opciones aleatorias para una pregunta
    generateOptions(correctNumber) {
        const availableNumbers = this.numbers.filter(n => n !== correctNumber);
        const shuffledOptions = this.shuffleArray(availableNumbers);
        const wrongOptions = shuffledOptions.slice(0, this.optionsPerQuestion - 1);
        // Convertir todos los números a string para consistencia
        return this.shuffleArray([correctNumber, ...wrongOptions]).map(n => n.toString());
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Sobrescribir el método generateQuestionUI para personalizar la UI del quiz de números
    generateQuestionUI() {
        const question = this.questions[this.currentQuestion];
        if (!question) return '';

        return `
            <div class="quiz-content-header">
                <h2 class="quiz-section-title">Quiz de Números</h2>
                <p class="quiz-section-description">Pregunta ${this.currentQuestion + 1} de ${this.questions.length}</p>
            </div>
            <div class="quiz-question">
                <div class="question-container">
                    <h3 class="question-text">${question.question}</h3>
                    <div class="question-image">
                        <img src="${question.imageUrl}" alt="Seña para el número ${question.number}" class="sign-image">
                    </div>
                </div>
                <div class="options-container">
                    ${this.generateOptionsUI(question)}
                </div>
                ${this.answers[this.currentQuestion] ? this.generateFeedbackUI(this.currentQuestion) : ''}
            </div>
            ${this.generateNavigationUI()}
        `;
    }

    generateOptionsUI(question) {
        return question.options.map((option, i) => `
            <div class="option ${this.answers[this.currentQuestion] === option ? 'selected' : ''}" 
                 data-option="${option}">
                <div class="option-content">
                    <span class="option-marker">${String.fromCharCode(65 + i)}</span>
                    <span class="option-text">${option}</span>
                </div>
            </div>
        `).join('');
    }

    generateNavigationUI() {
        const isLastQuestion = this.currentQuestion === this.questions.length - 1;
        return `
            <div class="quiz-navigation">
                <button id="prevQuestionBtn" class="nav-btn" ${this.currentQuestion === 0 ? 'disabled' : ''}>
                    <i class="bi bi-arrow-left"></i> Anterior
                </button>
                <button id="nextQuestionBtn" class="nav-btn" ${!this.answers[this.currentQuestion] ? 'disabled' : ''}>
                    ${isLastQuestion ? 
                        '<i class="bi bi-check-lg"></i> Finalizar' : 
                        'Siguiente <i class="bi bi-arrow-right"></i>'}
                </button>
            </div>
        `;
    }

    // Sobrescribir el método generateFeedbackUI para personalizar la retroalimentación
    generateFeedbackUI(questionIndex) {
        const question = this.questions[questionIndex];
        const isCorrect = this.answers[questionIndex] === question.correctAnswer;
        const feedbackText = isCorrect ? 
            '¡Correcto!' : 
            `Incorrecto. La respuesta correcta es: ${question.correctAnswer}`;

        return `
            <div class="feedback-container">
                <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="feedback-content">
                        <i class="bi bi-${isCorrect ? 'check' : 'x'}-circle"></i>
                        <span class="feedback-text">${feedbackText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Sobrescribir el método generateResultsUI para personalizar los resultados
    generateResultsUI() {
        const correctCount = this.answers.filter((answer, index) => 
            answer === this.questions[index].correctAnswer
        ).length;
        const percentage = (correctCount / this.questions.length) * 100;

        return `
            <div class="quiz-content-header">
                <h2 class="quiz-section-title">Resultados del Quiz de Números</h2>
            </div>
            <div class="quiz-results">
                <div class="score-container">
                    <div class="score">
                        <span class="score-number">${correctCount}</span>
                        <span class="score-total">/${this.questions.length}</span>
                    </div>
                    <div class="score-label">Respuestas correctas</div>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%"></div>
                </div>
                <p class="results-message">${this.getResultMessage(correctCount)}</p>
                <div class="result-actions">
                    <button class="action-btn" onclick="startQuiz('numeros')">
                        <i class="bi bi-arrow-repeat"></i> Intentar de nuevo
                    </button>
                    <button class="action-btn secondary" onclick="navigateToSection('practica')">
                        <i class="bi bi-list-check"></i> Otros ejercicios
                    </button>
                </div>
            </div>
        `;
    }

    // Método auxiliar para generar el mensaje de resultado
    getResultMessage(correctCount) {
        const percentage = (correctCount / this.questions.length) * 100;
        if (percentage === 100) {
            return '¡Excelente! Has dominado los números en LSC.';
        } else if (percentage >= 80) {
            return '¡Muy bien! Estás cerca de dominar los números en LSC.';
        } else if (percentage >= 60) {
            return 'Buen trabajo. Sigue practicando para mejorar.';
        } else {
            return 'Continúa practicando. ¡No te rindas!';
        }
    }

    // Sobrescribir el método generateQuizUI de la clase base
    generateQuizUI() {
        return `
            <div class="section-header">
                <button class="back-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h2>Quiz de Números</h2>
            </div>
            <div class="quiz-container">
                <div id="quizContent" class="quiz-content">
                    ${this.generateQuestionUI()}
                </div>
            </div>
        `;
    }
}

// Exportar la clase
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizNumbers;
} 