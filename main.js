// Utility functions for safe DOM access
function $(sel) { return document.getElementById(sel); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }

// ... (profile, sound, currency, modal, and other logic as before) ...

// --- Quiz Logic with Timer and Progress Bar ---
const quizQuestions = [
  {
    question: "What is a group of lions called?",
    options: ["Pride", "Flock", "School", "Pack"],
    answer: 0,
    animal: "Lion"
  },
  {
    question: "What is a group of crows called?",
    options: ["Murder", "Gaggle", "Pod", "Swarm"],
    answer: 0,
    animal: "Crow"
  },
  {
    question: "What is a group of dolphins called?",
    options: ["Pod", "Troop", "Army", "Parliament"],
    answer: 0,
    animal: "Dolphin"
  },
  {
    question: "What is a group of bees called?",
    options: ["Swarm", "Flock", "Herd", "Pack"],
    answer: 0,
    animal: "Bee"
  }
];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timerInterval = null;
const QUESTION_TIME = 20; // seconds
let isChallengeMode = false;

function startQuiz(challengeMode = false) {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  isChallengeMode = challengeMode;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizQuestions[currentQuestion];
  if ($('current-question')) $('current-question').textContent = currentQuestion + 1;
  if ($('total-questions')) $('total-questions').textContent = quizQuestions.length;
  if ($('score')) $('score').textContent = score;
  if ($('streak')) $('streak').textContent = streak;
  updateStreakStars();

  // Render question and options
  const questionArea = $('question-area');
  if (!questionArea) return;
  questionArea.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${q.question}</h2>
    <div id="options-list" class="mb-4"></div>
    <div class="flex justify-between items-center">
      <button id="hint-button" class="px-3 py-1 rounded">Hint (2 🪙)</button>
      <button id="next-btn" class="bg-blue-500 text-white px-4 py-2 rounded hidden">Next</button>
    </div>
  `;

  // Render options
  const optionsList = $('options-list');
  if (optionsList) {
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-button w-full mb-2 py-2 px-3 rounded';
      btn.textContent = opt;
      btn.onclick = () => handleOptionClick(idx, btn);
      optionsList.appendChild(btn);
    });
  }

  // Setup hint button
  const hintBtn = $('hint-button');
  if (hintBtn) hintBtn.onclick = showHint;

  // Start timer
  startTimer(QUESTION_TIME);
}

function handleOptionClick(selectedIdx, btn) {
  clearInterval(timerInterval);
  const q = quizQuestions[currentQuestion];
  const optionButtons = $qa('.option-button');
  optionButtons.forEach(b => b.disabled = true);

  if (selectedIdx === q.answer) {
    btn.classList.add('correct');
    score++;
    streak++;
    awardCoins(isChallengeMode ? 3 : 2);
    if (!stickers[q.animal]) {
      collectSticker(q.animal);
      showDidYouKnowPopup();
    }
    if (streak >= 3) launchFireworks();
  } else {
    btn.classList.add('incorrect');
    optionButtons[q.answer].classList.add('correct');
    streak = 0;
  }

  if ($('score')) $('score').textContent = score;
  if ($('streak')) $('streak').textContent = streak;
  updateStreakStars();
  if ($('next-btn')) {
    $('next-btn').classList.remove('hidden');
    $('next-btn').onclick = nextQuestion;
  }
  if ($('hint-button')) $('hint-button').disabled = true;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizQuestions.length) {
    renderQuizQuestion();
  } else {
    showQuizEnd();
  }
}

function showQuizEnd() {
  const questionArea = $('question-area');
  if (!questionArea) return;
  questionArea.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
    <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
    <button id="restart-btn" class="bg-green-500 text-white px-4 py-2 rounded">Play Again</button>
  `;
  if ($('timer-text')) $('timer-text').textContent = '';
  if ($('timer-bar-fill')) $('timer-bar-fill').style.width = '0%';
  const restartBtn = $('restart-btn');
  if (restartBtn) restartBtn.onclick = () => startQuiz(false);
}

// --- Timer and Progress Bar ---
function startTimer(seconds) {
  let timeLeft = seconds;
  updateTimerUI(timeLeft, seconds);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI(timeLeft, seconds);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function updateTimerUI(timeLeft, total) {
  if ($('timer-text')) $('timer-text').textContent = `${timeLeft}s`;
  const fill = $('timer-bar-fill');
  if (fill) {
    const percent = (timeLeft / total) * 100;
    fill.style.width = percent + '%';
    fill.classList.remove('warning', 'danger');
    if (timeLeft <= 5) {
      fill.classList.add('danger');
    } else if (timeLeft <= 10) {
      fill.classList.add('warning');
    }
  }
}

function handleTimeUp() {
  const q = quizQuestions[currentQuestion];
  const optionButtons = $qa('.option-button');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('correct');
  });
  streak = 0;
  if ($('streak')) $('streak').textContent = streak;
  updateStreakStars();
  if ($('next-btn')) {
    $('next-btn').classList.remove('hidden');
    $('next-btn').onclick = nextQuestion;
  }
  if ($('hint-button')) $('hint-button').disabled = true;
}

// --- Streak Stars ---
function updateStreakStars() {
  const stars = $qa('.streak-stars .star');
  for (let i = 0; i < stars.length; i++) {
    if (i < streak) {
      stars[i].classList.add('active');
    } else {
      stars[i].classList.remove('active');
    }
  }
}

// --- Hint System (fixed) ---
function showHint() {
  if (nounCoins < 2) {
    alert("You need 2 coins to use a hint!");
    return;
  }
  nounCoins -= 2;
  updateCoinsDisplay();
  const q = quizQuestions[currentQuestion];
  const optionButtons = $qa('.option-button');
  if ($('hint-button')) $('hint-button').disabled = true;

  // Only consider wrong options that are not already disabled
  let availableWrongOptions = [];
  optionButtons.forEach((btn, idx) => {
    if (idx !== q.answer && !btn.disabled) availableWrongOptions.push(idx);
  });
  availableWrongOptions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(2, availableWrongOptions.length); i++) {
    const wrongIdx = availableWrongOptions[i];
    optionButtons[wrongIdx].classList.add('disabled');
    optionButtons[wrongIdx].disabled = true; // This line ensures the button is unclickable!
  }
}

// --- Start quiz after splash/profile ---
setTimeout(() => startQuiz(false), 1200);

// ... (rest of your code for modals, profile, sound, etc., unchanged) ...
