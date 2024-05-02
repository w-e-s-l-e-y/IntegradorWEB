let currentMonth = 3; // Janeiro é 0, Fevereiro é 1, ..., Dezembro é 11
let currentYear = 2024;
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

document.getElementById("addTaskButton").addEventListener("click", addTask);

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

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskDateInput = document.getElementById("taskDate").value; // Obtém a data do input como string
    var taskColor = document.getElementById("taskColor").value;
    var taskList = document.getElementById("taskList");
    var task = taskInput.value;
    if (task.trim() !== "" && taskDateInput.trim() !== "") {
        var dateParts = taskDateInput.split('-'); // Divide a string da data em partes
        var taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Cria a data a partir das partes da string
        const formattedTaskDate = formatDate(taskDate.getFullYear(), taskDate.getMonth() + 1, taskDate.getDate());
        var li = document.createElement("li");
        li.innerHTML = `<span class="task-text">${task} - ${formattedTaskDate}</span>
                        <button class="edit-button" onclick="editTask(this)">Editar</button>
                        <button class="delete-button" onclick="deleteTask(this)">Excluir</button>`;
        li.style.color = taskColor;
        taskList.appendChild(li);
        taskInput.value = "";
        document.getElementById("taskDate").value = ""; // Limpa o campo de data após adicionar a tarefa
        generateCalendar(); // Atualiza o calendário após adicionar a tarefa
        updateTabs();
    } else {
        alert("Por favor, insira uma tarefa válida e selecione uma data.");
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
            filteredTasks.push({
                text: tasks[i].textContent,
                color: tasks[i].style.color
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

function changeTab(color) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    tabContents.forEach(tabContent => {
        tabContent.style.display = 'none';
    });
    document.getElementById(color + "-tab").classList.add('active');
    const filteredTasks = getTasksByColor(color);
    updateTaskList(filteredTasks);
}

function getTasksByColor(color) {
    const taskList = document.getElementById("taskList");
    const tasks = taskList.getElementsByTagName("li");
    const filteredTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].style.color === color) {
            filteredTasks.push(tasks[i]);
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
        const task = document.createElement("li");
        task.innerHTML = tasks[i].innerHTML; // mantém o HTML original
        task.style.color = tasks[i].style.color;
        if (tasks[i].style.color === "red") {
            redTab.appendChild(task);
        } else if (tasks[i].style.color === "blue") {
            blueTab.appendChild(task);
        } else if (tasks[i].style.color === "green") {
            greenTab.appendChild(task);
        } else if (tasks[i].style.color === "gray") {
            grayTab.appendChild(task);
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

// Gerar o calendário inicial
generateCalendar();
