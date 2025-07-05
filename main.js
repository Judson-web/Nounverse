// --- Splash Screen Logic ---
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.style.display = 'none';
    const quizContent = document.getElementById('quiz-content');
    if (quizContent) quizContent.classList.remove('hidden');
    showProfileSelection();
    showCookieBanner();
  }, 1200);
});

// --- Sound Toggle ---
const soundBtn = document.getElementById('sound-toggle-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
function updateSoundIcon() {
  if (soundEnabled) {
    volumeIcon.classList.remove('hidden');
    muteIcon.classList.add('hidden');
    document.getElementById('sound-tooltip').textContent = 'Mute Sound';
  } else {
    volumeIcon.classList.add('hidden');
    muteIcon.classList.remove('hidden');
    document.getElementById('sound-tooltip').textContent = 'Unmute Sound';
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
  // Start your challenge mode here!
};

// --- Profile Modal ---
document.getElementById('profile-btn').onclick = () => showProfileSelection();
document.getElementById('close-profile').onclick = () => document.getElementById('profile-modal').classList.remove('visible');

let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
let currentProfileIndex = Number(localStorage.getItem('currentProfileIndex')) || 0;

function showProfileSelection() {
  document.getElementById('profile-modal').classList.add('visible');
  renderProfileList();
  document.getElementById('add-profile-btn').onclick = addProfile;
}
function renderProfileList() {
  const profileList = document.getElementById('profile-list');
  profileList.innerHTML = '';
  profiles.forEach((profile, idx) => {
    const div = document.createElement('div');
    div.className = 'profile-card' + (idx === currentProfileIndex ? ' selected-profile' : '');
    div.innerHTML = `
      <img src="${profile.avatar || 'https://api.dicebear.com/6.x/personas/svg?seed=' + encodeURIComponent(profile.name)}" alt="Avatar">
      <span class="font-semibold">${profile.name}</span>
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
function addProfile() {
  const name = prompt('Enter explorer name:');
  if (!name) return;
  profiles.push({ name, avatar: '' });
  localStorage.setItem('profiles', JSON.stringify(profiles));
  renderProfileList();
}
function selectProfile(idx) {
  currentProfileIndex = idx;
  localStorage.setItem('currentProfileIndex', idx);
  document.getElementById('profile-modal').classList.remove('visible');
  updateProfileHeader();
}
function deleteProfile(idx) {
  if (!confirm('Delete this explorer?')) return;
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
    : `url('https://api.dicebear.com/6.x/personas/svg?seed=${encodeURIComponent(profile?.name || "Explorer")}')`;
  document.getElementById('profile-name').textContent = profile?.name || 'Profile';
}
updateProfileHeader();

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
}

// --- Example: Connect features to your quiz logic ---
// When a user answers correctly:
// awardCoins(2);
// collectSticker(animalName);
// showDidYouKnowPopup();
// launchFireworks();
  
