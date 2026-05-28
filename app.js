const productList = document.querySelector('#products');

const addProductForm = document.querySelector('#add-product-form');

const updateProductForm = document.querySelector('#update-product-form');

const updateProductId = document.querySelector('#update-id');

const updateProductName = document.querySelector('#update-name');

// inclusão do campo description
const updateProductDescription = document.querySelector('#update-description');

const updateProductPrice = document.querySelector('#update-price');

// busca de produto por id
const searchProductForm = document.querySelector('#search-product-form');

const searchResult = document.querySelector('#search-result');


// Function to fetch all products from the server
async function fetchProducts() {

  const response = await fetch('http://98.92.62.120:3000/products');

  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {

    const li = document.createElement('li');

    // exibindo descrição do produto
    li.innerHTML = `
      <strong>${product.name}</strong>
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

      // preenchendo descrição no update
      updateProductDescription.value = product.description;

      updateProductPrice.value = product.price;

    });

    li.appendChild(updateButton);

    productList.appendChild(li);

  });

}


// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {

  event.preventDefault();

  const name = addProductForm.elements['name'].value;

  // pegando descrição do formulário
  const description = addProductForm.elements['description'].value;

  const price = addProductForm.elements['price'].value;

  await addProduct(name, description, price);

  addProductForm.reset();

  await fetchProducts();

});


// Function to add a new product
async function addProduct(name, description, price) {

  const response = await fetch('http://98.92.62.120:3000/products', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    // enviando descrição para o backend
    body: JSON.stringify({
      name,
      description,
      price
    })

  });

  return response.json();

}


// Function to delete a product
async function deleteProduct(id) {

  const response = await fetch('http://98.92.62.120:3000/products/' + id, {

    method: 'DELETE',

    headers: {
      'Content-Type': 'application/json'
    },

  });

  return response.json();

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

  const response = await fetch(`http://98.92.62.120:3000/products/${id}`, {

    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      name,
      description,
      price
    })

  });

  return response.json();

}


// consulta por id
searchProductForm.addEventListener('submit', async event => {

  event.preventDefault();

  const id = document.querySelector('#search-id').value;

  const response = await fetch(`http://98.92.62.120:3000/products/${id}`);

  const product = await response.json();

  if (product.length > 0) {

    searchResult.innerHTML = `
      <h3>Product Found</h3>

      <p><strong>Name:</strong> ${product[0].name}</p>

      <p><strong>Description:</strong> ${product[0].description}</p>

      <p><strong>Price:</strong> $${product[0].price}</p>
    `;

  } else {

    searchResult.innerHTML = `
      <p>Product not found</p>
    `;

  }

});


// Fetch all products on page load
fetchProducts();
