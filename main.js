// ====== User Profile Data (with persistence) ======
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Guest',
    age: '',
    avatar: 'https://mui.com/static/images/avatar/1.jpg'
};

// ====== Quiz Logic Variables ======
let current = 0, score = 0, streak = 0, timer = null;
let timeTotal = 20; // Default timer value, can be changed in settings

// ====== Profile Modal Logic ======
const profileBtn = document.getElementById('profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileBtn = document.getElementById('close-profile-modal');
const profileForm = document.getElementById('profile-form');
const cancelProfileEdit = document.getElementById('cancel-profile-edit');
const profileNameInput = document.getElementById('profile-name-input');
const profileAgeInput = document.getElementById('profile-age-input');
const profileScore = document.getElementById('profile-score');
const profileStreak = document.getElementById('profile-streak');
const profileAvatar = document.getElementById('profile-avatar');
const editAvatarBtn = document.getElementById('edit-avatar-btn');
const avatarUpload = document.getElementById('avatar-upload');

// Show modal and populate fields
if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', () => {
        updateProfileInfo();
        profileModal.classList.remove('hidden');
    });
}
if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', () => {
        profileModal.classList.add('hidden');
    });
}
if (cancelProfileEdit && profileModal) {
    cancelProfileEdit.addEventListener('click', () => {
        profileModal.classList.add('hidden');
    });
}
profileModal?.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.add('hidden');
});

// Update profile fields and stats in modal
function updateProfileInfo() {
    profileNameInput.value = userProfile.name || 'Guest';
    profileAgeInput.value = userProfile.age || '';
    profileScore.textContent = score;
    profileStreak.textContent = streak;
    profileAvatar.src = userProfile.avatar || 'https://mui.com/static/images/avatar/1.jpg';
}

// Save profile edits
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        userProfile.name = profileNameInput.value.trim() || 'Guest';
        userProfile.age = profileAgeInput.value.trim();
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        updateProfileInfo();
        profileModal.classList.add('hidden');
    });
}

// Avatar upload logic
if (editAvatarBtn && avatarUpload) {
    editAvatarBtn.addEventListener('click', () => avatarUpload.click());
    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userProfile.avatar = e.target.result;
                profileAvatar.src = userProfile.avatar;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            };
            reader.readAsDataURL(file);
        }
    });
}

// Update stats in profile modal when score/streak changes
function updateProfileStatsLive() {
    if (!profileModal.classList.contains('hidden')) {
        profileScore.textContent = score;
        profileStreak.textContent = streak;
    }
}

// ====== Call updateProfileStatsLive() in your quiz logic after score/streak changes ======
// Example integration in your quiz logic:
function handleAnswer(idx, btn) {
    clearInterval(timer);
    const q = quizQuestions[current];
    const allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach(b => b.disabled = true);
    if (idx === q.answer) {
        btn.classList.add('correct');
        score++; streak++;
        playSound('correct-sound');
    } else {
        btn.classList.add('incorrect');
        allBtns[q.answer].classList.add('correct');
        streak = 0;
        playSound('wrong-sound');
    }
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    updateProfileStatsLive(); // <-- update profile modal stats
    showFunFact(q.funFact);

    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}
function handleTimeUp() {
    const q = quizQuestions[current];
    const allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    document.getElementById('streak').textContent = streak;
    updateProfileStatsLive(); // <-- update profile modal stats
    playSound('wrong-sound');
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

// ====== The rest of your quiz, settings, and sound logic remains unchanged ======

// Example: When quiz starts, also update profile info
window.addEventListener('DOMContentLoaded', function() {
    updateProfileInfo();
    // ... your existing DOMContentLoaded logic ...
});
