// ===== crm_clients storage helpers =====

function getClients() {
    const stored = localStorage.getItem('crm_clients');
    return stored ? JSON.parse(stored) : [];
}
function saveClients(clients) {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
}

// Converts one DummyJSON user into our Client shape
function transformApiUserToClient(user) {
    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        company: user.company ? user.company.name : '',
        image: user.image,
        status: 'Lead',
        dealValue: Math.floor(Math.random() * (10000 - 500 + 1)) + 500,
        notes: [],
        createdAt: new Date().toISOString()
    };
}

// If crm_clients already exists, use it (no API call). Otherwise fetch fresh data from DummyJSON and cache it.
async function loadClients() {
    const cached = getClients();
    if (cached.length > 0) {
        return cached;
    }

    const response = await fetch('https://dummyjson.com/users?limit=30');
    if (!response.ok) {
        throw new Error('Failed to fetch clients');
    }
    const data = await response.json();
    const clients = data.users.map(transformApiUserToClient);
    saveClients(clients);
    return clients;
}