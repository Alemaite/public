const getAddProductButtonElement = document.getElementById('add-product-btn');
const getAddProductFormElement = document.getElementById('add-product-form');
const getAddProductProductTitle = document.getElementById('product-title');
const getAddProductSummary = document.getElementById('product-summary');
const getAddProductPrice = document.getElementById('product-price');
const getAddProductFormCSRFToken = document.getElementById('_csrf');
const getAddProductFormFilepickerElement =
  document.getElementById('product-image-path');
const getAddProductImgPreviewElement = document.getElementById(
  'product-image-preview'
);

function submitAddProductForm(event) {
  event.preventDefault();
  const errorMessageChildElement = document.createElement('p');

  // Validate admin input, if all fields have values and are not empty, submit AJAX reqest, if not, show error message

  if (
    getAddProductProductTitle.value &&
    getAddProductSummary.value &&
    getAddProductPrice.value &&
    getAddProductFormFilepickerElement.files[0] &&
    getAddProductProductTitle.value.trim() !== '' &&
    getAddProductSummary.value.trim() !== '' &&
    getAddProductPrice.value.trim() !== ''
  ) {
    const addProductData = {
      'product-title': getAddProductProductTitle.value,
      'product-summary': getAddProductSummary.value,
      'product-price': getAddProductPrice.value,
    };
    const formData = new FormData();

    formData.append(
      'product-image-path',
      getAddProductFormFilepickerElement.files[0]
    );
    formData.append('product-data', JSON.stringify(addProductData));

    // Appending the file in a picture format and the related strings in json leads to the respective middlewares
    // dealing with the form correctly. The file gets handled by multer and the json data by the json middlewre - both
    // in app.js

    fetch('/admin/add-products', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': getAddProductFormCSRFToken.value,
      },
    });

    // Set values in form to empty after sending AJAX req

    getAddProductProductTitle.value = '';
    getAddProductSummary.value = '';
    getAddProductPrice.value = '';

    // Delete error message element after successful AJAX request, if one exists

    if (getAddProductFormElement.firstChild.className === 'error-messages') {
      getAddProductFormElement.firstChild.remove();
    }
    return;
  } else {
    // If no error message exists, append it, if it does, simply return to avoid creating multiple error message elements

    if (getAddProductFormElement.firstChild.className !== 'error-messages') {
      errorMessageChildElement.textContent =
        'Please check your input. All fields are required.';
      errorMessageChildElement.className = 'error-messages';
      getAddProductFormElement.insertAdjacentElement(
        'afterbegin',
        errorMessageChildElement
      );
    }
    return;
  }
}

function filePreview() {
  const files = getAddProductFormFilepickerElement.files;
  if (!files || files.length === 0) {
    getAddProductImgPreviewElement.style.display = 'none';
    return;
  }
  getAddProductImgPreviewElement.style.display = 'block';
  const pickedFile = files[0];
  getAddProductImgPreviewElement.src = URL.createObjectURL(pickedFile);
}

getAddProductFormElement.addEventListener('submit', submitAddProductForm);
getAddProductFormFilepickerElement.addEventListener('change', filePreview);
