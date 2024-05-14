// Obter a data atual
const currentDate = new Date();

// Definir o mês atual com base na data atual
let currentMonth = currentDate.getMonth(); // Janeiro é 0, Fevereiro é 1, ..., Dezembro é 11
let currentYear = currentDate.getFullYear();
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

                if (date === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
                    cell.classList.add("today");
                }

                cell.appendChild(cellText);
                const formattedDate = formatDate(currentYear, currentMonth + 1, date);
                cell.dataset.date = formattedDate;
                const tasks = getTasksForDate(formattedDate);
                tasks.forEach(task => {
                    const taskIndicator = document.createElement("span");
                    taskIndicator.className = "task-indicator";
                    taskIndicator.style.backgroundColor = task.color;
                    taskIndicator.onclick = function() {
                        if (task.color === "blue" || task.color === "red") {
                            // Mudar a cor da tarefa para verde se for azul ou vermelho
                            task.color = "green";
                        } else {
                            // Mudar a cor da tarefa para cinza escuro se for verde ou cinza escuro
                            task.color = "gray";
                        }
                        updateTabs();
                    };
                    cell.appendChild(taskIndicator);
                });
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

function formatDate(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function highlightTaskDate(date) {
    const cells = document.querySelectorAll('td[data-date="' + date + '"]');
    cells.forEach(cell => {
        if (!cell.classList.contains('task-added')) {
            cell.classList.add('task-added');
        }
    });
}

function updateTaskIndicators() {
    const calendarCells = document.querySelectorAll('#calendarBody td');
    calendarCells.forEach(cell => {
        const date = cell.dataset.date;
        const tasks = getTasksForDate(date);
        if (tasks.length > 0) {
            const indicator = document.createElement('span');
            indicator.classList.add('task-indicator');
            cell.appendChild(indicator);
        }
    });
}

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskDateInput = document.getElementById("taskDate").value; // Obtém a data do input como string
    var taskColor = document.getElementById("taskColor").value;
    var taskList = document.getElementById("taskList");
    var task = taskInput.value;
    if (task.trim() !== "" && taskDateInput.trim() !== "") {
        var dateParts = taskDateInput.split('-'); // Divide a string da data em partes
        var taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Cria a data a partir das partes da string
        const formattedTaskDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Formata a data como dia/mês/ano
        var li = document.createElement("li");
        li.textContent = task + " " + formattedTaskDate; // Adiciona a tarefa com a data formatada
        li.style.color = taskColor;
        taskList.appendChild(li);
        taskInput.value = "";
        document.getElementById("taskDate").value = ""; // Limpa o campo de data após adicionar a tarefa
        generateCalendar(); // Atualiza o calendário após adicionar a tarefa
        updateTabs();
        highlightTaskDate(formatDate(dateParts[0], dateParts[1], dateParts[2])); // Destaca a data no calendário
        updateTaskIndicators(); // Atualiza os indicadores de tarefa no calendário
    } else {
        alert("Por favor, insira uma tarefa válida e selecione uma data.");
    }
}

function formatDate(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getTasksForDate(date) {
    const taskList = document.getElementById("taskList");
    const tasks = [];
    const lis = taskList.getElementsByTagName("li");
    for (let i = 0; i < lis.length; i++) {
        const taskDate = lis[i].textContent.split(' ')[1];
        if (taskDate === date) {
            const text = lis[i].textContent.split(' ')[0];
            const color = lis[i].style.color;
            tasks.push({ text, color });
        }
    }
    return tasks;
}

function showTasks(cell) {
    const date = cell.dataset.date;
    const tasks = getTasksForDate(date);
    
    // Limpar a lista de tarefas anteriores
    const taskDisplay = document.getElementById("taskDisplay");
    taskDisplay.innerHTML = "";
    
    // Adicionar as tarefas marcadas ao elemento de exibição
    tasks.forEach(task => {
        const taskElement = document.createElement("li");
        taskElement.textContent = task.text;
        taskElement.style.color = task.color;
        taskDisplay.appendChild(taskElement);
    });
}

function changeTab(color) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none';
    });
    document.getElementById(color).style.display = 'block';
    document.getElementById(color + "-tab").classList.add('active');
}

function updateTabs() {
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");
    const redTab = document.getElementById("red");
    const blueTab = document.getElementById("blue");
    const greenTab = document.getElementById("green");
    const grayTab = document.getElementById("gray");
    redTab.innerHTML = "";
    blueTab.innerHTML = "";
    greenTab.innerHTML = "";
    grayTab.innerHTML = "";
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].style.color === "red") {
            const task = document.createElement("li");
            task.textContent = tasks[i].textContent;
            redTab.appendChild(task);
        } else if (tasks[i].style.color === "blue") {
            const task = document.createElement("li");
            task.textContent = tasks[i].textContent;
            blueTab.appendChild(task);
        } else if (tasks[i].style.color === "green") {
            const task = document.createElement("li");
            task.textContent = tasks[i].textContent;
            greenTab.appendChild(task);
        } else if (tasks[i].style.color === "gray") {
            const task = document.createElement("li");
            task.textContent = tasks[i].textContent;
            grayTab.appendChild(task);
        }
    }
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
