document.addEventListener('DOMContentLoaded', () => {
    const listaTarefas = document.getElementById('lista-tarefas');
    const tarefaForm = document.getElementById('nova-tarefa-form');
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-timer');
    const resetButton = document.getElementById('reset-timer');

    let globalInterval;
    let globalTimeLeft = 1500; // 25 minutes
    let activeTimer = null; // Keeps track of the active timer

    tarefaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tarefa = document.getElementById('tarefa').value;
        adicionarTarefa(tarefa);
        tarefaForm.reset();
    });

    function adicionarTarefa(tarefa) {
        const li = document.createElement('li');
        li.classList.add('pomodoro-tarefa');
        li.innerHTML = `
            <span class="tarefa-nome">${tarefa}</span>
            <div class="pomodoro-timer">
                <div class="timer-display">25:00</div>
                <button class="start-timer">Iniciar</button>
                <button class="reset-timer">Resetar</button>
                <button class="concluir-tarefa">Concluir</button>
            </div>
        `;
        listaTarefas.appendChild(li);

        const startTimerButton = li.querySelector('.start-timer');
        const resetTimerButton = li.querySelector('.reset-timer');
        const concluirTarefaButton = li.querySelector('.concluir-tarefa');
        const timerDisplay = li.querySelector('.timer-display');
        let interval;
        let timeLeft = 1500; // 25 minutes

        startTimerButton.addEventListener('click', () => {
            if (activeTimer && activeTimer !== interval) {
                alert("Outro Pomodoro está ativo. Termine ou pause-o primeiro.");
                return;
            }
            if (interval) {
                clearInterval(interval);
                startTimerButton.textContent = 'Iniciar';
                activeTimer = null;
            } else {
                interval = setInterval(() => {
                    if (timeLeft <= 0) {
                        clearInterval(interval);
                        startTimerButton.textContent = 'Iniciar';
                        timeLeft = 300; // 5 minutes break
                        timerDisplay.textContent = '05:00';
                    } else {
                        timeLeft--;
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;
                        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                }, 1000);
                startTimerButton.textContent = 'Pausar';
                activeTimer = interval;
            }
        });

        resetTimerButton.addEventListener('click', () => {
            clearInterval(interval);
            timeLeft = 1500;
            timerDisplay.textContent = '25:00';
            startTimerButton.textContent = 'Iniciar';
            activeTimer = null;
            interval = null;
        });

        concluirTarefaButton.addEventListener('click', () => {
            clearInterval(interval);
            li.remove();
            activeTimer = null;
            interval = null;
        });
    }

    startButton.addEventListener('click', () => {
        if (activeTimer && activeTimer !== globalInterval) {
            alert("Outro Pomodoro está ativo. Termine ou pause-o primeiro.");
            return;
        }
        if (globalInterval) {
            clearInterval(globalInterval);
            startButton.textContent = 'Iniciar';
            activeTimer = null;
            globalInterval = null;
        } else {
            globalInterval = setInterval(() => {
                if (globalTimeLeft <= 0) {
                    clearInterval(globalInterval);
                    startButton.textContent = 'Iniciar';
                    globalTimeLeft = 300; // 5 minutes break
                    timerDisplay.textContent = '05:00';
                } else {
                    globalTimeLeft--;
                    const minutes = Math.floor(globalTimeLeft / 60);
                    const seconds = globalTimeLeft % 60;
                    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
            startButton.textContent = 'Pausar';
            activeTimer = globalInterval;
        }
    });

    resetButton.addEventListener('click', () => {
        clearInterval(globalInterval);
        globalTimeLeft = 1500;
        timerDisplay.textContent = '25:00';
        startButton.textContent = 'Iniciar';
        activeTimer = null;
        globalInterval = null;
    });
});
