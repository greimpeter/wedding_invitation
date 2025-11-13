// script.js
// Countdown bis 03.10.2026 11:00 (lokale Zeit)
(function(){
  const target = new Date("2026-10-03T11:00:00"); // ISO 8601 local-ish
  const timerEl = document.getElementById("countTimer");

  function pad(n){ return n<10 ? "0"+n : n; }

  function updateCountdown(){
    const now = new Date();
    let diff = target - now;
    if(diff <= 0){
      timerEl.textContent = "Heute — die Feier!";
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const mins = Math.floor(diff / (1000*60));
    diff -= mins * (1000*60);
    const secs = Math.floor(diff / 1000);

    timerEl.textContent = `${days} Tage ${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// Form handling: send to Formspree via fetch and show status.
// IMPORTANT: Ersetze 'YOUR_FORMSPREE_ID' in form action oder hier mit eurer Formspree ID.
// Wenn ihr das HTML-Form action-Attribut benutzt, Formspree leitet standardmäßig weiter; wir verwenden fetch
// für ein besseres UX (kein Seitenreload).
(function(){
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  // Fallback: uses form.action but replace placeholder if left
  const formspreeUrl = form.action || "https://formspree.io/f/YOUR_FORMSPREE_ID";

  form.addEventListener("submit", async function(ev){
    ev.preventDefault();

    status.textContent = "Sende…";
    submitBtn.disabled = true;

    const fd = new FormData(form);

    // Optional: add a subject for email inbox clarity
    fd.append("_subject", "RSVP: " + (fd.get("name") || "Unbekannt"));

    try {
      const resp = await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: fd
      });

      if(resp.ok){
        status.textContent = "Danke! Deine Rückmeldung wurde gesendet.";
        form.reset();
      } else {
        const data = await resp.json().catch(()=>null);
        if(data && data.errors){
          status.textContent = "Fehler: " + (data.errors.map(e=>e.message).join(", ") || "Überprüfe die Eingaben.");
        } else {
          status.textContent = "Beim Senden ist ein Fehler aufgetreten. Bitte prüfe deine Verbindung oder schreibe uns direkt per Mail.";
        }
      }
    } catch(err){
      console.error(err);
      status.textContent = "Netzwerkfehler beim Senden. Bitte versuche es später oder kontaktiere uns per Mail.";
    } finally {
      submitBtn.disabled = false;
      // optional: nach 7s Status zurücksetzen
      setTimeout(()=> {
        if(status.textContent.startsWith("Danke")) return;
        status.textContent = "";
      }, 7000);
    }
  });
})();
