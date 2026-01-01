const burgerBtn = document.querySelector('[data-header-open]');
const mobileMenu = document.querySelector('[data-menu]');
const mobileCloseBtn = document.querySelector('[data-menu-close]');
const menuLinks = document.querySelectorAll('.mob-nav-link');

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  document.body.classList.add('no-scroll');
  document.addEventListener('keydown', closeMobileMenu);
}

function closeMobileMenu(e) {
  if (e.type === 'keydown' && e.key !== 'Escape') return;

  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', closeMobileMenu);
}

burgerBtn.addEventListener('click', openMobileMenu);
mobileCloseBtn.addEventListener('click', closeMobileMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
