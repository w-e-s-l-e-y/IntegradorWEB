document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    // Aqui você pode adicionar a lógica de validação do login, como verificar o nome de usuário e a senha
    
    // Por enquanto, vamos apenas exibir os dados no console
    console.log("Username:", username);
    console.log("Password:", password);
});
