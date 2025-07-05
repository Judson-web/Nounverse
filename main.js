// ====== User Profile Data ======
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Guest',
    age: '',
    avatar: 'https://mui.com/static/images/avatar/1.jpg'
};

// ====== Settings Defaults ======
let settings = JSON.parse(localStorage.getItem('settings')) || {
    soundEffects: true,
    fontSize: 'medium',
    quizLength: 10,
    theme: '', // '' means default (light)
    language: 'en',
    animations: true
};

// ====== Quiz Data ======
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

// ====== Quiz State ======
let current = 0, score = 0, streak = 0, timer = null;
let timeTotal = 20;

// ====== DOMContentLoaded ======
window.addEventListener('DOMContentLoaded', function() {
    applySettings();
    updateProfileInfo();
    setupSettingsUI();
    const splash = document.getElementById('splash-screen');
    const quizContent = document.getElementById('quiz-content');
    setTimeout(() => {
        splash.style.display = 'none';
        quizContent.classList.remove('hidden');
        startQuiz();
    }, 900);
});

// ====== Quiz Functions ======
function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function getQuizSet() {
    if (settings.quizLength === 'all' || settings.quizLength >= quizQuestions.length) {
        return [...quizQuestions];
    }
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Number(settings.quizLength));
}

let quizSet = [];
function showQuestion() {
    if (current === 0) quizSet = getQuizSet();
    const scoreEl = document.getElementById('score');
    const streakEl = document.getElementById('streak');
    const currentQ = document.getElementById('current-question');
    const totalQ = document.getElementById('total-questions');
    const area = document.getElementById('question-area');
    if (!scoreEl || !streakEl || !currentQ || !totalQ || !area) return;

    const q = quizSet[current];
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    currentQ.textContent = current + 1;
    totalQ.textContent = quizSet.length;

    area.innerHTML = `
        <h2 class="mb-4 text-xl font-bold">${q.question}</h2>
        <div id="options-list" class="flex flex-col gap-3"></div>
    `;
    const opts = document.getElementById('options-list');
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
    updateProfileStatsLive();
    showFunFact(q.funFact);

    setTimeout(() => {
        current++;
        if (current < quizSet.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showQuizEnd() {
    const area = document.getElementById('question-area');
    area.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizSet.length}</p>
        <button id="restart-btn" class="option-button" style="width:auto;min-width:120px;">Play Again</button>
    `;
    document.getElementById('timer-text').textContent = '';
    document.getElementById('timer-bar-fill').style.width = '0%';
    document.getElementById('restart-btn').onclick = () => startQuiz();
    hideFunFact();
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
    const timerText = document.getElementById('timer-text');
    const fill = document.getElementById('timer-bar-fill');
    if (timerText) timerText.textContent = `${timeLeft}s`;
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
    const allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    document.getElementById('streak').textContent = streak;
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
    const box = document.getElementById('fun-fact-box');
    if (!box) return;
    if (!fact) { hideFunFact(); return; }
    box.textContent = "Fun Fact: " + fact;
    box.classList.remove('hidden');
    setTimeout(hideFunFact, 1600);
}
function hideFunFact() {
    const box = document.getElementById('fun-fact-box');
    if (!box) return;
    box.classList.add('hidden');
    box.textContent = '';
}

// ====== Settings Modal Logic ======
const settingsBtn = document.getElementById('open-settings');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-modal');
const saveSettingsBtn = document.getElementById('save-settings');
const resetProgressBtn = document.getElementById('reset-progress-btn');
const settingsForm = document.getElementById('settings-form');

const soundEffectsToggle = document.getElementById('sound-effects-toggle');
const fontSizeBtns = document.querySelectorAll('.toggle-btn[data-font]');
const quizLengthSetting = document.getElementById('quiz-length-setting');
const themeBtns = document.querySelectorAll('.theme-btn');
const languageSetting = document.getElementById('language-setting');
const animationsToggle = document.getElementById('animations-toggle');

if (settingsBtn && settingsModal) {
    settingsBtn.onclick = () => {
        soundEffectsToggle.checked = settings.soundEffects;
        fontSizeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.font === settings.fontSize));
        quizLengthSetting.value = settings.quizLength;
        themeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === settings.theme));
        languageSetting.value = settings.language;
        animationsToggle.checked = settings.animations;
        settingsModal.classList.remove('hidden');
    };
}
if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.onclick = () => settingsModal.classList.add('hidden');
}
settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
});

fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fontSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.fontSize = btn.dataset.font;
    });
});

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.theme = btn.dataset.theme;
    });
});

if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        settings.soundEffects = soundEffectsToggle.checked;
        settings.quizLength = quizLengthSetting.value;
        settings.language = languageSetting.value;
        settings.animations = animationsToggle.checked;
        localStorage.setItem('settings', JSON.stringify(settings));
        applySettings();
        settingsModal.classList.add('hidden');
        startQuiz();
    });
}

if (resetProgressBtn) {
    resetProgressBtn.onclick = () => {
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

// ====== Sound Toggle Logic ======
let isMuted = false;
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
const soundTooltip = document.getElementById('sound-tooltip');

if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        soundToggleBtn.setAttribute('aria-pressed', isMuted);

        if (isMuted) {
            volumeIcon.classList.add('hidden');
            muteIcon.classList.remove('hidden');
            if (soundTooltip) soundTooltip.textContent = "Unmute Sound";
            muteAllAudio();
        } else {
            volumeIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
            if (soundTooltip) soundTooltip.textContent = "Mute Sound";
            unmuteAllAudio();
        }
    });
}
function muteAllAudio() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = true;
    });
}
function unmuteAllAudio() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.muted = false;
    });
}
function playSound(id) {
    if (isMuted || !settings.soundEffects) return;
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(()=>{});
    }
}

// ====== Profile Modal Logic ======
const profileModal = document.getElementById('profile-modal');
const profileBtn = document.getElementById('profile-btn');
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

function updateProfileInfo() {
    if (profileNameInput) profileNameInput.value = userProfile.name || '';
    if (profileAgeInput) profileAgeInput.value = userProfile.age || '';
    if (profileScore) profileScore.textContent = score;
    if (profileStreak) profileStreak.textContent = streak;
    if (profileAvatar) profileAvatar.src = userProfile.avatar || 'https://mui.com/static/images/avatar/1.jpg';
}

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

if (editAvatarBtn && avatarUpload) {
    editAvatarBtn.addEventListener('click', () => avatarUpload.click());
    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userProfile.avatar = e.target.result;
                if (profileAvatar) profileAvatar.src = userProfile.avatar;
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateProfileStatsLive() {
    if (profileModal && !profileModal.classList.contains('hidden')) {
        if (profileScore) profileScore.textContent = score;
        if (profileStreak) profileStreak.textContent = streak;
    }
}

// ====== Settings UI Setup (for toggles/buttons) ======
function setupSettingsUI() {
    fontSizeBtns.forEach(btn => {
        btn.classList.toggle('active
