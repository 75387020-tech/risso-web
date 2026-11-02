const btn = document.querySelector('#btnTema');

if (btn) {
  btn.addEventListener('click', () => {
    const isDark = btn.getAttribute('aria-checked') !== 'true';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
    btn.setAttribute('aria-checked', String(isDark));
  });
}