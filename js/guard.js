// Runs on every page, before content is meant to be visible, to enforce
// access rules. This file does ONLY the redirect check — no form logic
// belongs here, since guard.js loads at the TOP of <body>, before forms
// on the page even exist in the DOM yet.

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