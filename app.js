const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');
const searchProductForm = document.querySelector('#search-product-form');
const searchResult = document.querySelector('#search-result');

// Function to fetch all products from the server
async function fetchProducts() {
  try {
    const response = await fetch('http://3.235.128.171:3000/products');
    const products = await response.json();

    // Clear product list
    productList.innerHTML = '';

    // Add each product to the list
    products.forEach(product => {
      const li = document.createElement('li');

      // CORREÇÃO: Agora o ID do produto é exibido na lista para você saber o que buscar
      li.innerHTML = `
        <strong>ID: ${product.id} - ${product.name}</strong>
        <br>
        Description: ${product.description}
        <br>
        Price: $${product.price}
        <br><br>
      `;

      // Add delete button for each product
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
      });
      li.appendChild(deleteButton);

      // Add update button for each product
      const updateButton = document.createElement('button');
      updateButton.innerHTML = 'Update';
      updateButton.addEventListener('click', () => {
        updateProductId.value = product.id;
        updateProductName.value = product.name;
        updateProductDescription.value = product.description;
        updateProductPrice.value = product.price;
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = addProductForm.elements['name'].value;
  const description = addProductForm.elements['description'].value;
  const price = addProductForm.elements['price'].value;

  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, description, price) {
  try {
    const response = await fetch('http://3.235.128.171:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, price })
    });
    
    return await response.json();
  } catch (e) {
    console.log("Processando resposta do produto...");
  }
}

// Function to delete a product
async function deleteProduct(id) {
  try {
    const response = await fetch('http://3.235.128.171:3000/products/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// função de atualizar produto
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;

  await updateProduct(id, name, description, price);
  updateProductForm.reset();
  await fetchProducts();
});

// atualização dos dados do produto
async function updateProduct(id, name, description, price) {
  try {
    const response = await fetch(`http://3.235.128.171:3000/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, price })
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

// consulta por id — CORRIGIDO para aceitar múltiplos formatos de retorno do back-end
searchProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = document.querySelector('#search-id').value;

  try {
    const response = await fetch(`http://3.235.128.171:3000/products/${id}`);
    const product = await response.json();

    // Se o backend retornar uma lista vazia ou nula, já corta aqui
    if (!product || (Array.isArray(product) && product.length === 0)) {
      searchResult.innerHTML = `<p>Product not found</p>`;
      return;
    }

    // Se for uma lista pega o primeiro índice, caso contrário assume o objeto direto
    const prodData = Array.isArray(product) ? product[0] : product;

    if (prodData && prodData.name) {
      searchResult.innerHTML = `
        <h3>Product Found</h3>
        <p><strong>Name:</strong> ${prodData.name}</p>
        <p><strong>Description:</strong> ${prodData.description}</p>
        <p><strong>Price:</strong> $${prodData.price}</p>
      `;
    } else {
      searchResult.innerHTML = `<p>Product not found</p>`;
    }
  } catch (error) {
    console.error("Erro na busca por ID:", error);
    searchResult.innerHTML = `<p>Product not found</p>`;
  }
});

// Fetch all products on page load
fetchProducts();
