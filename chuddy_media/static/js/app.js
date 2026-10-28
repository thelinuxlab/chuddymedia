(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);

  // Reading progress bar + live Lagos clock
  const bar = $("#progress");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, { passive: true });
  const clock = $("#clock");
  const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }); };
  tick(); setInterval(tick, 1000);

  // Social popup
  const modal = $("#social");
  const toggle = (open) => { modal.hidden = !open; document.body.style.overflow = open ? "hidden" : ""; };
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => toggle(true)));
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.matches("[data-close]")) toggle(false); });
  addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));

  // Hero slideshow: changes image every 5s, pauses when the tab is hidden
  const slides = [...document.querySelectorAll(".slide")], dots = $("#dots"), cap = $("#caption");
  if (slides.length) {
    let i = 0, timer;
    slides.forEach((_, n) => { const d = document.createElement("button"); d.setAttribute("aria-label", "Slide " + (n + 1)); d.onclick = () => { show(n); play(); }; dots.appendChild(d); });
    const show = (n) => {
      i = n % slides.length;
      slides.forEach((s, k) => { s.classList.remove("on"); void s.offsetWidth; s.classList.toggle("on", k === i); });
      [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
      cap.textContent = slides[i].dataset.cap || "";
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5000); };
    document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : play());
    show(0); play();
  }

  // Contact form: email goes to the studio Gmail inbox; WhatsApp opens the studio number directly
  const form = $("#contact-form"), status = $("#status");
  if (form) {
    const say = (msg, err) => { status.textContent = msg; status.classList.toggle("err", !!err); };
    const send = async (viaWhatsApp) => {
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const text = `Hello Chuddy Media, I'm ${d.get("name")}.\n${d.get("message")}\nPhone: ${d.get("phone") || "-"}\nEmail: ${d.get("email")}`;
      const win = viaWhatsApp ? window.open("about:blank", "_blank") : null;
      say("Sending...");
      try {
        const res = await fetch(form.action, { method: "POST", body: d, headers: { "X-Requested-With": "XMLHttpRequest" } });
        const json = await res.json();
        if (!json.ok) throw new Error("invalid");
        if (viaWhatsApp) {
          const url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`;
          win ? (win.location = url) : (location.href = url);
          say("Opening WhatsApp...");
        } else {
          say(json.emailed ? "Sent! Your message is in our inbox." : "Received! We will get back to you shortly.");
        }
        form.reset();
      } catch {
        if (win) win.close();
        say("Please check your details and try again.", true);
      }
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); send(false); });
    $("#wa-btn").addEventListener("click", () => send(true));
  }

  // Real-time gallery: new uploads appear without refreshing the page
  const gallery = $("#gallery");
  if (gallery) {
    const poll = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/projects/?cat=${encodeURIComponent(gallery.dataset.cat)}`);
        const { projects } = await res.json();
        const seen = new Set([...gallery.querySelectorAll("[data-id]")].map((f) => f.dataset.id));
        projects.filter((p) => !seen.has(String(p.id))).reverse().forEach((p) => {
          const f = document.createElement("figure");
          f.className = "shot reveal in"; f.dataset.id = p.id;
          const cap = gallery.dataset.cat ? p.title : `${p.cat} · ${p.title}`;
          f.innerHTML = (p.image ? `<img src="${p.image}" alt="" loading="lazy">` : '<div class="ph"></div>') + "<figcaption></figcaption>";
          f.lastChild.textContent = cap;
          if (p.image) f.addEventListener("click", () => {
            const box = document.createElement("div"); box.className = "lightbox";
            box.innerHTML = `<img src="${p.image}" alt="">`; box.onclick = () => box.remove(); document.body.appendChild(box);
          });
          gallery.prepend(f);
        });
      } catch { /* retry on next tick */ }
    };
    setInterval(poll, 15000);
  }

  // No tilt on touch devices
  if (matchMedia("(hover: none)").matches) document.querySelectorAll(".tilt").forEach((c) => c.replaceWith(c.cloneNode(true)));
})();

// Typewriter: the hero headline types itself, then the second line fades in
(() => {
  "use strict";
  const el = document.getElementById("type"), after = document.getElementById("after");
  if (!el) return;
  const text = el.textContent.trim();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { after.classList.add("show"); return; }
  el.textContent = "";
  let i = 0;
  const type = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 70 + Math.random() * 70);
    else setTimeout(() => after.classList.add("show"), 350);
  };
  setTimeout(type, 600);
})();
