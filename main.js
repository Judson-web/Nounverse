// --- Utility: Safe DOM access ---
function $(sel) { return document.getElementById(sel); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }

// --- Splash Screen Logic ---
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if ($('splash-screen')) $('splash-screen').style.display = 'none';
    if ($('quiz-content')) $('quiz-content').classList.remove('hidden');
    showProfileSelection();
    showCookieBanner();
  }, 1000);
});

// --- Profile System ---
const avatarList = [
  "https://api.dicebear.com/6.x/personas/svg?seed=Cat",
  "https://api.dicebear.com/6.x/personas/svg?seed=Dog",
  "https://api.dicebear.com/6.x/personas/svg?seed=Fox",
  "https://api.dicebear.com/6.x/personas/svg?seed=Tiger",
  "https://api.dicebear.com/6.x/personas/svg?seed=Lion",
  "https://api.dicebear.com/6.x/personas/svg?seed=Rabbit"
];
const themeList = [
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#22c55e" },
  { name: "Pink", color: "#ec4899" },
  { name: "Orange", color: "#f59e42" }
];
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
let currentProfileIndex = Number(localStorage.getItem('currentProfileIndex'));
if (isNaN(currentProfileIndex) || currentProfileIndex < 0) currentProfileIndex = 0;

// Profile Modal Logic
function showProfileSelection() {
  if (!$('profile-modal')) return;
  $('profile-modal').classList.add('visible');
  renderProfileList();
  if ($('add-profile-btn')) $('add-profile-btn').onclick = showAddProfileModal;
  if ($('close-profile')) $('close-profile').onclick = () => $('profile-modal').classList.remove('visible');
}
function renderProfileList() {
  const profileList = $('profile-list');
  if (!profileList) return;
  profileList.innerHTML = '';
  if (profiles.length === 0) {
    profileList.innerHTML = `<div class="text-gray-500 text-center">No profiles yet. Add one!</div>`;
    return;
  }
  profiles.forEach((profile, idx) => {
    const div = document.createElement('div');
    div.className = 'profile-card' + (idx === currentProfileIndex ? ' selected-profile' : '');
    div.innerHTML = `
      <img src="${profile.avatar || avatarList[0]}" alt="Avatar">
      <span class="font-semibold">${profile.name}</span>
      <span class="profile-theme-sample" style="background:${profile.theme || themeList[0].color}"></span>
      <button class="delete-profile-btn" title="Delete Profile">&times;</button>
    `;
    div.onclick = () => selectProfile(idx);
    const delBtn = div.querySelector('.delete-profile-btn');
    if (delBtn) delBtn.onclick = (e) => { e.stopPropagation(); deleteProfile(idx); };
    profileList.appendChild(div);
  });
}
function showAddProfileModal() {
  if ($('profile-modal')) $('profile-modal').classList.remove('visible');
  if ($('add-profile-modal')) $('add-profile-modal').classList.add('visible');
  renderAvatarThemeChoices();
  if ($('add-profile-form')) {
    $('add-profile-form').onsubmit = function(e) {
      e.preventDefault();
      const name = $('profile-name-input') ? $('profile-name-input').value.trim() : '';
      if (!name) return;
      const selectedAvatar = $q('.avatar-choose-img.selected');
      const selectedTheme = $q('.theme-choose-sample.selected');
      profiles.push({
        name,
        avatar: avatarList[selectedAvatar ? selectedAvatar.dataset.idx : 0],
        theme: themeList[selectedTheme ? selectedTheme.dataset.idx : 0].color
      });
      localStorage.setItem('profiles', JSON.stringify(profiles));
      localStorage.setItem('currentProfileIndex', profiles.length - 1);
      if ($('add-profile-modal')) $('add-profile-modal').classList.remove('visible');
      showProfileSelection();
      updateProfileHeader();
    };
  }
  if ($('cancel-add-profile')) {
    $('cancel-add-profile').onclick = function() {
      if ($('add-profile-modal')) $('add-profile-modal').classList.remove('visible');
      showProfileSelection();
    };
  }
}
function renderAvatarThemeChoices() {
  const avatarListDiv = $('avatar-choose-list');
  if (avatarListDiv) {
    avatarListDiv.innerHTML = '';
    avatarList.forEach((url, i) => {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'avatar-choose-img rounded-full border-2 border-gray-300 cursor-pointer' + (i === 0 ? ' selected' : '');
      img.dataset.idx = i;
      img.onclick = function() {
        $qa('.avatar-choose-img').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
      };
      avatarListDiv.appendChild(img);
    });
  }
  const themeListDiv = $('theme-choose-list');
  if (themeListDiv) {
    themeListDiv.innerHTML = '';
    themeList.forEach((t, i) => {
      const span = document.createElement('span');
      span.className = 'theme-choose-sample rounded-full border-2 border-gray-300 cursor-pointer w-7 h-7 inline-block' + (i === 0 ? ' selected' : '');
      span.dataset.idx = i;
      span.style.background = t.color;
      span.onclick = function() {
        $qa('.theme-choose-sample').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
      };
      themeListDiv.appendChild(span);
    });
  }
}
function selectProfile(idx) {
  currentProfileIndex = idx;
  localStorage.setItem('currentProfileIndex', idx);
  if ($('profile-modal')) $('profile-modal').classList.remove('visible');
  updateProfileHeader();
}
function deleteProfile(idx) {
  if (!confirm('Delete this profile?')) return;
  profiles.splice(idx, 1);
  if (currentProfileIndex >= profiles.length) currentProfileIndex = 0;
  localStorage.setItem('profiles', JSON.stringify(profiles));
  localStorage.setItem('currentProfileIndex', currentProfileIndex);
  renderProfileList();
}
function updateProfileHeader() {
  const profile = profiles[currentProfileIndex];
  if ($('profile-avatar')) {
    $('profile-avatar').style.backgroundImage = profile?.avatar
      ? `url('${profile.avatar}')`
      : `url('${avatarList[0]}')`;
    $('profile-avatar').style.backgroundSize = 'cover';
  }
  if ($('profile-name')) $('profile-name').textContent = profile?.name || 'Profile';
}
updateProfileHeader();
if ($('profile-btn')) $('profile-btn').onclick = () => showProfileSelection();

// --- Cookie Banner ---
function showCookieBanner() {
  if (!localStorage.getItem('cookiesAccepted')) {
    const banner = $('cookie-banner');
    if (banner) {
      banner.classList.add('show');
      banner.classList.remove('hidden');
      const acceptBtn = $('accept-cookies');
      if (acceptBtn) {
        acceptBtn.onclick = () => {
          localStorage.setItem('cookiesAccepted', 'true');
          banner.classList.remove('show');
        };
      }
    }
  }
}

// --- Sound Toggle ---
const soundBtn = $('sound-toggle-btn');
const volumeIcon = $('volume-icon');
const muteIcon = $('mute-icon');
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
function updateSoundIcon() {
  if (soundEnabled) {
    if (volumeIcon) volumeIcon.classList.remove('hidden');
    if (muteIcon) muteIcon.classList.add('hidden');
    if ($('sound-tooltip')) $('sound-tooltip').textContent = 'Mute Sound';
  } else {
    if (volumeIcon) volumeIcon.classList.add('hidden');
    if (muteIcon) muteIcon.classList.remove('hidden');
    if ($('sound-tooltip')) $('sound-tooltip').textContent = 'Unmute Sound';
  }
}
if (soundBtn) {
  soundBtn.onclick = function() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    updateSoundIcon();
  };
  updateSoundIcon();
}

// --- In-Game Currency ---
let nounCoins = Number(localStorage.getItem('nounCoins')) || 0;
function updateCoinsDisplay() {
  if ($('noun-coins')) $('noun-coins').textContent = nounCoins;
  localStorage.setItem('nounCoins', nounCoins);
}
updateCoinsDisplay();
function awardCoins(amount) {
  nounCoins += amount;
  updateCoinsDisplay();
}

// --- Shop Modal ---
if ($('open-shop')) $('open-shop').onclick = () => $('shop-modal') && $('shop-modal').classList.add('visible');
if ($('close-shop')) $('close-shop').onclick = () => $('shop-modal') && $('shop-modal').classList.remove('visible');
$qa('.shop-item').forEach(btn => {
  btn.onclick = function() {
    const cost = Number(this.dataset.cost);
    if (nounCoins >= cost) {
      nounCoins -= cost;
      updateCoinsDisplay();
      alert('Purchased: ' + this.textContent);
    } else {
      alert('Not enough coins!');
    }
  };
});

// --- Sticker Book ---
const animals = ['Lion', 'Wolf', 'Crow', 'Dolphin', 'Elephant', 'Bee', 'Fish', 'Frog', 'Horse', 'Owl'];
let stickers = JSON.parse(localStorage.getItem('stickers')) || {};
function updateStickerBook() {
  const container = $('stickerbook-content');
  if (!container) return;
  container.innerHTML = '';
  animals.forEach(animal => {
    const div = document.createElement('div');
    div.className = 'sticker' + (stickers[animal] ? ' collected' : '');
    div.textContent = stickers[animal] ? '✅' : '❓';
    div.title = animal;
    container.appendChild(div);
  });
}
if ($('open-stickerbook')) $('open-stickerbook').onclick = () => {
  updateStickerBook();
  if ($('stickerbook-modal')) $('stickerbook-modal').classList.add('visible');
};
if ($('close-stickerbook')) $('close-stickerbook').onclick = () => $('stickerbook-modal') && $('stickerbook-modal').classList.remove('visible');
function collectSticker(animal) {
  stickers[animal] = true;
  localStorage.setItem('stickers', JSON.stringify(stickers));
}

// --- Settings Modal ---
if ($('open-settings')) $('open-settings').onclick = () => $('settings-modal') && $('settings-modal').classList.add('visible');
if ($('close-settings')) $('close-settings').onclick = () => $('settings-modal') && $('settings-modal').classList.remove('visible');
const dyslexiaCheckbox = $('dyslexia-mode');
if (dyslexiaCheckbox) {
  dyslexiaCheckbox.checked = localStorage.getItem('dyslexia') === 'true';
  dyslexiaCheckbox.onchange = updateFont;
}
function updateFont() {
  if (dyslexiaCheckbox && dyslexiaCheckbox.checked) {
    document.body.classList.add('dyslexia-font');
    localStorage.setItem('dyslexia', 'true');
  } else {
    document.body.classList.remove('dyslexia-font');
    localStorage.setItem('dyslexia', 'false');
  }
}
updateFont();
const colorblindCheckbox = $('colorblind-mode');
if (colorblindCheckbox) {
  colorblindCheckbox.checked = localStorage.getItem('colorblind') === 'true';
  colorblindCheckbox.onchange = () => localStorage.setItem('colorblind', colorblindCheckbox.checked ? 'true' : 'false');
}

// --- Daily Challenge ---
if ($('daily-challenge-btn')) $('daily-challenge-btn').onclick = () => {
  if ($('daily-challenge-modal')) $('daily-challenge-modal').classList.add('visible');
  if ($('daily-challenge-question')) $('daily-challenge-question').textContent = "Answer 5 questions in 30 seconds for a bonus badge!";
};
if ($('close-daily-challenge')) $('close-daily-challenge').onclick = () => $('daily-challenge-modal') && $('daily-challenge-modal').classList.remove('visible');
if ($('start-daily-challenge')) $('start-daily-challenge').onclick = () => {
  if ($('daily-challenge-modal')) $('daily-challenge-modal').classList.remove('visible');
  startQuiz(true); // Start in challenge mode
};

// --- Fun Fact Popups ---
const funFacts = [
  "A group of flamingos is called a 'flamboyance'!",
  "A group of crows is called a 'murder'.",
  "A group of owls is called a 'parliament'.",
  "A group of frogs is called an 'army'.",
  "A group of dolphins is called a 'pod'.",
  "A group of lions is called a 'pride'."
];
function showDidYouKnowPopup() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  const popup = document.createElement('div');
  popup.className = 'did-you-know-popup';
  popup.textContent = "Did you know? " + fact;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 5000);
}

// --- Fireworks/Confetti ---
function launchFireworks() {
  const container = $('fireworks-container');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.top = Math.random() * 80 + 10 + '%';
    firework.style.backgroundColor = `hsl(${Math.random()*360},80%,60%)`;
    container.appendChild(firework);
    setTimeout(() => firework.remove(), 1000);
  }
}

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

// --- Hint System ---
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
  let availableWrongOptions = [];
  optionButtons.forEach((btn, idx) => {
    if (idx !== q.answer) availableWrongOptions.push(idx);
  });
  availableWrongOptions.sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(2, availableWrongOptions.length); i++) {
    const wrongIdx = availableWrongOptions[i];
    optionButtons[wrongIdx].classList.add('disabled');
    optionButtons[wrongIdx].disabled = true;
  }
}

// --- Start quiz after splash/profile ---
setTimeout(() => startQuiz(false), 1200);
