// Dashboard utilities
document.addEventListener('DOMContentLoaded', () => {
  // Dashboard initialization
  loadDashboardData();
});

function loadDashboardData() {
  // Load dashboard data from API
  fetch('/api/stats')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        updateDashboardCards(data.data);
      }
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
    });
}

function updateDashboardCards(stats) {
  // Update dashboard cards with real data
  const cards = document.querySelectorAll('.dashboard-card');
  cards.forEach(card => {
    const metric = card.dataset.metric;
    const valueElement = card.querySelector('.card-value');
    if (valueElement && stats[metric]) {
      valueElement.textContent = stats[metric];
    }
  });
}
