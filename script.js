/* =====================================================================
   LOVE UNIVERSE — script.js
   Semua animasi "kelahiran tata surya cinta" ada di file ini.
   Baca komentar di setiap bagian. Tanda // EDIT HERE artinya
   bagian itu aman & mudah untuk kamu ubah.
   ===================================================================== */

// ---------------------------------------------------------------------
// 0. SETUP DASAR
// ---------------------------------------------------------------------
const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let DPR = Math.min(window.devicePixelRatio || 1, 2); // batasi biar HP tidak berat
let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas(){
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

function center(){ return { x: W / 2, y: H / 2 }; }

// jumlah partikel menyesuaikan ukuran layar/device supaya tetap ringan
// EDIT HERE: naikkan/turunkan angka ini kalau mau lebih padat/ringan
let PARTICLE_COUNT;
if (W <= 480)      PARTICLE_COUNT = prefersReducedMotion ? 260 : 550;
else if (W <= 900) PARTICLE_COUNT = prefersReducedMotion ? 350 : 900;
else               PARTICLE_COUNT = prefersReducedMotion ? 500 : 1500;

const COLORS = ['#FF69B4', '#FF4FA3', '#D946EF', '#F9A8D4', '#FFFFFF'];

function rand(min, max){ return Math.random() * (max - min) + min; }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function dist(x1,y1,x2,y2){ return Math.hypot(x1-x2, y1-y2); }

// ---------------------------------------------------------------------
// 1. LATAR BELAKANG: bintang halus + nebula (selalu tampil sejak awal)
// ---------------------------------------------------------------------
const stars = [];
const STAR_COUNT = W <= 480 ? 70 : 130;
for (let i = 0; i < STAR_COUNT; i++){
  stars.push({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(0.5, 1.6),
    baseAlpha: rand(0.2, 0.9),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.2, 0.6),
    floatY: rand(6, 16),
  });
}

function drawStars(t){
  stars.forEach(s => {
    const twinkle = prefersReducedMotion ? s.baseAlpha : s.baseAlpha * (0.6 + 0.4 * Math.sin(t * 0.001 * s.speed + s.phase));
    const floatOffset = prefersReducedMotion ? 0 : Math.sin(t * 0.0004 * s.speed + s.phase) * s.floatY;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
    ctx.arc(s.x, s.y + floatOffset, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawNebula(){
  // beberapa gumpalan cahaya sangat halus, statis, tidak mencolok
  const blobs = [
    { x: W*0.25, y: H*0.3, r: Math.max(W,H)*0.35, c: 'rgba(217,70,239,0.05)' },
    { x: W*0.75, y: H*0.65, r: Math.max(W,H)*0.4, c: 'rgba(255,105,180,0.045)' },
    { x: W*0.5,  y: H*0.5, r: Math.max(W,H)*0.5, c: 'rgba(90,30,120,0.05)' },
  ];
  blobs.forEach(b => {
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    g.addColorStop(0, b.c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });
}

// ---------------------------------------------------------------------
// 2. DATA PLANET CINTA
//    Ubah teks di bawah ini sesuka hati — semuanya ditandai EDIT HERE
// ---------------------------------------------------------------------
const planets = [
  {
    id: 'sunflower',
    label: 'SUNFLOWER',
    color: '#FFD24C',
    glow: '#FFE9A8',
    radiusX: 95, radiusY: 58,
    tilt: -0.25,
    speed: 0.00042,
    size: 15,
  },
  {
    id: 'letter',
    label: 'LETTER',
    color: '#F9A8D4',
    glow: '#FFD9EC',
    radiusX: 140, radiusY: 84,
    tilt: 0.18,
    speed: 0.00034,
    size: 14,
  },
  {
    id: 'memories',
    label: 'MEMORIES',
    color: '#D946EF',
    glow: '#F0B3FF',
    radiusX: 188, radiusY: 112,
    tilt: -0.12,
    speed: 0.00027,
    size: 15,
  },
  {
    id: 'dreams',
    label: 'DREAMS',
    color: '#9AA6FF',
    glow: '#C9CFFF',
    radiusX: 235, radiusY: 138,
    tilt: 0.28,
    speed: 0.00021,
    size: 14,
  },
  {
    id: 'you',
    label: 'YOU',
    color: '#FFFFFF',
    glow: '#FFC7E6',
    radiusX: 282, radiusY: 164,
    tilt: -0.32,
    speed: 0.00017,
    size: 17,
  },
];

// EDIT HERE: ganti semua teks di bawah ini dengan kata-katamu sendiri
const planetContent = {
  sunflower: {
    title: '🌻 SUNFLOWER',
    text: 'Somewhere in this universe,\nthere will always be a sunflower\nwaiting for your light.',
  },
  letter: {
    title: '💌 LETTER',
    // EDIT THIS LETTER
    text: 'Untuk kamu...\n\nAda begitu banyak hal yang ingin aku ceritakan,\ntapi mungkin semuanya terlalu panjang\nuntuk ditulis dalam satu pesan.\n\nJadi untuk sekarang,\nbiarkan surat kecil ini menjadi bagian\ndari alam semesta kita.',
  },
  memories: {
    title: '⭐ MEMORIES',
    text: 'A few little stars we already made together.',
    // EDIT HERE: ganti caption & foto (assets/photos/memory1.jpg dst.)
    memories: [
      { caption: 'First hello'},
      { caption: 'First conversation'},
      { caption: 'Favorite moment'},
      { caption: 'Today'},
    ],
  },
  dreams: {
    title: '🌙 DREAMS',
    text: 'Maybe the universe is huge,\nbut I hope our little story\nstill has a lot of chapters left.',
  },
  you: {
    title: '✨ YOU',
    text: 'You are my favorite part\nof this universe.',
  },
};

// ---------------------------------------------------------------------
// 3. PARTIKEL INTERAKTIF (debu kosmik -> orbit -> planet -> LOVE core)
// ---------------------------------------------------------------------
const particles = [];

// bagi total partikel: core / per-planet halo / sisanya jadi "debu orbit"
const CORE_SHARE = Math.round(PARTICLE_COUNT * 0.14);
const PLANET_SHARE = Math.round(PARTICLE_COUNT * 0.09); // per planet
const usedByPlanets = PLANET_SHARE * planets.length;
const TRAIL_TOTAL = Math.max(0, PARTICLE_COUNT - CORE_SHARE - usedByPlanets);
const TRAIL_PER_RING = Math.floor(TRAIL_TOTAL / planets.length);

function makeParticle(i){
  const c = center();
  return {
    id: i,
    x: rand(0, W), y: rand(0, H),
    vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
    tx: c.x, ty: c.y,
    size: Math.random() < 0.08 ? rand(2.2, 3.4) : rand(0.8, 1.8),
    color: pick(COLORS),
    mode: 'free',           // free | seek | ring | core | heart
    ringIndex: -1,
    ringOffset: 0,
    isPlanetHalo: false,
    heartT: Math.random(),  // posisi sepanjang kurva hati (0..1)
    twinklePhase: rand(0, Math.PI*2),
  };
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle(i));

// urutan index -> alokasikan ke ring/planet/core
(function allocateParticles(){
  let cursor = 0;
  planets.forEach((p, idx) => {
    p.trailIds = [];
    p.haloIds = [];
    for (let k = 0; k < TRAIL_PER_RING; k++){ p.trailIds.push(cursor); cursor++; }
    for (let k = 0; k < PLANET_SHARE; k++){ p.haloIds.push(cursor); cursor++; }
  });
  window.__coreIds = [];
  for (; cursor < PARTICLE_COUNT; cursor++) window.__coreIds.push(cursor);
})();

// -- heart curve parametrik, dipakai untuk LOVE core & untuk efek "particle heart" --
function heartPoint(t, scale){
  const a = t * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(a), 3);
  const y = -(13 * Math.cos(a) - 5 * Math.cos(2*a) - 2 * Math.cos(3*a) - Math.cos(4*a));
  return { x: x * scale, y: y * scale };
}

// ---------------------------------------------------------------------
// 4. STATE / FASE CERITA
// ---------------------------------------------------------------------
let phase = 'void';     // void -> random -> forming -> complete -> heart -> zoomout -> final
let startTime = null;
let ringGlobalAngle = 0;

// kamera sederhana untuk efek zoom halus saat planet/LOVE ditekan & saat zoom out akhir
const camera = { scale: 1, targetScale: 1, ox: 0, oy: 0, tox: 0, toy: 0 };

let focusedPlanet = null;
let hearting = false;      // sedang menjalankan efek particle-heart rahasia
let heartHold = 0;

// ---------------------------------------------------------------------
// 5. MASUK KE ALAM SEMESTA (tombol ENTER)
// ---------------------------------------------------------------------
const sceneVoid = document.getElementById('scene-void');
const voidContent = document.querySelector('.void-content');
const enterBtn = document.getElementById('enter-btn');
const hud = document.getElementById('hud');
const hint = document.getElementById('hint-text');

enterBtn.addEventListener('click', () => {
  voidContent.classList.add('fade-out');
  setTimeout(() => sceneVoid.classList.add('fade-out'), 500);
  phase = 'random';
  startTime = performance.now();

  const randomDuration = prefersReducedMotion ? 400 : 2600; // detik "debu kosmik" random
  setTimeout(startForming, randomDuration);
});

// ---------------------------------------------------------------------
// 6. PEMBENTUKAN TATA SURYA (orbit -> planet -> core), satu per satu
// ---------------------------------------------------------------------
function assignRing(planetIndex){
  const p = planets[planetIndex];
  const c = center();
  const angle0 = rand(0, Math.PI * 2);
  p.angleOffset = angle0;

  // debu ring menyebar rapi mengelilingi orbit (jadi terlihat seperti "cincin")
  p.trailIds.forEach((pid, k) => {
    const part = particles[pid];
    const a = (k / p.trailIds.length) * Math.PI * 2;
    part.mode = 'seek';
    part.ringIndex = planetIndex;
    part.ringOffset = a;
    part.isTrail = true;
  });

  // partikel halo planet berkumpul jadi satu titik dulu (materialisasi)
  p.haloIds.forEach((pid, k) => {
    const part = particles[pid];
    part.mode = 'seek';
    part.ringIndex = planetIndex;
    part.ringOffset = angle0 + rand(-0.12, 0.12);
    part.isTrail = false;
    part.haloR = rand(6, p.size * 1.4);
  });

  p.materialized = true;
}

function assignCore(){
  window.__coreIds.forEach(pid => {
    const part = particles[pid];
    part.mode = 'core';
  });
  document.dispatchEvent(new Event('core-formed'));
}

function startForming(){
  phase = 'forming';
  ringGlobalAngle = 0;
  const stepDelay = prefersReducedMotion ? 250 : 850;
  planets.forEach((p, i) => {
    setTimeout(() => assignRing(i), i * stepDelay);
  });
  const totalRingTime = planets.length * stepDelay;
  setTimeout(() => {
    assignCore();
    setTimeout(() => {
      phase = 'complete';
      hud.classList.remove('hidden');
      hint.classList.remove('hidden');
      setTimeout(() => hint.classList.add('hidden'), 6000);
    }, prefersReducedMotion ? 500 : 1600);
  }, totalRingTime + 300);
}

// ---------------------------------------------------------------------
// 7. UPDATE PARTIKEL SETIAP FRAME
// ---------------------------------------------------------------------
function updateParticles(t){
  const c = center();
  const heartActive = hearting;

  particles.forEach(part => {
    if (part.mode === 'free'){
      part.x += part.vx;
      part.y += part.vy;
      if (part.x < 0 || part.x > W) part.vx *= -1;
      if (part.y < 0 || part.y > H) part.vy *= -1;
      part.x = Math.max(0, Math.min(W, part.x));
      part.y = Math.max(0, Math.min(H, part.y));
      return;
    }

    if (heartActive){
      // semua partikel (apapun mode aslinya) sementara tertarik membentuk hati besar
      const hp = heartPoint(part.heartT, Math.min(W, H) * 0.02);
      part.tx = c.x + hp.x;
      part.ty = c.y + hp.y;
      part.x += (part.tx - part.x) * 0.06;
      part.y += (part.ty - part.y) * 0.06;
      return;
    }

    if (part.mode === 'seek'){
      const p = planets[part.ringIndex];
      const ang = p.angleOffset + part.ringOffset;
      const rx = p.radiusX, ry = p.radiusY;
      const cosT = Math.cos(p.tilt), sinT = Math.sin(p.tilt);
      const ex = Math.cos(ang) * rx, ey = Math.sin(ang) * ry;
      part.tx = c.x + (ex * cosT - ey * sinT);
      part.ty = c.y + (ex * sinT + ey * cosT);
      part.x += (part.tx - part.x) * 0.045;
      part.y += (part.ty - part.y) * 0.045;
      if (dist(part.x, part.y, part.tx, part.ty) < 2){
        part.mode = 'ring';
      }
      return;
    }

    if (part.mode === 'ring'){
      const p = planets[part.ringIndex];
      const ang = p.angleOffset + part.ringOffset;
      const rx = p.radiusX, ry = p.radiusY;
      const cosT = Math.cos(p.tilt), sinT = Math.sin(p.tilt);
      const ex = Math.cos(ang) * rx, ey = Math.sin(ang) * ry;
      part.tx = c.x + (ex * cosT - ey * sinT);
      part.ty = c.y + (ex * sinT + ey * cosT);
      part.x += (part.tx - part.x) * 0.12;
      part.y += (part.ty - part.y) * 0.12;
      return;
    }

    if (part.mode === 'core'){
      const hp = heartPoint(part.heartT, Math.min(W, H) * 0.018 * coreBreath(t));
      part.tx = c.x + hp.x;
      part.ty = c.y + hp.y - Math.min(W,H)*0.005;
      part.x += (part.tx - part.x) * 0.08;
      part.y += (part.ty - part.y) * 0.08;
      return;
    }
  });

  // planet (posisi sudut) berputar pelan mengelilingi LOVE, hanya saat 'complete'
  if (phase === 'complete' && !heartActive){
    planets.forEach(p => { p.angleOffset += p.speed * 16.6; });
  }
}

function coreBreath(t){
  if (prefersReducedMotion) return 1;
  return 1 + 0.04 * Math.sin(t * 0.0022);
}

// ---------------------------------------------------------------------
// 8. GAMBAR SEMUANYA
// ---------------------------------------------------------------------
function drawOrbitLines(){
  if (phase !== 'complete' && phase !== 'zoomout') return;
  const c = center();
  planets.forEach(p => {
    if (!p.materialized) return;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(p.tilt);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  });
}

function planetScreenPos(p){
  const c = center();
  const ang = p.angleOffset;
  const ex = Math.cos(ang) * p.radiusX, ey = Math.sin(ang) * p.radiusY;
  const cosT = Math.cos(p.tilt), sinT = Math.sin(p.tilt);
  return { x: c.x + (ex * cosT - ey * sinT), y: c.y + (ex * sinT + ey * cosT) };
}

function drawPlanets(){
  if (phase !== 'complete' && phase !== 'zoomout') return;
  planets.forEach(p => {
    if (!p.materialized) return;
    const pos = planetScreenPos(p);
    const isFocused = focusedPlanet === p.id;
    const r = p.size * (isFocused ? 1.3 : 1);
    const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 3);
    g.addColorStop(0, p.glow);
    g.addColorStop(0.4, p.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fill();

    // label kecil di bawah planet
    ctx.font = '11px Georgia, serif';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.textAlign = 'center';
    ctx.fillText(p.label, pos.x, pos.y + r + 16);

    p._screen = pos;
    p._hitR = Math.max(26, r * 2.4);
  });
}

function drawLoveCore(t){
  if (phase === 'void' || phase === 'random') return;
  const c = center();
  const coreVisible = window.__coreIds && particles[window.__coreIds[0]] && particles[window.__coreIds[0]].mode === 'core';
  if (!coreVisible) return;

  const breath = coreBreath(t);
  const baseR = Math.min(W, H) * 0.05 * breath;

  const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, baseR * 4.2);
  glow.addColorStop(0, 'rgba(255,240,248,0.9)');
  glow.addColorStop(0.35, 'rgba(255,105,180,0.35)');
  glow.addColorStop(1, 'rgba(217,70,239,0)');
  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(c.x, c.y, baseR * 4.2, 0, Math.PI * 2);
  ctx.fill();

  // bentuk hati vektor (bukan emoji) digambar dari kurva bezier
  ctx.save();
  ctx.translate(c.x, c.y + baseR * 0.15);
  const s = baseR / 16;
  ctx.scale(s, -s);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.bezierCurveTo(-18, -26, -34, -8, 0, 18);
  ctx.bezierCurveTo(34, -8, 18, -26, 0, -10);
  const hg = ctx.createLinearGradient(0, -20, 0, 18);
  hg.addColorStop(0, '#FFFFFF');
  hg.addColorStop(0.4, '#FF9BC7');
  hg.addColorStop(1, '#D946EF');
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.restore();

  ctx.font = '600 12px Georgia, serif';
  ctx.fillStyle = 'rgba(255,233,245,0.85)';
  ctx.textAlign = 'center';
  ctx.fillText('L  O  V  E', c.x, c.y + baseR * 1.9);

  window.__coreScreen = { x: c.x, y: c.y, r: baseR * 2.4 };
}

function drawParticles(){
  particles.forEach(part => {
    ctx.beginPath();
    ctx.globalAlpha = part.mode === 'free' ? 0.55 : 0.85;
    ctx.fillStyle = part.color;
    ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------
// 9. LOOP UTAMA
// ---------------------------------------------------------------------
function frame(t){
  // trail halus supaya partikel terasa punya "jejak cahaya", bukan clear polos
  ctx.fillStyle = 'rgba(5,2,13,0.28)';
  ctx.fillRect(0, 0, W, H);

  // kamera cinematic (zoom halus ke planet / zoom out akhir)
  camera.scale += (camera.targetScale - camera.scale) * 0.06;
  camera.ox += (camera.tox - camera.ox) * 0.06;
  camera.oy += (camera.toy - camera.oy) * 0.06;

  ctx.save();
  ctx.translate(W/2, H/2);
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(-W/2 - camera.ox, -H/2 - camera.oy);

  drawNebula();
  drawStars(t);
  drawOrbitLines();
  updateParticles(t);
  drawParticles();
  drawPlanets();
  drawLoveCore(t);
  drawGalaxyHeart(t);

  ctx.restore();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------------------------------------------------------------------
// 10. INTERAKSI: TAP PLANET / TAP LOVE CORE
// ---------------------------------------------------------------------
const panel = document.getElementById('planet-panel');
const panelCard = document.querySelector('.panel-card');
const panelTitle = document.getElementById('panel-title');
const panelText = document.getElementById('panel-text');
const panelExtra = document.getElementById('panel-extra');
const panelVisual = document.getElementById('panel-visual');
const panelClose = document.getElementById('panel-close');

function openPanel(id){
  const data = planetContent[id];
  if (!data) return;
  panelTitle.textContent = data.title;
  panelText.textContent = data.text;
  panelExtra.innerHTML = '';
  panelVisual.innerHTML = '';

  if (id === 'sunflower'){
    panelVisual.innerHTML = sunflowerSVG();
  } else if (id === 'memories' && data.memories){
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    data.memories.forEach(m => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `<img src="${m.img}" alt="${m.caption}" onerror="this.style.opacity=0.15">` +
                        `<div>${m.caption}</div>`;
      grid.appendChild(card);
    });
    panelExtra.appendChild(grid);
  } else if (id === 'you'){
    panelVisual.innerHTML = '<div style="font-size:46px;filter:drop-shadow(0 0 18px rgba(255,255,255,0.6))">✨</div>';
  }

  panel.classList.remove('hidden');
  requestAnimationFrame(() => panel.classList.add('show'));

  // fokuskan kamera lembut ke planet yang dibuka
  const p = planets.find(pp => pp.id === id);
  if (p && p._screen){
    focusedPlanet = id;
    camera.targetScale = 1.35;
    camera.tox = p._screen.x - W/2;
    camera.toy = p._screen.y - H/2;
  }
}

function closePanel(){
  panel.classList.remove('show');
  setTimeout(() => panel.classList.add('hidden'), 400);
  focusedPlanet = null;
  camera.targetScale = 1;
  camera.tox = 0;
  camera.toy = 0;
}
panelClose.addEventListener('click', closePanel);
panel.addEventListener('click', (e) => { if (e.target === panel) closePanel(); });

function sunflowerSVG(){
  return `<svg width="90" height="90" viewBox="0 0 100 100">
    <g>
      ${Array.from({length:12}).map((_,i)=>{
        const a = (i/12)*Math.PI*2;
        const x = 50 + Math.cos(a)*30, y = 50 + Math.sin(a)*30;
        return `<ellipse cx="${x}" cy="${y}" rx="10" ry="16" fill="#FFD24C"
                 transform="rotate(${a*180/Math.PI} ${x} ${y})" opacity="0.9"/>`;
      }).join('')}
      <circle cx="50" cy="50" r="17" fill="#7A4A1E"/>
    </g>
  </svg>`;
}

// klik/tap di canvas: cek kena planet atau LOVE core
canvas.addEventListener('pointerdown', (e) => {
  if (phase !== 'complete') return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (window.__coreScreen && dist(x, y, window.__coreScreen.x, window.__coreScreen.y) < window.__coreScreen.r){
    triggerHeartSecret();
    return;
  }
  for (const p of planets){
    if (!p._screen) continue;
    if (dist(x, y, p._screen.x, p._screen.y) < (p._hitR || 30)){
      openPanel(p.id);
      return;
    }
  }
});

// ---------------------------------------------------------------------
// 11. SECRET: PARTICLE HEART EFFECT (tekan LOVE core)
// ---------------------------------------------------------------------
function triggerHeartSecret(){
  if (hearting) return;
  hearting = true;
  const holdTime = prefersReducedMotion ? 900 : 2600;
  const travelTime = prefersReducedMotion ? 500 : 1400;
  setTimeout(() => {
    hearting = false; // partikel otomatis kembali ke mode aslinya (ring/core)
  }, travelTime + holdTime);
}

// ---------------------------------------------------------------------
// 12. HUD: MUSIC TOGGLE
// ---------------------------------------------------------------------
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let musicPlaying = false;
musicBtn.addEventListener('click', () => {
  if (!musicPlaying){
    bgMusic.play().catch(() => {});
    musicPlaying = true;
    musicBtn.classList.add('active');
    musicBtn.textContent = '🎵 Playing';
  } else {
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.classList.remove('active');
    musicBtn.textContent = '🎵 Music';
  }
});

// ---------------------------------------------------------------------
// 13. ZOOM OUT -> HEART GALAXY -> FINAL MESSAGE
// ---------------------------------------------------------------------
const zoomoutBtn = document.getElementById('zoomout-btn');
const finalScene = document.getElementById('final-scene');

// partikel tambahan khusus untuk "galaksi berbentuk hati" di scene akhir
const galaxyParticles = [];
const GALAXY_COUNT = W <= 480 ? 220 : 420;
for (let i = 0; i < GALAXY_COUNT; i++){
  galaxyParticles.push({
    t: Math.random(),
    jitter: rand(0.85, 1.15),
    size: rand(0.8, 2.2),
    color: pick(COLORS),
  });
}
let galaxyAlpha = 0;

function drawGalaxyHeart(){
  if (galaxyAlpha <= 0.001) return;
  const c = center();
  const scale = Math.min(W, H) * 0.11;
  ctx.save();
  ctx.globalAlpha = galaxyAlpha;
  galaxyParticles.forEach(gp => {
    const hp = heartPoint(gp.t, scale * gp.jitter);
    ctx.beginPath();
    ctx.fillStyle = gp.color;
    ctx.arc(c.x + hp.x, c.y + hp.y, gp.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

zoomoutBtn.addEventListener('click', () => {
  phase = 'zoomout';
  hud.classList.add('hidden');
  closePanel();

  camera.targetScale = 0.22;
  camera.tox = 0;
  camera.toy = 0;

  const fadeSteps = 24;
  let step = 0;
  const fadeIn = setInterval(() => {
    step++;
    galaxyAlpha = Math.min(1, step / fadeSteps);
    if (step >= fadeSteps) clearInterval(fadeIn);
  }, prefersReducedMotion ? 20 : 90);

  setTimeout(showFinalScene, prefersReducedMotion ? 1200 : 3600);
});

function showFinalScene(){
  finalScene.classList.remove('hidden');
  const lines = ['final-line-1', 'final-line-2', 'final-line-3', 'final-end'];
  const gap = prefersReducedMotion ? 500 : 1700;
  lines.forEach((id, i) => {
    setTimeout(() => document.getElementById(id).classList.add('show'), i * gap + 300);
  });
  setTimeout(() => {
    document.getElementById('restart-btn').classList.add('show');
  }, lines.length * gap + 600);
}

document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});
