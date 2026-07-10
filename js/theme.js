(function () {
    const savedTheme = localStorage.getItem('crm_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('crm_theme', next);
}