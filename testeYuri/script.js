let currentMonth = 3; // Janeiro é 0, Fevereiro é 1, ..., Dezembro é 11
let currentYear = 2024;
let taskIdCounter = 0; // Contador para atribuir IDs únicos às tarefas
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

document.getElementById("addTaskButton").addEventListener("click", addTask);

function generateUniqueId() {
    return taskIdCounter++;
}

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
                const button = document.createElement("button");
                button.textContent = date;
                button.classList.add("calendar-day");
                button.dataset.date = formatDate(currentYear, currentMonth + 1, date);

                const tasks = getTasksForDate(button.dataset.date);
                tasks.forEach(task => {
                    const taskIndicator = document.createElement("span");
                    taskIndicator.className = "task-indicator";
                    taskIndicator.dataset.taskId = task.id;
                    taskIndicator.style.backgroundColor = task.color;
                    button.appendChild(taskIndicator);
                    taskIndicator.onclick = function() {
                        const taskId = parseInt(this.dataset.taskId);
                        const task = tasks.find(t => t.id === taskId);
                        if (task.color === "blue" || task.color === "red") {
                            task.color = "green";
                        } else {
                            task.color = "black";
                        }
                        updateTabs();
                        generateCalendar();
                    };
                });

                cell.appendChild(button);
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

    updateCalendarColors(); // Atualiza as cores dos botões do calendário
}

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskDateInput = document.getElementById("taskDate").value;
    var taskColor = document.getElementById("taskColor").value;
    var taskList = document.getElementById("taskList");
    var task = taskInput.value;
    if (task.trim() !== "" && taskDateInput.trim() !== "") {
        var dateParts = taskDateInput.split('-');
        var taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const formattedTaskDate = formatDate(taskDate.getFullYear(), taskDate.getMonth() + 1, taskDate.getDate());
        var li = document.createElement("li");
        const taskId = generateUniqueId();
        li.dataset.taskId = taskId;
        li.innerHTML = `<span class="task-text">${task} - ${formattedTaskDate}</span>
                        <button class="edit-button" onclick="editTask(this)">Editar</button>
                        <button class="delete-button" onclick="deleteTask(this)">Excluir</button>
                        <button class="done-button" onclick="markTaskAsDone(this)">Feita</button>
                        <button class="undone-button" onclick="markTaskAsUndone(this)">Não Feita</button>`;
        li.style.color = taskColor;
        taskList.appendChild(li);
        taskInput.value = "";
        document.getElementById("taskDate").value = "";
        updateCalendarColors(); // Atualiza as cores dos botões do calendário
        updateTabs();
    } else {
        alert("Por favor, insira uma tarefa válida e selecione uma data.");
    }
}

function updateCalendarColors() {
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");
    for (let i = 0; i < tasks.length; i++) {
        const taskText = tasks[i].querySelector(".task-text").textContent;
        const taskDate = taskText.split(' - ')[1];
        const taskColor = tasks[i].style.color;
        const formattedTaskDate = formatDate(new Date(taskDate).getFullYear(), new Date(taskDate).getMonth() + 1, new Date(taskDate).getDate());
        const cells = document.querySelectorAll(`[data-date="${formattedTaskDate}"]`);
        cells.forEach(cell => {
            cell.style.backgroundColor = taskColor;
        });
    }
}

function formatDate(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getTasksForDate(date) {
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");
    const filteredTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        const taskDate = tasks[i].textContent.split(' - ')[1];
        if (taskDate === date) {
            const taskId = parseInt(tasks[i].dataset.taskId);
            const taskColor = tasks[i].style.color;
            filteredTasks.push({
                id: taskId,
                color: taskColor
            });
        }
    }
    return filteredTasks;
}

function editTask(button) {
    var taskItem = button.parentNode;
    var taskText = taskItem.querySelector(".task-text").textContent;
    var newTaskText = prompt("Editar tarefa:", taskText);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        taskItem.querySelector(".task-text").textContent = newTaskText;
    }
}

function deleteTask(button) {
    var taskItem = button.parentNode;
    taskItem.parentNode.removeChild(taskItem);
    updateTabs();
}

function markTaskAsDone(button) {
    var taskItem = button.parentNode;
    taskItem.style.color = "green";
}

function markTaskAsUndone(button) {
    var taskItem = button.parentNode;
    taskItem.style.color = "black";
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

function getTasksByColor(color) {
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");
    const filteredTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].style.color === color) {
            const taskId = parseInt(tasks[i].dataset.taskId);
            filteredTasks.push(taskId);
        }
    }
    return filteredTasks;
}

function updateTaskList(tasks) {
    const redTab = document.getElementById("red");
    const blueTab = document.getElementById("blue");
    const greenTab = document.getElementById("green");
    const grayTab = document.getElementById("gray");
    redTab.innerHTML = "";
    blueTab.innerHTML = "";
    greenTab.innerHTML = "";
    grayTab.innerHTML = "";
    for (var i = 0; i < tasks.length; i++) {
        const task = document.querySelector(`li[data-task-id="${tasks[i]}"]`);
        const clonedTask = task.cloneNode(true);
        if (task.style.color === "red") {
            redTab.appendChild(clonedTask);
        } else if (task.style.color === "blue") {
            blueTab.appendChild(clonedTask);
        } else if (task.style.color === "green") {
            greenTab.appendChild(clonedTask);
        } else if (task.style.color === "gray") {
            grayTab.appendChild(clonedTask);
        }
    }
}

function updateTabs() {
    const redTasks = getTasksByColor("red");
    const blueTasks = getTasksByColor("blue");
    const greenTasks = getTasksByColor("green");
    const grayTasks = getTasksByColor("gray");
    updateTaskList(redTasks);
    updateTaskList(blueTasks);
    updateTaskList(greenTasks);
    updateTaskList(grayTasks);
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
