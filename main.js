// --- Splash Screen Logic ---
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('quiz-content').classList.remove('hidden');
    showProfileSelection();
    showCookieBanner();
  }, 1000);
});

// --- Profile System (see previous code for details) ---
// ... (reuse your existing profile logic here for brevity) ...

// --- Quiz Logic with Timer and Progress Bar ---
const quizQuestions = [
  {
    question: "What is a group of lions called?",
    options: ["Pride", "Flock", "School", "Pack"],
    answer: 0
  },
  {
    question: "What is a group of crows called?",
    options: ["Murder", "Gaggle", "Pod", "Swarm"],
    answer: 0
  },
  {
    question: "What is a group of dolphins called?",
    options: ["Pod", "Troop", "Army", "Parliament"],
    answer: 0
  },
  {
    question: "What is a group of bees called?",
    options: ["Swarm", "Flock", "Herd", "Pack"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timerInterval = null;
const QUESTION_TIME = 20; // seconds

function renderQuizQuestion() {
  const q = quizQuestions[currentQuestion];
  document.getElementById('current-question').textContent = currentQuestion + 1;
  document.getElementById('total-questions').textContent = quizQuestions.length;
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  updateStreakStars();

  // Render question and options
  const questionArea = document.getElementById('question-area');
  questionArea.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${q.question}</h2>
    <div id="options-list"></div>
    <div class="flex justify-end mt-4">
      <button id="next-btn" class="bg-blue-500 text-white px-4 py-2 rounded hidden">Next</button>
    </div>
  `;

  // Render options
  const optionsList = document.getElementById('options-list');
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-button w-full mb-2 py-2 px-3 rounded';
    btn.textContent = opt;
    btn.onclick = () => handleOptionClick(idx, btn);
    optionsList.appendChild(btn);
  });

  // Start timer
  startTimer(QUESTION_TIME);
}

function handleOptionClick(selectedIdx, btn) {
  clearInterval(timerInterval);
  const q = quizQuestions[currentQuestion];
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(b => b.disabled = true);

  if (selectedIdx === q.answer) {
    btn.classList.add('correct');
    score++;
    streak++;
    awardCoins(2);
    showDidYouKnowPopup();
    launchFireworks();
  } else {
    btn.classList.add('incorrect');
    optionButtons[q.answer].classList.add('correct');
    streak = 0;
  }
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  updateStreakStars();
  document.getElementById('next-btn').classList.remove('hidden');
  document.getElementById('next-btn').onclick = nextQuestion;
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
  document.getElementById('question-area').innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
    <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
    <button onclick="location.reload()" class="bg-green-500 text-white px-4 py-2 rounded">Restart</button>
  `;
  document.getElementById('timer-text').textContent = '';
  document.getElementById('timer-bar-fill').style.width = '0%';
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
  document.getElementById('timer-text').textContent = `${timeLeft}s`;
  const percent = (timeLeft / total) * 100;
  const fill = document.getElementById('timer-bar-fill');
  fill.style.width = percent + '%';
  fill.classList.remove('warning', 'danger');
  if (timeLeft <= 5) {
    fill.classList.add('danger');
  } else if (timeLeft <= 10) {
    fill.classList.add('warning');
  }
}

function handleTimeUp() {
  // Disable all options and show correct answer
  const q = quizQuestions[currentQuestion];
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) btn.classList.add('correct');
  });
  streak = 0;
  document.getElementById('streak').textContent = streak;
  updateStreakStars();
  document.getElementById('next-btn').classList.remove('hidden');
  document.getElementById('next-btn').onclick = nextQuestion;
}

// --- Streak Stars ---
function updateStreakStars() {
  const stars = document.querySelectorAll('.streak-stars .star');
  for (let i = 0; i < stars.length; i++) {
    if (i < streak) {
      stars[i].classList.add('active');
    } else {
      stars[i].classList.remove('active');
    }
  }
}

// --- Fun Fact Popups, Fireworks, Coins, etc. ---
// (reuse your existing logic for these features here)

// --- Start quiz after splash/profile ---
setTimeout(renderQuizQuestion, 1200);
