// script.js — Countdown + Form Feedback

// Countdown
function createCountdown(elementId, targetDateString) {
  const target = new Date(targetDateString).getTime();
  const el = document.getElementById(elementId);

  setInterval(() => {
    const now = Date.now();
    const delta = target - now;

    if (delta <= 0) {
      el.textContent = "Heute ist der große Tag!";
      return;
    }

    const d = Math.floor(delta / (1000 * 60 * 60 * 24));
    const h = Math.floor((delta / (1000 * 60 * 60)) % 24);
    const m = Math.floor((delta / (1000 * 60)) % 60);
    const s = Math.floor((delta / 1000) % 60);

    el.textContent = `${d} Tage ${h} Std ${m} Min ${s} Sek`;
  }, 1000);
}

// Main countdown
createCountdown("countTimerMain", "2026-10-03T12:00:00");

// Second countdown – freely choose date
createCountdown("countTimerSecond", "2026-04-18T20:00:00");


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
