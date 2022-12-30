const addToCartBtnElements = document.querySelectorAll('#add-to-cart-btn');
const productsOverviewCsrfToken = document.getElementById('_csrf');
const h1ProductOverview = document.getElementById('h1-products-overview');
const headerCartElement = document.getElementById('header-cart');
const asideHeaderCartElement = document.getElementById('aside-header-cart');

addEventListenerForLoop();

function addEventListenerForLoop() {
  for (addToCartBtnElement of addToCartBtnElements) {
    addToCartBtnElement.addEventListener('click', addProductToCart);
  }
  return;
}

function addProductToCart(event) {
  event.preventDefault();
  const returnPath = event.composedPath();

  const productQty = returnPath[2].children[1].children[1].value;
  const productTitle = returnPath[3].children[1].textContent;
  const productSummary = returnPath[3].children[2].textContent;
  const productPrice = Number(
    returnPath[2].children[2].innerText.replace(/\D/g, '')
  );
  const productImagePath = returnPath[3].children[0].src.substring(21);

  const addItemData = {
    quantity: productQty,
    title: productTitle,
    summary: productSummary,
    price: productPrice,
    imagePath: productImagePath,
  };

  if (productQty < 1) {
    return;
  }

  fetch('/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': productsOverviewCsrfToken.value,
    },
    body: JSON.stringify(addItemData),
  });

  if (productQty) {
    addItemData.quantity = '';
    returnPath[2].childNodes[3].childNodes[3].value = '';
    event.target.style['background-color'] = 'green';
    event.target.style.color = 'white';
    event.target.textContent = 'Added to Cart';
  }

  headerCartElement.classList.add('item-in-cart');
  asideHeaderCartElement.classList.add('item-in-cart');
}
