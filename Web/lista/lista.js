import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCh9Efra6D6DjRia4Yubq44NV28eeDPa8E",
    authDomain: "life-sync-fa0ee.firebaseapp.com",
    databaseURL: "https://life-sync-fa0ee-default-rtdb.firebaseio.com",
    projectId: "life-sync-fa0ee",
    storageBucket: "life-sync-fa0ee.appspot.com",
    messagingSenderId: "78086954632",
    appId: "1:78086954632:web:567a52d817e3de1280093d",
    measurementId: "G-EN04957NEZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');

const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const logoutLink = document.getElementById('logout-link');
const openMapButton = document.getElementById('open-map');
const closeMapButton = document.getElementById('close-map');
const locationInput = document.getElementById('location');
const mapContainer = document.getElementById('map-container');
const mapDiv = document.getElementById('map');

let userId;
let map;
let marker;

onAuthStateChanged(auth, (user) => {
    if (user) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutLink.style.display = 'block';
        userId = user.uid;
        loadTasks();
    } else {
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        taskList.innerHTML = '';
        userId = null;
    }
});

logoutLink.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = '/Web/landing_page/index.html';
    }).catch((error) => {
        console.error('Erro ao fazer logout:', error);
    });
});

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!userId) {
        alert('Você precisa estar logado para adicionar tarefas.');
        return;
    }

    const task = e.target.task.value.trim();
    const priority = e.target.priority.value;
    const date = e.target.date.value;
    const time = e.target.time.value.trim();
    const location = e.target.location.value.trim();
    const taskRef = push(ref(database, `tasks/${userId}`));

    set(taskRef, {
        task,
        priority,
        date,
        time: time || null,
        location: location || null,
        completed: false
    }).then(() => {
        e.target.reset();
    }).catch((error) => {
        console.error('Erro ao adicionar tarefa:', error);
    });
});

openMapButton.addEventListener('click', () => {
    mapContainer.style.display = 'block';
    if (!map) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map = new google.maps.Map(mapDiv, {
                center: userLocation,
                zoom: 12,
            });

            map.addListener('click', (e) => {
                placeMarkerAndPanTo(e.latLng, map);
            });
        }, () => {
            map = new google.maps.Map(mapDiv, {
                center: { lat: -15.7942, lng: -47.8822 }, // Centro do Brasil
                zoom: 4,
            });

            map.addListener('click', (e) => {
                placeMarkerAndPanTo(e.latLng, map);
            });
        });
    }
});

closeMapButton.addEventListener('click', () => {
    mapContainer.style.display = 'none';
});

function placeMarkerAndPanTo(latLng, map) {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
    }
    map.panTo(latLng);
    locationInput.value = `${latLng.lat()}, ${latLng.lng()}`;
}

function loadTasks() {
    if (!userId) return;
    const tasksRef = ref(database, `tasks/${userId}`);
    onValue(tasksRef, (snapshot) => {
        const tasks = snapshot.val();
        taskList.innerHTML = '';
        for (let id in tasks) {
            const task = tasks[id];
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            let taskDetails = `
                <span class="task-details">
                    ${task.task}<br>
                    (Prioridade: ${task.priority}, Data: ${task.date}`;
            if (task.time) taskDetails += `, Tempo: ${task.time}`;
            if (task.location) taskDetails += `, Localização: <button class="btn-secondary" onclick="viewLocation('${task.location}')">Ver Localização</button>`;
            taskDetails += `)</span>`;

            li.innerHTML = taskDetails;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-primary';
            completeBtn.textContent = 'Concluir';
            completeBtn.addEventListener('click', () => completeTask(id));

            const editBtn = document.createElement('button');
            editBtn.className = 'btn-secondary';
            editBtn.textContent = 'Editar';
            editBtn.addEventListener('click', () => editTask(id, task));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-danger';
            deleteBtn.textContent = 'Excluir';
            deleteBtn.addEventListener('click', () => deleteTask(id));

            taskActions.appendChild(completeBtn);
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
            li.appendChild(taskActions);

            taskList.appendChild(li);
        }
    });
}

function completeTask(id) {
    if (!userId) return;
    const taskRef = ref(database, `tasks/${userId}/${id}`);
    update(taskRef, { completed: true }).catch((error) => {
        console.error('Erro ao completar tarefa:', error);
    });
}

function deleteTask(id) {
    if (!userId) return;
    const taskRef = ref(database, `tasks/${userId}/${id}`);
    remove(taskRef).catch((error) => {
        console.error('Erro ao excluir tarefa:', error);
    });
}

function editTask(id, task) {
    const taskRef = ref(database, `tasks/${userId}/${id}`);
    const newTask = prompt("Editar tarefa:", task.task);
    const newPriority = prompt("Editar prioridade:", task.priority);
    const newDate = prompt("Editar data:", task.date);
    const newTime = prompt("Editar tempo:", task.time || "");
    const newLocation = prompt("Editar localização:", task.location || "");

    if (newTask && newPriority && newDate) {
        set(taskRef, {
            task: newTask,
            priority: newPriority,
            date: newDate,
            time: newTime || null,
            location: newLocation || null,
            completed: false
        }).catch((error) => {
            console.error('Erro ao editar tarefa:', error);
        });
    }
}

window.viewLocation = function (location) {
    const [lat, lng] = location.split(', ').map(Number);
    mapContainer.style.display = 'block';
    if (!map) {
        map = new google.maps.Map(mapDiv, {
            center: { lat, lng },
            zoom: 12,
        });
    }
    if (marker) {
        marker.setPosition({ lat, lng });
    } else {
        marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
        });
    }
    map.panTo({ lat, lng });
};
