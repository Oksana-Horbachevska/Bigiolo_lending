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
    console.error('Помилка завантаження:', error);
  }
}

function initSwiper() {
  if (swiper) {
    swiper.destroy(true, true);
  }

  swiper = new Swiper('.swiper', {
    // Реєструємо модулі
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
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  setTimeout(() => {
    swiper.update();
  }, 100);
}

loadReviews();
