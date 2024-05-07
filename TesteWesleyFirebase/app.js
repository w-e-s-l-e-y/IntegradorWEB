
  // Configurações do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBKEbvSnm0uEXBoO9EXphaIDd4muen9ZNU",
    authDomain: "lifesync-581d7.firebaseapp.com",
    projectId: "lifesync-581d7",
    storageBucket: "lifesync-581d7.appspot.com",
    messagingSenderId: "910441512297",
    appId: "1:910441512297:web:d193f0df19aef739d791f8"
 
  };
  
  // Inicializando o Firebase com as configurações
  firebase.initializeApp(firebaseConfig);
  
  // Referência para o banco de dados
  const database = firebase.database();
  
  // Função para cadastrar um novo usuário
  function cadastrarUsuario(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
  
    const nome = document.getElementById("nomeUsuario").value;
    const email = document.getElementById("emailUsuario").value;
  
    const userId = database.ref('usuarios').push().key; // Cria uma nova chave para o usuário
  
    database.ref('usuarios/' + userId).set({
      nome: nome,
      email: email
      // Outros campos do usuário, se necessário
    })
    .then(() => {
      console.log("Usuário cadastrado com sucesso!");
      document.getElementById("formUsuario").reset(); // Limpa o formulário após o cadastro
    })
    .catch((error) => {
      console.error("Erro ao cadastrar usuário:", error);
    });
  }
  
  // Função para cadastrar uma nova tarefa para um usuário
  function cadastrarTarefa(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
  
    const descricao = document.getElementById("descricaoTarefa").value;
    const data = document.getElementById("dataTarefa").value;
  
    const userId = "ID_DO_USUARIO"; // Substitua pelo ID do usuário real
  
    const taskId = database.ref('usuarios/' + userId + '/tarefas').push().key; // Cria uma nova chave para a tarefa
  
    database.ref('usuarios/' + userId + '/tarefas/' + taskId).set({
      descricao: descricao,
      data: data
      // Outros campos da tarefa, se necessário
    })
    .then(() => {
      console.log("Tarefa cadastrada com sucesso!");
      document.getElementById("formTarefa").reset(); // Limpa o formulário após o cadastro
    })
    .catch((error) => {
      console.error("Erro ao cadastrar tarefa:", error);
    });
  }
  
  // Função para cadastrar um evento no calendário de um usuário
  function cadastrarEventoCalendario(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
  
    const data = document.getElementById("dataEvento").value;
    const descricao = document.getElementById("descricaoEvento").value;
  
    const userId = "ID_DO_USUARIO"; // Substitua pelo ID do usuário real
  
    const eventoId = database.ref('usuarios/' + userId + '/calendario/' + data).push().key; // Cria uma nova chave para o evento
  
    database.ref('usuarios/' + userId + '/calendario/' + data + '/' + eventoId).set({
      descricao: descricao
      // Outros campos do evento, se necessário
    })
    .then(() => {
      console.log("Evento do calendário cadastrado com sucesso!");
      document.getElementById("formEvento").reset(); // Limpa o formulário após o cadastro
    })
    .catch((error) => {
      console.error("Erro ao cadastrar evento do calendário:", error);
    });
  }
  
  // Adicionando listeners para os formulários
  document.getElementById("formUsuario").addEventListener("submit", cadastrarUsuario);
  document.getElementById("formTarefa").addEventListener("submit", cadastrarTarefa);
  document.getElementById("formEvento").addEventListener("submit", cadastrarEventoCalendario);
  