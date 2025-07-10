/* eslint-disable indent, operator-linebreak */
// Módulo de Apontamentos - Estrutura inicial
// CRUD de apontamentos (mock)

document.addEventListener('DOMContentLoaded', onReady);

function onReady() {
  loadApontamentos();
  const addBtn = document.getElementById('addApontamentoBtn');
  if (addBtn) {
    addBtn.addEventListener('click', showApontamentoForm);
  }
}

function loadApontamentos() {
  // TODO: buscar apontamentos do backend
  const apontamentos = [
    {
      modulo: 'core',
      pagina: 'users',
      tipo: 'banco',
      fonte: 'usuarios_sistema',
      operacoes: 'CRUD',
      campos: 'id, nome, email, papel, status',
      obs: 'PostgreSQL/PostGIS'
    }
  ];
  const list = document.getElementById('apontamentosList');
  if (!list) return;
  list.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Módulo</th>
          <th>Página</th>
          <th>Tipo</th>
          <th>Fonte</th>
          <th>Operações</th>
          <th>Campos</th>
          <th>Obs</th>
        </tr>
      </thead>
      <tbody>
        ${apontamentos
          .map(
            a => `
              <tr>
                <td>${a.modulo}</td>
                <td>${a.pagina}</td>
                <td>${a.tipo}</td>
                <td>${a.fonte}</td>
                <td>${a.operacoes}</td>
                <td>${a.campos}</td>
                <td>${a.obs}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function showApontamentoForm() {
  // TODO: formulário real
  const form = document.createElement('form');
  form.id = 'apontamentoForm';
  form.innerHTML = `
    <label>Módulo: <input name="modulo" required></label>
    <label>Página: <input name="pagina" required></label>
    <label>Tipo: <input name="tipo" required></label>
    <label>Fonte: <input name="fonte" required></label>
    <label>Operações: <input name="operacoes" required></label>
    <label>Campos: <input name="campos" required></label>
    <label>Obs: <input name="obs"></label>
    <button type="submit">Salvar</button>
    <button type="button" id="cancelApontamentoBtn">Cancelar</button>
  `;
  const container = document.getElementById('apontamentoFormContainer');
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(form);
  container.style.display = 'block';
  form.addEventListener('submit', onApontamentoSubmit);
  const cancelBtn = document.getElementById('cancelApontamentoBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      container.style.display = 'none';
    });
  }
}

function onApontamentoSubmit(e) {
  e.preventDefault();
  // TODO: salvar no backend
  const container = document.getElementById('apontamentoFormContainer');
  if (container) container.style.display = 'none';
  loadApontamentos();
}
