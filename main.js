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

function showProfileSelection() {
  document.getElementById('profile-modal').classList.add('visible');
  renderProfileList();
  document.getElementById('add-profile-btn').onclick = addProfile;
  document.getElementById('close-profile').onclick = () => document.getElementById('profile-modal').classList.remove('visible');
}
function renderProfileList() {
  const profileList = document.getElementById('profile-list');
  profileList.innerHTML = '';
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
function addProfile() {
  let name = prompt('Enter explorer name:');
  if (!name) return;
  let avatar = avatarList[0];
  let theme = themeList[0].color;

  // Avatar selection
  let avatarHTML = '<div class="avatar-choose-list">';
  avatarList.forEach((url, i) => {
    avatarHTML += `<img src="${url}" class="avatar-choose-img" data-idx="${i}">`;
  });
  avatarHTML += '</div>';
  let themeHTML = '<div>';
  themeList.forEach((t, i) => {
    themeHTML += `<span class="profile-theme-sample" style="background:${t.color};cursor:pointer;" data-idx="${i}" title="${t.name}"></span>`;
  });
  themeHTML += '</div>';

  let modal = document.createElement('div');
  modal.className = 'modal-overlay visible';
  modal.innerHTML = `
    <div class="modal-content w-full max-w-xs">
      <h2 class="text-lg font-bold mb-2">Choose Avatar</h2>
      ${avatarHTML}
      <h2 class="text-lg font-bold mt-2 mb-2">Choose Theme</h2>
      ${themeHTML}
      <button id="confirm-add-profile" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md mt-3">Confirm</button>
    </div>
  `;
  document.body.appendChild(modal);

  let selectedAvatar = 0, selectedTheme = 0;
  modal.querySelectorAll('.avatar-choose-img').forEach(img => {
    img.onclick = function() {
      selectedAvatar = Number(this.dataset.idx);
      modal.querySelectorAll('.avatar-choose-img').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
    };
  });
  modal.querySelectorAll('.profile-theme-sample').forEach(span => {
    span.onclick = function() {
      selectedTheme = Number(this.dataset.idx);
      modal.querySelectorAll('.profile-theme-sample').forEach(s => s.style.outline = '');
      this.style.outline = '2px solid #4A90E2';
    };
  });
  modal.querySelector('#confirm-add-profile').onclick = function() {
    profiles.push({ name, avatar: avatarList[selectedAvatar], theme: themeList[selectedTheme].color });
    localStorage.setItem('profiles', JSON.stringify(profiles));
    document.body.removeChild(modal);
    renderProfileList();
  };
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
    : `url('${avatarList[0]}')`;
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
