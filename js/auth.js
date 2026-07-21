// ===== Signup form logic =====

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

function handleSignup(e) {
    e.preventDefault();
    // all form info's values
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

// if name is least 3 charachters show error
    if (fullName.trim().length < 3) {
        showError('fullName', 'Full name must be at least 3 characters');
        isValid = false;
    }
// if email does not contain this symbols show error and if already exists, tell user
    if (!emailPattern.test(emailValue)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        const users = getUsers();
        const emailExists = users.some(u => u.email === emailValue);
        if (emailExists) {
            showError('email', 'An account with this email already exists');
            isValid = false;
        }
    }
// password validation rules
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    if (password.length < 8 || !hasLetter || !hasDigit) {
        showError('password', 'Password must be at least 8 characters and contain a letter and a number');
        isValid = false;
    }

    if (confirmPassword !== password) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) {
        return;
    }
    
// create user
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



//Login form

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    clearError('loginEmail');
    clearError('loginPassword');
    let isValid = true;

    // if email and pasword box is clear
    if (email.trim() === '') {
        showError('loginEmail', 'Email is required');
        isValid = false;
    }

    if (password === '') {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const emailValue = email.trim().toLowerCase();
    const users = getUsers();
    const matchedUser = users.find(
        u => u.email === emailValue && u.password === password
    );

    if (!matchedUser) {
        showError('loginPassword', 'Invalid email or password');
        return;
    }

    const session = {
        userId: matchedUser.id,
        email: matchedUser.email,
        loginAt: new Date().toISOString()
    };

    localStorage.setItem('crm_session', JSON.stringify(session));
    window.location.href = 'dashboard.html';
}



// ===== Shared helpers =====

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