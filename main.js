// --- Splash Screen Logic ---
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('quiz-content').classList.remove('hidden');
    showProfileSelection();
    showCookieBanner();
  }, 1000);
});

// --- Profile System with Avatar and Theme ---
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
let currentProfileIndex = Number(localStorage.getItem('currentProfileIndex')) || 0;

// Profile Modal Logic
function showProfileSelection() {
  document.getElementById('profile-modal').classList.add('visible');
  renderProfileList();
  document.getElementById('add-profile-btn').onclick = showAddProfileModal;
  document.getElementById('close-profile').onclick = () => document.getElementById('profile-modal').classList.remove('visible');
}
function renderProfileList() {
  const profileList = document.getElementById('profile-list');
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
    div.querySelector('.delete-profile-btn').onclick = (e) => {
      e.stopPropagation();
      deleteProfile(idx);
    };
    profileList.appendChild(div);
  });
}
function showAddProfileModal() {
  document.getElementById('profile-modal').classList.remove('visible');
  document.getElementById('add-profile-modal').classList.add('visible');
  renderAvatarThemeChoices();
  document.getElementById('add-profile-form').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name-input').value.trim();
    if (!name) return;
    const selectedAvatar = document.querySelector('.avatar-choose-img.selected');
    const selectedTheme = document.querySelector('.theme-choose-sample.selected');
    profiles.push({
      name,
      avatar: avatarList[selectedAvatar ? selectedAvatar.dataset.idx : 0],
      theme: themeList[selectedTheme ? selectedTheme.dataset.idx : 0].color
    });
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('currentProfileIndex', profiles.length - 1);
    document.getElementById('add-profile-modal').classList.remove('visible');
    showProfileSelection();
    updateProfileHeader();
  };
  document.getElementById('cancel-add-profile').onclick = function() {
    document.getElementById('add-profile-modal').classList.remove('visible');
    showProfileSelection();
  };
}
function renderAvatarThemeChoices() {
  const avatarListDiv = document.getElementById('avatar-choose-list');
  avatarListDiv.innerHTML = '';
  avatarList.forEach((url, i) => {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'avatar-choose-img rounded-full border-2 border-gray-300 cursor-pointer' + (i === 0 ? ' selected' : '');
    img.dataset.idx = i;
    img.onclick = function() {
      document.querySelectorAll('.avatar-choose-img').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
    };
    avatarListDiv.appendChild(img);
  });
  const themeListDiv = document.getElementById('theme-choose-list');
  themeListDiv.innerHTML = '';
  themeList.forEach((t, i) => {
    const span = document.createElement('span');
    span.className = 'theme-choose-sample rounded-full border-2 border-gray-300 cursor-pointer w-7 h-7 inline-block' + (i === 0 ? ' selected' : '');
    span.dataset.idx = i;
    span.style.background = t.color;
    span.onclick = function() {
      document.querySelectorAll('.theme-choose-sample').forEach(s => s.classList.remove('selected'));
      this.classList.add('selected');
    };
    themeListDiv.appendChild(span);
  });
}
function selectProfile(idx) {
  currentProfileIndex = idx;
  localStorage.setItem('currentProfileIndex', idx);
  document.getElementById('profile-modal').classList.remove('visible');
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
  document.getElementById('profile-avatar').style.backgroundImage = profile?.avatar
    ? `url('${profile.avatar}')`
    : `url('${avatarList[0]}')`;
  document.getElementById('profile-avatar').style.backgroundSize = 'cover';
  document.getElementById('profile-name').textContent = profile?.name || 'Profile';
}
updateProfileHeader();
document.getElementById('profile-btn').onclick = () => showProfileSelection();

// --- Cookie Banner ---
function showCookieBanner() {
  if (!localStorage.getItem('cookiesAccepted')) {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('show');
      banner.classList.remove('hidden');
      document.getElementById('accept-cookies').onclick = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.remove('show');
      };
    }
  }
}

// --- Sound Toggle ---
const soundBtn = document.getElementById('sound-toggle-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
function updateSoundIcon() {
  if (soundEnabled) {
    volumeIcon.classList.remove('hidden');
    muteIcon.classList.add('hidden');
  } else {
    volumeIcon.classList.add('hidden');
    muteIcon.classList.remove('hidden');
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
  document.getElementById('noun-coins').textContent = nounCoins;
  localStorage.setItem('nounCoins', nounCoins);
}
updateCoinsDisplay();
function awardCoins(amount) {
  nounCoins += amount;
  updateCoinsDisplay();
  
  // Play coin sound if enabled
  if (soundEnabled) {
    playSoundEffect('coin');
  }
}

// --- Shop Modal ---
document.getElementById('open-shop').onclick = () => document.getElementById('shop-modal').classList.add('visible');
document.getElementById('close-shop').onclick = () => document.getElementById('shop-modal').classList.remove('visible');
document.querySelectorAll('.shop-item').forEach(btn => {
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
  const container = document.getElementById('stickerbook-content');
  container.innerHTML = '';
  animals.forEach(animal => {
    const div = document.createElement('div');
    div.className = 'sticker' + (stickers[animal] ? ' collected' : '');
    div.textContent = stickers[animal] ? '✅' : '❓';
    div.title = animal;
    container.appendChild(div);
  });
}
document.getElementById('open-stickerbook').onclick = () => {
  updateStickerBook();
  document.getElementById('stickerbook-modal').classList.add('visible');
};
document.getElementById('close-stickerbook').onclick = () => document.getElementById('stickerbook-modal').classList.remove('visible');
function collectSticker(animal) {
  stickers[animal] = true;
  localStorage.setItem('stickers', JSON.stringify(stickers));
}

// --- Settings Modal ---
document.getElementById('open-settings').onclick = () => document.getElementById('settings-modal').classList.add('visible');
document.getElementById('close-settings').onclick = () => document.getElementById('settings-modal').classList.remove('visible');
const dyslexiaCheckbox = document.getElementById('dyslexia-mode');
dyslexiaCheckbox.checked = localStorage.getItem('dyslexia') === 'true';
function updateFont() {
  if (dyslexiaCheckbox.checked) {
    document.body.classList.add('dyslexia-font');
    localStorage.setItem('dyslexia', 'true');
  } else {
    document.body.classList.remove('dyslexia-font');
    localStorage.setItem('dyslexia', 'false');
  }
}
dyslexiaCheckbox.onchange = updateFont;
updateFont();
const colorblindCheckbox = document.getElementById('colorblind-mode');
colorblindCheckbox.checked = localStorage.getItem('colorblind') === 'true';
colorblindCheckbox.onchange = () => localStorage.setItem('colorblind', colorblindCheckbox.checked ? 'true' : 'false');

// --- Daily Challenge ---
document.getElementById('daily-challenge-btn').onclick = () => {
  document.getElementById('daily-challenge-modal').classList.add('visible');
  document.getElementById('daily-challenge-question').textContent = "Answer 5 questions in 30 seconds for a bonus badge!";
};
document.getElementById('close-daily-challenge').onclick = () => document.getElementById('daily-challenge-modal').classList.remove('visible');
document.getElementById('start-daily-challenge').onclick = () => {
  document.getElementById('daily-challenge-modal').classList.remove('visible');
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
  const container = document.getElementById('fireworks-container');
  for (let i = 0; i < 12; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.top = Math.random() * 80 + 10 + '%';
    firework.style.backgroundColor = `hsl(${Math.random()*360},80%,60%)`;
    container.appendChild(firework);
    setTimeout(() => firework.remove(), 1000);
  }
  
  // Play firework sound if enabled
  if (soundEnabled) {
    playSoundEffect('firework');
  }
}

// --- Sound Effects ---
function playSoundEffect(type) {
  if (!soundEnabled) return;
  
  // You can implement actual sound playing here
  // For example using the Web Audio API or HTML5 Audio
  console.log(`Playing sound: ${type}`);
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
  document.getElementById('current-question').textContent = currentQuestion + 1;
  document.getElementById('total-questions').textContent = quizQuestions.length;
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  updateStreakStars();

  // Render question and options
  const questionArea = document.getElementById('question-area');
  questionArea.innerHTML = `
    <h2 class="text-xl font-bold mb-4">${q.question}</h2>
    <div id="options-list" class="mb-4"></div>
    <div class="flex justify-between items-center">
      <button id="hint-button" class="px-3 py-1 rounded">Hint (2 🪙)</button>
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

  // Setup hint button
  const hintBtn = document.getElementById('hint-button');
  hintBtn.onclick = showHint;

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
    
    // Award coins and possibly collect sticker
    const coinReward = isChallengeMode ? 3 : 2;
    awardCoins(coinReward);
    
    // Collect sticker if this is the first time answering correctly
    if (!stickers[q.animal]) {
      collectSticker(q.animal);
      showDidYouKnowPopup();
    }
    
    // Show fireworks for correct answer
    if (streak >= 3) {
      launchFireworks();
    }
    
    // Play correct sound
    if (soundEnabled) {
      playSoundEffect('correct');
    }
  } else {
    btn.classList.add('incorrect');
    optionButtons[q.answer].classList.add('correct');
    streak = 0;
    
    // Play incorrect sound
    if (soundEnabled) {
      playSoundEffect('incorrect');
    }
  }
  
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
  updateStreakStars();
  document.getElementById('next-btn').classList.remove('hidden');
  document.getElementById('next-btn').onclick = nextQuestion;
  
  // Disable hint button after answering
  document.getElementById('hint-button').disabled = true;
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
  const questionArea = document.getElementById('question-area');
  questionArea.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
    <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
    <p class="mb-4">You earned <span class="font-bold">${score * (isChallengeMode ? 3 : 2)}</span> coins!</p>
    <button id="restart-btn" class="bg-green-500 text-white px-4 py-2 rounded">Play Again</button>
  `;
  document.getElementById('timer-text').textContent = '';
  document.getElementById('timer-bar-fill').style.width = '0%';
  
  // Show fireworks for good scores
  if (score >= quizQuestions.length * 0.7) {
    launchFireworks();
  }
  
  document.getElementById('restart-btn').onclick = () => startQuiz(false);
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
  document.getElementById('hint-button').disabled = true;
  
  // Play timeout sound
  if (soundEnabled) {
    playSoundEffect('timeout');
  }
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

// --- Hint System ---
function showHint() {
  // Check if user has enough coins
  if (nounCoins < 2) {
    alert("You need 2 coins to use a hint!");
    return;
  }
  
  // Deduct coins
  nounCoins -= 2;
  updateCoinsDisplay();
  
  const q = quizQuestions[currentQuestion];
  const optionButtons = document.querySelectorAll('.option-button');
  
  // Disable hint button
  document.getElementById('hint-button').disabled = true;
  
  // Eliminate two wrong options
  let eliminated = 0;
  let availableWrongOptions = [];
  
  // Find all wrong options
  optionButtons.forEach((btn, idx) => {
    if (idx !== q.answer) {
      availableWrongOptions.push(idx);
    }
  });
  
  // Shuffle wrong options
  availableWrongOptions.sort(() => Math.random() - 0.5);
  
  // Eliminate two wrong options
  for (let i = 0; i < Math.min(2, availableWrongOptions.length); i++) {
    const wrongIdx = availableWrongOptions[i];
    optionButtons[wrongIdx].classList.add('disabled');
    optionButtons[wrongIdx].disabled = true;
  }
  
  // Play hint sound
  if (soundEnabled) {
    playSoundEffect('hint');
  }
}

// Start quiz after splash/profile
setTimeout(() => startQuiz(false), 1200);
