import Papa from 'papaparse';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const wrapper = document.querySelector('.feedback-container .swiper-wrapper');
const form = document.querySelector('#feedback-form');
const SHEET_URL = import.meta.env.VITE_FEEDBACK_SHEET_URL;
const FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL;

console.log('ENV:', import.meta.env);

if (!SHEET_URL) {
  console.error('VITE_FEEDBACK_SHEET_URL is not defined');
}

if (!FORM_URL) {
  console.error('VITE_FEEDBACK_FORM_URL is not defined');
}

if (form && FORM_URL) {
  form.action = FORM_URL;
}

let feedbackSwiper;

async function loadReviews() {
  try {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

    if (!wrapper) return;
    wrapper.innerHTML = '';

    parsed.data.forEach(row => {
      const name = row['Name']?.trim();
      const message = row['Message']?.trim();
      const rating = parseInt(row['Rating']);

      if (!name || !message) return;

      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="feedback-stars">${'★'.repeat(rating || 5)}</div>
        <p class="feedback_description" title="Click to read more">${message}</p>
        <span class="feedback_name">${name}</span>
      `;

      const desc = slide.querySelector('.feedback_description');
      desc.addEventListener('click', () => {
        desc.classList.toggle('is-open');
        if (feedbackSwiper) {
          setTimeout(() => feedbackSwiper.updateAutoHeight(300), 10);
        }
      });
      wrapper.appendChild(slide);
    });

    initFeedbackSwiper();
  } catch (error) {
    console.error('loading error:', error);
  }
}

function updateCustomPagination(s) {
  const bullets = document.querySelectorAll(
    '.feedback-container .swiper-pagination-bullet'
  );
  if (!bullets.length || !s.slides) return;

  bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));
  const lastIndex = s.slides.length - 1;

  if (s.activeIndex === 0) {
    bullets[0]?.classList.add('swiper-pagination-bullet-active');
  } else if (s.activeIndex === lastIndex) {
    bullets[2]?.classList.add('swiper-pagination-bullet-active');
  } else {
    bullets[1]?.classList.add('swiper-pagination-bullet-active');
  }
}

function initFeedbackSwiper() {
  if (feedbackSwiper) feedbackSwiper.destroy(true, true);

  // Використовуємо специфічний клас .feedback-swiper
  feedbackSwiper = new Swiper('.feedback-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: true,
    observer: true,
    observeParents: true,
    pagination: {
      el: '.feedback-container .swiper-pagination',
      type: 'custom',
      renderCustom() {
        return `
          <span class="swiper-pagination-bullet" data-index="first"></span>
          <span class="swiper-pagination-bullet" data-index="middle"></span>
          <span class="swiper-pagination-bullet" data-index="last"></span>
        `;
      },
    },
    navigation: {
      nextEl: '.feedback-container .swiper-button-next',
      prevEl: '.feedback-container .swiper-button-prev',
    },
  });

  if (feedbackSwiper && feedbackSwiper.on) {
    feedbackSwiper.on('slideChange', () =>
      updateCustomPagination(feedbackSwiper)
    );
    updateCustomPagination(feedbackSwiper);
  }

  // Обробка кліків по кастомним булетам
  const paginationEl = document.querySelector(
    '.feedback-container .swiper-pagination'
  );
  if (paginationEl) {
    paginationEl.addEventListener('click', e => {
      const bullet = e.target.closest('.swiper-pagination-bullet');
      if (!bullet || !feedbackSwiper) return;
      const count = feedbackSwiper.slides.length;
      if (bullet.dataset.index === 'first') feedbackSwiper.slideTo(0);
      if (bullet.dataset.index === 'middle')
        feedbackSwiper.slideTo(Math.floor(count / 2));
      if (bullet.dataset.index === 'last') feedbackSwiper.slideTo(count - 1);
    });
  }
}

// Ініціалізація галереї La Casa
function initCasaSwiper() {
  new Swiper('.la-casa-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: '.la-casa-next',
      prevEl: '.la-casa-prev',
    },
    pagination: {
      el: '.la-casa-pagination',
      clickable: true,
      bulletClass: 'la-casa-pagination-bullet',
      bulletActiveClass: 'la-casa-pagination-bullet-active',
    },
  });
}

// Запуск усього
loadReviews();
initCasaSwiper();
