// Auth Module JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  // Modo de testes: aceita qualquer usuário e senha
  showMessage('Login realizado com sucesso! (modo teste)', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

function showMessage(message, type) {
  // Remove mensagens anteriores
  const existingMessages = document.querySelectorAll('.auth-message');
  existingMessages.forEach(msg => msg.remove());

  const messageDiv = document.createElement('div');
  messageDiv.className = `auth-message ${type}`;
  messageDiv.textContent = message;

  const form = document.querySelector('.auth-form');
  form.parentNode.insertBefore(messageDiv, form);

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Função para logout (exportada para uso global)
window.logout = function logout() {
  fetch('/api/auth/logout', {
    method: 'POST'
  })
    .then(() => {
      window.location.href = '/auth/login';
    })
    .catch(error => {
      console.error('Erro no logout:', error);
    });
};
