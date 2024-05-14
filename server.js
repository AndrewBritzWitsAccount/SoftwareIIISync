// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};
let gameStarted = false;

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('setUserCredentials', (credentials) => {
        const { username, password } = credentials;

        if (password === 'brokenTelephone') {
            users[socket.id] = {
                id: socket.id,
                username: username
            };
            io.emit('userConnected', Object.values(users));

            // If the required number of players is reached, and the game hasn't started, wait for "Start Game" button click
            if (Object.keys(users).length >= 3 && !gameStarted) {
                io.emit('waitingForStartGame');
            }
        } else {
            socket.emit('incorrectPassword');
            socket.disconnect(true);
        }
    });

    socket.on('startGame', () => {
        if (!gameStarted) {
            startGame();
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        io.emit('userDisconnected', socket.id);
    });
});

function startGame() {
    gameStarted = true;
    io.emit('gameStarted');
}

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'js']
}));

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
