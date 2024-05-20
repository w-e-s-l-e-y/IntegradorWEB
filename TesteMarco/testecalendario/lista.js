const currentDate = new Date();

let currentMonth = currentDate.getMonth(); // Janeiro é 0, Fevereiro é 1, ..., Dezembro é 11
let currentYear = currentDate.getFullYear();
const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let tasks = {};

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

                const tasksForDate = getTasksForDate(formattedDate);

                if (tasksForDate.length > 0) {
                    cell.classList.add("task-day");
                }

                cell.addEventListener("click", () => {
                    displayTasks(formattedDate, tasksForDate);
                });

                tasksForDate.forEach(task => {
                    const taskIndicator = document.createElement("span");
                    taskIndicator.className = "task-indicator";
                    taskIndicator.style.backgroundColor = task.color;
                    taskIndicator.onclick = function() {
                        if (task.color === "blue" || task.color === "red") {
                            task.color = "green";
                        }
                        generateCalendar(); // Regerar o calendário para atualizar as cores
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

function displayTasks(date, tasks) {
    if (tasks.length > 0) {
        let taskList = tasks.map(task => {
            let status = task.color === "green" ? "Feito" : "";
            return `${task.text} - ${task.priority} Prioridade (${status})`;
        }).join("\n");
        alert(`Tarefas para ${date}:\n${taskList}`);
    } else {
        alert(`Nenhuma tarefa para ${date}`);
    }
}


function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskDateInput = document.getElementById("taskDate").value;
    const taskColor = document.getElementById("taskColor").value;
    const taskList = document.getElementById("taskList");
    const task = taskInput.value;
    if (task.trim() !== "" && taskDateInput.trim() !== "") {
        const dateParts = taskDateInput.split('-');
        const taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const formattedTaskDate = formatDate(taskDate.getFullYear(), taskDate.getMonth() + 1, taskDate.getDate());

        if (!tasks[formattedTaskDate]) {
            tasks[formattedTaskDate] = [];
        }
        tasks[formattedTaskDate].push({
            text: task,
            color: taskColor,
            priority: taskColor === "red" ? "Alta" : "Baixa"
        });

        const li = document.createElement("li");
        li.textContent = task + " - " + formattedTaskDate;
        li.style.color = taskColor;
        li.dataset.originalColor = taskColor; // Armazena a cor original

        // Botão de Editar
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = function() {
            editTask(li);
        };

        // Botão de Excluir
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function() {
            deleteTask(li);
        };

        // Botão de Marcar como Feita
        const doneButton = document.createElement("button");
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
        generateCalendar(); // Atualizar o calendário após adicionar uma tarefa
        updateTabs();
    } else {
        alert("Por favor, insira uma tarefa válida e selecione uma data.");
    }
}

function editTask(taskItem) {
    const taskText = taskItem.childNodes[0].textContent;
    const taskDetails = taskText.split(' - ');
    const taskName = taskDetails[0];
    const taskDate = taskDetails[1];
    const taskPriority = taskItem.dataset.originalColor;

    const newTaskName = prompt("Edite a tarefa:", taskName);
    if (newTaskName !== null && newTaskName.trim() !== "") {
        const newTaskDate = prompt("Edite a data (DD-MM-AAAA):", taskDate);
        if (newTaskDate !== null && newTaskDate.trim() !== "") {
            const newTaskPriority = prompt("Edite a prioridade (red para alta, blue para baixa):", taskPriority);
            if (newTaskPriority !== null && (newTaskPriority.trim() === "red" || newTaskPriority.trim() === "blue")) {
                const dateParts = newTaskDate.split('-');
                const formattedDate = formatDate(dateParts[2], dateParts[1], dateParts[0]);
                taskItem.childNodes[0].textContent = newTaskName + " - " + formattedDate;
                taskItem.style.color = newTaskPriority.trim();
                taskItem.dataset.originalColor = newTaskPriority.trim();
                updateTaskInList(taskDetails[1], taskDetails[0], formattedDate, newTaskName, newTaskPriority.trim());
            } else {
                alert("Por favor, insira uma prioridade válida (red para alta, blue para baixa).");
            }
        }
    }
}

function updateTaskInList(oldDate, oldName, newDate, newName, newPriority) {
    if (tasks[oldDate]) {
        const taskIndex = tasks[oldDate].findIndex(task => task.text.includes(oldName));
        if (taskIndex !== -1) {
            tasks[oldDate].splice(taskIndex, 1);
        }
        if (tasks[oldDate].length === 0) {
            delete tasks[oldDate];
        }
    }

    if (!tasks[newDate]) {
        tasks[newDate] = [];
    }
    tasks[newDate].push({
        text: newName,
        color: newPriority,
        priority: newPriority === "red" ? "Alta" : "Baixa"
    });

    generateCalendar();
}

function deleteTask(taskItem) {
    const taskText = taskItem.childNodes[0].textContent;
    const taskDetails = taskText.split(' - ');
    const taskDate = taskDetails[1];

    const taskIndex = tasks[taskDate].findIndex(task => task.text.includes(taskDetails[0]));
    if (taskIndex !== -1) {
        tasks[taskDate].splice(taskIndex, 1);
        if (tasks[taskDate].length === 0) {
            delete tasks[taskDate];
        }
    }

    taskItem.remove();
    generateCalendar();
    updateTabs();
}

function markAsDone(taskItem) {
    const taskText = taskItem.childNodes[0].textContent;
    const taskDetails = taskText.split(' - ');
    const taskDate = taskDetails[1];

    const taskIndex = tasks[taskDate].findIndex(task => task.text.includes(taskDetails[0]));
    if (taskIndex !== -1) {
        tasks[taskDate][taskIndex].color = "green";
    }

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
    const paddedDay = day.toString().padStart(2, '0');
    const paddedMonth = month.toString().padStart(2, '0');
    return `${paddedDay}-${paddedMonth}-${year}`;
}

function getTasksForDate(date) {
    return tasks[date] || [];
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
    for (let i = 0; i < tasks.length; i++) {
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


