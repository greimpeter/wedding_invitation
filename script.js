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

// Formspree feedback
document.getElementById("rsvpForm")?.addEventListener("submit", function (e) {
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");

  btn.disabled = true;
  btn.textContent = "Wird gesendet...";

  setTimeout(() => {
    status.textContent = "Vielen Dank! Eure Antwort wurde verschickt.";
    btn.textContent = "Gesendet";
  }, 800);
});
