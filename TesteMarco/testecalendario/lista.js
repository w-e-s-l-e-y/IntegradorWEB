
const currentDate = new Date();


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
                            task.color = "orange";
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
    var taskDateInput = document.getElementById("taskDate").value;
    var taskColor = document.getElementById("taskColor").value;
    var taskList = document.getElementById("taskList");
    var task = taskInput.value;
    if (task.trim() !== "" && taskDateInput.trim() !== "") {
        var dateParts = taskDateInput.split('-');
        var taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const formattedTaskDate = formatDate(taskDate.getFullYear(), taskDate.getMonth() + 1, taskDate.getDate());

        var li = document.createElement("li");
        li.textContent = task + " - " + formattedTaskDate;
        li.style.color = taskColor;
        li.dataset.originalColor = taskColor; // Armazena a cor original

        // Botão de Editar
        var editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = function() {
            editTask(li);
        };

        // Botão de Excluir
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            deleteTask(li);
        };

        // Botão de Marcar como Feita
        var doneButton = document.createElement("button");
        doneButton.textContent = "Feita";
        doneButton.onclick = function() {
            markAsDone(li);
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(doneButton);
        taskList.appendChild(li);

        taskInput.value = "";
        document.getElementById("taskDate").value = "";
        generateCalendar();
        updateTabs();
    } else {
        alert("Por favor, insira uma tarefa válida e selecione uma data.");
    }
}

function editTask(taskItem) {
    var taskText = taskItem.childNodes[0].textContent;
    var taskDetails = taskText.split(' - ');
    var taskName = taskDetails[0];
    var taskDate = taskDetails[1];

    var newTaskName = prompt("Edite a tarefa:", taskName);
    if (newTaskName !== null && newTaskName.trim() !== "") {
        var newTaskDate = prompt("Edite a data (AAAA-MM-DD):", taskDate);
        if (newTaskDate !== null && newTaskDate.trim() !== "") {
            var dateParts = newTaskDate.split('-');
            var formattedDate = formatDate(dateParts[0], dateParts[1], dateParts[2]);
            taskItem.childNodes[0].textContent = newTaskName + " - " + formattedDate;
            generateCalendar();
            updateTabs();
        }
    }
}

function deleteTask(taskItem) {
    var taskList = document.getElementById("taskList");
    taskList.removeChild(taskItem);
    generateCalendar();
    updateTabs();
}

function markAsDone(taskItem) {
    taskItem.style.color = "green";
    generateCalendar();
    updateTabs();
}



function restoreOriginalColor(taskItem) {
    taskItem.style.color = taskItem.dataset.originalColor;
    generateCalendar();
    updateTabs();
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
    const orangeTab = document.getElementById("orange");
    redTab.innerHTML = "";
    blueTab.innerHTML = "";
    greenTab.innerHTML = "";
    orangeTab.innerHTML = "";
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
        } else if (tasks[i].style.color === "orange") {
            const task = document.createElement("li");
            task.textContent = tasks[i].textContent;
            orangeTab.appendChild(task);
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
