// Dashboard SIMPLES - SEM VALIDAÇÃO COMPLEXA
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard carregado');
    
    // Definir valores padrão para o usuário
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    
    if (userName) userName.textContent = 'Usuário Logado';
    if (userRole) userRole.textContent = 'Usuário';
    
    // Inicializar estatísticas
    updateStatistics();
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = '/auth/login';
        });
    }
});

function updateStatistics() {
    // Valores fixos para teste
    const stats = {
        'totalUsers': '1,247',
        'totalProducts': '3,489', 
        'monthlyRevenue': 'R$ 84,320',
        'totalSales': '926'
    };
    
    for (const [id, value] of Object.entries(stats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// Função global de logout
window.logout = function() {
    localStorage.clear();
    window.location.href = '/auth/login';
};

console.log('Dashboard JavaScript carregado com sucesso!');
