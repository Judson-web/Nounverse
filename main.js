// ====== Quiz Data ======
const quizQuestions = [
    // ... your quiz questions as before ...
    {
        question: "What is a group of lions called?",
        options: ["Pride", "Flock", "School", "Pack"],
        answer: 0,
        funFact: "A group of lions is called a 'pride' because they live together as a family group."
    },
    // ... (rest of your questions) ...
];

// ====== User Profile Data ======
const userProfile = {
    name: 'Guest',
    age: '-'
    // You can add more fields here
};

// ====== Quiz Logic ======
let current = 0, score = 0, streak = 0, timer = null;
let timeTotal = 20; // Default timer value, can be changed in settings

// ====== Sound State ======
let isMuted = false;

// ====== Settings Modal State ======
let pendingTimeTotal = timeTotal;
let pendingDarkMode = localStorage.getItem('darkMode') === 'true';

// ====== DOMContentLoaded ======
window.addEventListener('DOMContentLoaded', function() {
    // Apply dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    // Defensive: check for splash and quiz-content
    const splash = document.getElementById('splash-screen');
    const quizContent = document.getElementById('quiz-content');
    if (!splash || !quizContent) {
        alert('Required elements missing from HTML!');
        return;
    }
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

function showQuestion() {
    const scoreEl = document.getElementById('score');
    const streakEl = document.getElementById('streak');
    const currentQ = document.getElementById('current-question');
    const totalQ = document.getElementById('total-questions');
    const area = document.getElementById('question-area');
    if (!scoreEl || !streakEl || !currentQ || !totalQ || !area) return;

    const q = quizQuestions[current];
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    currentQ.textContent = current + 1;
    totalQ.textContent = quizQuestions.length;

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
    showFunFact(q.funFact);

    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showQuizEnd() {
    const area = document.getElementById('question-area');
    area.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
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
    const q = quizQuestions[current];
    const allBtns = document.querySelectorAll('.option-button');
    allBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    document.getElementById('streak').textContent = streak;
    playSound('wrong-sound');
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
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
const timerSettingInput = document.getElementById('timer-setting');
const saveSettingsBtn = document.getElementById('save-settings');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Keep track of pending (not-yet-applied) settings
if (settingsBtn && settingsModal) {
    settingsBtn.onclick = () => {
        // Set inputs to current (applied) values
        if (timerSettingInput) timerSettingInput.value = timeTotal;
        if (darkModeToggle) darkModeToggle.checked = document.body.classList.contains('dark');
        // Also update pending values
        pendingTimeTotal = timeTotal;
        pendingDarkMode = document.body.classList.contains('dark');
        settingsModal.classList.remove('hidden');
    };
}
if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.onclick = () => settingsModal.classList.add('hidden');
}
if (timerSettingInput) {
    timerSettingInput.addEventListener('input', function() {
        let val = parseInt(timerSettingInput.value, 10);
        if (!isNaN(val) && val >= 5 && val <= 60) {
            pendingTimeTotal = val;
        }
    });
}
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        pendingDarkMode = darkModeToggle.checked;
    });
}
if (saveSettingsBtn && settingsModal) {
    saveSettingsBtn.onclick = () => {
        // Apply timer
        timeTotal = pendingTimeTotal;
        // Apply dark mode
        if (pendingDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
        settingsModal.classList.add('hidden');
    };
}
// Optional: Close modal when clicking outside the box
settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
});

// ====== Sound Toggle Logic ======
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

// ====== Play Sound Helper ======
function playSound(id) {
    if (isMuted) return;
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}

// ====== Profile Modal Logic ======
const profileBtn = document.getElementById('profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeProfileBtn = document.getElementById('close-profile-modal');

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
profileModal?.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.add('hidden');
});

function updateProfileInfo() {
    document.getElementById('profile-name').textContent = userProfile.name || 'Guest';
    document.getElementById('profile-age').textContent = userProfile.age || '-';
    document.getElementById('profile-score').textContent = score;
    document.getElementById('profile-streak').textContent = streak;
}
