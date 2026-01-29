const API_URL = '/api/products';
const AUTH_TOKEN = 'Bearer secure-token';

let products = [];

// Fetch and display products
async function fetchProducts() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const sortVal = document.getElementById('sortSelect').value;
    const [sortBy, sortOrder] = sortVal.split('-');

    const queryParams = new URLSearchParams({
        search,
        category,
        sortBy,
        sortOrder
    });

    try {
        const response = await fetch(`${API_URL}?${queryParams}`);
        const result = await response.json();
        if (result.status === 'success') {
            products = result.data;
            renderProducts();
        }
    } catch (error) {
        showToast('Error fetching products', 'error');
    }
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <span class="category">${p.category}</span>
            <h3>${p.name}</h3>
            <p style="color:var(--text-muted); font-size:0.875rem">${p.description}</p>
            <div class="price">$${p.price.toFixed(2)}</div>
            <div class="card-actions">
                <button class="btn btn-sm" style="background:var(--border)" onclick="editProduct('${p.id}')">Edit</button>
                <button class="btn btn-sm" style="background:var(--danger); color:white" onclick="deleteProduct('${p.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle Form Submission
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast(id ? 'Product updated' : 'Product added');
            closeModal();
            fetchProducts();
        } else {
            const err = await response.json();
            showToast(err.message, 'error');
        }
    } catch (error) {
        showToast('Error saving product', 'error');
    }
});

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': AUTH_TOKEN }
        });

        if (response.ok) {
            showToast('Product deleted');
            fetchProducts();
        }
    } catch (error) {
        showToast('Error deleting product', 'error');
    }
}

function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('modalTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = p.id;
    document.getElementById('name').value = p.name;
    document.getElementById('category').value = p.category;
    document.getElementById('price').value = p.price;
    document.getElementById('description').value = p.description;

    document.getElementById('productModal').style.display = 'flex';
}

function openModal() {
    document.getElementById('modalTitle').innerText = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function handleSearch() {
    fetchProducts();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.style.borderLeftColor = type === 'success' ? 'var(--accent)' : 'var(--danger)';
    toast.style.transform = 'translateX(0)';
    setTimeout(() => {
        toast.style.transform = 'translateX(200%)';
    }, 3000);
}

// Initial fetch
fetchProducts();
