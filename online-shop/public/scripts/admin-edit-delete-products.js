const allDeleteBtnElements = document.querySelectorAll('#add-to-cart-btn');
const csrfTokenElement = document.getElementById('csrf');

addEventListenersToDeleteBtns();

function addEventListenersToDeleteBtns() {
  for (deleteBtnElement of allDeleteBtnElements) {
    deleteBtnElement.addEventListener('click', deleteItem);
  }
}

function deleteItem(event) {
  const itemObjectId = JSON.stringify({ objectId: event.target.dataset.id });
  const returnPath = event.composedPath();
  fetch('./admin/delete-product', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfTokenElement.value,
    },
    body: itemObjectId,
  });
  returnPath[3].remove();
  return;
}
