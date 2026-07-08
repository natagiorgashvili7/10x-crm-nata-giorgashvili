// form validation
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}
function handleSignup (form) {
    form.preventDefault();
// values for form validation
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const emailValue = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    clearError('fullName');
    clearError('email');
    clearError('password');
    clearError('confirmPassword');
    let isValid = true;

    if (fullName.trim().length < 3) {
        showError('fullName', 'Full name must be at least 3 characters');
        isValid = false;
    } if (!emailPattern.test(emailValue)){
        showError('email', 'Please enter a valid email address');
        isValid = false;

    } else {
        // Email duplicate check
        const users = getUsers();
        const emailExists = users.some(u => u.email === emailValue);
        if (emailExists) {
            showError('email', 'An account with this email already exists');
            isValid = false;
    }
}

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    if (password.length < 8 || !hasLetter || !hasDigit) {
        showError('password', 'Password must be at least 8 characters and contain a letter and a number');
        isValid = false;
    }

    // Confirm Password: must match exactly
    if (confirmPassword !== password) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return; // stop here — nothing gets saved, form isn't submitted
    }

    // --- All valid: build User object and save ---
    const newUser = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: emailValue,
        password: password,
        company: company.trim(),
        createdAt: new Date().toISOString()
    };

    const users = getUsers();
    users.push(newUser);
    localStorage.setItem('crm_users', JSON.stringify(users));

    showToast('Account created successfully! Please log in.', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== Helpers =====

function getUsers() {
    const stored = localStorage.getItem('crm_users');
    return stored ? JSON.parse(stored) : [];
}

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

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
