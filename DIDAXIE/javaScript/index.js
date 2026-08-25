const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('materiais').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('loginBtn').addEventListener('click', () => {
  showToast('Tela de login ainda não foi conectada.');
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
