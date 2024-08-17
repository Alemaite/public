const totalPriceAllItems = document.querySelectorAll('.total-price');
const grandTotalElement = document.getElementsByClassName('grand-total-h3');
const orderIdElements = document.getElementsByClassName('order-id-h3');
const shippingPaymentDetailsElements = document.getElementsByClassName(
  'shipping-payment-details'
);
const ordersContainerElements = document.getElementsByClassName(
  'shipping-and-products-container'
);

if (ordersContainerElements) {
  getGrandTotalPerOrder();
}

// goes through order then through the products total price per container to return total per order

function getGrandTotalPerOrder() {
  for (let i = 0; i < ordersContainerElements.length; i++) {
    let sumOfOrder = 0;
    for (productsContainer of ordersContainerElements[i].children[1].children) {
      sumOfOrder += Number(
        productsContainer.children[0].children[2].children[2].dataset.totalprice
      );
    }
    grandTotalElement[i].textContent = 'Order Grand Total: € ' + sumOfOrder;
  }
}

// for ([
//   i,
//   totalPrice,
// ] of ordersContainerElements.children[1].children[0].entries()) {
//   let GrandTotal = 0;
//   GrandTotal += Number(
//     totalPrice.children[0].children[2].children[2].dataset.totalprice
//   );
//   grandTotalElement[i].textContent = 'Order Grand Total: € ' + GrandTotal;
// }
