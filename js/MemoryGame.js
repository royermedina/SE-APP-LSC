class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 0;
        this.moves = 0;
        this.isLocked = false;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
    }

    // Iniciar el juego
    start() {
        this.loadCards();
        this.shuffleCards();
        this.resetGame();
        return this.generateGameUI();
    }

    // Cargar las cartas del juego
    loadCards() {
        // Combinar letras y números para el juego de memoria
        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
        const numbers = Array.from({length: 11}, (_, i) => i.toString());
        
        // Seleccionar aleatoriamente 6 letras y 2 números
        const selectedLetters = this.shuffle(letters).slice(0, 6);
        const selectedNumbers = this.shuffle(numbers).slice(0, 2);
        
        // Crear pares de cartas
        this.cards = [];
        
        // Agregar cartas de letras
        selectedLetters.forEach(letter => {
            this.cards.push(
                this.createCard('letter', letter),
                this.createCard('letter', letter)
            );
        });
        
        // Agregar cartas de números
        selectedNumbers.forEach(number => {
            this.cards.push(
                this.createCard('number', number),
                this.createCard('number', number)
            );
        });
        
        this.totalPairs = this.cards.length / 2;
    }

    // Crear una carta
    createCard(type, value) {
        let imageUrl;
        if (type === 'letter') {
            // Manejo especial para la letra Ñ
            if (value === 'Ñ') {
                imageUrl = 'assets/images/alfablanco/Ñ2.png';
            } else {
                imageUrl = `assets/images/alfablanco/${value}2.png`;
            }
        } else {
            imageUrl = `assets/images/numeros/${value}.png`;
        }

        return {
            id: `${type}_${value}_${Math.random().toString(36).substr(2, 9)}`,
            type: type,
            value: value,
            imageUrl: imageUrl,
            isFlipped: false,
            isMatched: false
        };
    }

    // Mezclar las cartas
    shuffleCards() {
        this.cards = this.shuffle(this.cards);
    }

    // Función auxiliar para mezclar un array
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Resetear el juego
    resetGame() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isLocked = false;
        this.gameStarted = false;
        this.timer = 0;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.cards.forEach(card => {
            card.isFlipped = false;
            card.isMatched = false;
        });
    }

    // Generar la UI del juego
    generateGameUI() {
        return `
            <div class="section-header">
                <button class="back-btn" onclick="navigateBack()">
                    <i class="bi bi-arrow-left"></i>
                </button>
                <h2>Juego de Memoria</h2>
            </div>
            <div class="game-stats">
                <div class="moves">
                    <i class="bi bi-arrow-repeat"></i>
                    Movimientos: <span id="moveCount">0</span>
                </div>
                <div class="timer">
                    <i class="bi bi-clock"></i>
                    Tiempo: <span id="gameTimer">00:00</span>
                </div>
            </div>
            <div class="memory-game-container">
                <div class="memory-board">
                    ${this.cards.map(card => this.generateCardHTML(card)).join('')}
                </div>
                <div id="gameResults" class="game-results" style="display: none;">
                    <h3>¡Felicidades!</h3>
                    <p>Has completado el juego de memoria.</p>
                    <div class="result-stats">
                        <div class="stat-item">
                            <i class="bi bi-arrow-repeat"></i>
                            <span>Movimientos: <strong id="finalMoves">0</strong></span>
                        </div>
                        <div class="stat-item">
                            <i class="bi bi-clock"></i>
                            <span>Tiempo: <strong id="finalTime">00:00</strong></span>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="action-btn" onclick="startMemoryGame()">
                            <i class="bi bi-arrow-repeat"></i> Jugar de nuevo
                        </button>
                        <button class="action-btn secondary" onclick="navigateToSection('practica')">
                            <i class="bi bi-list-check"></i> Otros ejercicios
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Generar HTML para una carta
    generateCardHTML(card) {
        return `
            <div class="memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}"
                 data-card-id="${card.id}"
                 onclick="memoryGame.flipCard('${card.id}')">
                <div class="card-inner">
                    <div class="card-front">
                        <i class="bi bi-question-lg"></i>
                    </div>
                    <div class="card-back">
                        <img src="${card.imageUrl}" alt="Seña de ${card.type === 'letter' ? 'letra' : 'número'} ${card.value}">
                    </div>
                </div>
            </div>
        `;
    }

    // Voltear una carta
    flipCard(cardId) {
        if (this.isLocked) return;
        
        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;
        
        card.isFlipped = true;
        this.flippedCards.push(card);
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTimer();
        }
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.isLocked = true;
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
        
        this.updateCardDisplay(card);
    }

    // Comprobar si hay coincidencia
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.value === card2.value) {
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            this.updateCardDisplay(card1);
            this.updateCardDisplay(card2);
            
            if (this.matchedPairs === this.totalPairs) {
                this.endGame();
            }
        } else {
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.updateCardDisplay(card1);
                this.updateCardDisplay(card2);
            }, 500);
        }
        
        this.flippedCards = [];
        this.isLocked = false;
    }

    // Actualizar el contador de movimientos
    updateMoves() {
        const moveCount = document.getElementById('moveCount');
        if (moveCount) {
            moveCount.textContent = this.moves;
        }
    }

    // Iniciar el temporizador
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    // Actualizar el temporizador en la UI
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Actualizar la visualización de una carta
    updateCardDisplay(card) {
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        if (!cardElement) return;
        
        if (card.isFlipped) {
            cardElement.classList.add('flipped');
        } else {
            cardElement.classList.remove('flipped');
        }
        
        if (card.isMatched) {
            cardElement.classList.add('matched');
        }
    }

    // Finalizar el juego
    endGame() {
        clearInterval(this.timerInterval);
        
        const gameResults = document.getElementById('gameResults');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');
        
        if (gameResults && finalMoves && finalTime) {
            finalMoves.textContent = this.moves;
            finalTime.textContent = document.getElementById('gameTimer').textContent;
            gameResults.style.display = 'block';
        }
    }
}

// Exportar la clase
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryGame;
} 