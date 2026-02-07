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

function updateFeedbackPagination(s) {
  const bullets = document.querySelectorAll(
    '.feedback-container .swiper-pagination-bullet'
  );
  if (!bullets.length) return;

  bullets.forEach(b => b.classList.remove('swiper-pagination-bullet-active'));
  const activeIndexMod5 = s.activeIndex % 5;
  bullets[activeIndexMod5]?.classList.add('swiper-pagination-bullet-active');
}

function initFeedbackSwiper() {
  if (feedbackSwiper) feedbackSwiper.destroy(true, true);

  feedbackSwiper = new Swiper('.feedback-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: true,
    observer: true,
    observeParents: true,
    touchEventsTarget: 'wrapper',
    pagination: {
      el: '.feedback-container .swiper-pagination',
      type: 'custom',
      renderCustom() {
        let bulletsHtml = '';
        for (let i = 0; i < 5; i++) {
          bulletsHtml += `
      <span
        class="swiper-pagination-bullet"
        data-feedback-index="${i}">
      </span>`;
        }
        return bulletsHtml;
      },
    },
    navigation: {
      nextEl: '.feedback-container .swiper-button-next',
      prevEl: '.feedback-container .swiper-button-prev',
    },
  });

  if (feedbackSwiper && feedbackSwiper.on) {
    feedbackSwiper.on('slideChange', () =>
      updateFeedbackPagination(feedbackSwiper)
    );
    updateFeedbackPagination(feedbackSwiper);
  }

  const paginationEl = document.querySelector(
    '.feedback-container .swiper-pagination'
  );
  if (paginationEl) {
    paginationEl.addEventListener('click', e => {
      const bullet = e.target.closest('.swiper-pagination-bullet');
      if (!bullet || !feedbackSwiper) return;
      const targetIndex = parseInt(bullet.dataset.feedbackIndex);

      feedbackSwiper.slideTo(targetIndex);
    });
  }
}

function updateCasaPagination(s) {
  const bullets = document.querySelectorAll(
    '.la-casa-pagination .la-casa-pagination-bullet'
  );
  if (!bullets.length) return;
  bullets.forEach(b => b.classList.remove('la-casa-pagination-bullet-active'));
  const activeIndexMod5 = s.realIndex % 5;
  bullets[activeIndexMod5]?.classList.add('la-casa-pagination-bullet-active');
}

//========== Pagination La Casa =========================
function initCasaSwiper() {
  const casaSwiper = new Swiper('.la-casa-swiper', {
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
      type: 'custom',
      renderCustom() {
        let bulletsHtml = '';
        for (let i = 0; i < 5; i++) {
          bulletsHtml += `<span class="la-casa-pagination-bullet" data-casa-index="${i}"></span>`;
        }
        return bulletsHtml;
      },
    },
    on: {
      init: function (s) {
        updateCasaPagination(s);
      },
      slideChange: function (s) {
        updateCasaPagination(s);
      },
    },
  });

  const paginationEl = document.querySelector('.la-casa-pagination');
  if (paginationEl) {
    paginationEl.addEventListener('click', e => {
      const bullet = e.target.closest('.la-casa-pagination-bullet');
      if (!bullet) return;
      const targetIndex = parseInt(bullet.dataset.casaIndex);
      casaSwiper.slideToLoop(targetIndex);
    });
  }
}

// Initialize everything
loadReviews();
initCasaSwiper();
