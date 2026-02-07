const feedbackOpenBtn = document.querySelector('[data-feedback-modal-open]');
const feedbackCloseBtn = document.querySelector('[data-feedback-modal-close]');
const feedbackModal = document.querySelector('[data-feedback-modal]');
const ratingEl = document.getElementById('feedback-star-rating');
const ratingInput = document.getElementById('rating-value');
const stars = ratingEl.querySelectorAll('button');
const feedbackForm = document.getElementById('feedback-form');
const feedbackSuccessMsg = document.getElementById('feedback-success');
const nameInput = document.getElementById('user-name');
const messageInput = document.getElementById('user-message');
const errorMessage = document.getElementById('feedback-error');
const feedbackList = document.querySelector('.feedback-modal-list');
const iframe = document.getElementById('hidden_iframe');

let isSubmitted = false;
let currentRating = 0;

function openFeedbackModal() {
  feedbackModal.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
  document.addEventListener('keydown', closeFeedbackModal);
}

function closeFeedbackModal(e) {
  // Ignore key presses except Escape
  if (e.type === 'keydown' && e.key !== 'Escape') return;
  feedbackModal.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', closeFeedbackModal);
}

feedbackOpenBtn.addEventListener('click', openFeedbackModal);
feedbackCloseBtn.addEventListener('click', closeFeedbackModal);

/** Handle star rating click*/
stars.forEach(star => {
  star.addEventListener('click', () => {
    currentRating = Number(star.dataset.value);
    ratingInput.value = currentRating;

    stars.forEach(s =>
      s.classList.toggle('active', Number(s.dataset.value) <= currentRating)
    );
  });
});

/**Triggered after the form is submitted to the iframe */
iframe.addEventListener('load', () => {
  if (isSubmitted) {
    feedbackForm.style.display = 'none';

    const title = document.querySelector('.feedback-modal-title');
    if (title) title.style.display = 'none';
    feedbackSuccessMsg.classList.remove('is-hidden');
    feedbackForm.reset();

    stars.forEach(s => s.classList.remove('active'));
    currentRating = 0;
    ratingInput.value = '';

    setTimeout(() => {
      closeFeedbackModal({ type: 'keydown', key: 'Escape' });

      setTimeout(() => {
        feedbackForm.style.display = 'block';
        if (title) title.style.display = 'block';
        feedbackSuccessMsg.classList.add('is-hidden');
        isSubmitted = false;
      }, 500);
    }, 3000);
  }
});

/** Shows validation error message  */
function showError() {
  errorMessage.classList.remove('is-hidden');
  ratingEl.classList.add('rating-error');
}

/** Hides validation error message  */
function hideError() {
  errorMessage.classList.add('is-hidden');
  ratingEl.classList.remove('rating-error');
}

/** Form validation before submit  */
feedbackForm.addEventListener('submit', e => {
  const nameValid = nameInput.value.trim() !== '';
  const messageValid = messageInput.value.trim() !== '';
  const ratingValid = currentRating > 0;

  if (!nameValid || !messageValid || !ratingValid) {
    e.preventDefault(); // ⛔  stop form submission
  }

  hideError();
  isSubmitted = true;
});
