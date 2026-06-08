// ============================================================
//  script.js — App Logic, State Machine & Transitions
// ============================================================
// Depends on: data.js (config), canvas-confetti (CDN), style.css

"use strict";

// ── State ────────────────────────────────────────────────────
let currentScreen = null;
let birthdayMode = false;
let typewriterTimer = null;
let candlesBlown = false;

// ── DOM References ───────────────────────────────────────────
const $ = id => document.getElementById(id);
const screens = {
  1: $('screen-1'),
  2: $('screen-2'),
  3: $('screen-3'),
  "3-5": $('screen-3-5'),
  "3-8": $('screen-3-8'),
  4: $('screen-4'),
  "4-5": $('screen-4-5'),
  5: $('screen-5')
};

const bdOverlay = $('birthday-overlay');
const cakeScene = $('cake-scene');
const countBlock = $('count-block-wrap');
const greetEl = $('greeting-text');
const greetBlock = $('greeting-block');
const pwInput = $('pw-input');
const pwError = $('pw-error');
const sendStatus = $('send-status');
const letterBody = $('letter-body');
const letterDeco = $('letter-deco');

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateSlots();
  setupEvents();
  if (isBirthdayCountdownTime() || isBirthdayTime()) {
    startBirthdayMode();
  } else {
    startNormalFlow();
  }
});

// Tự động ẩn overlay bánh sinh nhật và về giao diện bình thường lúc 01:00 sáng ngày sinh nhật
function scheduleEndOfBirthdayMode() {
  const now = new Date();
  const bdY = config.birthdayYear || now.getFullYear();
  // Thời điểm kết thúc: 01:00:00 sáng ngày sinh nhật
  const end = new Date(bdY, config.birthdayMonth - 1, config.birthdayDay, 1, 0, 0, 0);
  const msUntilEnd = end - now;
  if (msUntilEnd > 0) {
    setTimeout(() => {
      bdOverlay.classList.remove('active');
      document.body.style.overflow = '';
      birthdayMode = false;
      startNormalFlow();
    }, msUntilEnd);
  }
}

// ── Birthday Time Check ───────────────────────────────────────
function isBirthdayCountdownTime() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const h = now.getHours();
  const bdM = config.birthdayMonth;
  const bdD = config.birthdayDay;
  return (m === bdM && d === bdD - 1 && h >= 23);
}

function isBirthdayTime() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const h = now.getHours();
  const bdM = config.birthdayMonth;
  const bdD = config.birthdayDay;
  // Chỉ đúng từ 00:00 đến 00:59 sáng ngày sinh nhật
  return (m === bdM && d === bdD && h < 1);
}

// ── Birthday Mode ─────────────────────────────────────────────
function startBirthdayMode() {
  birthdayMode = true;
  document.body.style.overflow = 'hidden';
  bdOverlay.classList.add('active');
  
  if (isBirthdayTime()) {
    showCakeScene();
    // Lên lịch tự động kết thúc birthday mode vào cuối ngày sinh nhật
    scheduleEndOfBirthdayMode();
  } else {
    cakeScene.classList.remove('visible');
    countBlock.style.display = 'flex';
    tickCountdown();
  }
}

function tickCountdown() {
  const now = new Date();
  const bdY = config.birthdayYear || now.getFullYear();
  const target = new Date(bdY, config.birthdayMonth - 1, config.birthdayDay, 0, 0, 0, 0);
  if (target <= now) target.setFullYear(target.getFullYear() + 1);

  const diff = target - now;
  if (diff <= 0) { showCakeScene(); return; }

  $('cnt-h').textContent = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
  $('cnt-m').textContent = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
  $('cnt-s').textContent = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
  setTimeout(tickCountdown, 1_000);
}

function showCakeScene() {
  countBlock.style.display = 'none';
  cakeScene.classList.add('visible');
  
  // Khi màn hình bánh kem hiện ra, đổi chữ của countdown-label thành câu thổi nến
  const label = document.getElementById('countdown-label');
  if (label) {
    label.textContent = 'thổi nến nàoo..:*☆';
  }
}

function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  
  // Thêm class 'out' vào .candle thay vì .candle-flame
  document.querySelectorAll('.candle').forEach(c => c.classList.add('out'));
  
  launchConfetti();
  $('cake-msg').textContent = config.birthdayCakeMessage;
  setTimeout(() => { $('cake-continue').style.display = 'inline-flex'; }, 1_500);
}

// ── Normal Flow ───────────────────────────────────────────────
function startNormalFlow() {
  setGreeting();
  showScreen(1, false);
  setTimeout(() => {
    greetBlock.classList.add('move-up');
    setTimeout(() => { hideScreen(1); transitionTo(2); }, 700);
  }, 2_200);
}

function setGreeting() {
  const h = new Date().getHours();
  const name = config.recipientName;
  const msgs = [
    [5, 8, `Sáng sớm, mở rèm ra cho nắng chiếu vào nhà nhé ❤`],
    [9, 10, `Buổi sáng tốt lành nhé, ${name}`],
    [11, 12, `Trưa rồi, nhớ uống đủ nước nhé ${name}!`],
    [13, 18, `Chào buổi chiều, hôm nay của cậu tuyệt vời chứ?`],
    [19, 21, `Chào buổi tối, khoe tớ bữa cơm tối cậu nấu nhé ❤`],
    [22, 23, `Chúc ngủ ngon nhé, ${name}`],
  ];
  const found = msgs.find(([a, b]) => h >= a && h <= b);
  greetEl.textContent = found ? found[2] : 'Lên giường đi ngủ ngay!!';
}

// ── Screen Navigation ─────────────────────────────────────────
function showScreen(n, animate = true) {
  const el = screens[n];
  if (!el) return;
  currentScreen = n;

  if (n === 4) {
    document.body.style.overflow = 'auto';
    el.style.position = 'relative';
    el.classList.add('scrollable');
  } else {
    document.body.style.overflow = 'hidden';
    el.classList.remove('scrollable');
  }

  el.style.display = 'flex';
  void el.offsetWidth; // force reflow to restart CSS transition
  el.classList.add('active');

  // Tự động chuyển cảnh cho màn hình trung chuyển
  if (n === "3-8") {
    const block = $('greeting-block-38');
    if (block) {
      block.classList.remove('move-up');
      setTimeout(() => {
        block.classList.add('move-up');
        setTimeout(() => {
          transitionTo(4);
          if (typeof populateGallery === 'function') populateGallery();
        }, 700);
      }, 2500); // Hiển thị 2.5s rồi chạy hiệu ứng 0.7s
    }
  }

  if (n === "4-5") {
    const block = $('intro-block-45');
    if (block) {
      block.classList.remove('exit-fade');
      setTimeout(() => {
        block.classList.add('exit-fade');
        setTimeout(() => {
          transitionTo(5);
          setTimeout(startTypewriter, 600);
        }, 1200); // Đợi 1.2s kết thúc hiệu ứng exit-fade
      }, 5500); // Hiển thị lâu hơn (5.5s) để người dùng đọc hết chữ dài
    }
  }
}

function hideScreen(n) {
  const el = screens[n];
  if (!el) return;
  el.classList.add('exit');
  el.classList.remove('active');
  setTimeout(() => { el.classList.remove('exit'); el.style.display = 'none'; }, 500);
}

function transitionTo(n) {
  if (currentScreen) hideScreen(currentScreen);

  if (n === 2) {
    const confirmBtn = $('confirm-btn');
    if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = 'Xác nhận ✦'; }
    if (sendStatus) sendStatus.textContent = '';

    // Reset nút Nope về vị trí ban đầu
    const nopeBtn = $('btn-nope');
    if (nopeBtn) {
      nopeBtn.style.position = 'relative';
      nopeBtn.style.transform = '';
      nopeBtn.style.transition = '';
      nopeBtn.style.zIndex = '';
      $('nope-spacer')?.remove();
    }
  }

  setTimeout(() => showScreen(n), 300);
}

// ── Slot Population ───────────────────────────────────────────
function populateSlots() {
  const grid = $('slot-grid');
  if (!grid) return;

  const frag = document.createDocumentFragment(); // batch DOM insert
  config.schedulerSlots.forEach((slot, i) => {
    const label = document.createElement('label');
    label.className = 'slot-label';

    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'time-slot'; input.value = slot.value;
    if (i === 0) input.checked = true;

    const card = document.createElement('div');
    card.className = 'slot-card';
    card.innerHTML = `<span class="slot-name">${slot.label}</span><span class="slot-time">${slot.sub}</span>`;

    label.appendChild(input);
    label.appendChild(card);
    frag.appendChild(label);
  });
  grid.appendChild(frag);
}

// ── Gallery Population ────────────────────────────────────────
function populateGallery() {
  const grid = $('gallery-grid');
  if (!grid || grid.children.length > 0) return;

  const frag = document.createDocumentFragment(); // batch DOM insert
  config.galleryPhotos.forEach((photo, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item fade-enter';
    div.style.animationDelay = `${i * 0.1}s`;

    const img = document.createElement('img');
    img.src = photo.url; img.alt = photo.caption; img.loading = 'lazy';
    img.onerror = () => {
      img.style.background = `linear-gradient(135deg,hsl(${140 + i * 25},40%,88%),hsl(${150 + i * 25},35%,82%))`;
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    };

    const cap = document.createElement('p');
    cap.className = 'gallery-caption';
    cap.textContent = photo.caption;

    div.appendChild(img);
    div.appendChild(cap);
    frag.appendChild(div);
  });
  grid.appendChild(frag);
}

// ── Typewriter Effect ─────────────────────────────────────────
function startTypewriter() {
  if (!letterBody) return;
  clearTimeout(typewriterTimer);

  const text = config.letterContent;
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  letterBody.innerHTML = '';
  letterBody.appendChild(cursor);

  let i = 0;
  function type() {
    if (i < text.length) {
      const ch = text[i++];
      cursor.insertAdjacentText('beforebegin', ch);
      typewriterTimer = setTimeout(type, ch === '\n' ? 84 : 28);
    } else {
      cursor.remove();
      letterDeco?.classList.add('visible');
    }
  }
  typewriterTimer = setTimeout(type, 500);
}

// ── Send to Email ───────────────────
async function sendToEmail(slot, message) {
  try {
    // Gọi API Web3Forms bằng mã Access Key bạn đã dán trong data.js (config.webhookUrl)
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({
        access_key: config.webhookUrl, // Tự động lấy mã token từ data.js
        title: "📬 Có lời nhắn sinh nhật mới từ Website!",
        "Khung giờ rảnh": slot,
        "Lời nhắn gửi": message
      }),
    });

    const data = await res.json();          // ← parse body thay vì chỉ check res.ok
    console.log("Web3Forms response:", data); // để debug trên GitHub Pages
    return data.success === true;           // ← check đúng field
  } catch (err) {
    console.error("Lỗi mạng:", err);
    return false;
  }
}

// ── Confetti ──────────────────────────────────────────────────
function launchConfetti(opts = {}) {
  if (typeof confetti === 'undefined') return;
  const defaults = {
    spread: 80, ticks: 120, gravity: 1, decay: 0.93, startVelocity: 36,
    colors: ['#a7ffd5', '#b2f7d3', '#d4ffe0', '#ffffff', '#e3ffe7', '#ffd6e0', '#ffe9a0'],
  };
  confetti({ ...defaults, particleCount: 80, origin: { x: 0.3, y: 0.6 }, ...opts });
  setTimeout(() => confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.6 }, ...opts }), 200);
  setTimeout(() => confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.5 }, ...opts }), 400);
}

// ── Events ────────────────────────────────────────────────────
function setupEvents() {

  // Screen 2 — Confirm
  const confirmBtn = $('confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const slot = document.querySelector('input[name="time-slot"]:checked')?.value ?? 'unknown';
      const msg = $('scheduler-msg')?.value?.trim() || '';
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Đang gửi...';

      const ok = await sendToEmail(slot, msg);

      if (sendStatus) {
        sendStatus.textContent = ok
          ? '✓ Đã gửi rồi nhé! Đợi bí mật vào thứ 2 nhaaa'
          : '⚠ Không gửi được, nhưng mình đã ghi nhận rồi!';
        sendStatus.style.color = ok ? '#192153' : '#9c3e4a';
      }
      setTimeout(() => transitionTo(3), 1_400);
    });
  }

  // Screen 3 — Unlock
  $('unlock-btn')?.addEventListener('click', handleUnlock);
  pwInput?.addEventListener('keydown', e => { if (e.key === 'Enter') handleUnlock(); });

  // Back buttons
  $('back-3')?.addEventListener('click', () => transitionTo(2));
  $('back-4')?.addEventListener('click', () => transitionTo("3-5"));
  $('back-5')?.addEventListener('click', () => transitionTo(4));

  // Screen 4 — Next
  $('gallery-next')?.addEventListener('click', () => {
    transitionTo("4-5");
  });

  // Birthday
  $('cake-scene')?.addEventListener('click', blowCandles);
  $('cake-continue')?.addEventListener('click', () => {
    bdOverlay.classList.remove('active');
    setTimeout(() => transitionTo(3), 500);
  });

  // ── Nope button: dùng transform thay left/top để tránh layout reflow ──
  const nopeBtn = $('btn-nope');
  if (nopeBtn) {
    // Lưu vị trí gốc để tính offset
    let originX = 0, originY = 0, detached = false;

    function runAway(e) {
      if (e?.type === 'touchstart') e.preventDefault();

      const screen2 = $('screen-2');
      if (!screen2) return;

      // Lần đầu chạm: tách ra fixed, ghi nhớ origin
      if (!detached) {
        const rect = nopeBtn.getBoundingClientRect();
        originX = rect.left;
        originY = rect.top;

        // Spacer giữ chỗ trong flexbox
        const spacer = document.createElement('div');
        spacer.id = 'nope-spacer';
        spacer.style.width = `${nopeBtn.offsetWidth}px`;
        spacer.style.height = `${nopeBtn.offsetHeight}px`;
        nopeBtn.parentNode.insertBefore(spacer, nopeBtn);

        // Đặt fixed tại đúng vị trí ban đầu, transition = none để không giật
        nopeBtn.style.transition = 'none';
        nopeBtn.style.position = 'fixed';
        nopeBtn.style.left = `${originX}px`;
        nopeBtn.style.top = `${originY}px`;
        nopeBtn.style.transform = 'translate(0,0)';
        nopeBtn.style.margin = '0';
        nopeBtn.style.zIndex = '9999';
        void nopeBtn.offsetWidth; // flush
        detached = true;
      }

      const s2 = screen2.getBoundingClientRect();
      const bW = nopeBtn.offsetWidth;
      const bH = nopeBtn.offsetHeight;
      const pad = 20;

      // Random đích đến trong bounds của screen-2
      const targetX = pad + Math.random() * (s2.width - bW - pad * 2) + s2.left;
      const targetY = pad + Math.random() * (s2.height - bH - pad * 2) + s2.top;

      // ✅ Dùng transform translate thay vì left/top → compositor thread, không reflow
      nopeBtn.style.transition = 'transform 0.25s cubic-bezier(0.2,0,0,1)';
      nopeBtn.style.transform = `translate(${targetX - originX}px, ${targetY - originY}px)`;
    }

    nopeBtn.addEventListener('mouseenter', runAway);
    nopeBtn.addEventListener('touchstart', runAway, { passive: false });
  }
}

// ── Password Logic ────────────────────────────────────────────
function handleUnlock() {
  const val = pwInput?.value?.trim() || '';
  if (val === String(config.secretPassword)) {
    pwError && (pwError.textContent = '');
    launchConfetti();
    setTimeout(() => { Puzzle.init(config.puzzleImage); }, 800);
  } else {
    if (pwInput) {
      pwInput.classList.remove('shake');
      void pwInput.offsetWidth;
      pwInput.classList.add('shake');
      pwInput.value = '';
    }
    pwError && (pwError.textContent = config.wrongPasswordMessage);
  }
}
