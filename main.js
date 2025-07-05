// ===== Utility =====
function $(id) { return document.getElementById(id); }
function show(el) { el && el.classList.remove('hidden'); }
function hide(el) { el && el.classList.add('hidden'); }
function setText(id, value) { if ($(id)) $(id).innerHTML = value; }

// ===== Global State =====
let LANG = 'en';
let STRINGS = {};
let quizSet = [];
let current = 0, score = 0, streak = 0, timer = null;
let userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}') || {};
let settings = JSON.parse(localStorage.getItem('settings') || '{}') || {};
let users = JSON.parse(localStorage.getItem('users') || '{}') || {};
let isDaily = false;
let quizInProgress = false;
let isMuted = false;

// ===== Load Strings and Init =====
fetch('strings.json')
  .then(res => res.json())
  .then(strings => {
    STRINGS = strings;
    LANG = localStorage.getItem('lang') || 'en';
    updateAllStrings();
    setupEventListeners();
    hide($('splash-screen'));
    show($('start-screen'));
    hide($('quiz-content'));
  });

// ===== Language Switching =====
function updateAllStrings() {
  const S = STRINGS[LANG];
  setText('app-title', S.appTitle);
  setText('welcome-title', S.welcomeTitle);
  setText('welcome-desc', S.welcomeDesc);
  setText('start-quiz-btn', S.startQuiz);
  setText('start-daily-btn', S.startDailyQuiz);
  setText('login-btn', S.login);
  setText('signup-btn', S.signup);
  setText('score-label', `${S.score}: <span id="score">0</span>`);
  setText('streak-label', `${S.streak}: <span id="streak">0</span>`);
  setText('profile-modal-title', S.profile);
  setText('settings-modal-title', S.settings);
  setText('leaderboard-modal-title', S.leaderboard);
  setText('save-btn', S.save);
  setText('cancel-profile-edit', S.cancel);
  setText('reset-progress-btn', S.resetProgress);
  setText('auth-modal-title', S.login);
  setText('auth-submit', S.login);
  setText('auth-switch', S.dontHaveAccount);
  setText('of', S.of);
  // Selects
  if ($('language-selector')) $('language-selector').value = LANG;
  if ($('language-setting')) $('language-setting').value = LANG;
  // If quiz in progress, update question in new language
  if (quizInProgress) showQuestion();
}

// ===== Quiz Logic =====
function startQuiz(daily = false) {
  isDaily = daily;
  quizInProgress = true;
  hide($('start-screen'));
  show($('quiz-content'));
  quizSet = getQuizSet();
  current = 0; score = 0; streak = 0;
  showQuestion();
}
function getQuizSet() {
  const all = STRINGS[LANG].quizQuestions.slice();
  if (isDaily) return [all[Math.floor(Math.random() * all.length)]];
  let n = settings.quizLength || 10;
  if (n === 'all' || n >= all.length) return all;
  return all.sort(() => Math.random() - 0.5).slice(0, Number(n));
}
function showQuestion() {
  const S = STRINGS[LANG];
  const q = quizSet[current];
  setText('score', score);
  setText('streak', streak);
  setText('current-question', current + 1);
  setText('total-questions', quizSet.length);

  // Render image if present
  let html = '';
  if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
  html += `<h2>${q.question}</h2><div id="options-list"></div>`;
  $('question-area').innerHTML = html;

  // Randomize options
  const opts = q.options.map((opt, i) => ({opt, idx: i}));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  opts.forEach(({opt, idx}) => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(idx, btn, opts);
    $('options-list').appendChild(btn);
  });
  hideFunFact();
  startTimer(20);
}
function handleAnswer(idx, btn, opts) {
  clearInterval(timer);
  const q = quizSet[current];
  document.querySelectorAll('.option-button').forEach(b => b.disabled = true);

  // Find the correct answer's new index after shuffle
  const correctOpt = opts.find(o => o.idx === q.answer);
  if (idx === q.answer) {
    btn.classList.add('correct');
    score++; streak++;
    playSound('correct-sound');
  } else {
    btn.classList.add('incorrect');
    document.querySelectorAll('.option-button')[opts.indexOf(correctOpt)].classList.add('correct');
    streak = 0;
    playSound('wrong-sound');
  }
  setText('score', score);
  setText('streak', streak);
  showFunFact(q.funFact, q.explanation);
  setTimeout(() => {
    current++;
    if (current < quizSet.length) showQuestion();
    else showQuizEnd();
  }, 2000);
}
function showQuizEnd() {
  quizInProgress = false;
  $('question-area').innerHTML =
    `<h2>Quiz Complete!</h2>
    <p>Your score: <span class="font-bold">${score}</span>/${quizSet.length}</p>
    <button id="restart-btn" class="option-button" style="width:auto;min-width:120px;">Play Again</button>
    <button id="return-home-btn" class="option-button" style="width:auto;min-width:120px;">Return Home</button>`;
  setText('timer-text', '');
  $('timer-bar-fill').style.width = '0%';
  $('restart-btn').onclick = () => startQuiz(isDaily);
  $('return-home-btn').onclick = () => {
    hide($('quiz-content'));
    show($('start-screen'));
  };
  hideFunFact();
  showSnackbar("Quiz complete!");
}
function startTimer(seconds) {
  let timeLeft = seconds;
  updateTimerUI(timeLeft, seconds);
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft, seconds);
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}
function updateTimerUI(timeLeft, total) {
  setText('timer-text', `${timeLeft}s`);
  const fill = $('timer-bar-fill');
  if (fill) {
    const percent = (timeLeft / total) * 100;
    fill.style.width = percent + '%';
    fill.classList.remove('warning', 'danger');
    if (timeLeft <= 5) fill.classList.add('danger');
    else if (timeLeft <= 10) fill.classList.add('warning');
  }
}
function handleTimeUp() {
  const q = quizSet[current];
  document.querySelectorAll('.option-button').forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === q.options[q.answer]) btn.classList.add('correct');
  });
  streak = 0;
  setText('streak', streak);
  playSound('wrong-sound');
  showFunFact(q.funFact, q.explanation);
  setTimeout(() => {
    current++;
    if (current < quizSet.length) showQuestion();
    else showQuizEnd();
  }, 2000);
}
function showFunFact(fact, explanation) {
  if (!fact && !explanation) return hideFunFact();
  $('fun-fact-box').innerHTML = `<strong>Fun Fact:</strong> ${fact || ''}<br><span>${explanation || ''}</span>`;
  show($('fun-fact-box'));
}
function hideFunFact() {
  hide($('fun-fact-box'));
  $('fun-fact-box').innerHTML = '';
}

// ===== Event Listeners and UI =====
function setupEventListeners() {
  // Language selector
  $('language-selector').onchange = function() {
    LANG = this.value;
    localStorage.setItem('lang', LANG);
    updateAllStrings();
  };
  $('language-setting').onchange = function() {
    LANG = this.value;
    localStorage.setItem('lang', LANG);
    updateAllStrings();
  };
  // Start quiz
  $('start-quiz-btn').onclick = () => startQuiz(false);
  $('start-daily-btn').onclick = () => startQuiz(true);
  // Login/signup modals
  $('login-btn').onclick = () => { show($('auth-modal')); setAuthMode('login'); };
  $('signup-btn').onclick = () => { show($('auth-modal')); setAuthMode('signup'); };
  $('close-auth-modal').onclick = () => hide($('auth-modal'));
  $('auth-switch').onclick = () => toggleAuthMode();
  $('auth-form').onsubmit = handleAuth;
  // Profile modal
  $('profile-btn').onclick = () => show($('profile-modal'));
  $('close-profile-modal').onclick = () => hide($('profile-modal'));
  $('cancel-profile-edit').onclick = () => hide($('profile-modal'));
  // Settings modal
  $('open-settings').onclick = () => show($('settings-modal'));
  $('close-settings-modal').onclick = () => hide($('settings-modal'));
  // Leaderboard modal
  $('leaderboard-btn').onclick = () => show($('leaderboard-modal'));
  $('close-leaderboard-modal').onclick = () => hide($('leaderboard-modal'));
  // Sound toggle
  $('sound-toggle-btn').onclick = toggleSound;
}

// ===== Auth Logic (Demo, Local) =====
function setAuthMode(mode) {
  setText('auth-modal-title', STRINGS[LANG][mode]);
  setText('auth-submit', STRINGS[LANG][mode]);
  $('auth-switch').textContent = mode === 'login' ? STRINGS[LANG].dontHaveAccount : STRINGS[LANG].haveAccount;
  $('auth-form').dataset.mode = mode;
}
function toggleAuthMode() {
  setAuthMode($('auth-form').dataset.mode === 'login' ? 'signup' : 'login');
}
function handleAuth(e) {
  e.preventDefault();
  const email = $('auth-email').value.trim();
  const password = $('auth-password').value;
  if ($('auth-form').dataset.mode === 'signup') {
    if (users[email]) return showSnackbar("Email already registered.");
    users[email] = { password, profile: { displayName: email.split('@')[0] } };
    localStorage.setItem('users', JSON.stringify(users));
    showSnackbar("Signup successful! Please log in.");
    setAuthMode('login');
  } else {
    if (!users[email] || users[email].password !== password) return showSnackbar("Invalid credentials.");
    userProfile = users[email].profile;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    showSnackbar("Login successful!");
    hide($('auth-modal'));
  }
}

// ===== Sound Logic =====
function toggleSound() {
  isMuted = !isMuted;
  $('sound-toggle-btn').setAttribute('aria-pressed', isMuted);
  if (isMuted) {
    $('volume-icon').classList.add('hidden');
    $('mute-icon').classList.remove('hidden');
  } else {
    $('volume-icon').classList.remove('hidden');
    $('mute-icon').classList.add('hidden');
  }
}
function playSound(id) {
  if (isMuted) return;
  const sound = $(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(()=>{});
  }
}

// ===== Snackbar =====
function showSnackbar(message, duration = 2000) {
  const sb = $('snackbar');
  sb.textContent = message;
  sb.classList.add('show');
  sb.classList.remove('hidden');
  setTimeout(() => {
    sb.classList.remove('show');
    setTimeout(() => sb.classList.add('hidden'), 350);
  }, duration);
}
