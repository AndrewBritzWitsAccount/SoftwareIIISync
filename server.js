// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'js']
}));

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

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
        } else {
            socket.emit('incorrectPassword');
            socket.disconnect(true);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        io.emit('userDisconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
