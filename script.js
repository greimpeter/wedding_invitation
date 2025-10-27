// Countdown
(function () {
  const el = document.getElementById('countdown');
  const target = new Date('2026-06-12T12:00:00');
  function tick() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      el.textContent = 'Heute ist der Tag!';
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${d} Tage ${h}:${m}:${s}`;
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

// RSVP local save + mailto
(function () {
  const form = document.getElementById('rsvpForm');
  const saved = document.getElementById('saved');
  const mailBtn = document.getElementById('mailtoBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const entry = {
      name: form.name.value,
      guests: form.guests.value,
      coming: form.coming.value,
      message: form.message.value,
      time: new Date().toISOString(),
    };
    localStorage.setItem('rsvp-anna-lukas', JSON.stringify(entry));
    saved.textContent = `Danke, ${entry.name}! Deine Antwort wurde gespeichert.`;
    form.reset();
  });

  mailBtn.addEventListener('click', () => {
    const name = form.name.value || '—';
    const guests = form.guests.value || '—';
    const coming = form.coming.value || '—';
    const message = form.message.value || '';
    const subject = encodeURIComponent('RSVP: ' + name);
    const body = encodeURIComponent(
      `Name: ${name}\nAnzahl Personen: ${guests}\nKommt: ${coming}\nNachricht: ${message}`
    );
    // TODO: eigene Mailadresse einsetzen
    window.location.href = `mailto:EMAIL@BEISPIEL.AT?subject=${subject}&body=${body}`;
  });
})();
