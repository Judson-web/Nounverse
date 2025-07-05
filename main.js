// ========== Quiz Data ==========
const quizQuestions = [
    {
        question: "What is a group of lions called?",
        options: ["Pride", "Flock", "School", "Pack"],
        answer: 0,
        funFact: "A group of lions is called a 'pride' because they live together as a family group."
    },
    {
        question: "What is a group of crows called?",
        options: ["Murder", "Gaggle", "Pod", "Swarm"],
        answer: 0,
        funFact: "A group of crows is called a 'murder'—the name comes from old folk tales and superstitions!"
    },
    {
        question: "What is a group of dolphins called?",
        options: ["Pod", "Troop", "Army", "Parliament"],
        answer: 0,
        funFact: "A group of dolphins is called a 'pod.' Dolphins are very social animals!"
    },
    {
        question: "What is a group of bees called?",
        options: ["Swarm", "Flock", "Herd", "Pack"],
        answer: 0,
        funFact: "A group of bees is called a 'swarm.' Swarms are usually seen when bees are searching for a new home."
    }
];

// ========== State ==========
let current = 0, score = 0, streak = 0, timer = null, timeTotal = 20;
let questionOrder = [];
let soundEnabled = true;
let funFactTimeout = null;

// ========== Sound Effects ==========
const playSound = (type) => {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    g.gain.value = 0.1;
    if (type === "correct") o.frequency.value = 660;
    else if (type === "incorrect") o.frequency.value = 220;
    else if (type === "streak") o.frequency.value = 880;
    o.type = "sine";
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 150);
};

// ========== Modal Logic ==========
function showModal(title, content) {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.removeAttribute('hidden');
    modalOverlay.classList.add('visible');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').innerHTML = content;
    // Trap focus in modal
    const focusable = modalOverlay.querySelectorAll('button, [tabindex="0"]');
    if (focusable.length) focusable[0].focus();
    document.getElementById('close-modal-btn').onclick = closeModal;
    modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
    document.addEventListener('keydown', trapFocusInModal);
}
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    modalOverlay.classList.remove('visible');
    modalOverlay.setAttribute('hidden', '');
    document.removeEventListener('keydown', trapFocusInModal);
}
function trapFocusInModal(e) {
    const modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay.classList.contains('visible')) return;
    if (e.key === "Escape") { closeModal(); return; }
    // Trap focus
    const focusable = modalOverlay.querySelectorAll('button, [tabindex="0"]');
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
            last.focus(); e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus(); e.preventDefault();
        }
    }
}

// ========== Splash and Initial Setup ==========
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('quiz-content').classList.remove('hidden');
        startQuiz();
    }, 900);

    // Header button modals
    document.getElementById('profile-btn').onclick = () =>
        showModal('Profile', `<p>Profile management coming soon!<br><br><strong>Name:</strong> Kid<br><strong>High Score:</strong> ${getHighScore()}</p>`);
    document.getElementById('open-settings').onclick = () =>
        showModal('Settings', `<p>
            <label><input type="checkbox" id="toggle-dark" disabled> Dark Mode (coming soon)</label><br>
            <label><input type="checkbox" id="toggle-large-font" disabled> Large Font (coming soon)</label>
        </p>`);
    document.getElementById('open-shop').onclick = () =>
        showModal('Shop', `<p>Shop and rewards coming soon!</p>`);
    document.getElementById('open-stickerbook').onclick = () =>
        showModal('Stickerbook', `<p>Your sticker collection will appear here!<br>(Feature coming soon.)</p>`);
    document.getElementById('daily-challenge-btn').onclick = () =>
        showModal('Daily Challenge', `<p>Daily challenge feature coming soon!</p>`);
    document.getElementById('parental-controls-btn').onclick = () =>
        showModal('Parental Controls', `<p>Parental controls will allow you to set quiz length, topics, and view progress reports. (Coming soon!)</p>`);

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
        soundBtn.onclick = () => {
            soundEnabled = !soundEnabled;
            const vol = document.getElementById('volume-icon');
            const mute = document.getElementById('mute-icon');
            if (vol && mute) {
                if (soundEnabled) {
                    vol.classList.remove('hidden');
                    mute.classList.add('hidden');
                    soundBtn.setAttribute('aria-pressed', 'false');
                    document.getElementById('sound-tooltip').textContent = "Mute Sound";
                } else {
                    vol.classList.add('hidden');
                    mute.classList.remove('hidden');
                    soundBtn.setAttribute('aria-pressed', 'true');
                    document.getElementById('sound-tooltip').textContent = "Unmute Sound";
                }
            }
        };
    }
});

// ========== Quiz Logic ==========
function startQuiz() {
    current = 0; score = 0; streak = 0;
    // Randomize question order
    questionOrder = shuffle(Array.from(Array(quizQuestions.length).keys()));
    updateScoreStreak();
    showQuestion();
}

function showQuestion() {
    clearTimeout(funFactTimeout);
    hideFunFact();
    const q = quizQuestions[questionOrder[current]];
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    updateStreakStars(streak);

    // Update question number
    const currentQ = document.getElementById('current-question');
    const totalQ = document.getElementById('total-questions');
    if (currentQ) currentQ.textContent = current + 1;
    if (totalQ) totalQ.textContent = quizQuestions.length;

    // Render question and options
    const area = document.getElementById('question-area');
    area.innerHTML = `
        <h2 class="mb-4 text-xl font-bold">${q.question}</h2>
        <div id="options-list" class="flex flex-col gap-3"></div>
    `;
    const opts = document.getElementById('options-list');
    // Shuffle options for each question
    const optionOrder = shuffle(Array.from(Array(q.options.length).keys()));
    optionOrder.forEach((idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = q.options[idx];
        btn.setAttribute('aria-label', q.options[idx]);
        btn.onclick = () => handleAnswer(idx, btn, optionOrder.indexOf(q.answer));
        opts.appendChild(btn);
    });

    startTimer(timeTotal);
}

function handleAnswer(idx, btn, correctBtnIdx) {
    clearInterval(timer);
    Array.from(document.querySelectorAll('.option-button')).forEach(b => b.disabled = true);
    const q = quizQuestions[questionOrder[current]];
    const correct = idx === q.answer;
    if (correct) {
        btn.classList.add('correct');
        score++; streak++;
        playSound("correct");
        if (streak > 1) playSound("streak");
    } else {
        btn.classList.add('incorrect');
        // Find the correct button and highlight it
        document.querySelectorAll('.option-button')[q.answer].classList.add('correct');
        streak = 0;
        playSound("incorrect");
    }
    updateScoreStreak();
    showFunFact(q.funFact);

    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showQuizEnd() {
    updateHighScore(score);
    const area = document.getElementById('question-area');
    area.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
        <p class="mb-2">Longest streak: <span class="font-bold">${getLongestStreak()}</span></p>
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
    if (timerText) timerText.textContent = `${timeLeft}s`;
    const fill = document.getElementById('timer-bar-fill');
    if (fill) {
        const percent = (timeLeft / total) * 100;
        fill.style.width = percent + '%';
        fill.classList.remove('warning', 'danger');
        if (timeLeft <= 5) fill.classList.add('danger');
        else if (timeLeft <= 10) fill.classList.add('warning');
    }
}
function handleTimeUp() {
    const q = quizQuestions[questionOrder[current]];
    Array.from(document.querySelectorAll('.option-button')).forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    playSound("incorrect");
    updateScoreStreak();
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}
function updateStreakStars(streakCount) {
    const stars = document.querySelectorAll('.streak-stars .star');
    stars.forEach((star, i) => {
        if (i < streakCount) star.classList.add('active');
        else star.classList.remove('active');
    });
}
function updateScoreStreak() {
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    updateStreakStars(streak);
    // Store for persistence
    localStorage.setItem('nv_high_score', Math.max(score, getHighScore()));
    localStorage.setItem('nv_longest_streak', Math.max(streak, getLongestStreak()));
}
function showFunFact(fact) {
    const box = document.getElementById('fun-fact-box');
    if (!fact) { hideFunFact(); return; }
    box.textContent = "Fun Fact: " + fact;
    box.classList.remove('hidden');
    funFactTimeout = setTimeout(hideFunFact, 1600);
}
function hideFunFact() {
    const box = document.getElementById('fun-fact-box');
    box.classList.add('hidden');
    box.textContent = '';
}

// ========== Utility Functions ==========
function shuffle(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function getHighScore() {
    return parseInt(localStorage.getItem('nv_high_score') || '0', 10);
}
function updateHighScore(newScore) {
    const old = getHighScore();
    if (newScore > old) localStorage.setItem('nv_high_score', newScore);
}
function getLongestStreak() {
    return parseInt(localStorage.getItem('nv_longest_streak') || '0', 10);
}

// ========== Accessibility: Keyboard Shortcuts ==========
window.addEventListener('keydown', function(e) {
    // Alt+S to open settings, Alt+P for profile, Alt+K for stickerbook, Alt+D for daily
    if (e.altKey && !e.repeat) {
        if (e.key.toLowerCase() === 's') { document.getElementById('open-settings').click(); }
        if (e.key.toLowerCase() === 'p') { document.getElementById('profile-btn').click(); }
        if (e.key.toLowerCase() === 'k') { document.getElementById('open-stickerbook').click(); }
        if (e.key.toLowerCase() === 'd') { document.getElementById('daily-challenge-btn').click(); }
    }
    // Alt+M toggles mute
    if (e.altKey && e.key.toLowerCase() === 'm') {
        document.getElementById('sound-toggle-btn').click();
    }
});
