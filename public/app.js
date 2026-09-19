async function loadProducts() {
    const res = await fetch('/api/products');

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
    }

    return await res.json();
}

const list = document.querySelector('#list');


function render(products) {
    list.innerHTML = '';

    for (let product of products) {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;
        list.appendChild(li);
    }
}

const errorBox = document.querySelector('#error');

async function refresh() {
    try {
        errorBox.textContent = '';
        const products = await loadProducts();
        render(products);
    } catch (error) {
        errorBox.textContent = `Error: ${error.message}`;
    }
}

const form = document.querySelector('#form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title');
    const price = Number(formData.get('price'));
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, price })
        })

        if (!res.ok) {
            const data = await res.json();
            document.querySelector('#error').textContent = `Error: ${data.error}`;
            return;
        }

        form.reset();
        refresh();

        
    }
    catch (error) {
        document.querySelector('#error').textContent = `Error: ${error.message}`;
    }
})
refresh();
