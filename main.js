// ===== Embedded Strings and Questions =====
const STRINGS = {
  "en": {
    "appTitle": "Global Quiz App",
    "welcomeTitle": "Welcome!",
    "welcomeDesc": "Test your knowledge with global quizzes.<br>Ready to begin?",
    "startQuiz": "Start Quiz",
    "startDailyQuiz": "Start Daily Quiz",
    "score": "Score",
    "streak": "Streak",
    "of": "of",
    "profile": "Profile",
    "settings": "Settings",
    "quizQuestions": [
      {
        "id": 1,
        "question": "What is a group of lions called?",
        "options": ["Pride", "Flock", "School", "Pack"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        "explanation": "A group of lions is called a pride.",
        "funFact": "Lion prides are usually made up of related females and their offspring, plus a small number of adult males."
      },
      {
        "id": 2,
        "question": "What is a group of crows called?",
        "options": ["Murder", "Gaggle", "Pod", "Swarm"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        "explanation": "A group of crows is called a murder.",
        "funFact": "Crows are known for their intelligence and can use tools and solve complex problems."
      },
      {
        "id": 3,
        "question": "What is a group of elephants called?",
        "options": ["Herd", "Pod", "Pack", "Troop"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        "explanation": "A group of elephants is called a herd.",
        "funFact": "Elephant herds are led by the oldest female, known as the matriarch."
      }
    ]
  }
  // Add other languages as needed
};

// ===== Utility Functions =====
function $(id) { return document.getElementById(id); }
function show(el) { if (el) el.classList.remove('hidden'); }
function hide(el) { if (el) el.classList.add('hidden'); }
function setText(id, value) { if ($(id)) $(id).innerHTML = value; }

// ===== Global State =====
let LANG = localStorage.getItem('lang') || 'en';
if (!STRINGS[LANG]) LANG = 'en';
let quizSet = [];
let current = 0, score = 0, streak = 0, timer = null;
let isDaily = false;
let quizInProgress = false;
let isMuted = false;
let profileName = localStorage.getItem('profileName') || '';

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  updateAllStrings();
  setupEventListeners();
  if ($('profile-name')) $('profile-name').value = profileName;
  hide($('splash-screen'));
  show($('start-screen'));
  hide($('quiz-content'));
});

// ===== Language Switching =====
function updateAllStrings() {
  if (!STRINGS[LANG]) LANG = 'en';
  const S = STRINGS[LANG];
  setText('app-title', S.appTitle);
  setText('welcome-title', S.welcomeTitle);
  setText('welcome-desc', S.welcomeDesc);
  setText('start-quiz-btn', S.startQuiz);
  setText('start-daily-btn', S.startDailyQuiz);
  setText('score-label', `${S.score}: <span id="score">0</span>`);
  setText('streak-label', `${S.streak}: <span id="streak">0</span>`);
  setText('of', S.of);
  setText('profile-modal-title', S.profile || "Profile");
  setText('settings-modal-title', S.settings || "Settings");
  if ($('language-selector')) $('language-selector').value = LANG;
  if ($('language-setting')) $('language-setting').value = LANG;
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
  return all.sort(() => Math.random() - 0.5).slice(0, all.length);
}
function showQuestion() {
  const S = STRINGS[LANG];
  const q = quizSet[current];
  setText('score', score);
  setText('streak', streak);
  setText('current-question', current + 1);
  setText('total-questions', quizSet.length);

  let html = '';
  if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
  html += `<h2>${q.question}</h2><div id="options-list"></div>`;
  $('question-area').innerHTML = html;

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
  $('language-selector').onchange = function() {
    LANG = this.value;
    localStorage.setItem('lang', LANG);
    updateAllStrings();
  };
  $('start-quiz-btn').onclick = () => startQuiz(false);
  $('start-daily-btn').onclick = () => startQuiz(true);
  $('sound-toggle-btn').onclick = toggleSound;
  // Profile modal
  $('profile-btn').onclick = () => show($('profile-modal'));
  $('close-profile-modal').onclick = () => hide($('profile-modal'));
  $('save-profile-btn').onclick = () => {
    profileName = $('profile-name').value.trim();
    localStorage.setItem('profileName', profileName);
    showSnackbar("Profile saved!");
    hide($('profile-modal'));
  };
  // Settings modal
  $('open-settings').onclick = () => show($('settings-modal'));
  $('close-settings-modal').onclick = () => hide($('settings-modal'));
  $('language-setting').onchange = function() {
    LANG = this.value;
    localStorage.setItem('lang', LANG);
    updateAllStrings();
  };
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
