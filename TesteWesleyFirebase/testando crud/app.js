// Inicialize o Firebase com sua configuração
var firebaseConfig = {
    apiKey: "AIzaSyBKEbvSnm0uEXBoO9EXphaIDd4muen9ZNU",
    authDomain: "lifesync-581d7.firebaseapp.com",
    databaseURL: "https://lifesync-581d7-default-rtdb.firebaseio.com",
    projectId: "lifesync-581d7",
    storageBucket: "lifesync-581d7.appspot.com",
    messagingSenderId: "910441512297",
    appId: "1:910441512297:web:d193f0df19aef739d791f8"
};
console.log("Configuração do Firebase:", firebaseConfig);
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

document.getElementById('login').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("Tentando login com:", email, password);
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Usuário logado:", userCredential);
            document.getElementById('auth').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            document.getElementById('userName').textContent = userCredential.user.email;
            const userId = userCredential.user.uid;
            loadUserData(userId);
        })
        .catch((error) => {
            console.error('Erro ao fazer login:', error);
            alert('Login falhou: ' + error.message);
        });
});

document.getElementById('logout').addEventListener('click', () => {
    console.log("Tentando fazer logout");
    auth.signOut().then(() => {
        console.log("Usuário deslogado");
        document.getElementById('auth').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
});

function loadUserData(userId) {
    console.log("Carregando dados do usuário:", userId);
    const userRef = db.ref('usuarios/' + userId);
    userRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log("Dados do usuário carregados:", data);
        localStorage.setItem('userData', JSON.stringify(data));
        updateUI(userId, data);
    });
}

function updateUI(userId, data) {
    console.log("Atualizando UI com dados do usuário:", userId, data);
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    for (let taskId in data.tarefas) {
        const task = data.tarefas[taskId];
        console.log("Tarefa:", taskId, task);
        const listItem = document.createElement('li');
        const taskDate = task.evento ? formatDateToBR(task.evento) : 'Data não fornecida';
        listItem.textContent = `${task.nomeTarefa} - ${taskDate} - ${task.prioridade}`;
        taskList.appendChild(listItem);

        // Adding delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(userId, taskId));
        listItem.appendChild(deleteButton);

        // Adding update button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => updateTask(userId, taskId, task));
        listItem.appendChild(updateButton);

        // Adding complete button
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Concluido';
        completeButton.addEventListener('click', () => completeTask(userId, taskId));
        listItem.appendChild(completeButton);
    }
}

// Util functions to format date
function formatDateToBR(dateString) {
    if (typeof dateString !== 'string') {
        console.error('Invalid date format:', dateString);
        return '';
    }
    return dateString.split('-').reverse().join('/');
}

function formatDateFromBR(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;
    const taskName = document.getElementById('taskName').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskPriority = document.getElementById('taskPriority').value;
    console.log("Adicionando nova tarefa:", taskName, taskDate, taskPriority);
    const newTaskRef = db.ref('usuarios/' + userId + '/tarefas').push();
    newTaskRef.set({
        nomeTarefa: taskName,
        evento: taskDate,
        prioridade: taskPriority,
        estadoAtual: 'ativo',
        pomodoroConcluido: 0,
        tempoInicial: Date.now(),
        tempoFinal: Date.now()
    }).then(() => {
        console.log("Tarefa adicionada com sucesso");
        alert('Task added successfully');
        document.getElementById('taskForm').reset();
    }).catch((error) => {
        console.error('Erro ao adicionar tarefa:', error);
        alert('Failed to add task: ' + error.message);
    });
});

function deleteTask(userId, taskId) {
    console.log("Deletando tarefa:", taskId);
    db.ref('usuarios/' + userId + '/tarefas/' + taskId).remove()
        .then(() => {
            console.log("Tarefa deletada com sucesso");
            alert('Task deleted successfully');
        })
        .catch((error) => {
            console.error('Erro ao deletar tarefa:', error);
            alert('Failed to delete task: ' + error.message);
        });
}

function updateTask(userId, taskId, task) {
    const taskName = prompt("Update Task Name", task.nomeTarefa);
    const taskDate = prompt("Update Task Date (dd/mm/yyyy)", task.evento ? formatDateToBR(task.evento) : '');
    const taskPriority = prompt("Update Task Priority", task.prioridade);

    if (taskName && taskDate && taskPriority) {
        const formattedDate = formatDateFromBR(taskDate);
        console.log("Atualizando tarefa:", taskId, taskName, formattedDate, taskPriority);
        db.ref('usuarios/' + userId + '/tarefas/' + taskId).update({
            nomeTarefa: taskName,
            evento: formattedDate,
            prioridade: taskPriority,
            tempoFinal: Date.now() // Update the time to current timestamp
        }).then(() => {
            console.log("Tarefa atualizada com sucesso");
            alert('Task updated successfully');
        }).catch((error) => {
            console.error('Erro ao atualizar tarefa:', error);
            alert('Failed to update task: ' + error.message);
        });
    } else {
        alert('All fields must be filled out to update the task');
    }
}

function completeTask(userId, taskId) {
    console.log("Concluindo tarefa:", taskId);
    db.ref('usuarios/' + userId + '/tarefas/' + taskId).update({
        estadoAtual: 'concluido',
        tempoFinal: Date.now() // Update the time to current timestamp
    }).then(() => {
        console.log("Tarefa concluída com sucesso");
        alert('Task completed successfully');
    }).catch((error) => {
        console.error('Erro ao concluir tarefa:', error);
        alert('Failed to complete task: ' + error.message);
    });
}
