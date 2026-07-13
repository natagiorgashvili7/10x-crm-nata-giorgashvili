// ===== Clients page: load + render (Day 4) =====

const clientsListEl = document.getElementById('clientsList');

const STATUS_CLASSES = {
    Lead: 'badge_lead',
    Contacted: 'badge_contacted',
    Won: 'badge_won',
    Lost: 'badge_lost'
};

async function initClientsPage() {
    clientsListEl.innerHTML = '<p class="loading_text">Loading clients...</p>';

    try {
        const clients = await loadClients();
        renderClients(clients);
    } catch (err) {
        renderLoadError();
    }
}

function renderLoadError() {
    clientsListEl.innerHTML = `
        <div class="error_state">
            <p>Could not load clients. Check your connection and try again.</p>
            <button id="retryLoadBtn" class="btn_primary">Retry</button>
        </div>
    `;
    document.getElementById('retryLoadBtn').addEventListener('click', initClientsPage);
}

// The one function everything else eventually calls to redraw the screen
function renderClients(list) {
    clientsListEl.innerHTML = '';

    if (list.length === 0) {
        clientsListEl.innerHTML = '<p class="empty_text">No clients found.</p>';
        return;
    }

    list.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client_card';
        card.setAttribute('data-id', client.id);

        const badgeClass = STATUS_CLASSES[client.status] || 'badge_lead';
        const formattedDeal = `$${client.dealValue.toLocaleString()}`;

        card.innerHTML = `
            <img src="${client.image}" alt="${client.name}" class="client_avatar">
            <div class="client_info">
                <h4>${client.name}</h4>
                <p class="client_company">${client.company}</p>
                <p class="client_email">${client.email}</p>
            </div>
            <span class="status_badge ${badgeClass}">${client.status}</span>
            <span class="client_deal">${formattedDeal}</span>
            <button class="delete_btn" data-id="${client.id}">Delete</button>
        `;

        clientsListEl.appendChild(card);
    });
}

initClientsPage();