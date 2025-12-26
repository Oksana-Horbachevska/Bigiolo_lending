const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

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
    threshold: 0.6, // 60% секції в полі зору
  }
);

sections.forEach(section => observer.observe(section));
