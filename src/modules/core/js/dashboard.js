// Dashboard - COMPLETAMENTE SEM VALIDAÇÃO
console.log('Dashboard carregado - ACESSO LIVRE');

// NADA MAIS - SEM REDIRECIONAMENTO

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
