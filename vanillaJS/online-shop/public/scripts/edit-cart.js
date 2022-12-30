const headerCartElement = document.getElementById('header-cart');
const asideHeaderCartElement = document.getElementById('aside-header-cart');
const allCartMinusBtnElements = document.querySelectorAll('.minus-amount-cart');
const allCartPlusBtnElements = document.querySelectorAll('.plus-amount-cart');
const allCartQtyInputElements = document.querySelectorAll('.cart-qty');
const removeItemBtnElements =
  document.getElementsByClassName('remove-item-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const cartItemContainerElements = document.querySelectorAll(
  '.cart-item-container'
);
const grandTotalContainer = document.getElementById(
  'cart-grand-total-container'
);
const grandTotalElement = document.getElementById('grand-total-h3');
const cartItemsSection = document.getElementById('cart-summary');
const shippingAndPaymentContainer = document.getElementById('shipping-payment');
const itemsInCartRemovedMessageContainer = document.getElementById(
  'items-in-cart-removed'
);
const cartItemsContainer = document.getElementById('cart-items-container');

const csrfTokenCartInputElement = document.getElementById('_csrf');

addEventListenersToQtyElements();
addEventListenersToRemoveItemBtnElements();
addEventListenersToCartQtyInputElements();
calculateGrandTotal();

function addEventListenersToQtyElements() {
  for (cartMinusBtnElement of allCartMinusBtnElements) {
    cartMinusBtnElement.addEventListener('click', reduceQtyInCart);
  }
  for (cartPlusBtnElement of allCartPlusBtnElements) {
    cartPlusBtnElement.addEventListener('click', increaseQtyInCart);
  }
  return;
}

function addEventListenersToRemoveItemBtnElements() {
  for (removeItemBtnElement of removeItemBtnElements) {
    removeItemBtnElement.addEventListener('click', removeItemFromCart);
  }
  return;
}

function addEventListenersToCartQtyInputElements() {
  for (allCartQtyInputElement of allCartQtyInputElements) {
    allCartQtyInputElement.addEventListener('change', preventWrongQty);
  }
  return;
}

function reduceQtyInCart(event) {
  const returnPath = event.composedPath();
  if (returnPath[1].children[2].value > 1) {
    returnPath[1].children[2].value--;
    updateTotalPrice(event);
  } else {
    returnPath[1].children[2].value = 1;
    updateTotalPrice(event);
  }
}

function increaseQtyInCart(event) {
  const returnPath = event.composedPath();
  if (returnPath[1].children[2].value < 99) {
    returnPath[1].children[2].value++;
    updateTotalPrice(event);
  } else {
    returnPath[1].children[2].value = 99;
    updateTotalPrice(event);
  }
  return;
}

function preventWrongQty(event) {
  const returnPath = event.composedPath();
  if (returnPath[0].value < 1) {
    returnPath[0].value = '';
  }

  if (returnPath[0].value > 99) {
    returnPath[0].value = 99;
  }
  return;
}

async function updateTotalPrice(event) {
  const returnPath = event.composedPath();
  returnPath[2].children[1].children[1].outerHTML =
    '<p> Total: € ' +
    returnPath[1].children[2].value *
      returnPath[2].children[1].children[0].dataset.price +
    '</p>';
  returnPath[2].children[1].children[1].dataset.totalPrice =
    returnPath[1].children[2].value *
    returnPath[2].children[1].children[0].dataset.price;
  calculateGrandTotal();
  return;
}

async function calculateGrandTotal() {
  const grandTotalArray = [];
  const numberOfLiInCart = cartItemsContainer.children.length;
  const firstCartItem = cartItemsContainer.children[0];

  if (firstCartItem && firstCartItem.className === 'cart-item-container') {
    for (let i = 0; i < numberOfLiInCart; i++) {
      const totalPriceDataSetPath =
        cartItemsContainer.children[i].children[2].children[1].children[1]
          .dataset.totalPrice;
      grandTotalArray.push(Number(totalPriceDataSetPath));
    }

    let grandTotal = 0;

    for (let n = 0; n < grandTotalArray.length; n++) {
      grandTotal += grandTotalArray[n];
    }
    grandTotalElement.textContent = 'Grand Total: € ' + grandTotal;
    return;
  }

  // remove cart, shipping, & payment container if there is no first cart item, but the containers still are being
  // displayed and are empty

  if (cartItemsSection && shippingAndPaymentContainer) {
    cartItemsSection.style.display = 'none';
    shippingAndPaymentContainer.style.display = 'none';
    itemsInCartRemovedMessageContainer.style.display = 'block';
    headerCartElement.classList.remove('item-in-cart');
    asideHeaderCartElement.classList.remove('item-in-cart');
    return;
  }
}

async function removeItemFromCart(event) {
  const returnPath = event.composedPath();
  const resetCartData = { deletedItemIndex: event.target.dataset.liIndex };
  const stringifiedResetCartData = await JSON.stringify(resetCartData);

  await fetch('/removecartitem', {
    method: 'DELETE',
    body: stringifiedResetCartData,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfTokenCartInputElement.value,
    },
  });

  // loop through the items coming after the deleted item and reduce their index by 1
  for (
    let i = Number(resetCartData.deletedItemIndex) + 1;
    i < returnPath[3].childElementCount;
    i++
  ) {
    returnPath[3].children[i].children[2].children[2].dataset.liIndex =
      Number(
        returnPath[3].children[i].children[2].children[2].dataset.liIndex
      ) - 1;
  }

  await returnPath[2].remove();
  await calculateGrandTotal(event);

  return;
}
