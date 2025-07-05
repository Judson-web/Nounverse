function $(id) { return document.getElementById(id); }

const quizQuestions = [
    { question: "What is a group of lions called?", options: ["Pride", "Flock", "School", "Pack"], answer: 0 },
    { question: "What is a group of crows called?", options: ["Murder", "Gaggle", "Pod", "Swarm"], answer: 0 },
    { question: "What is a group of dolphins called?", options: ["Pod", "Troop", "Army", "Parliament"], answer: 0 },
    { question: "What is a group of bees called?", options: ["Swarm", "Flock", "Herd", "Pack"], answer: 0 }
];

let current = 0, score = 0, streak = 0, timer = null, timeTotal = 20;

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        $('splash-screen').style.display = 'none';
        $('quiz-content').classList.remove('hidden');
        startQuiz();
    }, 900);

    // Example modal triggers (replace alert with modal logic as needed)
    $('profile-btn').onclick = () => alert('Profile modal');
    $('open-settings').onclick = () => alert('Settings modal');
    $('open-shop').onclick = () => alert('Shop modal');
    $('open-stickerbook').onclick = () => alert('Stickerbook modal');
    $('daily-challenge-btn').onclick = () => alert('Daily Challenge modal');
});

function startQuiz() {
    current = 0; score = 0; streak = 0;
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[current];
    $('score').textContent = score;
    $('streak').textContent = streak;
    updateStreakStars(streak);
    if ($('current-question')) $('current-question').textContent = current + 1;
    if ($('total-questions')) $('total-questions').textContent = quizQuestions.length;
    $('question-area').innerHTML = `
        <h2 class="mb-3">${q.question}</h2>
        <div id="options-list"></div>
        <div class="flex justify-end">
            <button id="next-btn" class="option-button hidden" style="width:auto;min-width:120px;">Next</button>
        </div>
    `;
    const opts = $('options-list');
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(idx, btn);
        opts.appendChild(btn);
    });
    $('next-btn').onclick = nextQuestion;
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
    $('score').textContent = score;
    $('streak').textContent = streak;
    updateStreakStars(streak);
    $('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    current++;
    if (current < quizQuestions.length) showQuestion();
    else showQuizEnd();
}

function showQuizEnd() {
    $('question-area').innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
        <button id="restart-btn" class="option-button" style="width:auto;min-width:120px;">Play Again</button>
    `;
    $('timer-text').textContent = '';
    $('timer-bar-fill').style.width = '0%';
    $('restart-btn').onclick = () => startQuiz();
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
    if ($('timer-text')) $('timer-text').textContent = `${timeLeft}s`;
    const fill = $('timer-bar-fill');
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
    $('streak').textContent = streak;
    updateStreakStars(streak);
    $('next-btn').classList.remove('hidden');
}

function updateStreakStars(streakCount) {
    const stars = document.querySelectorAll('.streak-stars .star');
    stars.forEach((star, i) => {
        if (i < streakCount) star.classList.add('active');
        else star.classList.remove('active');
    });
}
