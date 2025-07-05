// Utility function
function $(id) { return document.getElementById(id); }

// Quiz data
const quizQuestions = [
    { question: "What is a group of lions called?", options: ["Pride", "Flock", "School", "Pack"], answer: 0 },
    { question: "What is a group of crows called?", options: ["Murder", "Gaggle", "Pod", "Swarm"], answer: 0 },
    { question: "What is a group of dolphins called?", options: ["Pod", "Troop", "Army", "Parliament"], answer: 0 },
    { question: "What is a group of bees called?", options: ["Swarm", "Flock", "Herd", "Pack"], answer: 0 }
];

let current = 0, score = 0, streak = 0;

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        $('splash-screen').style.display = 'none';
        $('quiz-content').classList.remove('hidden');
        startQuiz();
    }, 1000);

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
    $('question-area').innerHTML = `
        <h2>${q.question}</h2>
        <div id="options-list"></div>
    `;
    const opts = $('options-list');
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(idx, btn);
        opts.appendChild(btn);
    });
}

function handleAnswer(idx, btn) {
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

    setTimeout(() => {
        current++;
        if (current < quizQuestions.length) showQuestion();
        else $('question-area').innerHTML = `<h2>Quiz Complete!</h2><p>Score: ${score}/${quizQuestions.length}</p>`;
    }, 1200);
}

function updateStreakStars(streakCount) {
    const stars = document.querySelectorAll('.streak-stars .star');
    stars.forEach((star, i) => {
        if (i < streakCount) star.classList.add('active');
        else star.classList.remove('active');
    });
}
