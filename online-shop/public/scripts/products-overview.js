const plusAmountBtnElementAll = document.querySelectorAll('#plus-amount');
const minusAmountBtnElementAll = document.querySelectorAll('#minus-amount');
const qtyInputFields = document.querySelectorAll('.product-qty');

addEventListenerForLoop();

function increaseAmount(event) {
  const returnPath = event.composedPath();
  // console.log(returnPath);
  returnPath[1].children[1].value++;
  if (returnPath[1].children[1].value > 99) {
    return (returnPath[1].children[1].value = 99);
  }
}

function decreaseAmount(event) {
  const returnPath = event.composedPath();
  returnPath[1].children[1].value--;
  if (returnPath[1].children[1].value < 1) {
    return (returnPath[1].children[1].value = '');
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

function addEventListenerForLoop() {
  for (plusAmountBtnElement of plusAmountBtnElementAll) {
    plusAmountBtnElement.addEventListener('click', increaseAmount);
  }
  for (minusAmountBtnElement of minusAmountBtnElementAll) {
    minusAmountBtnElement.addEventListener('click', decreaseAmount);
  }
  for (qtyInputField of qtyInputFields) {
    qtyInputField.addEventListener('change', preventWrongQty);
  }
  return;
}
