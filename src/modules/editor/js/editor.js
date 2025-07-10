// Editor Visual - Estrutura inicial
// Login independente
// Após login, exibe mapa de módulos, páginas e elementos

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('editorLoginForm');
  const editorLogin = document.getElementById('editorLogin');
  const editorApp = document.getElementById('editorApp');

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    // TODO: autenticação real via backend
    editorLogin.style.display = 'none';
    editorApp.style.display = 'block';
    loadModulesMap();
  });
});

function loadModulesMap() {
  // TODO: buscar módulos dinamicamente do backend
  const modules = [
    { name: 'core', pages: ['index', 'dashboard', 'users', 'events'] },
    { name: 'auth', pages: ['login'] },
    { name: 'products', pages: ['products'] },
    { name: 'reports', pages: ['reports'] },
    { name: 'settings', pages: ['settings'] }
  ];
  const modulesMap = document.getElementById('modulesMap');
  modulesMap.innerHTML = `<h3>Módulos</h3>${modules.map(m => `<button onclick="showPages('${m.name}')">${m.name}</button>`).join(' ')}`;
}

function showPages(moduleName) {
  // TODO: buscar páginas do backend
  const pagesList = document.getElementById('pagesList');
  const pages = {
    core: ['index', 'dashboard', 'users', 'events'],
    auth: ['login'],
    products: ['products'],
    reports: ['reports'],
    settings: ['settings']
  };
  pagesList.innerHTML = `<h3>Páginas</h3>${(pages[moduleName] || []).map(p => `<button onclick="showElements('${moduleName}','${p}')">${p}</button>`).join(' ')}`;
}

function showElements(moduleName, pageName) {
  // TODO: buscar estrutura de elementos do backend
  const elementsTree = document.getElementById('elementsTree');
  elementsTree.innerHTML = `<h3>Elementos da página ${pageName}</h3><ul><li>Cabeçalho</li><li>Body<ul><li>Seção 1</li><li>Seção 2</li></ul></li><li>Rodapé</li></ul>`;
  // TODO: permitir clicar em elemento para editar
}

/* exported showPages, showElements */
