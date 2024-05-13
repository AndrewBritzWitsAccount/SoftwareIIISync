const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Store connected users with usernames
let users = {};

// Serve static files
app.use(express.static('public'));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Listen for username and password input from client
    socket.on('setUserCredentials', (credentials) => {
        const { username, password } = credentials;

        // Check if password is correct
        if (password === 'brokenTelephone') {
            users[socket.id] = {
                id: socket.id,
                username: username
            };
            // Update connected users list
            io.emit('userConnected', Object.values(users));
        } else {
            // If password is incorrect, disconnect the user
            socket.emit('incorrectPassword');
            socket.disconnect(true);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove user from the list
        delete users[socket.id];

        // Update connected users list
        io.emit('userDisconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});