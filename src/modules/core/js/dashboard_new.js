// Dashboard Principal - SIGMA PLI
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard SIGMA PLI carregado');
    
    // Verificar autenticação
    checkAuthentication();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar animações
    initAnimations();
});

function checkAuthentication() {
    const token = localStorage.getItem('sigma_token');
    if (!token) {
        console.log('Token não encontrado, redirecionando para login');
        window.location.href = '/login';
        return false;
    }
    
    // Decodificar informações do usuário do token
    try {
        const userInfo = JSON.parse(atob(token.split('.')[1]));
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        if (userName) userName.textContent = userInfo.name || 'Usuário';
        if (userRole) userRole.textContent = userInfo.role || 'Usuário';
        
        console.log('Usuário autenticado:', userInfo.name);
        return true;
    } catch (e) {
        console.error('Erro ao decodificar token:', e);
        localStorage.removeItem('sigma_token');
        window.location.href = '/login';
        return false;
    }
}

function loadDashboardData() {
    console.log('Carregando dados do dashboard...');
    
    // Simular carregamento de dados
    setTimeout(() => {
        updateStatistics();
        startRealTimeUpdates();
    }, 500);
}

function updateStatistics() {
    // Animar contadores das estatísticas
    animateCounter('totalUsers', 1247);
    animateCounter('totalProducts', 3489);
    animateCounter('totalSales', 926);
    
    // Atualizar receita com formatação
    const revenueElement = document.getElementById('monthlyRevenue');
    if (revenueElement) {
        animateRevenue(revenueElement, 84320);
    }
    
    console.log('Estatísticas atualizadas com animação');
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000;
    const start = 0;
    const increment = targetValue / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

function animateRevenue(element, targetValue) {
    const duration = 2000;
    const start = 0;
    const increment = targetValue / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = 'R$ ' + Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

function startRealTimeUpdates() {
    // Simular atualizações em tempo real
    setInterval(() => {
        updateRandomStatistic();
    }, 30000); // Atualizar a cada 30 segundos
}

function updateRandomStatistic() {
    const stats = ['totalUsers', 'totalProducts', 'totalSales'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    const element = document.getElementById(randomStat);
    
    if (element) {
        const currentValue = parseInt(element.textContent.replace(/\./g, ''));
        const variation = Math.floor(Math.random() * 10) - 5; // -5 a +5
        const newValue = Math.max(0, currentValue + variation);
        
        element.style.transition = 'all 0.5s ease';
        element.textContent = newValue.toLocaleString('pt-BR');
        
        console.log(`Estatística ${randomStat} atualizada para ${newValue}`);
    }
}

function initAnimations() {
    // Animação de entrada para os cards
    const cards = document.querySelectorAll('.stat-card, .card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupEventListeners() {
    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Links do menu lateral
    document.querySelectorAll('.menu-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '/dashboard') {
                e.preventDefault();
                showDevelopmentAlert(href);
            }
            
            // Atualizar item ativo no menu
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
    
    // Botões de ação rápida
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            showActionAlert(action);
        });
    });
    
    // Efeitos visuais para cards de estatísticas
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });
}

function showDevelopmentAlert(section) {
    const sectionNames = {
        '/products': 'Produtos',
        '/reports': 'Relatórios', 
        '/settings': 'Configurações'
    };
    
    const sectionName = sectionNames[section] || section;
    showNotification(`🚀 Módulo "${sectionName}" em desenvolvimento!`, 'info');
}

function showActionAlert(action) {
    const actionMessages = {
        'Novo Produto': '📦 Formulário de cadastro de produto',
        'Ver Relatórios': '📊 Módulo de relatórios analíticos',
        'Gerenciar Usuários': '👥 Painel de gerenciamento de usuários',
        'Configurações': '⚙️ Configurações do sistema'
    };
    
    const message = actionMessages[action] || `Ação: ${action}`;
    showNotification(`🔧 ${message}\nFuncionalidade em desenvolvimento...`, 'warning');
}

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid ${type === 'info' ? '#667eea' : '#f093fb'};
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'exclamation-triangle'}" 
               style="color: ${type === 'info' ? '#667eea' : '#f093fb'};"></i>
            <span style="color: #333; font-weight: 500;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function logout() {
    console.log('Realizando logout...');
    
    // Animação de saída
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        localStorage.removeItem('sigma_token');
        window.location.href = '/login';
    }, 300);
}

// Função para atualizar dashboard manualmente
function refreshDashboard() {
    console.log('Atualizando dashboard...');
    updateStatistics();
    showNotification('Dashboard atualizado com sucesso!', 'info');
}

// Exportar funções para uso global
window.dashboardFunctions = {
    refreshDashboard,
    logout,
    updateStatistics,
    showNotification
};

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl + R para atualizar dashboard
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Ctrl + L para logout
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
});

console.log('Dashboard SIGMA PLI inicializado com sucesso!');
