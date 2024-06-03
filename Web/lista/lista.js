let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.5505, lng: -46.6333 }, // Posição inicial (São Paulo)
        zoom: 12,
    });

    map.addListener('click', (e) => {
        placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
    }
    document.getElementById('localizacao').value = `${latLng.lat()},${latLng.lng()}`;
    map.panTo(latLng);
}

function openMap() {
    document.getElementById('map-container').style.display = 'block';
}

function closeMap() {
    document.getElementById('map-container').style.display = 'none';
}



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nova-tarefa-form');
    const listaTarefas = document.getElementById('lista-tarefas');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tarefa = document.getElementById('tarefa').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const prioridade = document.getElementById('prioridade').value;
        const localizacao = document.getElementById('localizacao').value;
        adicionarTarefa(tarefa, data, hora, prioridade, localizacao);
        form.reset();
        closeMap();
    });

    function adicionarTarefa(tarefa, data, hora, prioridade, localizacao) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        const novaTarefa = { tarefa, data, hora, prioridade, localizacao };
        tarefas.push(novaTarefa);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarTarefas();
    }

    function renderizarTarefas() {
        listaTarefas.innerHTML = '';
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.forEach((tarefaObj, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="texto-tarefa">${tarefaObj.tarefa} - ${tarefaObj.data} ${tarefaObj.hora ? tarefaObj.hora : ''} - ${tarefaObj.prioridade}</span>
                ${tarefaObj.localizacao ? `<a href="https://www.google.com/maps?q=${tarefaObj.localizacao}" target="_blank">Ver Localização</a>` : ''}
                <button class="editar" data-index="${index}">Editar</button>
                <button class="concluir" data-index="${index}">Concluir</button>
                <div class="spinner" style="display: none;">⏳</div>
                <div class="editar-tarefa" style="display: none;">
                    <input type="text" class="editar-texto" value="${tarefaObj.tarefa}">
                    <input type="date" class="editar-data" value="${tarefaObj.data}">
                    <input type="time" class="editar-hora" value="${tarefaObj.hora}">
                    <select class="editar-prioridade">
                        <option value="alta"${tarefaObj.prioridade === 'alta' ? ' selected' : ''}>Alta</option>
                        <option value="media"${tarefaObj.prioridade === 'media' ? ' selected' : ''}>Média</option>
                        <option value="baixa"${tarefaObj.prioridade === 'baixa' ? ' selected' : ''}>Baixa</option>
                    </select>
                    <input type="text" class="editar-localizacao" value="${tarefaObj.localizacao}" readonly>
                    <button type="button" class="selecionar-localizacao">Selecionar Localização</button>
                    <button class="salvar" data-index="${index}">Salvar</button>
                </div>
            `;
            listaTarefas.appendChild(li);

            const editarBtn = li.querySelector('.editar');
            const concluirBtn = li.querySelector('.concluir');
            const salvarBtn = li.querySelector('.salvar');
            const selecionarLocalizacaoBtn = li.querySelector('.selecionar-localizacao');
            const editarDiv = li.querySelector('.editar-tarefa');
            const spinner = li.querySelector('.spinner');

            editarBtn.addEventListener('click', () => {
                editarDiv.style.display = editarDiv.style.display === 'none' ? 'block' : 'none';
            });

            concluirBtn.addEventListener('click', () => {
                concluirTarefa(index);
            });

            salvarBtn.addEventListener('click', () => {
                spinner.style.display = 'inline-block';
                setTimeout(() => {
                    salvarTarefa(index, li);
                    spinner.style.display = 'none';
                    editarDiv.style.display = 'none';
                }, 1000);
            });

            selecionarLocalizacaoBtn.addEventListener('click', () => {
                openMap();
                if (tarefaObj.localizacao) {
                    const [lat, lng] = tarefaObj.localizacao.split(',').map(Number);
                    marker = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                    });
                    map.panTo(marker.getPosition());
                }
            });
        });
    }

    function concluirTarefa(index) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.splice(index, 1);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarTarefas();
    }

    function salvarTarefa(index, li) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        const novoTexto = li.querySelector('.editar-texto').value;
        const novaData = li.querySelector('.editar-data').value;
        const novaHora = li.querySelector('.editar-hora').value;
        const novaPrioridade = li.querySelector('.editar-prioridade').value;
        const novaLocalizacao = li.querySelector('.editar-localizacao').value;
        tarefas[index] = { tarefa: novoTexto, data: novaData, hora: novaHora, prioridade: novaPrioridade, localizacao: novaLocalizacao };
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        renderizarTarefas();
    }

    renderizarTarefas();
});
