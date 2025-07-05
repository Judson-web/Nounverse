// Utility functions
function $(id) { return document.getElementById(id); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }

// Quiz data (sample)
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

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timer = null;
const QUESTION_TIME = 20;

// Splash screen logic
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if ($('splash-screen')) $('splash-screen').style.display = 'none';
        if ($('quiz-content')) $('quiz-content').classList.remove('hidden');
        startQuiz();
        showCookieBanner();
    }, 1000);

    // Header buttons
    $('profile-btn')?.addEventListener('click', () => openModal('profile-modal'));
    $('open-settings')?.addEventListener('click', () => openModal('settings-modal'));
    $('open-shop')?.addEventListener('click', () => openModal('shop-modal'));
    $('open-stickerbook')?.addEventListener('click', () => openModal('stickerbook-modal'));
    $('daily-challenge-btn')?.addEventListener('click', () => openModal('daily-challenge-modal'));

    // Close modal buttons
    $qa('.modal-overlay .btn-modal, .modal-overlay [id^="close-"]').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Cookie banner accept
    $('accept-cookies')?.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        $('cookie-banner')?.classList.remove('show');
    });
});

// Modal logic
function openModal(id) {
    closeAllModals();
    const modal = $(id);
    if (modal) {
        modal.classList.add('visible');
        setTimeout(() => {
            const first = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (first) first.focus();
        }, 50);
    }
}
function closeAllModals() {
    $qa('.modal-overlay.visible').forEach(m => m.classList.remove('visible'));
}
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeAllModals();
    // Focus trap for open modal
    const openModalEl = $q('.modal-overlay.visible .modal-content');
    if (openModalEl && (e.key === "Tab" || e.keyCode === 9)) {
        const focusable = openModalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
});

// Cookie banner
function showCookieBanner() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const banner = $('cookie-banner');
        if (banner) banner.classList.add('show');
    }
}

// Quiz logic
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quizQuestions[currentQuestion];
    if ($('current-question')) $('current-question').textContent = currentQuestion + 1;
    if ($('total-questions')) $('total-questions').textContent = quizQuestions.length;
    if ($('score')) $('score').textContent = score;
    if ($('streak')) $('streak').textContent = streak;
    updateStreakStars();

    // Render question and options
    const questionArea = $('question-area');
    if (!questionArea) return;
    questionArea.innerHTML = `
        <h2 class="text-xl font-bold mb-4">${q.question}</h2>
        <div id="options-list" class="mb-4"></div>
        <div class="flex justify-end">
            <button id="next-btn" class="bg-blue-500 text-white px-4 py-2 rounded hidden" aria-label="Next question">Next</button>
        </div>
    `;

    // Render options
    const optionsList = $('options-list');
    if (optionsList) {
        optionsList.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'option-button w-full mb-2 py-2 px-3 rounded';
            btn.textContent = opt;
            btn.setAttribute('aria-label', opt);
            btn.dataset.idx = idx;
            optionsList.appendChild(btn);
        });
        optionsList.onclick = function(e) {
            if (e.target.classList.contains('option-button') && !e.target.disabled) {
                handleOptionClick(Number(e.target.dataset.idx), e.target);
            }
        };
    }

    // Next button
    if ($('next-btn')) {
        $('next-btn').onclick = nextQuestion;
    }

    // Timer
    startTimer(QUESTION_TIME);
}

function handleOptionClick(selectedIdx, btn) {
    clearInterval(timer);
    const q = quizQuestions[currentQuestion];
    const optionButtons = $qa('.option-button');
    optionButtons.forEach(b => b.disabled = true);

    if (selectedIdx === q.answer) {
        btn.classList.add('correct');
        score++;
        streak++;
    } else {
        btn.classList.add('incorrect');
        optionButtons[q.answer].classList.add('correct');
        streak = 0;
    }

    if ($('score')) $('score').textContent = score;
    if ($('streak')) $('streak').textContent = streak;
    updateStreakStars();

    if ($('next-btn')) $('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        renderQuizQuestion();
    } else {
        showQuizEnd();
    }
}

function showQuizEnd() {
    const questionArea = $('question-area');
    if (!questionArea) return;
    questionArea.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p class="mb-2">Your score: <span class="font-bold">${score}</span>/${quizQuestions.length}</p>
        <button id="restart-btn" class="bg-green-500 text-white px-4 py-2 rounded">Play Again</button>
    `;
    if ($('timer-text')) $('timer-text').textContent = '';
    if ($('timer-bar-fill')) $('timer-bar-fill').style.width = '0%';
    const restartBtn = $('restart-btn');
    if (restartBtn) restartBtn.onclick = () => startQuiz();
}

// Timer and Progress Bar
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
        if (timeLeft <= 5) {
            fill.classList.add('danger');
        } else if (timeLeft <= 10) {
            fill.classList.add('warning');
        }
    }
}
function handleTimeUp() {
    const q = quizQuestions[currentQuestion];
    const optionButtons = $qa('.option-button');
    optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    streak = 0;
    if ($('streak')) $('streak').textContent = streak;
    updateStreakStars();
    if ($('next-btn')) $('next-btn').classList.remove('hidden');
}

// Streak Stars
function updateStreakStars() {
    const stars = $qa('.streak-stars .star');
    for (let i = 0; i < stars.length; i++) {
        if (i < streak) {
            stars[i].classList.add('active');
        } else {
            stars[i].classList.remove('active');
        }
    }
}
