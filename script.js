// script.js — Countdown + Form Feedback

// Countdown
const targetDate = new Date("2026-10-03T11:00:00").getTime();
const timerEl = document.getElementById("countTimer");

setInterval(() => {
  const now = Date.now();
  const delta = targetDate - now;

  if (delta <= 0) {
    timerEl.textContent = "Heute ist der große Tag!";
    return;
  }

  const d = Math.floor(delta / (1000 * 60 * 60 * 24));
  const h = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const m = Math.floor((delta / (1000 * 60)) % 60);
  const s = Math.floor((delta / 1000) % 60);

  timerEl.textContent = `${d} Tage ${h} Std ${m} Min ${s} Sek`;
}, 1000);

// RSVP Form handling with Formspree
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Senden...';

    const formData = new FormData(rsvpForm);

    try {
      const response = await fetch(rsvpForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.style.display = 'block';
        formStatus.textContent = 'Vielen Dank! Eure Antwort wurde verschickt.';
        formStatus.classList.add('success');
        rsvpForm.reset();
      } else {
        formStatus.style.display = 'block';
        formStatus.textContent = 'Fehler beim Senden. Bitte erneut versuchen.';
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.style.display = 'block';
      formStatus.textContent = 'Netzwerkfehler. Bitte später erneut versuchen.';
      formStatus.classList.add('error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Absenden';
  });
}
