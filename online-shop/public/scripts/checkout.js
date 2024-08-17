const paymentMethodElement = document.getElementById('payment-methods');
const creditCardContainerElement = document.getElementById(
  'credit-card-container'
);
const paypalContainerElement = document.getElementById('paypal-container');
const paypalEmailElement = document.getElementById('paypal-email');
const cardHolderElement = document.getElementById('card-holder');
const cardNumberElement = document.getElementById('card-number');
const cardCvcElement = document.getElementById('cvc');

function showPaymentInput() {
  if (paymentMethodElement.value === 'credit-card') {
    creditCardContainerElement.style.display = 'flex';
    paypalContainerElement.style.display = 'none';
    paypalEmailElement.value = '';
  }

  if (paymentMethodElement.value === 'paypal') {
    creditCardContainerElement.style.display = 'none';
    paypalContainerElement.style.display = 'flex';
    cardHolderElement.value = '';
    cardNumberElement.value = '';
    cardCvcElement.value = '';
  }
}

if (paymentMethodElement) {
  paymentMethodElement.addEventListener('change', showPaymentInput);
}
