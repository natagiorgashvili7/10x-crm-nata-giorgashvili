// ===== Dashboard page logic (Day 7, P3) =====

const STATUS_CLASSES_DASH = {
    Lead: 'badge_lead',
    Contacted: 'badge_contacted',
    Won: 'badge_won',
    Lost: 'badge_lost'
};

async function initDashboard() {
    renderGreeting();
    startLiveClock();

    // Same load-or-fetch logic as clients.js — shared via data.js,
    // so a first-time visit to the dashboard also seeds crm_clients.
    try {
        await loadClients();
    } catch (err) {
        // If the API fails here, just render with whatever is cached
        // (possibly empty) rather than blocking the whole dashboard.
    }

    const clients = getClients();
    renderStats(clients);
    renderPipeline(clients);
    renderRecentClients(clients);
}

function renderGreeting() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    const users = JSON.parse(localStorage.getItem('crm_users')) || [];
    const currentUser = users.find(u => u.id === session?.userId);

    const firstName = currentUser ? currentUser.fullName.split(' ')[0] : 'there';
    document.getElementById('greetingText').textContent = `Welcome back, ${firstName}!`;
}

function startLiveClock() {
    const clockEl = document.getElementById('liveClock');

    function updateClock() {
        const now = new Date();
        clockEl.textContent = `${now.toLocaleDateString()} | ${now.toLocaleTimeString()}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

function renderStats(clients) {
    const totalClients = clients.length;

    const activeDeals = clients.filter(
        c => c.status !== 'Won' && c.status !== 'Lost'
    ).length;

    const wonRevenue = clients
        .filter(c => c.status === 'Won')
        .reduce((sum, c) => sum + c.dealValue, 0);

    const newThisWeek = clients.filter(c => {
        const daysSinceCreated = (Date.now() - new Date(c.createdAt)) / 86400000;
        return daysSinceCreated <= 7;
    }).length;

    document.getElementById('statTotalClients').textContent = totalClients;
    document.getElementById('statActiveDeals').textContent = activeDeals;
    document.getElementById('statWonRevenue').textContent = `$${wonRevenue.toLocaleString()}`;
    document.getElementById('statNewThisWeek').textContent = newThisWeek;
}

function renderPipeline(clients) {
    const statuses = ['Lead', 'Contacted', 'Won', 'Lost'];
    const pipelineEl = document.getElementById('pipelineBars');
    pipelineEl.innerHTML = '';

    statuses.forEach(status => {
        const count = clients.filter(c => c.status === status).length;
        const percent = clients.length > 0 ? (count / clients.length) * 100 : 0;

        const row = document.createElement('div');
        row.className = 'pipeline_row';
        row.innerHTML = `
            <div class="pipeline_row_label">
                <span>${status}</span>
                <span>${count} Deals</span>
            </div>
            <div class="pipeline_bar_track">
                <div class="pipeline_bar_fill ${STATUS_CLASSES_DASH[status]}" style="width: ${percent}%"></div>
            </div>
        `;
        pipelineEl.appendChild(row);
    });
}

function renderRecentClients(clients) {
    const listEl = document.getElementById('recentClientsList');
    listEl.innerHTML = '';

    const recent = [...clients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (recent.length === 0) {
        listEl.innerHTML = '<p class="empty_text">No clients yet.</p>';
        return;
    }

    recent.forEach(client => {
        const row = document.createElement('div');
        row.className = 'recent_client_row';
        row.innerHTML = `
            <img src="${client.image}" alt="${client.name}" class="recent_avatar">
            <div class="recent_info">
                <p class="recent_name">${client.name}</p>
                <p class="recent_company">${client.company}</p>
            </div>
            <span class="status_badge ${STATUS_CLASSES_DASH[client.status]}">${client.status}</span>
            <span class="recent_date">${new Date(client.createdAt).toLocaleDateString()}</span>
        `;
        listEl.appendChild(row);
    });
}

initDashboard();