/* ═══════════════════════════════════════════
   PUZZLE GAME — puzzle.js
   4×4, drag-and-drop + touch, Web Audio API
   Không dependency ngoài canvas-confetti
   (đã load sẵn trong index.html)
═══════════════════════════════════════════ */

const Puzzle = (() => {

  /* ── Cấu hình ── */
  const COLS       = 4;
  const ROWS       = 4;
  const TOTAL      = COLS * ROWS;
  const BOARD_SIZE = window.innerWidth <= 400 ? 280 : 320;  // px
  const GAP        = 3;

  /* ── State ── */
  let order   = [];      // order[i] = correctIndex của mảnh tại ô i
  let solved  = new Array(TOTAL).fill(false);
  let moves   = 0;
  let seconds = 0;
  let timerID = null;
  let selectedCell = null;   // index ô đang chọn (0-15)
  let audioCtx = null;
  let imageURL = '';

  /* ── DOM refs ── */
  let board, previewImg, hintText, annotation,
      statsEl, movesEl, timerEl,
      btnPeek, peekOverlay,
      footerEl, winEl;

  /* ════════════════════════════════════════
     PUBLIC: init(imgURL)
     Gọi từ script.js sau khi unlock thành công
  ════════════════════════════════════════ */
  function init(imgURL) {
    imageURL = imgURL || (config && config.puzzleImage) || '';

    _cacheDom();
    _setSize();
    _buildBoard();
    _buildPeekOverlay();
    _attachPreviewClick();
    _setupHackListeners();
    _showScreen();
  }

  /* ── Cache DOM ── */
  function _cacheDom() {
    board       = document.getElementById('puzzle-board');
    previewImg  = document.getElementById('puzzle-preview-img');
    hintText    = document.getElementById('puzzle-hint-text');
    annotation  = document.getElementById('puzzle-annotation');
    statsEl     = document.querySelector('.puzzle-stats');
    movesEl     = document.getElementById('puzzle-moves');
    timerEl     = document.getElementById('puzzle-timer');
    btnPeek     = document.getElementById('btn-peek');
    peekOverlay = document.getElementById('peek-overlay');
    footerEl    = document.querySelector('.puzzle-footer');
    winEl       = document.getElementById('puzzle-win');
  }

  /* ── Đặt CSS variable --board-size ── */
  function _setSize() {
    document.getElementById('screen-3-5')
      .style.setProperty('--board-size', BOARD_SIZE + 'px');
  }

  /* ── Xây 16 mảnh ghép (ẩn trước) ── */
  function _buildBoard() {
    board.innerHTML = '';
    const pieceW = (BOARD_SIZE - GAP * (COLS - 1)) / COLS;
    const pieceH = (BOARD_SIZE - GAP * (ROWS - 1)) / ROWS;

    for (let i = 0; i < TOTAL; i++) {
      const el = document.createElement('div');
      el.className = 'puzzle-piece';
      el.dataset.cell = i;

      // background-position để cắt đúng mảnh
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      el.style.backgroundImage  = `url("${imageURL}")`;
      el.style.backgroundSize   = `${BOARD_SIZE}px ${BOARD_SIZE}px`;
      el.style.backgroundPosition =
        `-${col * (pieceW + GAP)}px -${row * (pieceH + GAP)}px`;
      el.style.width  = pieceW + 'px';
      el.style.height = pieceH + 'px';

      _attachDrag(el, i);
      board.appendChild(el);
    }

    // order ban đầu = đúng thứ tự, chưa shuffle
    order = Array.from({ length: TOTAL }, (_, i) => i);
  }

  /* ── Peek overlay ── */
  function _buildPeekOverlay() {
    if (!peekOverlay) return;
    peekOverlay.style.backgroundImage = `url("${imageURL}")`;
  }

  /* ── Click vào ảnh → explode + shuffle ── */
  function _attachPreviewClick() {
    if (!previewImg) return;
    previewImg.src = imageURL;

    // Reset các class của các element khi init/chơi lại
    previewImg.classList.remove('exploded');
    if (annotation) annotation.classList.remove('hidden');
    if (hintText) hintText.classList.remove('visible');
    if (board) board.classList.remove('visible');
    if (statsEl) statsEl.classList.remove('visible');
    if (btnPeek) btnPeek.classList.remove('visible');
    if (footerEl) footerEl.classList.remove('visible');

    // Reset stats hiển thị
    moves = 0;
    if (movesEl) movesEl.textContent = '0';
    if (timerEl) timerEl.textContent = '00:00';

    // Dùng onclick trực tiếp để tránh nhân bản listener khi chạy lại game
    previewImg.onclick = () => {
      if (previewImg.classList.contains('exploded')) return;
      previewImg.classList.add('exploded');

      // Ẩn annotation "bấm vào đây" ngay lập tức
      if (annotation) annotation.classList.add('hidden');

      // Phát âm thanh "whoosh"
      _playWhoosh();

      // Shuffle mảnh
      _shuffle();
      board.classList.add('visible');

      // Hiện hướng dẫn thứ 2 ngay lập tức khi nổ ảnh
      if (hintText) hintText.classList.add('visible');

      // Hiện stats + peek button + footer
      setTimeout(() => {
        if (statsEl)  statsEl.classList.add('visible');
        if (btnPeek)  btnPeek.classList.add('visible');
        if (footerEl) footerEl.classList.add('visible');
        _startTimer();
      }, 400);
    };
  }

  /* ── Fisher-Yates shuffle (luôn có lời giải với 4×4) ── */
  function _shuffle() {
    order = Array.from({ length: TOTAL }, (_, i) => i);

    // Thực hiện random swaps chẵn → đảm bảo giải được
    let swaps = 0;
    for (let i = TOTAL - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [order[i], order[j]] = [order[j], order[i]];
      swaps++;
    }
    // Nếu số swap lẻ → thêm 1 swap nữa để chẵn (luôn có lời giải)
    if (swaps % 2 !== 0) {
      [order[0], order[1]] = [order[1], order[0]];
    }

    _renderOrder();
    solved = new Array(TOTAL).fill(false);
    _recheckAll();
  }

  /* ── Áp order lên background-position các mảnh ── */
  function _renderOrder() {
    const pieces = board.querySelectorAll('.puzzle-piece');
    const pieceW = (BOARD_SIZE - GAP * (COLS - 1)) / COLS;
    const pieceH = (BOARD_SIZE - GAP * (ROWS - 1)) / ROWS;

    pieces.forEach((el, cellIdx) => {
      const correctIdx = order[cellIdx];
      const col = correctIdx % COLS;
      const row = Math.floor(correctIdx / COLS);
      el.style.backgroundPosition =
        `-${col * (pieceW + GAP)}px -${row * (pieceH + GAP)}px`;
      el.dataset.correct = correctIdx;
      el.dataset.cell    = cellIdx;
    });
  }

  /* ── Kiểm tra tất cả mảnh sau shuffle ── */
  function _recheckAll() {
    for (let i = 0; i < TOTAL; i++) {
      solved[i] = (order[i] === i);
    }
  }

  /* ════════════════════════════════════════
     CLICK-TO-SWAP (mouse + touch)
   ════════════════════════════════════════ */
  function _attachDrag(el, idx) {
    el.addEventListener('click', _onPieceClick);
  }

  function _onPieceClick(e) {
    const clickedCell = parseInt(e.currentTarget.dataset.cell);

    // 1. Nếu chưa chọn mảnh nào
    if (selectedCell === null) {
      selectedCell = clickedCell;
      e.currentTarget.classList.add('dragging');
      return;
    }

    // 2. Nếu click lại chính mảnh đang chọn
    if (selectedCell === clickedCell) {
      selectedCell = null;
      e.currentTarget.classList.remove('dragging');
      return;
    }

    // 3. Nếu click vào mảnh khác mảnh đang chọn -> Đổi chỗ
    const prevSelectedEl = board.querySelector(`[data-cell="${selectedCell}"]`);
    if (prevSelectedEl) {
      prevSelectedEl.classList.remove('dragging');
    }

    const a = selectedCell;
    const b = clickedCell;
    selectedCell = null; // Reset trạng thái trước khi swap

    _swap(a, b);
  }

  /* ── Hoán đổi 2 ô ── */
  function _swap(a, b) {
    moves++;
    if (movesEl) movesEl.textContent = moves;

    // Swap trong mảng order
    [order[a], order[b]] = [order[b], order[a]];

    // Cập nhật DOM
    _renderOrder();

    // Kiểm tra từng ô vừa swap
    let newSnap = false;
    [a, b].forEach(idx => {
      const wasCorrect = solved[idx];
      const isCorrect  = (order[idx] === idx);
      solved[idx] = isCorrect;

      if (isCorrect && !wasCorrect) {
        newSnap = true;
        _playSnap();
        _snapEffect(board.children[idx]);
      }
    });

    // Kiểm tra win
    if (solved.every(Boolean)) {
      setTimeout(_onWin, 400);
    }
  }

  /* ── Hiệu ứng snap đúng ── */
  function _snapEffect(el) {
    el.classList.remove('snap-correct');
    void el.offsetWidth; // reflow
    el.classList.add('snap-correct');

    const glow = document.createElement('div');
    glow.className = 'piece-glow';
    el.appendChild(glow);
    setTimeout(() => glow.remove(), 600);
  }

  /* ════════════════════════════════════════
     AUDIO  (Web Audio API — không cần file)
  ════════════════════════════════════════ */
  function _getCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (_) {}
    }
    return audioCtx;
  }

  // Tiếng "snap" nhẹ khi 2 mảnh khớp
  function _playSnap() {
    const ctx = _getCtx();
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  }

  // Tiếng "whoosh" khi mảnh tách ra
  function _playWhoosh() {
    const ctx = _getCtx();
    if (!ctx) return;
    const bufSize = ctx.sampleRate * 0.3;
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data    = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    src.buffer = buf;
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  // Tiếng "fanfare" khi thắng
  function _playFanfare() {
    const ctx = _getCtx();
    if (!ctx) return;
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  /* ════════════════════════════════════════
     PEEK  (xem ảnh gốc 2 giây)
  ════════════════════════════════════════ */
  function _initPeek() {
    if (!btnPeek || !peekOverlay) return;
    btnPeek.addEventListener('click', () => {
      peekOverlay.classList.add('active');
      setTimeout(() => peekOverlay.classList.remove('active'), 2000);
    });
  }

  /* ════════════════════════════════════════
     TIMER
  ════════════════════════════════════════ */
  function _startTimer() {
    seconds = 0;
    clearInterval(timerID);
    timerID = setInterval(() => {
      seconds++;
      if (timerEl) timerEl.textContent = _fmt(seconds);
    }, 1000);
  }

  function _stopTimer() { clearInterval(timerID); }

  function _fmt(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  /* ════════════════════════════════════════
     WIN
  ════════════════════════════════════════ */
  function _onWin() {
    _stopTimer();
    _playFanfare();

    // Confetti (canvas-confetti đã load trong index.html)
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 } });
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { x: 0.15, y: 0.6 } }), 300);
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { x: 0.85, y: 0.6 } }), 500);
    }

    if (winEl) {
      winEl.style.display = 'flex';
      winEl.classList.add('visible');
    }
    const instructionsEl = document.getElementById('puzzle-instructions');
    if (instructionsEl) {
      instructionsEl.style.display = 'none';
    }

    // Hiện nút "Tiếp tục" trong footer
    const btnNext = document.getElementById('puzzle-next');
    const btnBack = document.getElementById('back-puzzle');
    if (btnNext) btnNext.style.display = 'inline-flex';
    if (btnBack) btnBack.style.display = 'inline-flex';

    // Ẩn hint text cũ
    if (hintText) hintText.classList.remove('visible');
  }

  /* ════════════════════════════════════════
     SHOW SCREEN
  ════════════════════════════════════════ */
  function _showScreen() {
    // Reset khung thông tin bên phải (luật chơi / chúc mừng)
    const winEl = document.getElementById('puzzle-win');
    const instructionsEl = document.getElementById('puzzle-instructions');
    if (winEl) {
      winEl.style.display = 'none';
      winEl.classList.remove('visible');
    }
    if (instructionsEl) {
      instructionsEl.style.display = 'block';
    }

    // Hiện screen-3-5 bằng cách tích hợp vào hệ thống transition của script.js
    if (typeof transitionTo === 'function') {
      transitionTo("3-5");
    } else {
      document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
      });
      const screen = document.getElementById('screen-3-5');
      if (screen) {
        screen.style.display = 'flex';
        screen.classList.add('active');
      }
    }

    // Init peek button
    _initPeek();

    // Footer buttons — dùng onclick trực tiếp để tránh nhân bản event listener
    const btnNext = document.getElementById('puzzle-next');
    const btnBack = document.getElementById('back-puzzle');
    if (btnNext) {
      btnNext.style.display = 'none';
      btnNext.onclick = () => {
        if (typeof transitionTo === 'function') {
          transitionTo("3-8");
        } else {
          document.getElementById('screen-3-5').style.display = 'none';
          document.getElementById('screen-3-8').style.display = 'flex';
        }
      };
    }
    if (btnBack) {
      btnBack.onclick = () => {
        _stopTimer();
        if (typeof transitionTo === 'function') {
          transitionTo(3);
        } else {
          document.getElementById('screen-3-5').style.display = 'none';
          document.getElementById('screen-3').style.display   = 'flex';
        }
      };
    }
  }
  /* ── Secret Hack Win ── */
  let hackListenersSetup = false;
  function _setupHackListeners() {
    if (hackListenersSetup) return;
    hackListenersSetup = true;

    // Keyboard shortcut: Ctrl + Shift + H
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
        e.preventDefault();
        const screen35 = document.getElementById('screen-3-5');
        if (screen35 && screen35.style.display !== 'none') {
          hackWin();
        }
      }
    });

    // Mobile secret tap: Tap 3 times on the eyebrow title
    const eyebrow = document.querySelector('.puzzle-eyebrow');
    let clickCount = 0;
    let clickTimeout = null;
    if (eyebrow) {
      eyebrow.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimeout);
        if (clickCount >= 3) {
          clickCount = 0;
          const screen35 = document.getElementById('screen-3-5');
          if (screen35 && screen35.style.display !== 'none') {
            hackWin();
          }
        } else {
          clickTimeout = setTimeout(() => { clickCount = 0; }, 400);
        }
      });
    }
  }

  function hackWin() {
    order = Array.from({ length: TOTAL }, (_, i) => i);
    _renderOrder();
    solved = new Array(TOTAL).fill(true);
    _onWin();
  }

  /* ── Public API ── */
  return { init, hackWin };

})();
// Dòng này nằm ở cuối cùng file puzzle.js, sau dấu })();
// Vô hiệu hóa code tự động chạy game khi load trang để chạy luồng thực tế
// setTimeout(() => {
//     // Ép chạy game ngay lập tức sau 200ms để test giao diện
//     Puzzle.init('image/puzzle.JPG'); 
// }, 200);