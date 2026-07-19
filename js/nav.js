// Builds the sidebar + topbar shell shared across all protected pages

function renderShell() {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return; // safety check if a page forgot the container

    // Figure out which nav link should be marked active
    const currentPage = window.location.pathname.split('/').pop();

    const session = JSON.parse(localStorage.getItem('crm_session'));
    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    const currentUser = users.find(u => u.id === session?.userId);
    const displayName = currentUser ? currentUser.fullName : 'User';

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'app_sidebar';
    sidebar.innerHTML = `
        <div class="sidebar_logo">
            <h2>10X CRM</h2>
            <p>Sales Management</p>
        </div>
        <nav class="sidebar_nav">
            <a href="dashboard.html" class="nav_link ${currentPage === 'dashboard.html' ? 'active' : ''}">
                <span class="nav_icon">▦</span> Dashboard
            </a>
            <a href="clients.html" class="nav_link ${currentPage === 'clients.html' ? 'active' : ''}">
                <span class="nav_icon">☰</span> Clients
            </a>
            <a href="profile.html" class="nav_link ${currentPage === 'profile.html' ? 'active' : ''}">
                <span class="nav_icon">◍</span> Profile
            </a>
        </nav>
        <button class="sidebar_logout" id="logoutBtn">
            <span class="nav_icon">⏻</span> Logout
        </button>
    `;

    // ----- Topbar -----
    const topbar = document.createElement('header');
    topbar.className = 'app_topbar';
    topbar.innerHTML = `
        <input type="text" class="topbar_search" placeholder="Search records, deals, or clients...">
        <div class="topbar_actions">
            <button class="theme_toggle" id="themeToggleBtn" title="Toggle theme">🌓</button>
            <span class="topbar_bell">🔔</span>
            <span class="topbar_avatar">${displayName.charAt(0).toUpperCase()}</span>
        </div>
    `;

    // Wrap everything so CSS grid can lay out sidebar | (topbar + content)
    const main = document.createElement('div');
    main.className = 'app_main';

    // Move the existing page-content into main, after the topbar
    main.appendChild(topbar);
    main.appendChild(pageContent);

    const shell = document.createElement('div');
    shell.className = 'app_shell';
    shell.appendChild(sidebar);
    shell.appendChild(main);

    document.body.prepend(shell);

    // Ensure a toast container exists on every protected page too
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // ----- Wire up buttons -----
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
}

function handleLogout() {
    // Only ever remove the session — never touch crm_users or crm_clients
    localStorage.removeItem('crm_session');
    window.location.href = 'index.html';
}

renderShell();