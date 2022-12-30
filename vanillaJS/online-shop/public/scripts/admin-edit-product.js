const filePickerElement = document.getElementById('product-image-path');
const newPictureElement = document.getElementById('new-picture');

function previewNewPicture() {
  if (!filePickerElement.files[0]) {
    newPictureElement.style.display = 'none';
    return;
  }
  newPictureElement.style.display = 'block';
  newPictureElement.src = URL.createObjectURL(filePickerElement.files[0]);
}

filePickerElement.addEventListener('change', previewNewPicture);
