// Funções usadas via HTML (onclick) são suprimidas corretamente
// Products Module JavaScript
let currentPage = 1;
const productsPerPage = 12;
let products = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupEventListeners();
});

function setupEventListeners() {
  setupProductButtons();
  setupProductModal();
  setupProductForm();
}

function setupProductButtons() {
  const addProductBtn = document.getElementById('addProductBtn');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const filterBtn = document.getElementById('filterBtn');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  if (addProductBtn) addProductBtn.addEventListener('click', openAddProductModal);
  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
  if (filterBtn) filterBtn.addEventListener('click', filterProducts);
  if (prevPage) prevPage.addEventListener('click', () => changePage(-1));
  if (nextPage) nextPage.addEventListener('click', () => changePage(1));
}

function setupProductModal() {
  const productModal = document.getElementById('productModal');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  if (closeModal) closeModal.addEventListener('click', closeProductModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);
  if (productModal) {
    productModal.addEventListener('click', event => {
      if (event.target === productModal) closeProductModal();
    });
  }
}

function setupProductForm() {
  const productForm = document.getElementById('productForm');
  if (productForm) productForm.addEventListener('submit', handleProductSubmit);
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const result = await response.json();

    if (response.ok) {
      products = result.data || [];
      filteredProducts = [...products];
      renderProducts();
    } else {
      showMessage(result.message || 'Erro ao carregar produtos', 'error');
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    // Dados de exemplo para desenvolvimento
    products = [
      {
        id: 1,
        name: 'Smartphone Galaxy',
        category: 'electronics',
        price: 1299.99,
        stock: 25,
        description: 'Smartphone Android com 128GB'
      },
      {
        id: 2,
        name: 'Notebook Dell',
        category: 'electronics',
        price: 2499.99,
        stock: 10,
        description: 'Notebook Dell Inspiron 15'
      },
      {
        id: 3,
        name: 'Camiseta Polo',
        category: 'clothing',
        price: 79.99,
        stock: 50,
        description: 'Camiseta polo masculina'
      }
    ];
    filteredProducts = [...products];
    renderProducts();
  }
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (paginatedProducts.length === 0) {
    productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
    return;
  }

  productsGrid.innerHTML = paginatedProducts
    .map(
      product => `
        <div class="product-card">
            <div class="product-image">📦</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <p class="product-stock ${product.stock <= 10 ? 'low' : ''}">${product.stock} em estoque</p>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="editProduct(${product.id})">Editar</button>
                    <button class="btn btn-secondary btn-sm" onclick="deleteProduct(${product.id})">Excluir</button>
                </div>
            </div>
        </div>
    `
    )
    .join('');

  updatePagination();
}

function getCategoryName(category) {
  const categories = {
    electronics: 'Eletrônicos',
    clothing: 'Roupas',
    books: 'Livros',
    home: 'Casa'
  };
  return categories[category] || category;
}

function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;

  filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  currentPage = 1;
  renderProducts();
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const newPage = currentPage + direction;

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderProducts();
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pageInfo = document.getElementById('pageInfo');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');

  if (pageInfo) {
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  }

  if (prevPage) {
    prevPage.disabled = currentPage === 1;
  }

  if (nextPage) {
    nextPage.disabled = currentPage === totalPages;
  }
}

function openAddProductModal() {
  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('productForm');

  modalTitle.textContent = 'Adicionar Produto';
  form.reset();
  form.dataset.productId = '';
  modal.style.display = 'block';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    description: formData.get('description')
  };

  const productId = event.target.dataset.productId;
  const isEdit = productId !== '';

  try {
    const url = isEdit ? `/api/products/${productId}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(
        isEdit ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!',
        'success'
      );
      closeProductModal();
      loadProducts();
    } else {
      showMessage(result.message || 'Erro ao salvar produto', 'error');
    }
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    showMessage('Erro de conexão. Tente novamente.', 'error');
  }
}

// eslint-disable-next-line no-unused-vars
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('productForm');

  modalTitle.textContent = 'Editar Produto';
  form.dataset.productId = productId;

  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productDescription').value = product.description;

  modal.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
async function deleteProduct(productId) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Produto excluído com sucesso!', 'success');
      loadProducts();
    } else {
      showMessage(result.message || 'Erro ao excluir produto', 'error');
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
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
  contentHeader.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}
