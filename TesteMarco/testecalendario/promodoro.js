// script.js
// Lógica JavaScript para a funcionalidade do site

// Agenda de Tarefas
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");
    var task = taskInput.value;
    if (task.trim() !== "") {
        var li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
        taskInput.value = "";
    } else {
        alert("Por favor, insira uma tarefa válida.");
    }
}

let timerInterval; // Variável para armazenar o intervalo do temporizador

function startPomodoro() {
    document.getElementById("startButton").style.display = "none"; // Ocultar botão Iniciar
    document.getElementById("stopButton").style.display = "inline-block"; // Exibir botão Parar

    let pomodoroTimer = document.getElementById("pomodoroTimer");
    let minutes = 25;
    let seconds = 0;

    // Inicializar o temporizador apenas se não estiver em execução
    if (!timerInterval) {
        timerInterval = setInterval(function () {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timerInterval);
                    timerInterval = null; // Limpar o intervalo
                    alert("Pomodoro concluído!");
                    document.getElementById("startButton").style.display = "inline-block"; // Exibir botão Iniciar
                    document.getElementById("stopButton").style.display = "none"; // Ocultar botão Parar
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            pomodoroTimer.textContent = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        }, 1000);
    }
}

function stopPomodoro() {
    clearInterval(timerInterval); // Parar o temporizador
    timerInterval = null; // Limpar o intervalo
    document.getElementById("startButton").style.display = "inline-block"; // Exibir botão Iniciar
    document.getElementById("stopButton").style.display = "none"; // Ocultar botão Parar
    document.getElementById("pomodoroTimer").textContent = "25:00"; // Redefinir o temporizador para o valor padrão
}

// Calendário
// Você pode usar bibliotecas como FullCalendar para implementar o calendário, mas para este exemplo, deixarei como exercício adicional.
// Adicione este código ao final do seu arquivo script.js

let currentMonth = 3; // Janeiro é 0, Fevereiro é 1, ..., Dezembro é 11
let currentYear = 2024;
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function generateCalendar() {
    const calendarBody = document.getElementById("calendarBody");
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    calendarBody.innerHTML = "";

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDayOfMonth) {
                const cellText = document.createTextNode("");
                cell.appendChild(cellText);
            } else if (date > daysInMonth) {
                break;
            } else {
                const cellText = document.createTextNode(date);

                if (date === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                    cell.classList.add("today");
                }

                cell.appendChild(cellText);
                date++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);

        if (date > daysInMonth) {
            break;
        }
    }

    document.getElementById("currentMonthYear").textContent = `${months[currentMonth]} ${currentYear}`;
}

function previousMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }

    generateCalendar();
}

function nextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }

    generateCalendar();
}

// Gerar o calendário inicial
generateCalendar();