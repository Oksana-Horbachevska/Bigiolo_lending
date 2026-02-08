const DEFAULT_LANG = 'it';
const LANG_STORAGE_KEY = 'bigiolo-lang';

let translations = {};

/* Load translations JSON for selected language */
async function loadTranslations(lang) {
  const response = await fetch(`/locales/${lang}.json`);
  translations = await response.json();
}

/* Replace text content for all elements with data-i18n attribute */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = key
      .split('.')
      .reduce((obj, k) => (obj ? obj[k] : null), translations);

    if (value) {
      el.textContent = value;
    }
  });
}

/** Update active language button state */
function updateLangButtons(lang) {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
}

/** Change language handler */
async function changeLanguage(lang) {
  await loadTranslations(lang);
  applyTranslations();
  updateLangButtons(lang);
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

/** Init i18n on page load */
(async function initI18n() {
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
  const browserLang = navigator.language.startsWith('en') ? 'en' : 'it';
  const lang = savedLang || browserLang || DEFAULT_LANG;

  await changeLanguage(lang);

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;

    const selectedLang = btn.dataset.lang;
    changeLanguage(selectedLang);
  });
})();
