const calendar = document.getElementById('calendar');
const monthName = document.getElementById('monthName');
const weekdays = document.getElementById('weekdays');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let currentDate = new Date();
let tasks = [];

// Criação do calendário
function createCalendar(year, month) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const firstDayName = new Date(year, month, 1).toLocaleString('default', { weekday: 'long' });

    calendar.innerHTML = '';
    weekdays.innerHTML = '';

    // Nome do mês
    monthName.innerText = months[month] + ' ' + year;

    // Nome dos dias da semana
    const weekdaysNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    weekdaysNames.forEach(name => {
        const weekday = document.createElement('div');
        weekday.innerText = name;
        weekdays.appendChild(weekday);
    });

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.innerText = i;
        day.setAttribute('data-day', i);
        calendar.appendChild(day);
    }

    // Marcando tarefas no calendário
    tasks.forEach(task => {
        const dayElement = calendar.querySelector(`[data-day="${task.day}"]`);
        if (dayElement) {
            dayElement.classList.add(task.status ? 'done' : 'not-done');
        }
    });

    // Adiciona evento de clique para adicionar tarefa
    const days = document.querySelectorAll('[data-day]');
    days.forEach(day => {
        day.addEventListener('click', () => {
            const selectedDay = day.getAttribute('data-day');
            addTaskToList(selectedDay);
        });
    });
}

// Adiciona tarefa à lista
function addTaskToList(day) {
    const task = taskInput.value.trim();
    if (task === '') return;

    tasks.push({ day: parseInt(day), task: task, status: false });
    updateCalendar();
    updateTaskList();

    taskInput.value = '';
}

// Atualiza o calendário e a lista de tarefas
function updateCalendar() {
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

function updateTaskList() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerText = `Dia ${task.day}: ${task.task}`;
        listItem.style.textDecoration = task.status ? 'line-through' : 'none';
        listItem.addEventListener('click', () => {
            task.status = !task.status;
            updateCalendar();
            updateTaskList();
        });
        taskList.appendChild(listItem);
    });
}

// Carrega o calendário para o mês atual
function loadCalendar() {
    createCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

loadCalendar();

// Botões para navegar pelos meses
document.getElementById('prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    loadCalendar();
});

document.getElementById('next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    loadCalendar();
});

// Submit do formulário de tarefa
document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addTaskToList(currentDate.getDate());
});
