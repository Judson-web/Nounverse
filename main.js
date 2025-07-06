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
  },
  "es": {
    "appTitle": "Quiz Global",
    "welcomeTitle": "¡Bienvenido!",
    "welcomeDesc": "Pon a prueba tus conocimientos con cuestionarios globales.<br>¿Listo para empezar?",
    "startQuiz": "Comenzar quiz",
    "startDailyQuiz": "Comenzar desafío diario",
    "score": "Puntaje",
    "streak": "Racha",
    "of": "de",
    "profile": "Perfil",
    "settings": "Configuración",
    "quizQuestions": [
      {
        "id": 1,
        "question": "¿Cómo se llama un grupo de leones?",
        "options": ["Manada", "Bandada", "Escuela", "Manojo"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un grupo de leones se llama manada.",
        "funFact": "Las manadas de leones suelen estar formadas por hembras emparentadas y sus crías, además de algunos machos adultos."
      },
      {
        "id": 2,
        "question": "¿Cómo se llama un grupo de cuervos?",
        "options": ["Parvada", "Bandada", "Pod", "Enjambre"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un grupo de cuervos se llama parvada.",
        "funFact": "Los cuervos son conocidos por su inteligencia y su capacidad para usar herramientas y resolver problemas complejos."
      },
      {
        "id": 3,
        "question": "¿Cómo se llama un grupo de elefantes?",
        "options": ["Manada", "Pod", "Manojo", "Tropa"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un grupo de elefantes se llama manada.",
        "funFact": "Las manadas de elefantes son lideradas por la hembra más vieja, llamada matriarca."
      }
    ]
  },
  "fr": {
    "appTitle": "Quiz Mondial",
    "welcomeTitle": "Bienvenue !",
    "welcomeDesc": "Testez vos connaissances avec des quiz mondiaux.<br>Prêt à commencer ?",
    "startQuiz": "Commencer le quiz",
    "startDailyQuiz": "Commencer le défi du jour",
    "score": "Score",
    "streak": "Série",
    "of": "sur",
    "profile": "Profil",
    "settings": "Paramètres",
    "quizQuestions": [
      {
        "id": 1,
        "question": "Comment appelle-t-on un groupe de lions ?",
        "options": ["Troupe", "Vol", "École", "Meute"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un groupe de lions s'appelle une troupe.",
        "funFact": "Les troupes de lions sont généralement composées de femelles apparentées et de leurs petits, ainsi que de quelques mâles adultes."
      },
      {
        "id": 2,
        "question": "Comment appelle-t-on un groupe de corbeaux ?",
        "options": ["Volée", "Bande", "Pod", "Essaim"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un groupe de corbeaux s'appelle une volée.",
        "funFact": "Les corbeaux sont connus pour leur intelligence et leur capacité à utiliser des outils et à résoudre des problèmes complexes."
      },
      {
        "id": 3,
        "question": "Comment appelle-t-on un groupe d'éléphants ?",
        "options": ["Troupeau", "Pod", "Meute", "Bande"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        "explanation": "Un groupe d'éléphants s'appelle un troupeau.",
        "funFact": "Les troupeaux d'éléphants sont dirigés par la femelle la plus âgée, appelée matriarche."
      }
    ]
  },
  "ml": {
    "appTitle": "ഗ്ലോബൽ ക്വിസ് ആപ്പ്",
    "welcomeTitle": "സ്വാഗതം!",
    "welcomeDesc": "ലോകവ്യാപകമായ ക്വിസുകളിലൂടെ നിങ്ങളുടെ അറിവ് പരീക്ഷിക്കുക.<br>തയ്യാറാണോ?",
    "startQuiz": "ക്വിസ് ആരംഭിക്കുക",
    "startDailyQuiz": "ദൈനംദിന ക്വിസ് ആരംഭിക്കുക",
    "score": "സ്കോർ",
    "streak": "സ്ട്രീക്ക്",
    "of": "ഇൽ",
    "profile": "പ്രൊഫൈൽ",
    "settings": "ക്രമീകരണങ്ങൾ",
    "quizQuestions": [
      {
        "id": 1,
        "question": "സിംഹങ്ങളുടെ കൂട്ടത്തെ എന്താണ് വിളിക്കുന്നത്?",
        "options": ["പ്രൈഡ്", "ഫ്ലോക്ക്", "സ്കൂൾ", "പാക്ക്"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        "explanation": "സിംഹങ്ങളുടെ കൂട്ടത്തെ പ്രൈഡ് എന്ന് വിളിക്കുന്നു.",
        "funFact": "പ്രൈഡിൽ സാധാരണയായി ബന്ധമുള്ള പെൺ സിംഹങ്ങളും അവരുടെ കുഞ്ഞുങ്ങളും കുറച്ച് പുരുഷ സിംഹങ്ങളും ഉണ്ടാകും."
      },
      {
        "id": 2,
        "question": "കാക്കകളുടെ കൂട്ടത്തെ എന്താണ് വിളിക്കുന്നത്?",
        "options": ["മർഡർ", "ഗാഗിൾ", "പോഡ്", "സ്വാർം"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        "explanation": "കാക്കകളുടെ കൂട്ടത്തെ മർഡർ എന്ന് വിളിക്കുന്നു.",
        "funFact": "കാക്കകൾ വളരെ ബുദ്ധിമുട്ടുള്ളവയാണ്; അവയ്ക്ക് ഉപകരണങ്ങൾ ഉപയോഗിക്കാനും പ്രശ്നങ്ങൾ പരിഹരിക്കാനും കഴിയും."
      },
      {
        "id": 3,
        "question": "ആനകളുടെ കൂട്ടത്തെ എന്താണ് വിളിക്കുന്നത്?",
        "options": ["ഹേർഡ്", "പോഡ്", "പാക്ക്", "ട്രൂപ്പ്"],
        "answer": 0,
        "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        "explanation": "ആനകളുടെ കൂട്ടത്തെ ഹേർഡ് എന്ന് വിളിക്കുന്നു.",
        "funFact": "ആനകളുടെ കൂട്ടത്തിന് നേതൃത്വം നൽകുന്നത് ഏറ്റവും പ്രായം കൂടിയ പെൺ ആനയാണ്, അവളെ 'മാട്രിയാർക്ക്' എന്ന് വിളിക്കുന്നു."
      }
    ]
  }
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
try {
  updateAllStrings();
  setupEventListeners();
  if ($('profile-name')) $('profile-name').value = profileName;
  hide($('splash-screen'));
  show($('start-screen'));
  hide($('quiz-content'));
} catch (e) {
  // If anything fails, hide splash and show error
  hide($('splash-screen'));
  alert("App failed to load. See console for details.");
  console.error(e);
}

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
  if ($('language-selector')) {
    $('language-selector').onchange = function() {
      LANG = this.value;
      localStorage.setItem('lang', LANG);
      updateAllStrings();
    };
  }
  if ($('start-quiz-btn')) $('start-quiz-btn').onclick = () => startQuiz(false);
  if ($('start-daily-btn')) $('start-daily-btn').onclick = () => startQuiz(true);
  if ($('sound-toggle-btn')) $('sound-toggle-btn').onclick = toggleSound;
  // Profile modal
  if ($('profile-btn')) $('profile-btn').onclick = () => show($('profile-modal'));
  if ($('close-profile-modal')) $('close-profile-modal').onclick = () => hide($('profile-modal'));
  if ($('save-profile-btn')) $('save-profile-btn').onclick = () => {
    profileName = $('profile-name').value.trim();
    localStorage.setItem('profileName', profileName);
    showSnackbar("Profile saved!");
    hide($('profile-modal'));
  };
  // Settings modal
  if ($('open-settings')) $('open-settings').onclick = () => show($('settings-modal'));
  if ($('close-settings-modal')) $('close-settings-modal').onclick = () => hide($('settings-modal'));
  if ($('language-setting')) $('language-setting').onchange = function() {
    LANG = this.value;
    localStorage.setItem('lang', LANG);
    updateAllStrings();
  };
}

// ===== Sound Logic =====
function toggleSound() {
  isMuted = !isMuted;
  if ($('sound-toggle-btn')) $('sound-toggle-btn').setAttribute('aria-pressed', isMuted);
  if (isMuted) {
    if ($('volume-icon')) $('volume-icon').classList.add('hidden');
    if ($('mute-icon')) $('mute-icon').classList.remove('hidden');
  } else {
    if ($('volume-icon')) $('volume-icon').classList.remove('hidden');
    if ($('mute-icon')) $('mute-icon').classList.add('hidden');
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
  if (!sb) return;
  sb.textContent = message;
  sb.classList.add('show');
  sb.classList.remove('hidden');
  setTimeout(() => {
    sb.classList.remove('show');
    setTimeout(() => sb.classList.add('hidden'), 350);
  }, duration);
}
