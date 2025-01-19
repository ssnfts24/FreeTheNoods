// User Authentication Logic
const users = JSON.parse(localStorage.getItem('users')) || []; // Load existing users

function register(username, password) {
    if (users.find(user => user.username === username)) {
        alert('Username already exists. Please choose another.');
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! You can now log in.');
}

function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        loadGame();
        return true;
    } else {
        alert('Invalid username or password.');
        return false;
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}
