document.addEventListener('DOMContentLoaded', () => {
    const calendarioEl = document.getElementById('calendario');
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    const eventos = tarefas.map(tarefa => ({
        title: `${tarefa.tarefa} - ${tarefa.prioridade}`,
        start: `${tarefa.data}T${tarefa.hora}`,
        description: tarefa.localizacao ? `<a href="https://www.google.com/maps?q=${tarefa.localizacao}" target="_blank">Ver Localização</a>` : ''
    }));

    const calendario = new FullCalendar.Calendar(calendarioEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        events: eventos,
        eventRender: function(info) {
            if (info.event.extendedProps.description) {
                info.el.querySelector('.fc-title').innerHTML += `<br>${info.event.extendedProps.description}`;
            }
        }
    });

    calendario.render();
});
