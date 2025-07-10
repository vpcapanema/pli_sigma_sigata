// Funções usadas via HTML (onclick) são suprimidas corretamente
// Settings Module JavaScript
// Variável de controle de abas removida pois não é utilizada

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSettings();
});

function setupEventListeners() {
  setupFormListeners();
  setupUserModalListeners();
}

function setupFormListeners() {
  const generalForm = document.getElementById('generalForm');
  const securityForm = document.getElementById('securityForm');
  const backupForm = document.getElementById('backupForm');
  const userForm = document.getElementById('userForm');
  if (generalForm) generalForm.addEventListener('submit', handleGeneralSubmit);
  if (securityForm) securityForm.addEventListener('submit', handleSecuritySubmit);
  if (backupForm) backupForm.addEventListener('submit', handleBackupSubmit);
  if (userForm) userForm.addEventListener('submit', handleUserSubmit);
}

function setupUserModalListeners() {
  const addUserBtn = document.getElementById('addUserBtn');
  const closeUserModal = document.getElementById('closeUserModal');
  const userModal = document.getElementById('userModal');
  if (addUserBtn) addUserBtn.addEventListener('click', openUserModal);
  if (closeUserModal) closeUserModal.addEventListener('click', closeUserModalFunc);
  if (userModal) {
    userModal.addEventListener('click', event => {
      if (event.target === userModal) closeUserModalFunc();
    });
  }
}

// eslint-disable-next-line no-unused-vars
function showTab(tabName) {
  // Ocultar todas as abas
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));

  // Remover classe ativa dos botões
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));

  // Mostrar aba selecionada
  const selectedTab = document.getElementById(`${tabName}Tab`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Ativar botão correspondente
  const selectedButton = document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`);
  if (selectedButton) {
    selectedButton.classList.add('active');
  }

  // ActiveTab removido pois não é utilizado

  // Carregar dados específicos da aba
  if (tabName === 'users') {
    loadUsers();
  } else if (tabName === 'backup') {
    loadBackupHistory();
  }
}

async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    const result = await response.json();

    if (response.ok) {
      populateSettings(result.data);
    } else {
      throw new Error(result.message || 'Erro ao carregar configurações');
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    // Dados de exemplo
    populateSettings({
      companyName: 'SIGMA PLI',
      companyEmail: 'contato@sigmapli.com',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      requireStrongPassword: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      enableAutoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00'
    });
  }
}

function populateSettings(settings) {
  setGeneralSettings(settings);
  setSecuritySettings(settings);
  setBackupSettings(settings);
}

function setGeneralSettings(settings) {
  const companyName = document.getElementById('companyName');
  const companyEmail = document.getElementById('companyEmail');
  const timezone = document.getElementById('timezone');
  const language = document.getElementById('language');
  if (companyName) companyName.value = settings.companyName || '';
  if (companyEmail) companyEmail.value = settings.companyEmail || '';
  if (timezone) timezone.value = settings.timezone || 'America/Sao_Paulo';
  if (language) language.value = settings.language || 'pt-BR';
}

function setSecuritySettings(settings) {
  const requireStrongPassword = document.getElementById('requireStrongPassword');
  const enableTwoFactor = document.getElementById('enableTwoFactor');
  const sessionTimeout = document.getElementById('sessionTimeout');
  const maxLoginAttempts = document.getElementById('maxLoginAttempts');
  if (requireStrongPassword) {
    requireStrongPassword.checked = settings.requireStrongPassword || false;
  }
  if (enableTwoFactor) enableTwoFactor.checked = settings.enableTwoFactor || false;
  if (sessionTimeout) sessionTimeout.value = settings.sessionTimeout || 30;
  if (maxLoginAttempts) maxLoginAttempts.value = settings.maxLoginAttempts || 3;
}

function setBackupSettings(settings) {
  const enableAutoBackup = document.getElementById('enableAutoBackup');
  const backupFrequency = document.getElementById('backupFrequency');
  const backupTime = document.getElementById('backupTime');
  if (enableAutoBackup) enableAutoBackup.checked = settings.enableAutoBackup || false;
  if (backupFrequency) backupFrequency.value = settings.backupFrequency || 'daily';
  if (backupTime) backupTime.value = settings.backupTime || '02:00';
}

async function handleGeneralSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const settingsData = {
    companyName: formData.get('companyName'),
    companyEmail: formData.get('companyEmail'),
    timezone: formData.get('timezone'),
    language: formData.get('language')
  };

  try {
    const response = await fetch('/api/settings/general', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Configurações gerais salvas com sucesso!', 'success');
    } else {
      showMessage(result.message || 'Erro ao salvar configurações', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

async function handleSecuritySubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const settingsData = {
    requireStrongPassword: formData.get('requireStrongPassword') === 'on',
    enableTwoFactor: formData.get('enableTwoFactor') === 'on',
    sessionTimeout: parseInt(formData.get('sessionTimeout')),
    maxLoginAttempts: parseInt(formData.get('maxLoginAttempts'))
  };

  try {
    const response = await fetch('/api/settings/security', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Configurações de segurança salvas com sucesso!', 'success');
    } else {
      showMessage(result.message || 'Erro ao salvar configurações', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

async function handleBackupSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const settingsData = {
    enableAutoBackup: formData.get('enableAutoBackup') === 'on',
    backupFrequency: formData.get('backupFrequency'),
    backupTime: formData.get('backupTime')
  };

  try {
    const response = await fetch('/api/settings/backup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Configurações de backup salvas com sucesso!', 'success');
    } else {
      showMessage(result.message || 'Erro ao salvar configurações', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

async function loadUsers() {
  try {
    const response = await fetch('/api/users');
    const result = await response.json();

    if (response.ok) {
      renderUsers(result.data);
    } else {
      throw new Error(result.message || 'Erro ao carregar usuários');
    }
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    // Dados de exemplo
    renderUsers([
      { id: 1, name: 'Admin', email: 'admin@sigmapli.com', role: 'admin', status: 'active' },
      { id: 2, name: 'João Silva', email: 'joao@sigmapli.com', role: 'manager', status: 'active' },
      { id: 3, name: 'Maria Santos', email: 'maria@sigmapli.com', role: 'user', status: 'inactive' }
    ]);
  }
}

function renderUsers(users) {
  const tableBody = document.querySelector('#usersTable tbody');
  if (!tableBody) return;

  tableBody.innerHTML = users
    .map(
      user => `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${getRoleName(user.role)}</td>
          <td><span class="user-status ${user.status}">${getStatusName(user.status)}</span></td>
          <td>
            <div class="user-actions">
              <button class="btn-edit" onclick="editUser(${user.id})">Editar</button>
              <button class="btn-delete" onclick="deleteUser(${user.id})">Excluir</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function getRoleName(role) {
  const roles = {
    admin: 'Administrador',
    manager: 'Gerente',
    user: 'Usuário'
  };
  return roles[role] || role;
}

function getStatusName(status) {
  const statuses = {
    active: 'Ativo',
    inactive: 'Inativo'
  };
  return statuses[status] || status;
}

function openUserModal() {
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');

  form.reset();
  form.dataset.userId = '';
  modal.style.display = 'block';
}

function closeUserModalFunc() {
  const modal = document.getElementById('userModal');
  modal.style.display = 'none';
}

async function handleUserSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: formData.get('password')
  };

  const userId = event.target.dataset.userId;
  const isEdit = userId !== '';

  try {
    const url = isEdit ? `/api/users/${userId}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(
        isEdit ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!',
        'success'
      );
      closeUserModalFunc();
      loadUsers();
    } else {
      showMessage(result.message || 'Erro ao salvar usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }

  // Implementar edição de usuário
  // eslint-disable-next-line no-console
  console.log('Editando usuário:', userId);
}

// eslint-disable-next-line no-unused-vars
function editUser(userId) {
  // Implementar edição de usuário
  // eslint-disable-next-line no-console
  console.log('Editando usuário:', userId);
}

// eslint-disable-next-line no-unused-vars
async function deleteUser(userId) {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) {
    return;
  }

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Usuário excluído com sucesso!', 'success');
      loadUsers();
    } else {
      showMessage(result.message || 'Erro ao excluir usuário', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

// eslint-disable-next-line no-unused-vars
async function createBackup() {
  try {
    const response = await fetch('/api/backup/create', {
      method: 'POST'
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Backup criado com sucesso!', 'success');
      loadBackupHistory();
    } else {
      showMessage(result.message || 'Erro ao criar backup', 'error');
    }
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

// eslint-disable-next-line no-unused-vars
function downloadBackup() {
  window.open('/api/backup/download', '_blank');
}

async function loadBackupHistory() {
  try {
    const response = await fetch('/api/backup/history');
    const result = await response.json();

    if (response.ok) {
      renderBackupHistory(result.data);
    } else {
      throw new Error(result.message || 'Erro ao carregar histórico de backup');
    }
  } catch (error) {
    console.error('Erro ao carregar histórico de backup:', error);
    // Dados de exemplo
    renderBackupHistory([
      { id: 1, date: '2024-01-15T02:00:00Z', size: '150.5 MB', status: 'success' },
      { id: 2, date: '2024-01-14T02:00:00Z', size: '148.2 MB', status: 'success' },
      { id: 3, date: '2024-01-13T02:00:00Z', size: '145.8 MB', status: 'success' }
    ]);
  }
}

function renderBackupHistory(backups) {
  const backupHistory = document.getElementById('backupHistory');
  if (!backupHistory) return;

  backupHistory.innerHTML = backups
    .map(
      backup => `
        <div class="backup-item">
          <div class="backup-info">
            <div class="backup-date">${formatDate(backup.date)}</div>
            <div class="backup-size">${backup.size}</div>
          </div>
          <div class="backup-actions">
            <button class="btn btn-sm btn-outline" onclick="downloadBackupFile(${backup.id})">Download</button>
            <button class="btn btn-sm btn-secondary" onclick="deleteBackupFile(${backup.id})">Excluir</button>
          </div>
        </div>
      `
    )
    .join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
}

// eslint-disable-next-line no-unused-vars
function downloadBackupFile(backupId) {
  window.open(`/api/backup/download/${backupId}`, '_blank');
}

// eslint-disable-next-line no-unused-vars
async function deleteBackupFile(backupId) {
  if (!confirm('Tem certeza que deseja excluir este backup?')) {
    return;
  }

  try {
    const response = await fetch(`/api/backup/${backupId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Backup excluído com sucesso!', 'success');
      loadBackupHistory();
    } else {
      showMessage(result.message || 'Erro ao excluir backup', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir backup:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

function showMessage(message, type) {
  const existingMessages = document.querySelectorAll('.message');
  existingMessages.forEach(msg => msg.remove());

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const contentHeader = document.querySelector('.content-header');
  if (contentHeader) {
    contentHeader.appendChild(messageDiv);
  }

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}
