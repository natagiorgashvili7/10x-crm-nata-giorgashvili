function checkAuthGuard() {
    const session = localStorage.getItem('crm_session');

    // Get just the filename from the URL, e.g. "index.html"
    const currentPage = window.location.pathname.split('/').pop();

    const protectedPages = ['dashboard.html', 'clients.html', 'profile.html'];
    const publicAuthPages = ['index.html', 'signup.html'];

    // No session, trying to view a protected page -> bounce to login
    if (protectedPages.includes(currentPage) && !session) {
        window.location.href = 'index.html';
    }

    // Already logged in, but on login/signup -> bounce to dashboard
    if (publicAuthPages.includes(currentPage) && session) {
        window.location.href = 'dashboard.html';
    }
}

checkAuthGuard();


// ===== Login form logic =====

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Clear old errors before re-validating
    clearError('loginEmail');
    clearError('loginPassword');

    let isValid = true;

    // --- Email: just needs to be non-empty here (format was already ---
    // --- enforced at signup time, so we don't re-check the pattern) ---
    if (email.trim() === '') {
        showError('loginEmail', 'Email is required');
        isValid = false;
    }

    // --- Password: just needs to be non-empty ---
    if (password === '') {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // --- Look for a matching user ---
    const emailValue = email.trim().toLowerCase();
    const users = getUsers();
    const matchedUser = users.find(
        u => u.email === emailValue && u.password === password
    );

    // Deliberately generic error — doesn't reveal whether the email
    // exists or the password was wrong, which is a security best
    // practice (an attacker shouldn't learn which emails are registered).
    if (!matchedUser) {
        showError('loginPassword', 'Invalid email or password');
        return;
    }

    // --- Success: build session and save it ---
    const session = {
        userId: matchedUser.id,
        email: matchedUser.email,
        loginAt: new Date().toISOString()
    };

    localStorage.setItem('crm_session', JSON.stringify(session));

    window.location.href = 'dashboard.html';
}