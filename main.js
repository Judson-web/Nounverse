// Utility functions
function $(id) { return document.getElementById(id); }
function $q(sel) { return document.querySelector(sel); }
function $qa(sel) { return document.querySelectorAll(sel); }

// Modal logic: open, close, focus trap
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

// Attach header button listeners after DOM is ready
window.addEventListener('DOMContentLoaded', function() {
    $('profile-btn')?.addEventListener('click', () => openModal('profile-modal'));
    $('open-settings')?.addEventListener('click', () => openModal('settings-modal'));
    $('open-shop')?.addEventListener('click', () => openModal('shop-modal'));
    $('open-stickerbook')?.addEventListener('click', () => openModal('stickerbook-modal'));
    $('daily-challenge-btn')?.addEventListener('click', () => openModal('daily-challenge-modal'));
    // Example: Close modal buttons
    $qa('.modal-overlay .btn-modal, .modal-overlay [id^="close-"]').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    // Optionally: Cookie banner accept
    $('accept-cookies')?.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        $('cookie-banner')?.classList.remove('show');
    });
});

// Quiz option buttons: event delegation (re-attach after each render)
function renderQuizOptions(options) {
    const optionsList = $('options-list');
    if (!optionsList) return;
    optionsList.innerHTML = '';
    options.forEach((opt, idx) => {
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

// Example quiz logic (replace with your actual logic)
function handleOptionClick(idx, btn) {
    // Example: disable all option buttons after click
    $qa('.option-button').forEach(b => b.disabled = true);
    btn.classList.add('correct');
    // Show next button, update score, etc.
}

// Example: show cookie banner if not accepted
function showCookieBanner() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const banner = $('cookie-banner');
        if (banner) banner.classList.add('show');
    }
}

// Call this after quiz render
// renderQuizOptions(['Pride', 'Flock', 'School', 'Pack']);

showCookieBanner();
