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
    setTimeout(function() {
        splash.style.display = 'none';
        quizContent.classList.remove('hidden');
        startQuiz();
    }, 900);
});

// ====== Quiz Functions ======
function startQuiz() {
    current = 0;
    score = 0;
    streak = 0;
    showQuestion();
}

function getQuizSet() {
    if (settings.quizLength === 'all' || settings.quizLength >= quizQuestions.length) {
        return quizQuestions.slice();
    }
    var shuffled = quizQuestions.slice().sort(function() { return Math.random() - 0.5; });
    return shuffled.slice(0, Number(settings.quizLength));
}

let quizSet = [];
function showQuestion() {
    if (current === 0) quizSet = getQuizSet();
    var scoreEl = document.getElementById('score');
    var streakEl = document.getElementById('streak');
    var currentQ = document.getElementById('current-question');
    var totalQ = document.getElementById('total-questions');
    var area = document.getElementById('question-area');
    if (!scoreEl || !streakEl || !currentQ || !totalQ || !area) return;

    var q = quizSet[current];
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    currentQ.textContent = current + 1;
    totalQ.textContent = quizSet.length;

    area.innerHTML = '<h2 class="mb-4 text-xl font-bold">' + q.question + '</h2>' +
        '<div id="options-list" class="flex flex-col gap-3"></div>';
    var opts = document.getElementById('options-list');
    q.options.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = opt;
        btn.setAttribute('aria-label', opt);
        btn.onclick = function() { handleAnswer(idx, btn); };
        opts.appendChild(btn);
    });

    startTimer(timeTotal);
}

function handleAnswer(idx, btn) {
    clearInterval(timer);
    var q = quizSet[current];
    var allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach(function(b) { b.disabled = true; });
    if (idx === q.answer) {
        btn.classList.add('correct');
        score++;
        streak++;
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

    setTimeout(function() {
        current++;
        if (current < quizSet.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showQuizEnd() {
    var area = document.getElementById('question-area');
    area.innerHTML =
        '<h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>' +
        '<p class="mb-2">Your score: <span class="font-bold">' + score + '</span>/' + quizSet.length + '</p>' +
        '<button id="restart-btn" class="option-button" style="width:auto;min-width:120px;">Play Again</button>';
    document.getElementById('timer-text').textContent = '';
    document.getElementById('timer-bar-fill').style.width = '0%';
    document.getElementById('restart-btn').onclick = function() { startQuiz(); };
    hideFunFact();
}

function startTimer(seconds) {
    var timeLeft = seconds;
    updateTimerUI(timeLeft, seconds);
    if (timer) clearInterval(timer);
    timer = setInterval(function() {
        timeLeft--;
        updateTimerUI(timeLeft, seconds);
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerUI(timeLeft, total) {
    var timerText = document.getElementById('timer-text');
    var fill = document.getElementById('timer-bar-fill');
    if (timerText) timerText.textContent = timeLeft + 's';
    if (fill) {
        var percent = (timeLeft / total) * 100;
        fill.style.width = percent + '%';
        fill.classList.remove('warning', 'danger');
        if (timeLeft <= 5) fill.classList.add('danger');
        else if (timeLeft <= 10) fill.classList.add('warning');
    }
}

function handleTimeUp() {
    var q = quizSet[current];
    var allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach(function(btn, idx) {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    document.getElementById('streak').textContent = streak;
    updateProfileStatsLive();
    playSound('wrong-sound');
    showFunFact(q.funFact);
    setTimeout(function() {
        current++;
        if (current < quizSet.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showFunFact(fact) {
    var box = document.getElementById('fun-fact-box');
    if (!box) return;
    if (!fact) { hideFunFact(); return; }
    box.textContent = "Fun Fact: " + fact;
    box.classList.remove('hidden');
    setTimeout(hideFunFact, 1600);
}

function hideFunFact() {
    var box = document.getElementById('fun-fact-box');
    if (!box) return;
    box.classList.add('hidden');
    box.textContent = '';
}

// ====== Settings Modal Logic ======
var settingsBtn = document.getElementById('open-settings');
var settingsModal = document.getElementById('settings-modal');
var closeSettingsBtn = document.getElementById('close-settings-modal');
var saveSettingsBtn = document.getElementById('save-settings');
var resetProgressBtn = document.getElementById('reset-progress-btn');
var settingsForm = document.getElementById('settings-form');

var soundEffectsToggle = document.getElementById('sound-effects-toggle');
var fontSizeBtns = document.querySelectorAll('.toggle-btn[data-font]');
var quizLengthSetting = document.getElementById('quiz-length-setting');
var themeBtns = document.querySelectorAll('.theme-btn');
var languageSetting = document.getElementById('language-setting');
var animationsToggle = document.getElementById('animations-toggle');

if (settingsBtn && settingsModal) {
    settingsBtn.onclick = function() {
        soundEffectsToggle.checked = settings.soundEffects;
        fontSizeBtns.forEach(function(btn) { btn.classList.toggle('active', btn.dataset.font === settings.fontSize); });
        quizLengthSetting.value = settings.quizLength;
        themeBtns.forEach(function(btn) { btn.classList.toggle('active', btn.dataset.theme === settings.theme); });
        languageSetting.value = settings.language;
        animationsToggle.checked = settings.animations;
        settingsModal.classList.remove('hidden');
    };
}
if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.onclick = function() { settingsModal.classList.add('hidden'); };
}
if (settingsModal) {
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
}

fontSizeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        fontSizeBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        settings.fontSize = btn.dataset.font;
    });
});

themeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        themeBtns.forEach(function(b) { b.classList.remove('active'); });
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
    resetProgressBtn.onclick = function() {
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
var isMuted = false;
var soundToggleBtn = document.getElementById('sound-toggle-btn');
var volumeIcon = document.getElementById('volume-icon');
var muteIcon = document.getElementById('mute-icon');
var soundTooltip = document.getElementById('sound-tooltip');

if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function() {
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
    document.querySelectorAll('audio').forEach(function(audio) {
        audio.muted = true;
    });
}
function unmuteAllAudio() {
    document.querySelectorAll('audio').forEach(function(audio) {
        audio.muted = false;
    });
}
function playSound(id) {
    if (isMuted || !settings.soundEffects) return;
    var sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(function(){});
    }
}

// ====== Profile Modal Logic ======
var profileModal = document.getElementById('profile-modal');
var profileBtn = document.getElementById('profile-btn');
var closeProfileBtn = document.getElementById('close-profile-modal');
var profileForm = document.getElementById('profile-form');
var cancelProfileEdit = document.getElementById('cancel-profile-edit');
var profileNameInput = document.getElementById('profile-name-input');
var profileAgeInput = document.getElementById('profile-age-input');
var profileScore = document.getElementById('profile-score');
var profileStreak = document.getElementById('profile-streak');
var profileAvatar = document.getElementById('profile-avatar');
var editAvatarBtn = document.getElementById('edit-avatar-btn');
var avatarUpload = document.getElementById('avatar-upload');

if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', function() {
        updateProfileInfo();
        profileModal.classList.remove('hidden');
    });
}
if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', function() {
        profileModal.classList.add('hidden');
    });
}
if (cancelProfileEdit && profileModal) {
    cancelProfileEdit.addEventListener('click', function() {
        profileModal.classList.add('hidden');
    });
}
if (profileModal) {
    profileModal.addEventListener('click', function(e) {
        if (e.target === profileModal) profileModal.classList.add('hidden');
    });
}

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
    editAvatarBtn.addEventListener('click', function() { avatarUpload.click(); });
    avatarUpload.addEventListener('change', function() {
        var file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            var reader = new FileReader();
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
    fontSizeBtns.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.font === settings.fontSize);
    });
    themeBtns.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.theme === settings.theme);
    });
}
