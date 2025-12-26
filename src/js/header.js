const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const header = document.querySelector('.header');
// -------------------current navLink--------------------------

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('current'));
    link.classList.add('current');
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navLinks.forEach(link => {
          link.classList.toggle(
            'current',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  {
    threshold: 0.6,
  }
);

sections.forEach(section => observer.observe(section));

// -------------------appeared with scroll --------------------------

const SCROLL_OFFSET = 80;

window.addEventListener('scroll', () => {
  if (window.scrollY > SCROLL_OFFSET) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});
