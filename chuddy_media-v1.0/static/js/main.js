(() => {
  "use strict";
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.querySelector(".burger");

  // Header: hide on scroll down, show on scroll up
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("scrolled", y > 40);
    header.classList.toggle("hide", y > lastY && y > 200 && !nav.classList.contains("open"));
    lastY = y;
  }, { passive: true });

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });

  // Scroll reveal
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Animated counters
  const counter = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(end * p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  }));
  document.querySelectorAll("[data-count]").forEach((el) => counter.observe(el));

  // 3D tilt on cards
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  // Lightbox
  document.querySelectorAll(".shot[data-full]").forEach((shot) => {
    shot.addEventListener("click", () => {
      const box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = `<img src="${shot.dataset.full}" alt="">`;
      box.addEventListener("click", () => box.remove());
      document.body.appendChild(box);
    });
  });
  addEventListener("keydown", (e) => e.key === "Escape" && document.querySelector(".lightbox")?.remove());

  // Three.js hero: glowing camera lens ring, orbiting particles, mouse parallax
  const canvas = document.getElementById("scene");
  if (!canvas || typeof THREE === "undefined") return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 8;
  const gold = 0xd4a24c, group = new THREE.Group();
  scene.add(group, new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.PointLight(gold, 2, 40); key.position.set(5, 4, 6); scene.add(key);

  [[2.2, 0.12], [1.6, 0.06], [1, 0.04]].forEach(([r, t], i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, t, 24, 120),
      new THREE.MeshStandardMaterial({ color: gold, metalness: 0.9, roughness: 0.25 }));
    ring.userData.speed = 0.004 * (i + 1);
    group.add(ring);
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x111118, metalness: 1, roughness: 0.1, emissive: 0x1a1305 })));

  const N = 700, pos = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 24;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: gold, size: 0.04, transparent: true, opacity: 0.7 }));
  scene.add(stars);

  const mouse = { x: 0, y: 0 };
  addEventListener("mousemove", (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    camera.aspect = w / h; camera.updateProjectionMatrix();
    group.position.x = w > 860 ? 3 : 0;
  };
  addEventListener("resize", resize); resize();
  const loop = () => {
    group.children.forEach((m) => { if (m.userData.speed) { m.rotation.x += m.userData.speed; m.rotation.y += m.userData.speed * 1.4; } });
    group.rotation.y += (mouse.x * 1.2 - group.rotation.y) * 0.05;
    group.rotation.x += (mouse.y * 0.8 - group.rotation.x) * 0.05;
    stars.rotation.y += 0.0007;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  loop();
})();
