// Auth Module JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  const remember = formData.get('remember');

  try {
    // Fazer requisição para o backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        remember
      })
    });

    const result = await response.json();

    if (result.success) {
      showMessage('Login realizado com sucesso!', 'success');
      
      // Redirecionar IMEDIATAMENTE para o dashboard - SEM VALIDAÇÃO
      window.location.href = '/dashboard';
    } else {
      showMessage(result.message || 'Erro no login', 'error');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
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
