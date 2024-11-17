<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card p-5 rounded shadow-sm mx-auto timer-card">
            <h1 class="text-center mb-4 display-6">FREE! Boxing Timer</h1>

            <div class="input-group mb-3">
                <label for="prepTime" class="form-label">Tiempo de Preparación (seg):</label>
                <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="prepTime"
                    id="prepTime"
                    min="1"
                    placeholder="Segundos"
                    required
                />
            </div>

            <div class="input-group mb-3">
                <label for="roundTime" class="form-label">Tiempo de Round (min):</label>
                <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="roundTime"
                    id="roundTime"
                    min="1"
                    placeholder="Minutos"
                    required
                />
            </div>

            <div class="input-group mb-3">
                <label for="intervalTime" class="form-label">Tiempo entre Rounds (seg):</label>
                <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="intervalTime"
                    id="intervalTime"
                    min="1"
                    placeholder="Segundos"
                    required
                />
            </div>

            <div class="input-group mb-3">
                <label for="rounds" class="form-label">Cantidad de Rounds:</label>
                <input
                    type="number"
                    class="form-control form-control-sm"
                    v-model="rounds"
                    id="rounds"
                    min="1"
                    placeholder="Rounds"
                    required
                />
            </div>

            <div v-if="isActive" class="text-center mb-3 timer-display">
                <h2 :class="['digital-clock', { 'countdown': isCountdown }]">{{ formattedTime }}</h2>
                <p class="mb-1">Round: {{ currentRound }} / {{ rounds }}</p>
                <p>Tiempo total: {{ totalTrainingTime }} min</p>
                <p>Tiempo total libre: {{ totalFreeTime }} min</p>
            </div>

            <div class="text-center">
                <button @click="startTimer" class="btn btn-primary btn-lg m-1" :disabled="isActive || !isInputValid">Iniciar</button>
                <button @click="pauseTimer" class="btn btn-warning btn-lg m-1 text-white" :disabled="!isActive || isPaused">Pausar</button>
                <button @click="resumeTimer" class="btn btn-success btn-lg m-1" :disabled="!isPaused">Reanudar</button>
                <button @click="resetTimer" class="btn btn-danger btn-lg m-1" :disabled="!isActive">Reiniciar</button>
            </div>
        </div>

        <!-- GIF de finalización -->
        <div v-if="showGif" class="fullscreen-gif" :class="{ 'party-effect': showLights }">
            <div class="completion-message">
                <h1>¡Entrenamiento Finalizado!</h1>
                <img src="@/assets/gif/philadelphia-rocky-balboa.gif" alt="Entrenamiento finalizado" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            prepTime: 30,
            roundTime: 3,
            intervalTime: 60,
            rounds: 3,
            currentRound: 1,
            timeLeft: 0,
            timer: null,
            isActive: false,
            isPaused: false,
            phase: 'prep',
            isCountdown: false,
            showGif: false,
            audio: null,
            showLights: false, // Nueva variable para la luz de fiesta
        };
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return `${this.pad(minutes)}:${this.pad(seconds)}`;
        },
        isInputValid() {
            return this.roundTime > 0 && this.rounds > 0 && this.prepTime > 0 && this.intervalTime > 0;
        },
        totalTrainingTime() {
            return this.roundTime * this.rounds;
        },
        totalFreeTime() {
            return ((this.rounds - 1) * (this.intervalTime / 60));
        },
    },
    methods: {
        pad(num) {
            return num < 10 ? '0' + num : num;
        },
        startTimer() {
            this.timeLeft = this.prepTime; 
            this.isActive = true;
            this.isPaused = false;
            this.phase = 'prep'; 
            this.isCountdown = false;

            let countdownPlayed = false;

            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;

                    if (this.phase === 'round') {
                        if (this.timeLeft === 10 && !countdownPlayed) {
                            this.playCountdownSound(); 
                            countdownPlayed = true;
                        } else if (this.timeLeft < 10) {
                            countdownPlayed = false;
                        }
                    }
                } else {
                    this.handlePhaseEnd();
                }
            }, 1000);
        },
        handlePhaseEnd() {
            this.isCountdown = false; 
            if (this.phase === 'prep') {
                this.playBellSound(); 
                this.currentRound = 1;
                this.timeLeft = this.roundTime * 60;
                this.phase = 'round';
                this.isCountdown = true; 
            } else if (this.phase === 'round') {
                if (this.currentRound < this.rounds) {
                    this.currentRound++;
                    this.timeLeft = this.intervalTime; 
                    this.phase = 'interval';
                    this.playBellSound(); 
                } else {
                    this.stopTimer(); 
                    this.showCompletionGif();
                }
            } else if (this.phase === 'interval') {
                this.timeLeft = this.roundTime * 60;
                this.phase = 'round';
                this.playBellSound(); 
                this.isCountdown = true; 
            }
        },
        showCompletionGif() {
            this.showGif = true;
            this.showLights = true; // Activar efecto de luces
            if (!this.audio) {
                this.audio = new Audio(require('@/assets/sounds/rocky-song.mp3'));
            }

            this.audio.currentTime = 140;
            this.audio.play();

            setTimeout(() => {
                this.showGif = false;
                this.audio.pause();
                this.audio.currentTime = 140; 
                this.resetTimer(); // Resetea valores después de completar
            }, 15000); 
        },
        playBellSound() {
            const audio = new Audio(require('@/assets/sounds/boxing-bell.mp3'));
            audio.play().catch(err => {
                console.error('Error al reproducir el sonido playBellSound:', err);
            });
        },
        playCountdownSound() {
            const audio = new Audio(require('@/assets/sounds/countdown-from-10.mp3'));
            audio.play().catch(err => {
                console.error('Error al reproducir el sonido playCountdownSound:', err);
            });
        },
        pauseTimer() {
            if (this.isActive && !this.isPaused) {
                clearInterval(this.timer);
                this.isPaused = true;
            }
        },
        resumeTimer() {
            if (this.isPaused) {
                this.isPaused = false;
                this.timer = setInterval(() => {
                    if (this.timeLeft > 0) {
                        this.timeLeft--;
                        if (this.phase === 'round' && this.timeLeft === 10) {
                            this.playCountdownSound();
                        }
                    } else {
                        this.handlePhaseEnd();
                    }
                }, 1000);
            }
        },
        stopTimer() {
            clearInterval(this.timer);
            this.isActive = false;
            this.isPaused = false;
            this.currentRound = 1; 
            this.timeLeft = 0; 
            this.phase = 'prep'; 
            this.isCountdown = false; 
            if (this.audio) {
                this.audio.pause(); 
                this.audio.currentTime = 140; 
            }
        },
        resetTimer() {
            this.stopTimer();
            this.prepTime = 30; 
            this.roundTime = 3; 
            this.intervalTime = 60; 
            this.rounds = 3; 
            this.showGif = false; 
            this.showLights = false; // Resetea efectos de luces
        },
    },
};
</script>

<style scoped>
.timer-card {
    background-color: rgba(40, 44, 52, 0.8);
    color: white; 
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
}

.digital-clock {
    font-family: 'Digital Dismay', monospace; 
    font-size: 5em; 
    letter-spacing: 3px;
    margin: 0;
    padding: 20px;
    border: 3px solid red;
    border-radius: 15px;
    background-color: rgba(30, 33, 37, 0.9);
    transition: transform 0.4s, filter 0.4s; 
}

.digital-clock.countdown {
    animation: zoomEffect 1s infinite alternate; 
    filter: brightness(1.5); 
}

@keyframes zoomEffect {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.1);
    }
}

.input-group {
    padding: 1em;
}

.btn {
    transition: background-color 0.3s ease;
}

.btn:hover {
    opacity: 0.8; 
}

.fullscreen-gif {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.fullscreen-gif img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

.completion-message {
    text-align: center; 
    color: white; 
    font-size: 2rem; 
}

.party-effect {
    animation: partyLights 1s infinite alternate; /* Añadido efecto de fiesta */
}

@keyframes partyLights {
    0% {
        background-color: rgba(255, 0, 0, 0.5);
    }
    25% {
        background-color: rgba(0, 255, 0, 0.5);
    }
    50% {
        background-color: rgba(0, 0, 255, 0.5);
    }
    75% {
        background-color: rgba(255, 255, 0, 0.5);
    }
    100% {
        background-color: rgba(255, 0, 255, 0.5);
    }
}
</style>
