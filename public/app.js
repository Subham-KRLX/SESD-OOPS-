const API_URL = '/api/products';
const AUTH_TOKEN = 'Bearer secure-token';

let products = [];

async function fetchProducts() {
    let search = document.getElementById('searchInput').value;
    let category = document.getElementById('categoryFilter').value;
    let sortVal = document.getElementById('sortSelect').value;

    let splitSort = sortVal.split('-');
    let sortBy = splitSort[0];
    let sortOrder = splitSort[1];

    let queryString = 'search=' + search + '&category=' + category + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder;

    try {
        const response = await fetch(API_URL + '?' + queryString);
        const result = await response.json();

        if (result.status === 'success') {
            products = result.data;
            renderProducts();
        }
    } catch (error) {
        console.error(error);
        showToast('Error fetching products', 'error');
    }
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        let p = products[i];

        let html = '<div class="product-card">';
        html += '<span class="category">' + p.category + '</span>';
        html += '<h3>' + p.name + '</h3>';
        html += '<p style="color:var(--text-muted); font-size:0.875rem">' + p.description + '</p>';
        html += '<div class="price">$' + p.price.toFixed(2) + '</div>';
        html += '<div class="card-actions">';
        html += '<button class="btn btn-sm" style="background:var(--border)" onclick="editProduct(\'' + p.id + '\')">Edit</button>';
        html += '<button class="btn btn-sm" style="background:var(--danger); color:white" onclick="deleteProduct(\'' + p.id + '\')">Delete</button>';
        html += '</div>';
        html += '</div>';

        grid.innerHTML += html;
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let id = document.getElementById('productId').value;
    let name = document.getElementById('name').value;
    let cat = document.getElementById('category').value;
    let price = document.getElementById('price').value;
    let desc = document.getElementById('description').value;

    let data = {
        name: name,
        category: cat,
        price: parseFloat(price),
        description: desc
    };

    let method = 'POST';
    let url = API_URL;

    if (id) {
        method = 'PUT';
        url = API_URL + '/' + id;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            if (id) {
                showToast('Product updated');
            } else {
                showToast('Product added');
            }
            closeModal();
            fetchProducts();
        } else {
            const err = await response.json();
            showToast(err.message, 'error');
        }
    } catch (error) {
        console.log(error);
        showToast('Error saving product', 'error');
    }
});

async function deleteProduct(id) {
    let confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(API_URL + '/' + id, {
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
    let p = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            p = products[i];
            break;
        }
    }

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

function showToast(message, type) {
    if (!type) type = 'success';

    const toast = document.getElementById('toast');
    toast.innerText = message;

    if (type === 'success') {
        toast.style.borderLeftColor = 'var(--accent)';
    } else {
        toast.style.borderLeftColor = 'var(--danger)';
    }

    toast.style.transform = 'translateX(0)';

    setTimeout(function () {
        toast.style.transform = 'translateX(200%)';
    }, 3000);
}

fetchProducts();
