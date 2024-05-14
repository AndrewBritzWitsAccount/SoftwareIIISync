// client.js

document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    const loginButton = document.getElementById('login-button');
    const credentialsForm = document.getElementById('credentials-form');
    const userListDiv = document.getElementById('users-list');
    const startGameButton = document.getElementById('start-game-button');
    const waitingMessage = document.getElementById('waiting-message');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const username = document.getElementById('username-input').value.trim();
        const password = document.getElementById('password-input').value.trim();

        if (username !== '' && password !== '') {
            socket.emit('setUserCredentials', { username, password });
            credentialsForm.style.display = 'none';
        }
    });

    socket.on('userConnected', function (users) {
        updateUserList(users);
    });

    function updateUserList(users) {
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        users.forEach(function (user) {
            const li = document.createElement('li');
            li.textContent = user.username;
            userList.appendChild(li);
        });

        if (users.length >= 3) {
            userListDiv.style.display = 'block';
            startGameButton.style.display = 'block';
            waitingMessage.style.display = 'none';
        } else {
            userListDiv.style.display = 'block';
            startGameButton.style.display = 'none';
            waitingMessage.style.display = 'block';
        }
    }

    startGameButton.addEventListener('click', startGame);
    function startGame() {
        window.location.href = '/game';
    }
});
