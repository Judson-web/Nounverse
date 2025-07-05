// Utility Functions
function $(id) { return document.getElementById(id); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }
function debounce(fn, delay = 300) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
function safeParse(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        localStorage.removeItem(key);
        return fallback;
    }
}

// Modal Logic (Focus trap, Esc-close, one open at a time)
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
    // Focus trap
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

// Splash Screen Logic
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if ($('splash-screen')) $('splash-screen').style.display = 'none';
        if ($('quiz-content')) $('quiz-content').classList.add('hidden');
        showProfileSelection();
        showCookieBanner();
    }, 1000);
});

// Profile System
const avatarList = [
    "https://api.dicebear.com/6.x/personas/svg?seed=Cat",
    "https://api.dicebear.com/6.x/personas/svg?seed=Dog",
    "https://api.dicebear.com/6.x/personas/svg?seed=Fox",
    "https://api.dicebear.com/6.x/personas/svg?seed=Tiger",
    "https://api.dicebear.com/6.x/personas/svg?seed=Lion",
    "https://api.dicebear.com/6.x/personas/svg?seed=Rabbit"
];
const themeList = [
    { name: "Blue", color: "#3b82f6" },
    { name: "Green", color: "#22c55e" },
    { name: "Pink", color: "#ec4899" },
    { name: "Orange", color: "#f59e42" }
];
let profiles = safeParse('profiles', []);
let currentProfileIndex = Number(localStorage.getItem('currentProfileIndex'));
if (isNaN(currentProfileIndex) || currentProfileIndex < 0) currentProfileIndex = 0;

function showProfileSelection() {
    closeAllModals();
    openModal('profile-modal');
    renderProfileList();
    if ($('add-profile-btn')) $('add-profile-btn').onclick = showAddProfileModal;
    if ($('close-profile')) $('close-profile').onclick = () => closeAllModals();
}
function renderProfileList() {
    const profileList = $('profile-list');
    if (!profileList) return;
    profileList.innerHTML = '';
    if (profiles.length === 0) {
        profileList.innerHTML = `<div class="text-gray-500 text-center">No profiles yet. Add one!</div>`;
        return;
    }
    profiles.forEach((profile, idx) => {
        const div = document.createElement('div');
        div.className = 'profile-card' + (idx === currentProfileIndex ? ' selected-profile' : '');
        div.innerHTML = `
            <img src="${profile.avatar || avatarList[0]}" alt="User avatar">
            <span class="font-semibold">${profile.name}</span>
            <span class="profile-theme-sample" style="background:${profile.theme || themeList[0].color}"></span>
            <button class="delete-profile-btn" title="Delete Profile" aria-label="Delete Profile">&times;</button>
        `;
        div.onclick = () => selectProfile(idx);
        const delBtn = div.querySelector('.delete-profile-btn');
        if (delBtn) delBtn.onclick = (e) => { e.stopPropagation(); deleteProfile(idx); };
        profileList.appendChild(div);
    });
}
function showAddProfileModal() {
    closeAllModals();
    openModal('add-profile-modal');
    renderAvatarThemeChoices();
    if ($('add-profile-form')) {
        $('add-profile-form').onsubmit = function(e) {
            e.preventDefault();
            const name = $('profile-name-input') ? $('profile-name-input').value.trim() : '';
            if (!name) { alert("Please enter a name."); return; }
            const selectedAvatar = $q('input[name="avatar"]:checked');
            const selectedTheme = $q('input[name="theme"]:checked');
            profiles.push({
                name,
                avatar: avatarList[selectedAvatar ? selectedAvatar.value : 0],
                theme: themeList[selectedTheme ? selectedTheme.value : 0].color
            });
            localStorage.setItem('profiles', JSON.stringify(profiles));
            localStorage.setItem('currentProfileIndex', profiles.length - 1);
            closeAllModals();
            updateProfileHeader();
            startQuizAfterProfileSelection();
        };
    }
    if ($('cancel-add-profile')) {
        $('cancel-add-profile').onclick = function() {
            closeAllModals();
            showProfileSelection();
        };
    }
}
function renderAvatarThemeChoices() {
    const avatarListDiv = $('avatar-choose-list');
    if (avatarListDiv) {
        avatarListDiv.innerHTML = '';
        avatarList.forEach((url, i) => {
            const id = `avatar-radio-${i}`;
            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.className = 'avatar-choose-img';
            label.innerHTML = `<input type="radio" name="avatar" id="${id}" value="${i}" class="sr-only" ${i === 0 ? 'checked' : ''}>
                <img src="${url}" alt="Avatar ${i+1}" class="rounded-full border-2 border-gray-300 cursor-pointer">`;
            avatarListDiv.appendChild(label);
        });
    }
    const themeListDiv = $('theme-choose-list');
    if (themeListDiv) {
        themeListDiv.innerHTML = '';
        themeList.forEach((t, i) => {
            const id = `theme-radio-${i}`;
            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.className = 'theme-choose-sample';
            label.innerHTML = `<input type="radio" name="theme" id="${id}" value="${i}" class="sr-only" ${i === 0 ? 'checked' : ''}>
                <span style="background:${t.color}; display:inline-block; width:28px; height:28px; border-radius:50%;"></span>`;
            themeListDiv.appendChild(label);
        });
    }
}
function selectProfile(idx) {
    currentProfileIndex = idx;
    localStorage.setItem('currentProfileIndex', idx);
    closeAllModals();
    updateProfileHeader();
    startQuizAfterProfileSelection();
}
function deleteProfile(idx) {
    profiles.splice(idx, 1);
    if (profiles.length === 0) {
        currentProfileIndex = 0;
        localStorage.removeItem('profiles');
        localStorage.removeItem('currentProfileIndex');
        updateProfileHeader();
        showProfileSelection();
        return;
    }
    if (currentProfileIndex >= profiles.length) currentProfileIndex = 0;
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('currentProfileIndex', currentProfileIndex);
    renderProfileList();
}
function updateProfileHeader() {
    const profile = profiles[currentProfileIndex];
    if ($('profile-avatar')) {
        $('profile-avatar').style.backgroundImage = profile?.avatar
            ? `url('${profile.avatar}')`
            : `url('${avatarList[0]}')`;
        $('profile-avatar').style.backgroundSize = 'cover';
    }
    if ($('profile-name')) $('profile-name').textContent = profile?.name || 'Profile';
}
function startQuizAfterProfileSelection() {
    if ($('splash-screen')) $('splash-screen').style.display = 'none';
    if ($('quiz-content')) $('quiz-content').classList.remove('hidden');
    startQuiz();
}

// Quiz Logic
const quizQuestions = [
    {
        question: "What is a group of lions called?",
        options: ["Pride", "Flock", "School", "Pack"],
        answer: 0,
        animal: "Lion"
    },
    {
        question: "What is a group of crows called?",
        options: ["Murder", "Gaggle", "Pod", "Swarm"],
        answer: 0,
        animal: "Crow"
    },
    {
        question: "What is a group of dolphins called?",
        options: ["Pod", "Troop", "Army", "Parliament"],
        answer: 0,
        animal: "Dolphin"
    },
    {
        question: "What is a group of bees called?",
        options: ["Swarm", "Flock", "Herd", "Pack"],
        answer: 0,
        animal: "Bee"
    }
];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timerInterval = null;
const QUESTION_TIME = 20; // seconds

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
    if ($('score')) {
        $('score').textContent = score;
        $('score').setAttribute('aria-live', 'polite');
    }
    if ($('streak')) {
        $('streak').textContent = streak;
        $('streak').setAttribute('aria-live', 'polite');
    }
    updateStreakStars();

    // Render question and options
    const questionArea = $('question-area');
    if (!questionArea) return;
    questionArea.innerHTML = `
        <h2 class="text-xl font-bold mb-4">${q.question}</h2>
        <div id="options-list" class="mb-4"></div>
        <div class="flex justify-between items-center">
            <button id="hint-button" class="px-3 py-1 rounded" aria-label="Get a hint">Hint (2 🪙)</button>
            <button id="next-btn" class="bg-blue-500 text-white px-4 py-2 rounded hidden" aria-label="Next question">Next</button>
        </div>
    `;

    // Render options as real buttons (event delegation)
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

    // Setup hint button
    const hintBtn = $('hint-button');
    if (hintBtn) hintBtn.onclick = showHint;

    // Start timer
    startTimer(QUESTION_TIME);
}
function handleOptionClick(selectedIdx, btn) {
    clearInterval(timerInterval);
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
    if ($('next-btn')) {
        $('next-btn').classList.remove('hidden');
        $('next-btn').onclick = nextQuestion;
    }
    if ($('hint-button')) $('hint-button').disabled = true;
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

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI(timeLeft, seconds);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
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
    if ($('next-btn')) {
        $('next-btn').classList.remove('hidden');
        $('next-btn').onclick = nextQuestion;
    }
    if ($('hint-button')) $('hint-button').disabled = true;
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

// Hint System
function showHint() {
    const q = quizQuestions[currentQuestion];
    const optionButtons = $qa('.option-button');
    let availableWrongOptions = [];
    optionButtons.forEach((btn, idx) => {
        if (idx !== q.answer && !btn.disabled) availableWrongOptions.push(idx);
    });
    availableWrongOptions.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(2, availableWrongOptions.length); i++) {
        const wrongIdx = availableWrongOptions[i];
        optionButtons[wrongIdx].classList.add('disabled');
        optionButtons[wrongIdx].disabled = true;
    }
    if ($('hint-button')) $('hint-button').disabled = true;
}

// Cookie Banner
function showCookieBanner() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const banner = $('cookie-banner');
        if (banner) {
            banner.classList.add('show');
            banner.classList.remove('hidden');
            const acceptBtn = $('accept-cookies');
            if (acceptBtn) {
                acceptBtn.onclick = () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    banner.classList.remove('show');
                };
            }
        }
    }
}
