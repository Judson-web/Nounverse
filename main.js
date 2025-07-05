// ====== Quiz Data ======
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
    },
    {
        question: "What is a group of owls called?",
        options: ["Parliament", "Flock", "Colony", "Pack"],
        answer: 0,
        funFact: "A group of owls is called a 'parliament'—the name was popularized by C.S. Lewis in his books!"
    },
    {
        question: "What is a group of flamingos called?",
        options: ["Flamboyance", "Gaggle", "Herd", "Pod"],
        answer: 0,
        funFact: "A group of flamingos is called a 'flamboyance' because of their bright pink feathers."
    },
    {
        question: "What is a group of whales called?",
        options: ["Pod", "School", "Troop", "Murder"],
        answer: 0,
        funFact: "Whales travel in groups called 'pods' to communicate and protect each other."
    },
    {
        question: "What is a group of frogs called?",
        options: ["Army", "Swarm", "Pack", "Colony"],
        answer: 0,
        funFact: "A group of frogs is called an 'army' because they often move together in large numbers."
    },
    {
        question: "What is a group of kangaroos called?",
        options: ["Mob", "Pack", "Herd", "Troop"],
        answer: 0,
        funFact: "A group of kangaroos is called a 'mob'—they use this group for protection."
    },
    {
        question: "What is a group of ants called?",
        options: ["Colony", "Swarm", "Herd", "Pack"],
        answer: 0,
        funFact: "A group of ants is called a 'colony' because they live and work together underground."
    }
];

// ====== Quiz Logic ======
let current = 0, score = 0, streak = 0, timer = null;
let timeTotal = 20; // Default timer value, can be changed in settings

window.addEventListener('DOMContentLoaded', function() {
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

function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function showQuestion() {
    // Defensive: check for required elements
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

    // Render question and options
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
    } else {
        btn.classList.add('incorrect');
        allBtns[q.answer].classList.add('correct');
        streak = 0;
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

if (settingsBtn && settingsModal) {
    settingsBtn.onclick = () => {
        // Set current timer value in input
        if (timerSettingInput) timerSettingInput.value = timeTotal;
        settingsModal.classList.remove('hidden');
    };
}
if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.onclick = () => settingsModal.classList.add('hidden');
}
if (saveSettingsBtn && settingsModal) {
    saveSettingsBtn.onclick = () => {
        // Update timer duration
        if (timerSettingInput) {
            let val = parseInt(timerSettingInput.value, 10);
            if (!isNaN(val) && val >= 5 && val <= 60) {
                timeTotal = val;
            }
        }
        settingsModal.classList.add('hidden');
    };
}
// Optional: Close modal when clicking outside the box
settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
});
