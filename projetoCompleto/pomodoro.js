let minutes = 25;
let seconds = 0;
let interval;
let isPaused = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const taskInput = document.getElementById('task');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        if (!isPaused) {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                    alert("Tempo esgotado!");
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateDisplay();
        }
    }, 1000);
}

startButton.addEventListener('click', () => {
    isPaused = false;
    startTimer();
});

pauseButton.addEventListener('click', () => {
    isPaused = true;
});

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    minutes = 25;
    seconds = 0;
    isPaused = false;
    updateDisplay();
});

addTaskButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
        const li = document.createElement('li');
        li.textContent = task;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Concluir';
        completeButton.className = 'complete-btn';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('done');
            if (li.classList.contains('done')) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.className = 'delete-btn';
                deleteButton.addEventListener('click', () => {
                    taskList.removeChild(li);
                });
                li.appendChild(deleteButton);
            } else {
                const deleteButton = li.querySelector('.delete-btn');
                if (deleteButton) {
                    li.removeChild(deleteButton);
                }
            }
        });

        li.appendChild(completeButton);
        taskList.appendChild(li);
        taskInput.value = '';
    }
});

updateDisplay();
