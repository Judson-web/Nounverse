// ===== Utility Shortcuts =====
function $(id) { return document.getElementById(id); }
function saveProfile() { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }
function saveSettings() { localStorage.setItem('settings', JSON.stringify(settings)); }

// ===== User Profile Data =====
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    displayName: 'Guest',
    username: '',
    birthday: '',
    age: '',
    pronouns: '',
    pronounsCustom: '',
    favColor: '#1976d2',
    favAnimal: '',
    greeting: '',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    pin: '',
    stats: { quizzes: 0, bestScore: 0, bestStreak: 0 },
    badges: []
};

// ===== Settings Defaults =====
let settings = JSON.parse(localStorage.getItem('settings')) || {
    soundEffects: true,
    fontSize: 'medium',
    quizLength: 10,
    theme: '',
    language: 'en',
    animations: true
};

// ===== Cached DOM Elements =====
const dom = {
    splash: $('splash-screen'),
    quizContent: $('quiz-content'),
    score: $('score'),
    streak: $('streak'),
    currentQ: $('current-question'),
    totalQ: $('total-questions'),
    questionArea: $('question-area'),
    funFactBox: $('fun-fact-box'),
    timerText: $('timer-text'),
    timerBarFill: $('timer-bar-fill'),
    // Profile
    profileModal: $('profile-modal'),
    profileBtn: $('profile-btn'),
    closeProfileBtn: $('close-profile-modal'),
    profileForm: $('profile-form'),
    cancelProfileEdit: $('cancel-profile-edit'),
    profileAvatar: $('profile-avatar'),
    editAvatarBtn: $('edit-avatar-btn'),
    emojiAvatarBtn: $('emoji-avatar-btn'),
    avatarUpload: $('avatar-upload'),
    displayNameInput: $('profile-display-name'),
    usernameInput: $('profile-username'),
    birthdayInput: $('profile-birthday'),
    ageInput: $('profile-age'),
    pronounsSelect: $('profile-pronouns'),
    pronounsCustomInput: $('profile-pronouns-custom'),
    favColorInput: $('profile-fav-color'),
    favAnimalInput: $('profile-fav-animal'),
    greetingInput: $('profile-greeting'),
    pinInput: $('profile-pin'),
    scoreStat: $('profile-score'),
    streakStat: $('profile-streak'),
    quizzesStat: $('profile-quizzes'),
    accessibilityFont: $('profile-accessibility-font'),
    accessibilityTheme: $('profile-accessibility-theme'),
    accessibilityLanguage: $('profile-accessibility-language'),
    // Settings
    settingsBtn: $('open-settings'),
    settingsModal: $('settings-modal'),
    closeSettingsBtn: $('close-settings-modal'),
    saveSettingsBtn: $('save-settings'),
    resetProgressBtn: $('reset-progress-btn'),
    settingsForm: $('settings-form'),
    soundEffectsToggle: $('sound-effects-toggle'),
    fontSizeBtns: document.querySelectorAll('.toggle-btn[data-font]'),
    quizLengthSetting: $('quiz-length-setting'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    languageSetting: $('language-setting'),
    animationsToggle: $('animations-toggle'),
    // Sound
    soundToggleBtn: $('sound-toggle-btn'),
    volumeIcon: $('volume-icon'),
    muteIcon: $('mute-icon'),
    soundTooltip: $('sound-tooltip')
};

// ===== Quiz Data =====
const quizQuestions = [
    { question: "What is a group of lions called?", options: ["Pride", "Flock", "School", "Pack"], answer: 0, funFact: "A group of lions is called a 'pride' because they live together as a family group." },
    { question: "What is a group of crows called?", options: ["Murder", "Gaggle", "Pod", "Swarm"], answer: 0, funFact: "A group of crows is called a 'murder'—the name comes from old folk tales and superstitions!" },
    { question: "What is a group of dolphins called?", options: ["Pod", "Troop", "Army", "Parliament"], answer: 0, funFact: "A group of dolphins is called a 'pod.' Dolphins are very social animals!" },
    { question: "What is a group of bees called?", options: ["Swarm", "Flock", "Herd", "Pack"], answer: 0, funFact: "A group of bees is called a 'swarm.' Swarms are usually seen when bees are searching for a new home." },
    { question: "What is a group of owls called?", options: ["Parliament", "Flock", "Colony", "Pack"], answer: 0, funFact: "A group of owls is called a 'parliament'—the name was popularized by C.S. Lewis in his books!" },
    { question: "What is a group of flamingos called?", options: ["Flamboyance", "Gaggle", "Herd", "Pod"], answer: 0, funFact: "A group of flamingos is called a 'flamboyance' because of their bright pink feathers." },
    { question: "What is a group of whales called?", options: ["Pod", "School", "Troop", "Murder"], answer: 0, funFact: "Whales travel in groups called 'pods' to communicate and protect each other." },
    { question: "What is a group of frogs called?", options: ["Army", "Swarm", "Pack", "Colony"], answer: 0, funFact: "A group of frogs is called an 'army' because they often move together in large numbers." },
    { question: "What is a group of kangaroos called?", options: ["Mob", "Pack", "Herd", "Troop"], answer: 0, funFact: "A group of kangaroos is called a 'mob'—they use this group for protection." },
    { question: "What is a group of ants called?", options: ["Colony", "Swarm", "Herd", "Pack"], answer: 0, funFact: "A group of ants is called a 'colony' because they live and work together underground." }
];

// ===== Quiz State =====
let current = 0, score = 0, streak = 0, timer = null, quizSet = [];
const timeTotal = 20;

// ===== DOMContentLoaded =====
window.addEventListener('DOMContentLoaded', function() {
    applySettings();
    updateProfileInfo();
    setupSettingsUI();
    setupProfileUI();
    // Hide splash and show quiz when DOM is ready
    if (dom.splash) dom.splash.style.display = 'none';
    if (dom.quizContent) dom.quizContent.classList.remove('hidden');
    startQuiz();
});

// ===== Quiz Functions =====
function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function getQuizSet() {
    if (settings.quizLength === 'all' || settings.quizLength >= quizQuestions.length) {
        return quizQuestions.slice();
    }
    return quizQuestions.slice().sort(() => Math.random() - 0.5).slice(0, Number(settings.quizLength));
}

function showQuestion() {
    if (current === 0) quizSet = getQuizSet();
    const q = quizSet[current];
    dom.score.textContent = score;
    dom.streak.textContent = streak;
    dom.currentQ.textContent = current + 1;
    dom.totalQ.textContent = quizSet.length;
    dom.questionArea.innerHTML = `<h2 class="mb-4 text-xl font-bold">${q.question}</h2>
      <div id="options-list" class="flex flex-col gap-3"></div>`;
    const opts = $('options-list');
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = opt;
        btn.setAttribute('aria-label', opt);
        btn.onclick = () => handleAnswer(idx, btn);
        opts.appendChild(btn);
    });
    startTimer(timeTotal);
}

function handleAnswer(idx, btn) {
    clearInterval(timer);
    const q = quizSet[current];
    document.querySelectorAll('.option-button').forEach(b => b.disabled = true);
    if (idx === q.answer) {
        btn.classList.add('correct');
        score++; streak++;
        playSound('correct-sound');
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.option-button')[q.answer].classList.add('correct');
        streak = 0;
        playSound('wrong-sound');
    }
    dom.score.textContent = score;
    dom.streak.textContent = streak;
    updateProfileStatsLive();
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizSet.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showQuizEnd() {
    dom.questionArea.innerHTML =
        `<h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizSet.length}</p>
        <button id="restart-btn" class="option-button" style="width:auto;min-width:120px;">Play Again</button>`;
    dom.timerText.textContent = '';
    dom.timerBarFill.style.width = '0%';
    $('restart-btn').onclick = startQuiz;
    hideFunFact();
    // Stats & badges
    userProfile.stats.quizzes = (userProfile.stats.quizzes || 0) + 1;
    if (score > (userProfile.stats.bestScore || 0)) userProfile.stats.bestScore = score;
    if (streak > (userProfile.stats.bestStreak || 0)) userProfile.stats.bestStreak = streak;
    if (userProfile.stats.quizzes === 1 && !userProfile.badges.includes('first-quiz')) userProfile.badges.push('first-quiz');
    if (streak >= 5 && !userProfile.badges.includes('streak-5')) userProfile.badges.push('streak-5');
    saveProfile();
    updateProfileStatsLive();
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
    dom.timerText.textContent = `${timeLeft}s`;
    const fill = dom.timerBarFill;
    const percent = (timeLeft / total) * 100;
    fill.style.width = percent + '%';
    fill.classList.remove('warning', 'danger');
    if (timeLeft <= 5) fill.classList.add('danger');
    else if (timeLeft <= 10) fill.classList.add('warning');
}

function handleTimeUp() {
    const q = quizSet[current];
    document.querySelectorAll('.option-button').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    dom.streak.textContent = streak;
    updateProfileStatsLive();
    playSound('wrong-sound');
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizSet.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showFunFact(fact) {
    if (!fact) return hideFunFact();
    dom.funFactBox.textContent = "Fun Fact: " + fact;
    dom.funFactBox.classList.remove('hidden');
    setTimeout(hideFunFact, 1600);
}
function hideFunFact() {
    dom.funFactBox.classList.add('hidden');
    dom.funFactBox.textContent = '';
}

// ===== Profile Logic =====
function updateProfileInfo() {
    dom.displayNameInput.value = userProfile.displayName || '';
    dom.usernameInput.value = userProfile.username || generateUsername(userProfile.displayName);
    dom.birthdayInput.value = userProfile.birthday || '';
    dom.ageInput.value = userProfile.age || '';
    dom.pronounsSelect.value = userProfile.pronouns || '';
    dom.pronounsCustomInput.value = userProfile.pronounsCustom || '';
    dom.pronounsCustomInput.classList.toggle('hidden', userProfile.pronouns !== 'custom');
    dom.favColorInput.value = userProfile.favColor || '#1976d2';
    dom.favAnimalInput.value = userProfile.favAnimal || '';
    dom.greetingInput.value = userProfile.greeting || '';
    dom.pinInput.value = userProfile.pin || '';
    if (dom.profileAvatar) dom.profileAvatar.src = userProfile.avatar || 'https://mui.com/static/images/avatar/1.jpg';
    dom.scoreStat.textContent = userProfile.stats.bestScore || 0;
    dom.streakStat.textContent = userProfile.stats.bestStreak || 0;
    dom.quizzesStat.textContent = userProfile.stats.quizzes || 0;
    updateProfileBadges();
}

function updateProfileBadges() {
    // Add dynamic badge logic here if you want to show/hide badges
}

function updateProfileStatsLive() {
    dom.scoreStat.textContent = userProfile.stats.bestScore || 0;
    dom.streakStat.textContent = userProfile.stats.bestStreak || 0;
    dom.quizzesStat.textContent = userProfile.stats.quizzes || 0;
    updateProfileBadges();
}

// Profile modal open/close
if (dom.profileBtn && dom.profileModal) {
    dom.profileBtn.onclick = () => { updateProfileInfo(); dom.profileModal.classList.remove('hidden'); };
}
if (dom.closeProfileBtn && dom.profileModal) {
    dom.closeProfileBtn.onclick = () => dom.profileModal.classList.add('hidden');
}
if (dom.cancelProfileEdit && dom.profileModal) {
    dom.cancelProfileEdit.onclick = () => dom.profileModal.classList.add('hidden');
}
if (dom.profileModal) {
    dom.profileModal.addEventListener('click', e => {
        if (e.target === dom.profileModal) dom.profileModal.classList.add('hidden');
    });
}

// Profile form logic
if (dom.profileForm) {
    dom.profileForm.onsubmit = function(e) {
        e.preventDefault();
        userProfile.displayName = dom.displayNameInput.value.trim() || 'Guest';
        userProfile.username = dom.usernameInput.value.trim() || generateUsername(dom.displayNameInput.value);
        userProfile.birthday = dom.birthdayInput.value;
        userProfile.age = dom.ageInput.value;
        userProfile.pronouns = dom.pronounsSelect.value;
        userProfile.pronounsCustom = dom.pronounsCustomInput.value;
        userProfile.favColor = dom.favColorInput.value;
        userProfile.favAnimal = dom.favAnimalInput.value;
        userProfile.greeting = dom.greetingInput.value.trim();
        userProfile.pin = dom.pinInput.value.trim();
        saveProfile();
        updateProfileInfo();
        dom.profileModal.classList.add('hidden');
    };
}

// Avatar upload
if (dom.editAvatarBtn && dom.avatarUpload) {
    dom.editAvatarBtn.onclick = () => dom.avatarUpload.click();
    dom.avatarUpload.onchange = function() {
        const file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userProfile.avatar = e.target.result;
                if (dom.profileAvatar) dom.profileAvatar.src = userProfile.avatar;
                saveProfile();
            };
            reader.readAsDataURL(file);
        }
    };
}

// Emoji avatar picker
if (dom.emojiAvatarBtn) {
    dom.emojiAvatarBtn.onclick = function() {
        const emoji = prompt('Enter an emoji for your avatar:');
        if (emoji && emoji.length <= 2) {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text x="50%" y="50%" font-size="60" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`;
            userProfile.avatar = 'data:image/svg+xml;base64,' + btoa(svg);
            if (dom.profileAvatar) dom.profileAvatar.src = userProfile.avatar;
            saveProfile();
        }
    };
}

// Birthday/age sync
if (dom.birthdayInput && dom.ageInput) {
    dom.birthdayInput.onchange = function() {
        if (dom.birthdayInput.value) {
            const birthDate = new Date(dom.birthdayInput.value);
            const today = new Date();
            let years = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) years--;
            dom.ageInput.value = years > 0 ? years : '';
        }
    };
    dom.ageInput.onchange = function() {
        if (dom.ageInput.value) dom.birthdayInput.value = '';
    };
}

// Pronouns custom input toggle
if (dom.pronounsSelect && dom.pronounsCustomInput) {
    dom.pronounsSelect.onchange = function() {
        if (dom.pronounsSelect.value === 'custom') {
            dom.pronounsCustomInput.classList.remove('hidden');
        } else {
            dom.pronounsCustomInput.classList.add('hidden');
            dom.pronounsCustomInput.value = '';
        }
    };
}

// Accessibility quick links
if (dom.accessibilityFont) {
    dom.accessibilityFont.onclick = function() {
        dom.settingsBtn.click();
        setTimeout(() => document.querySelector('.toggle-btn[data-font]')?.focus(), 300);
    };
}
if (dom.accessibilityTheme) {
    dom.accessibilityTheme.onclick = function() {
        dom.settingsBtn.click();
        setTimeout(() => document.querySelector('.theme-btn')?.focus(), 300);
    };
}
if (dom.accessibilityLanguage) {
    dom.accessibilityLanguage.onclick = function() {
        dom.settingsBtn.click();
        setTimeout(() => dom.languageSetting?.focus(), 300);
    };
}

// Generate username from display name (simple slug)
function generateUsername(name) {
    if (!name) return 'user' + Math.floor(Math.random() * 10000);
    return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 16) + Math.floor(Math.random() * 100);
}

// ===== Settings Modal Logic =====
if (dom.settingsBtn && dom.settingsModal) {
    dom.settingsBtn.onclick = function() {
        dom.soundEffectsToggle.checked = settings.soundEffects;
        dom.fontSizeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.font === settings.fontSize));
        dom.quizLengthSetting.value = settings.quizLength;
        dom.themeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === settings.theme));
        dom.languageSetting.value = settings.language;
        dom.animationsToggle.checked = settings.animations;
        dom.settingsModal.classList.remove('hidden');
    };
}
if (dom.closeSettingsBtn && dom.settingsModal) {
    dom.closeSettingsBtn.onclick = () => dom.settingsModal.classList.add('hidden');
}
if (dom.settingsModal) {
    dom.settingsModal.addEventListener('click', e => {
        if (e.target === dom.settingsModal) dom.settingsModal.classList.add('hidden');
    });
}
dom.fontSizeBtns.forEach(btn => {
    btn.onclick = function() {
        dom.fontSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.fontSize = btn.dataset.font;
    };
});
dom.themeBtns.forEach(btn => {
    btn.onclick = function() {
        dom.themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.theme = btn.dataset.theme;
    };
});
if (dom.settingsForm) {
    dom.settingsForm.onsubmit = function(e) {
        e.preventDefault();
        settings.soundEffects = dom.soundEffectsToggle.checked;
        settings.quizLength = dom.quizLengthSetting.value;
        settings.language = dom.languageSetting.value;
        settings.animations = dom.animationsToggle.checked;
        saveSettings();
        applySettings();
        dom.settingsModal.classList.add('hidden');
        startQuiz();
    };
}
if (dom.resetProgressBtn) {
    dom.resetProgressBtn.onclick = function() {
        if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            localStorage.clear();
            location.reload();
        }
    };
}
function applySettings() {
    document.body.classList.remove('dark', 'theme-ocean', 'theme-sunset');
    if (settings.theme === 'dark') document.body.classList.add('dark');
    if (settings.theme === 'ocean') document.body.classList.add('theme-ocean');
    if (settings.theme === 'sunset') document.body.classList.add('theme-sunset');
    document.documentElement.style.fontSize =
        settings.fontSize === 'small' ? '15px' :
        settings.fontSize === 'large' ? '19px' : '17px';
    document.body.classList.toggle('animations-off', !settings.animations);
}

// ===== Sound Toggle Logic =====
let isMuted = false;
if (dom.soundToggleBtn) {
    dom.soundToggleBtn.onclick = function() {
        isMuted = !isMuted;
        dom.soundToggleBtn.setAttribute('aria-pressed', isMuted);
        if (isMuted) {
            dom.volumeIcon.classList.add('hidden');
            dom.muteIcon.classList.remove('hidden');
            if (dom.soundTooltip) dom.soundTooltip.textContent = "Unmute Sound";
            muteAllAudio();
        } else {
            dom.volumeIcon.classList.remove('hidden');
            dom.muteIcon.classList.add('hidden');
            if (dom.soundTooltip) dom.soundTooltip.textContent = "Mute Sound";
            unmuteAllAudio();
        }
    };
}
function muteAllAudio() {
    document.querySelectorAll('audio').forEach(audio => { audio.muted = true; });
}
function unmuteAllAudio() {
    document.querySelectorAll('audio').forEach(audio => { audio.muted = false; });
}
function playSound(id) {
    if (isMuted || !settings.soundEffects) return;
    const sound = $(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(()=>{});
    }
}

// ===== UI Setup =====
function setupSettingsUI() {
    dom.fontSizeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.font === settings.fontSize));
    dom.themeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === settings.theme));
}
function setupProfileUI() {
    if (dom.displayNameInput && dom.usernameInput) {
        let debounce;
        dom.displayNameInput.addEventListener('input', function() {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                dom.usernameInput.value = generateUsername(dom.displayNameInput.value);
            }, 200);
        });
    }
}
