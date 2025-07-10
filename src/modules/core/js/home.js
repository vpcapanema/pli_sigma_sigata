// Notícias simuladas (poderia vir de uma API futuramente)
const noticias = [
  {
    titulo: 'Novo decreto publicado',
    texto: 'Foi publicado o decreto 1234/2025 que regulamenta o PLI.',
    icone: 'fa-file-alt'
  },
  {
    titulo: 'Reunião do Comitê Executivo',
    texto: 'A próxima reunião será em 15/07, às 10h.',
    icone: 'fa-users'
  },
  {
    titulo: 'Ferramenta de análise',
    texto: 'Nova ferramenta de análise de dados disponível no módulo Ferramentas.',
    icone: 'fa-chart-bar'
  },
  {
    titulo: 'Capacitação',
    texto: 'Inscrições abertas para o curso de capacitação em logística mineral.',
    icone: 'fa-graduation-cap'
  }
];

function renderNoticias() {
  const container = document.getElementById('noticias-list');
  if (!container) return;

  container.innerHTML = '';
  noticias.forEach(n => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-icon">
        <i class="fas ${n.icone}"></i>
      </div>
      <div class="news-title">${n.titulo}</div>
      <div class="news-text">${n.texto}</div>
    `;
    container.appendChild(card);
  });
}

// Adiciona efeito de hover nas seções de cards
function addHoverEffects() {
  document.querySelectorAll('.section-card').forEach(card => {
    card.addEventListener('mouseenter', function handleMouseEnter() {
      this.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', function handleMouseLeave() {
      this.style.transform = 'translateY(0)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNoticias();
  addHoverEffects();

  // Navegação dos botões da sidebar
  document.getElementById('btn-pli').onclick = () => alert('Página "O PLI" em construção.');
  document.getElementById('btn-instrumentos').onclick = () => alert('Página "Instrumentos Normativos" em construção.');
  document.getElementById('btn-organograma').onclick = () => alert('Página "Organograma Executivo" em construção.');
  document.getElementById('btn-semil').onclick = () => alert('Página "A SEMIL" em construção.');
  document.getElementById('btn-equipe').onclick = () => alert('Página "Equipe" em construção.');
  document.getElementById('btn-ferramentas').onclick = () => alert('Página "Ferramentas" em construção.');

  // Animação de rolagem suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function handleClick(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
