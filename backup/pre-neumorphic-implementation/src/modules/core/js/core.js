/**
 * Módulo Core - JavaScript Principal
 * Responsável pela navegação, autenticação e funcionalidades gerais
 */

// Simple frontend logger
/* eslint-disable no-console */
const logger = {
  info: (message, data) => console.info(`[INFO] ${message}`, data || ''),
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data || ''),
  error: (message, data) => console.error(`[ERROR] ${message}`, data || '')
};
/* eslint-enable no-console */

class CoreModule {
  constructor() {
    this.currentUser = null;
    this.currentPage = 'dashboard';
    this.notifications = [];
    this.isAuthenticated = false;

    this.init();
  }

  /**
   * Inicialização do módulo
   */
  init() {
    this.loadUserData();
    this.setupEventListeners();
    this.setupNavigation();
    this.loadInitialPage();
    this.startNotificationPolling();
  }

  /**
   * Carrega dados do usuário atual
   */
  async loadUserData() {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        this.currentUser = await response.json();
        this.isAuthenticated = true;
        this.updateUserInterface();
      } else {
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.redirectToLogin();
    }
  }

  /**
   * Atualiza interface com dados do usuário
   */
  updateUserInterface() {
    if (!this.currentUser) return;

    const userNameElement = document.getElementById('userName');
    const userRoleElement = document.getElementById('userRole');
    const userInitialsElement = document.getElementById('userInitials');

    if (userNameElement) {
      userNameElement.textContent = this.currentUser.name || 'Usuário';
    }

    if (userRoleElement) {
      userRoleElement.textContent = this.currentUser.role || 'Usuário';
    }

    if (userInitialsElement) {
      const initials = this.getUserInitials(this.currentUser.name);
      userInitialsElement.textContent = initials;
    }
  }

  /**
   * Obtém iniciais do nome do usuário
   */
  getUserInitials(name) {
    if (!name) return 'U';

    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Navegação da sidebar
    document.querySelectorAll('.core-sidebar-nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        this.navigateTo(page);
      });
    });

    // Busca global
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.handleGlobalSearch(e.target.value);
      });
    }

    // Notificações
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => {
        this.toggleNotifications();
      });
    }

    // Menu do usuário
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
      userMenu.addEventListener('click', () => {
        this.toggleUserMenu();
      });
    }

    // Logout
    document.addEventListener('click', e => {
      if (e.target.classList.contains('logout-btn')) {
        this.logout();
      }
    });

    // Fechar modais ao clicar fora
    document.addEventListener('click', e => {
      if (e.target.classList.contains('core-modal')) {
        this.closeModal();
      }
    });

    // Tecla ESC para fechar modais
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  /**
   * Configura navegação
   */
  setupNavigation() {
    // Detectar mudanças na URL
    window.addEventListener('popstate', () => {
      this.loadPageFromURL();
    });

    // Interceptar links internos
    document.addEventListener('click', e => {
      if (e.target.tagName === 'A' && e.target.hostname === window.location.hostname) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.navigateTo(href.substring(1));
        }
      }
    });
  }

  /**
   * Carrega página inicial
   */
  loadInitialPage() {
    this.loadPageFromURL();
  }

  /**
   * Carrega página baseada na URL
   */
  loadPageFromURL() {
    const path = window.location.pathname.substring(1) || 'dashboard';
    this.navigateTo(path, false);
  }

  /**
   * Navega para uma página específica
   */
  async navigateTo(page, updateHistory = true) {
    if (!this.isAuthenticated) {
      this.redirectToLogin();
      return;
    }

    try {
      this.currentPage = page;

      // Atualizar estado da navegação
      this.updateNavigationState(page);

      // Carregar conteúdo da página
      await this.loadPageContent(page);

      // Atualizar URL
      if (updateHistory) {
        history.pushState({ page }, '', `/${page}`);
      }

      // Atualizar título da página
      this.updatePageTitle(page);
    } catch (error) {
      console.error('Erro ao navegar para página:', error);
      this.showError('Erro ao carregar página');
    }
  }

  /**
   * Atualiza estado da navegação
   */
  updateNavigationState(page) {
    // Remover classe active de todos os itens
    document.querySelectorAll('.core-sidebar-nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Adicionar classe active ao item atual
    const activeItem = document.querySelector(`[data-page="${page}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  /**
   * Carrega conteúdo da página
   */
  async loadPageContent(page) {
    const contentContainer = document.getElementById('mainContent');

    try {
      // Mostrar loading
      contentContainer.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;

      // Determinar o template e dados a carregar
      let templatePath;
      let dataEndpoint;

      switch (page) {
        case 'dashboard':
          templatePath = '/src/modules/core/templates/dashboard.html';
          dataEndpoint = '/api/core/dashboard';
          break;
        case 'users':
          templatePath = '/src/modules/core/templates/users.html';
          dataEndpoint = '/api/core/users';
          break;
        case 'events':
          templatePath = '/src/modules/core/templates/events.html';
          dataEndpoint = '/api/core/events';
          break;
        case 'products':
          templatePath = '/src/modules/products/templates/products.html';
          dataEndpoint = '/api/products';
          break;
        case 'reports':
          templatePath = '/src/modules/reports/templates/reports.html';
          dataEndpoint = '/api/reports';
          break;
        case 'settings':
          templatePath = '/src/modules/settings/templates/settings.html';
          dataEndpoint = '/api/settings';
          break;
        default:
          throw new Error(`Página não encontrada: ${page}`);
      }

      // Carregar template e dados em paralelo
      const [templateResponse, dataResponse] = await Promise.all([
        fetch(templatePath),
        fetch(dataEndpoint)
      ]);

      if (!templateResponse.ok) {
        throw new Error(`Erro ao carregar template: ${templateResponse.status}`);
      }

      const template = await templateResponse.text();
      const data = dataResponse.ok ? await dataResponse.json() : null;

      // Renderizar template
      contentContainer.innerHTML = template;

      // Inicializar página específica
      await this.initializePage(page, data);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      contentContainer.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Erro ao carregar página</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="window.core.navigateTo('dashboard')">
                        Voltar ao Dashboard
                    </button>
                </div>
            `;
    }
  }

  /**
   * Inicializa página específica
   */
  async initializePage(page, data) {
    switch (page) {
      case 'dashboard':
        if (window.DashboardModule) {
          window.DashboardModule.init(data);
        }
        break;
      case 'users':
        if (window.UsersModule) {
          window.UsersModule.init(data);
        }
        break;
      case 'events':
        if (window.EventsModule) {
          window.EventsModule.init(data);
        }
        break;
      // Adicionar outros módulos conforme necessário
    }
  }

  /**
   * Atualiza título da página
   */
  updatePageTitle(page) {
    const titles = {
      dashboard: 'Dashboard',
      users: 'Usuários',
      events: 'Eventos',
      products: 'Produtos',
      reports: 'Relatórios',
      settings: 'Configurações'
    };

    const title = titles[page] || 'SIGMA PLI';
    document.title = `${title} - SIGMA PLI`;

    const pageTitleElement = document.getElementById('pageTitle');
    if (pageTitleElement) {
      pageTitleElement.textContent = title;
    }
  }

  /**
   * Manipula busca global
   */
  handleGlobalSearch(query) {
    if (query.length < 2) return;

    // Implementar busca global
    // TODO: Implementar busca real
    logger.info('Busca global:', query);
  }

  /**
   * Alterna painel de notificações
   */
  toggleNotifications() {
    // Implementar painel de notificações
    logger.debug('Toggling notifications');
  }

  /**
   * Alterna menu do usuário
   */
  toggleUserMenu() {
    // Implementar menu do usuário
    logger.debug('Toggling user menu');
  }

  /**
   * Inicia polling de notificações
   */
  startNotificationPolling() {
    // Verificar novas notificações a cada 30 segundos
    setInterval(async () => {
      await this.checkForNewNotifications();
    }, 30000);

    // Verificar imediatamente
    this.checkForNewNotifications();
  }

  /**
   * Verifica novas notificações
   */
  async checkForNewNotifications() {
    try {
      const response = await fetch('/api/core/notifications/unread');
      if (response.ok) {
        const notifications = await response.json();
        this.updateNotificationBadge(notifications.length);
      }
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  }

  /**
   * Atualiza badge de notificações
   */
  updateNotificationBadge(count) {
    const badge = document.getElementById('notificationsBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  /**
   * Mostra modal
   */
  showModal(content, title = '') {
    const modal = document.createElement('div');
    modal.className = 'core-modal';
    modal.innerHTML = `
            <div class="core-modal-content">
                <div class="core-modal-header">
                    <h3 class="core-modal-title">${title}</h3>
                    <button class="core-modal-close" onclick="window.core.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="core-modal-body">
                    ${content}
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Animação de entrada
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }

  /**
   * Fecha modal
   */
  closeModal() {
    const modal = document.querySelector('.core-modal');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }

  /**
   * Mostra notificação
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);

    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  /**
   * Obtém ícone da notificação
   */
  getNotificationIcon(type) {
    const icons = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'times-circle'
    };
    return icons[type] || 'info-circle';
  }

  /**
   * Mostra erro
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Mostra sucesso
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Logout
   */
  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    this.redirectToLogin();
  }

  /**
   * Redireciona para login
   */
  redirectToLogin() {
    window.location.href = '/login';
  }
}

// Inicializar módulo core quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  window.core = new CoreModule();
});

// Adicionar estilos para notificações
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-notification);
    opacity: 0;
    transform: translateX(100%);
    transition: all var(--transition-normal);
    min-width: 300px;
}

.notification.notification-info {
    border-left: 4px solid var(--info-color);
}

.notification.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification.notification-warning {
    border-left: 4px solid var(--warning-color);
}

.notification.notification-error {
    border-left: 4px solid var(--error-color);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius);
}

.notification-close:hover {
    background-color: var(--bg-secondary);
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-left: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-md);
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    text-align: center;
}

.error-icon {
    font-size: 4rem;
    color: var(--error-color);
    margin-bottom: var(--spacing-md);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
