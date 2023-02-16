const sectionItems = document.querySelector('.items');
const cartItems = document.querySelector('.cart-items');
const body = document.querySelector('body');
const emptyCart = document.querySelector('.empty');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems(cartItems.innerHTML);
}

body.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart-item')) {
    cartItemClickListener(event);
  }
});

function removeAllItems() {
  cartItems.innerHTML = '';
  saveCartItems('');
}

emptyCart.addEventListener('click', removeAllItems);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart-item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Referencia: Guilherme Augusto
const addToCart = (foundProduct) => {
  const { id: sku, title: name, price: salePrice } = foundProduct;
  const product = { sku, name, salePrice };
  const item = createCartItemElement(product);
  cartItems.appendChild(item);
  saveCartItems(cartItems.innerHTML);
};

const getProduct = async (e) => {
  const product = e.target.parentElement;
  const productId = product.firstChild.innerText;
  const findProduct = await fetchItem(productId);
  addToCart(findProduct);
};

body.addEventListener('click', (e) => {
  if (e.target.classList.contains('button-add')) {
    e.preventDefault();
    getProduct(e);
  }
});

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'sku', sku));
  section.appendChild(createCustomElement('span', 'name', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'button-add', 'Adicionar ao carrinho!'));
  
  return section;
}

async function searchProduct(product) {
  const searchResponse = await fetchProducts(product);
  searchResponse.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;

    sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = () => {
  searchProduct('computador');
  cartItems.innerHTML = getSavedCartItems();
};
