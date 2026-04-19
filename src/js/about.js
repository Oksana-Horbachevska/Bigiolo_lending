const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll('.about-content-wrapper, .about-img-box')
  .forEach(el => observer.observe(el));
