// Your quizQuestions array here...

let current = 0, score = 0, streak = 0, timer = null, timeTotal = 20;

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('quiz-content').classList.remove('hidden');
        startQuiz();
    }, 900);
});

function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[current];
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;

    // Update question number
    document.getElementById('current-question').textContent = current + 1;
    document.getElementById('total-questions').textContent = quizQuestions.length;

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
    showFunFact(q.funFact);
    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else showQuizEnd();
    }, 1800);
}

function showFunFact(fact) {
    const box = document.getElementById('fun-fact-box');
    if (!fact) { hideFunFact(); return; }
    box.textContent = "Fun Fact: " + fact;
    box.classList.remove('hidden');
    setTimeout(hideFunFact, 1600);
}
function hideFunFact() {
    const box = document.getElementById('fun-fact-box');
    box.classList.add('hidden');
    box.textContent = '';
}
