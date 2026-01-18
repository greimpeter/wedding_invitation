// script.js — Countdown + Form Feedback

// For translations
function t(key) {
  const lang = localStorage.getItem("lang") || "de";
  return key.split(".").reduce(
    (obj, k) => obj && obj[k],
    translations[lang]
  ) || key;
}

function pluralize(value, singularKey, pluralKey) {
  const lang = localStorage.getItem("lang") || "de";
  const labels = translations[lang].countdown_labels;

  return value === 1
    ? labels[singularKey]
    : labels[pluralKey];
}



// Countdown
function createCountdown(elementId, targetDateString) {
  const target = new Date(targetDateString).getTime();
  const el = document.getElementById(elementId);

  setInterval(() => {
    const now = Date.now();
    const delta = target - now;
    const lang = localStorage.getItem("lang") || "de";
    const labels = translations[lang].countdown_labels;

    if (delta <= 0) {
      el.textContent = "Heute ist der große Tag!";
      return;
    }

    const d = Math.floor(delta / (1000 * 60 * 60 * 24));
    const h = Math.floor((delta / (1000 * 60 * 60)) % 24);
    const m = Math.floor((delta / (1000 * 60)) % 60);
    const s = Math.floor((delta / 1000) % 60);

    el.textContent =
      `${d} ${pluralize(d, "day", "days")} ` +
      `${h} ${pluralize(h, "hour", "hours")} ` +
      `${m} ${pluralize(m, "minute", "minutes")} ` +
      `${s} ${pluralize(s, "second", "seconds")}`;
  }, 1000);
}

// Main countdown
createCountdown("countTimerMain", "2026-10-03T12:00:00");

// Second countdown – freely choose date
createCountdown("countTimerSecond", "2026-06-15T20:00:00");


// RSVP Form handling with Formspree
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');

// if (rsvpForm) {
//   rsvpForm.addEventListener('submit', async function (e) {
//     e.preventDefault();
//     const submitBtn = document.getElementById('submitBtn');
//     submitBtn.disabled = true;
//     submitBtn.textContent = 'Senden...';

//     const formData = new FormData(rsvpForm);

//     try {
//       const response = await fetch(rsvpForm.action, {
//         method: 'POST',
//         body: formData,
//         headers: { 'Accept': 'application/json' }
//       });

//       if (response.ok) {
//         formStatus.style.display = 'block';
//         formStatus.textContent = 'Vielen Dank! Eure Antwort wurde verschickt.';
//         formStatus.classList.add('success');
//         rsvpForm.reset();
//       } else {
//         formStatus.style.display = 'block';
//         formStatus.textContent = 'Fehler beim Senden. Bitte erneut versuchen.';
//         formStatus.classList.add('error');
//       }
//     } catch (err) {
//       formStatus.style.display = 'block';
//       formStatus.textContent = 'Netzwerkfehler. Bitte später erneut versuchen.';
//       formStatus.classList.add('error');
//     }

//     submitBtn.disabled = false;
//     submitBtn.textContent = 'Absenden';
//   });
// }

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = t("form.sending");

    const formData = new FormData(rsvpForm);

    try {
      const response = await fetch(rsvpForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      formStatus.style.display = 'block';

      if (response.ok) {
        formStatus.textContent = t("form.success");
        formStatus.classList.remove('error');
        formStatus.classList.add('success');
        rsvpForm.reset();
      } else {
        formStatus.textContent = t("form.error");
        formStatus.classList.remove('success');
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.style.display = 'block';
      formStatus.textContent = t("form.network");
      formStatus.classList.remove('success');
      formStatus.classList.add('error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = t("form.submit");
  });
}





// Language Switcher

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("langToggle");
  const menu = document.getElementById("langMenu");
  const currentLang = document.getElementById("currentLang");
  const currentFlag = document.getElementById("currentFlag");

  const options = document.querySelectorAll(".lang-option");

  // Restore saved language or default to German
  const savedLang = localStorage.getItem("lang") || "de";
  applyLanguageUI(savedLang);
  translatePage(savedLang);

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang;
      const label = option.dataset.label;
      const flag = option.dataset.flag;

      applyLanguageUI(lang, label, flag);
      translatePage(lang);
      menu.classList.remove("open");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".lang-switcher")) {
      menu.classList.remove("open");
    }
  });

  function applyLanguageUI(lang, label, flag) {
    const option =
      [...options].find(o => o.dataset.lang === lang);

    currentLang.textContent = label || option.dataset.label;
    currentFlag.src = flag || option.dataset.flag;
  }
});

function translatePlaceholders(lang) {
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");

    // supports nested keys like "placeholders.allergies"
    const value = key.split(".").reduce(
      (obj, k) => obj && obj[k],
      translations[lang]
    );

    if (value) {
      el.placeholder = value;
    }
  });
}

