// ===== Profile page logic (P5) =====
// Self-contained: defines its own showError/clearError/showToast so this
// page doesn't depend on auth.js (which isn't loaded here).

function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('crm_session'));
    const users = getUsers();
    return users.find(u => u.id === session?.userId) || null;
}

function getUsers() {
    const stored = localStorage.getItem('crm_users');
    return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
    localStorage.setItem('crm_users', JSON.stringify(users));
}

// ===== P5.1 — Render profile info =====

function renderProfileInfo() {
    const user = getCurrentUser();
    if (!user) return;

    const initials = user.fullName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);

    document.getElementById('profileAvatar').textContent = initials;
    document.getElementById('profileName').textContent = user.fullName;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileSince').textContent =
        `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

    // Pre-fill the edit form with current values
    document.getElementById('profileFullName').value = user.fullName;
    document.getElementById('profileCompany').value = user.company || '';
}

renderProfileInfo();

// ===== P5.2 — Save Changes (edit name / company) =====

const editProfileForm = document.getElementById('editProfileForm');
editProfileForm.addEventListener('submit', handleEditProfile);

function handleEditProfile(e) {
    e.preventDefault();

    const fullName = document.getElementById('profileFullName').value;
    const company = document.getElementById('profileCompany').value;

    clearError('profileFullName');

    if (fullName.trim().length < 3) {
        showError('profileFullName', 'Full name must be at least 3 characters');
        return;
    }

    const user = getCurrentUser();
    if (!user) return;

    const users = getUsers();
    const target = users.find(u => u.id === user.id);
    target.fullName = fullName.trim();
    target.company = company.trim();
    saveUsers(users);

    renderProfileInfo();
    showToast('Profile updated ✓', 'success');
}

// ===== P5.3 — Change Password =====

const changePasswordForm = document.getElementById('changePasswordForm');
changePasswordForm.addEventListener('submit', handleChangePassword);

function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    clearError('currentPassword');
    clearError('newPassword');
    clearError('confirmNewPassword');

    let isValid = true;
    const user = getCurrentUser();
    if (!user) return;

    if (currentPassword !== user.password) {
        showError('currentPassword', 'Current password is incorrect');
        isValid = false;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword);
    if (newPassword.length < 8 || !hasLetter || !hasDigit) {
        showError('newPassword', 'Password must be at least 8 characters and contain a letter and a number');
        isValid = false;
    } else if (currentPassword === newPassword) {
        showError('newPassword', 'New password must be different from the current one');
        isValid = false;
    }

    if (confirmNewPassword !== newPassword) {
        showError('confirmNewPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const users = getUsers();
    const target = users.find(u => u.id === user.id);
    target.password = newPassword;
    saveUsers(users);

    changePasswordForm.reset();
    showToast('Password changed ✓', 'success');
}

// ===== P5.4 — Reset CRM Data =====

document.getElementById('resetDataBtn').addEventListener('click', handleResetData);

async function handleResetData() {
    const confirmed = confirm(
        'Reset all CRM data? This deletes every client stored locally ' +
        'and cannot be undone. Fresh sample data will be fetched from the server.'
    );
    if (!confirmed) return;

    localStorage.removeItem('crm_clients');

    try {
        await loadClients();
        showToast('CRM data reset ✓', 'success');
    } catch (err) {
        showToast('Reset failed — could not reach the API', 'error');
    }
}

// ===== Shared helpers =====

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');

    input.classList.add('input-error');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');

    input.classList.remove('input-error');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}

function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}