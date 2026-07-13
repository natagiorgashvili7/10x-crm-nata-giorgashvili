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
            <select class="status_badge status_select ${badgeClass}" data-id="${client.id}">
                <option value="Lead" ${client.status === 'Lead' ? 'selected' : ''}>Lead</option>
                <option value="Contacted" ${client.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Won" ${client.status === 'Won' ? 'selected' : ''}>Won</option>
                <option value="Lost" ${client.status === 'Lost' ? 'selected' : ''}>Lost</option>
            </select>
            <span class="client_deal">${formattedDeal}</span>
            <button class="delete_btn" data-id="${client.id}">Delete</button>
        `;

        clientsListEl.appendChild(card);
    });
}

initClientsPage();

// ===== Add Client Modal (Day 5) =====

const addClientModal = document.getElementById('addClientModal');
const addClientForm = document.getElementById('addClientForm');

document.getElementById('addClientBtn').addEventListener('click', openAddClientModal);
document.getElementById('closeAddClientModal').addEventListener('click', closeAddClientModal);

// Bonus: click on the dark overlay (not the box itself) also closes it
addClientModal.addEventListener('click', (e) => {
    if (e.target === addClientModal) {
        closeAddClientModal();
    }
});

function openAddClientModal() {
    addClientModal.classList.remove('hidden');
}

function closeAddClientModal() {
    addClientModal.classList.add('hidden');
    addClientForm.reset();
    clearError('clientName');
    clearError('clientEmail');
    clearError('clientPhone');
    clearError('clientDealValue');
}

addClientForm.addEventListener('submit', handleAddClient);

async function handleAddClient(e) {
    e.preventDefault();

    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const phone = document.getElementById('clientPhone').value;
    const company = document.getElementById('clientCompany').value;
    const dealValueRaw = document.getElementById('clientDealValue').value;
    const status = document.getElementById('clientStatus').value;

    clearError('clientName');
    clearError('clientEmail');
    clearError('clientPhone');
    clearError('clientDealValue');

    let isValid = true;
    const emailValue = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dealValue = Number(dealValueRaw);

    if (name.trim().length < 3) {
        showError('clientName', 'Name must be at least 3 characters');
        isValid = false;
    }

    if (!emailPattern.test(emailValue)) {
        showError('clientEmail', 'Please enter a valid email address');
        isValid = false;
    } else {
        const existing = getClients();
        const emailExists = existing.some(c => c.email.toLowerCase() === emailValue);
        if (emailExists) {
            showError('clientEmail', 'A client with this email already exists');
            isValid = false;
        }
    }

    if (phone.trim() !== '' && phone.trim().length < 6) {
        showError('clientPhone', 'Phone number looks too short');
        isValid = false;
    }

    if (isNaN(dealValue) || dealValue <= 0) {
        showError('clientDealValue', 'Deal value must be a positive number');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // ---- POST to DummyJSON (mocked write — see PRD note on this) ----
    let apiResponse;
    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName: name.trim() })
        });
        apiResponse = await response.json();
    } catch (err) {
        showToast('Could not reach server. Please try again.', 'error');
        return;
    }

    const newClient = {
        id: apiResponse.id, // server-issued id, per PRD instructions
        name: name.trim(),
        email: emailValue,
        phone: phone.trim(),
        company: company.trim(),
        image: 'https://dummyjson.com/icon/newclient/128', // no upload per Out of Scope
        status: status,
        dealValue: dealValue,
        notes: [],
        createdAt: new Date().toISOString()
    };

    const clients = getClients();
    clients.unshift(newClient); // new client appears at the top
    saveClients(clients);
    renderClients(clients);

    closeAddClientModal();
    showToast('Client added ✓', 'success');
}

// ===== Delete Client (Day 5) =====
// Event delegation: one listener on the container instead of one
// per card, since cards get destroyed/recreated on every render.

clientsListEl.addEventListener('click', handleClientsListClick);

function handleClientsListClick(e) {
    if (e.target.classList.contains('delete_btn')) {
        const id = Number(e.target.getAttribute('data-id'));
        handleDeleteClient(id);
    }
}

async function handleDeleteClient(id) {
    const confirmed = confirm('Delete this client? This cannot be undone.');
    if (!confirmed) return;

    try {
        await fetch(`https://dummyjson.com/users/${id}`, { method: 'DELETE' });
        // Note: DummyJSON may return 404 for clients we added ourselves,
        // since it never actually persisted them server-side. That's
        // expected — we still remove it from our own state below.
    } catch (err) {
        // Even on network failure, DummyJSON's write endpoints are
        // mocked anyway, so we proceed with the local removal.
    }

    const clients = getClients().filter(c => c.id !== id);
    saveClients(clients);
    renderClients(clients);
    showToast('Client deleted', 'success');
}