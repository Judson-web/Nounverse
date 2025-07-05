// Utility functions for safe DOM access
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
      updateProfileHeader();
      startQuizAfterProfileSelection();
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
  startQuizAfterProfileSelection();
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

function startQuizAfterProfileSelection() {
  if ($('splash-screen')) $('splash-screen').style.display = 'none';
  if ($('quiz-content')) $('quiz-content').classList.remove('hidden');
  startQuiz(false);
}

// --- Rest of your quiz, timer, hint, and other logic unchanged ---
// Make sure to call startQuizAfterProfileSelection() only after profile selection or creation.

// Example:
// setTimeout(() => startQuiz(false), 1200); // REMOVE this line if present to prevent auto start before profile selection
