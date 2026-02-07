import Papa from 'papaparse';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const wrapper = document.querySelector('.feedback-container .swiper-wrapper');
const form = document.querySelector('#feedback-form');

// Environment variables
const SHEET_URL = import.meta.env.VITE_FEEDBACK_SHEET_URL;
const FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL;

// Safety checks for env variables
if (!SHEET_URL) {
  console.error('VITE_FEEDBACK_SHEET_URL is not defined');
}
if (!FORM_URL) {
  console.error('VITE_FEEDBACK_FORM_URL is not defined');
}
// Dynamically set Google Form action
if (form && FORM_URL) {
  form.action = FORM_URL;
}

let feedbackSwiper;

/* ==========Load reviews from Google Sheet (CSV), parse them and render Swiper slides ===========*/
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

      // Create slide
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="feedback-stars">${'★'.repeat(rating || 5)}</div>
        <p class="feedback_description" title="Click to read more">${message}</p>
        <span class="feedback_name">${name}</span>
      `;
      // Toggle expanded review text
      const desc = slide.querySelector('.feedback_description');
      desc.addEventListener('click', () => {
        desc.classList.toggle('is-open');
        // Recalculate Swiper height after content change
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

/* ===========Update custom feedback pagination (5 bullets), Active bullet is calculated via modulo ============*/
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
  // Destroy previous instance if exists
  if (feedbackSwiper) feedbackSwiper.destroy(true, true);

  feedbackSwiper = new Swiper('.feedback-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    autoHeight: true,
    observer: true,
    observeParents: true,
    touchEventsTarget: 'wrapper',
    // Custom pagination with 5 fixed bullets
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
    // Navigation arrows
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
  // Handle pagination bullet clicks
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

/**================Update La Casa pagination (5 bullets, looped) ============ */
function updateCasaPagination(s) {
  const bullets = document.querySelectorAll(
    '.la-casa-pagination .la-casa-pagination-bullet'
  );
  if (!bullets.length) return;
  bullets.forEach(b => b.classList.remove('la-casa-pagination-bullet-active'));
  const activeIndexMod5 = s.realIndex % 5;
  bullets[activeIndexMod5]?.classList.add('la-casa-pagination-bullet-active');
}

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
    // Custom pagination with 5 bullets
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
  // Handle pagination clicks
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

// Initialize all sliders
loadReviews();
initCasaSwiper();
