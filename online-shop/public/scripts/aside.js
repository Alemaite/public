const hmgBtnContainer = document.getElementById('hmg-btn');
const asideContainer = document.getElementById('aside');

function toggleAside() {
  if (
    asideContainer.style.display === '' ||
    asideContainer.style.display === 'none'
  ) {
    asideContainer.style.display = 'block';
    return;
  }

  if (asideContainer.style.display === 'block') {
    asideContainer.style.display = 'none';
    return;
  }
}

hmgBtnContainer.addEventListener('click', toggleAside);
