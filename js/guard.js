// Runs on every page, before content is meant to be visible, to enforce access rules.

function checkAuthGuard() {
    const session = localStorage.getItem('crm_session');
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