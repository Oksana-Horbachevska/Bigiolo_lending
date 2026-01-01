import Papa from 'papaparse';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const wrapper = document.querySelector('.swiper-wrapper');
const feedbackForm = document.getElementById('feedback-form');

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmwbeh0wcfzPaoNP18jTO7b5qbPxUKGZW55oibzdkk_qyXE0K8X85JqPh_fBGQG45bY6sRlRhAT9Hc/pub?output=csv';
let swiper;

async function loadReviews() {
  try {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    wrapper.innerHTML = '';

    parsed.data.forEach((row, index) => {
      const name = row['Name']?.trim();
      const message = row['Message']?.trim();
      const rating = parseInt(row['Rating']);

      // Лог тепер не буде видавати помилку
      console.log(`Обробка відгуку №${index + 1}:`, name);

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
        desc.classList.toggle('is-open'); // Перемикаємо клас

        // Оновлюємо висоту слайдера, щоб він не обрізав розгорнутий текст
        if (swiper) {
          setTimeout(() => swiper.updateAutoHeight(300), 10);
        }
      });
      wrapper.appendChild(slide);
    });

    initSwiper();
  } catch (error) {
    console.error('loading error:', error);
  }
}

function updateCustomPagination(swiper) {
  const bullets = document.querySelectorAll('.swiper-pagination-bullet');
  if (!bullets.length) return;

  bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));

  const lastIndex = swiper.slides.length - 1;

  if (swiper.activeIndex === 0) {
    bullets[0].classList.add('swiper-pagination-bullet-active');
  } else if (swiper.activeIndex === lastIndex) {
    bullets[2].classList.add('swiper-pagination-bullet-active');
  } else {
    bullets[1].classList.add('swiper-pagination-bullet-active');
  }
}

function initSwiper() {
  if (swiper) {
    swiper.destroy(true, true);
  }

  swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    autoHeight: true,
    observer: true,
    observeParents: true,
    watchOverflow: true,

    pagination: {
      el: '.swiper-pagination',
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
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  swiper.on('slideChange', () => {
    updateCustomPagination(swiper);
  });

  setTimeout(() => {
    updateCustomPagination(swiper);
  }, 0);

  const paginationEl = document.querySelector('.swiper-pagination');

  paginationEl.addEventListener('click', e => {
    const bullet = e.target.closest('.swiper-pagination-bullet');
    if (!bullet || !swiper) return;

    const slidesCount = swiper.slides.length;

    switch (bullet.dataset.index) {
      case 'first':
        swiper.slideTo(0);
        break;

      case 'middle':
        swiper.slideTo(Math.floor(slidesCount / 2));
        break;

      case 'last':
        swiper.slideTo(slidesCount - 1);
        break;
    }
  });

  setTimeout(() => {
    swiper.update();
  }, 100);
}

loadReviews();
