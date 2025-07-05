// Quiz data
const quizQuestions = [
    {
        question: "What is a group of lions called?",
        options: ["Pride", "Flock", "School", "Pack"],
        answer: 0
    },
    {
        question: "What is a group of crows called?",
        options: ["Murder", "Gaggle", "Pod", "Swarm"],
        answer: 0
    },
    {
        question: "What is a group of dolphins called?",
        options: ["Pod", "Troop", "Army", "Parliament"],
        answer: 0
    },
    {
        question: "What is a group of bees called?",
        options: ["Swarm", "Flock", "Herd", "Pack"],
        answer: 0
    }
];

let current = 0, score = 0, streak = 0, timer = null, timeTotal = 20;

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('quiz-content').classList.remove('hidden');
        startQuiz();
    }, 1000);

    // Example: Sound toggle (if you wish to implement)
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
        soundBtn.onclick = () => {
            const vol = document.getElementById('volume-icon');
            const mute = document.getElementById('mute-icon');
            if (vol.classList.contains('hidden')) {
                vol.classList.remove('hidden');
                mute.classList.add('hidden');
                document.getElementById('sound-tooltip').textContent = "Mute Sound";
            } else {
                vol.classList.add('hidden');
                mute.classList.remove('hidden');
                document.getElementById('sound-tooltip').textContent = "Unmute Sound";
            }
        };
    }
});

function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[current];
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
    Array.from(document.querySelectorAll('.option-button')).forEach(b => b.disabled = true);
    if (idx === q.answer) {
        btn.classList.add('correct');
        score++; streak++;
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.option-button')[q.answer].classList.add('correct');
        streak = 0;
    }
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    updateStreakStars(streak);

    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1200);
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
    const q = quizQuestions[current];
    Array.from(document.querySelectorAll('.option-button')).forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    document.getElementById('streak').textContent = streak;
    updateStreakStars(streak);
    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1200);
}
function updateStreakStars(streakCount) {
    const stars = document.querySelectorAll('.streak-stars .star');
    stars.forEach((star, i) => {
        if (i < streakCount) star.classList.add('active');
        else star.classList.remove('active');
    });
}
