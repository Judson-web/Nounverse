// =========================
// 1. Embedded Strings/Questions
// =========================
const STRINGS = {
  "en": {
    "appTitle": "Quiz App",
    "welcomeTitle": "Welcome!",
    "welcomeDesc": "Test your knowledge with fun quizzes.<br>Ready to begin?",
    "startQuiz": "Start Quiz",
    "startDailyQuiz": "Daily Challenge",
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

// =========================
// 2. Utility Functions
// =========================
function $(id) { return document.getElementById(id); }
function show(el) { if (el) el.classList.remove('hidden'); }
function hide(el) { if (el) el.classList.add('hidden'); }
function setText(id, value) { if ($(id)) $(id).innerHTML = value; }

// =========================
// 3. Global State
// =========================
let LANG = localStorage.getItem('lang') || 'en';
if (!STRINGS[LANG]) LANG = 'en';
let quizSet = [];
let current = 0, score = 0, streak = 0;
let isDaily = false;
let quizInProgress = false;
let isMuted = false;
let profileName = localStorage.getItem('profileName') || '';
let profileAvatar = localStorage.getItem('profileAvatar') ||
  "https://api.dicebear.com/7.x/personas/svg?seed=owl";

// =========================
// 4. Initialization
// =========================
document.addEventListener('DOMContentLoaded', () => {
  updateAllStrings();
  setupEventListeners();
  $('profile-avatar').src = profileAvatar;
  if ($('profile-name')) $('profile-name').value = profileName;
  hide($('splash-screen'));
  show($('start-screen'));
  hide($('quiz-content'));
});

// =========================
// 5. Language/UI Update
// =========================
function updateAllStrings() {
  if (!STRINGS[LANG]) LANG = 'en';
  const S = STRINGS[LANG];
  setText('app-title', S.appTitle);
  setText('welcome-title', S.welcomeTitle);
  setText('welcome-desc', S.welcomeDesc);
  setText('start-quiz-btn', S.startQuiz);
  setText('start-daily-btn', S.startDailyQuiz);
  setText('score-label', `${S.score}: <span id="score">0</span>`);
  setText('streak-label', `🔥 <span id="streak">0</span>`);
  setText('profile-modal-title', S.profile || "Profile");
  setText('settings-modal-title', S.settings || "Settings");
  if ($('language-setting')) $('language-setting').value = LANG;
  if (quizInProgress) showQuestion();
}

// =========================
// 6. Quiz Logic
// =========================
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

  // Progress bar
  const percent = ((current) / quizSet.length) * 100;
  $('progress-fill').style.width = percent + "%";

  // Render image and question
  let html = '';
  if (q.image) html += `<img src="${q.image}" alt="Question Image">`;
  html += `<h2>${q.question}</h2><div id="options-list"></div>`;
  $('question-area').innerHTML = html;

  // Shuffle options
  const opts = q.options.map((opt, i) => ({opt, idx: i}));
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  opts.forEach(({opt, idx}) => {
    const btn = document.createElement('button');
    btn.className = 'duo-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(idx, btn, opts);
    $('options-list').appendChild(btn);
  });
  hideFunFact();
}
function handleAnswer(idx, btn, opts) {
  const q = quizSet[current];
  document.querySelectorAll('.duo-btn').forEach(b => b.disabled = true);

  // Find the correct answer's new index after shuffle
  const correctOpt = opts.find(o => o.idx === q.answer);
  if (idx === q.answer) {
    btn.classList.add('correct');
    score++; streak++;
    playSound('correct-sound');
  } else {
    btn.classList.add('incorrect');
    document.querySelectorAll('.duo-btn')[opts.indexOf(correctOpt)].classList.add('correct');
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
  }, 1500);
}
function showQuizEnd() {
  quizInProgress = false;
  $('progress-fill').style.width = "100%";
  $('question-area').innerHTML =
    `<h2>Quiz Complete!</h2>
    <p>Your score: <span style="font-weight:bold;">${score}</span>/${quizSet.length}</p>
    <button id="restart-btn" class="duo-btn duo-btn-primary" style="width:auto;min-width:120px;">Play Again</button>
    <button id="return-home-btn" class="duo-btn" style="width:auto;min-width:120px;">Return Home</button>`;
  $('restart-btn').onclick = () => startQuiz(isDaily);
  $('return-home-btn').onclick = () => {
    hide($('quiz-content'));
    show($('start-screen'));
    $('progress-fill').style.width = "0%";
  };
  hideFunFact();
  showSnackbar("Quiz complete!");
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

// =========================
// 7. Event Listeners and UI
// =========================
function setupEventListeners() {
  // Start quiz
  $('start-quiz-btn').onclick = () => startQuiz(false);
  $('start-daily-btn').onclick = () => startQuiz(true);

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

  // Sound
  $('sound-toggle-btn').onclick = toggleSound;
}

// =========================
// 8. Sound Logic
// =========================
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

// =========================
// 9. Snackbar
// =========================
function showSnackbar(message, duration = 1800) {
  const sb = $('snackbar');
  sb.textContent = message;
  sb.classList.add('show');
  sb.classList.remove('hidden');
  setTimeout(() => {
    sb.classList.remove('show');
    setTimeout(() => sb.classList.add('hidden'), 350);
  }, duration);
}
