// Import necessary modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public directory
app.use(express.static('public'));

// Store active game rooms
const gameRooms = {};

// Define route for creating a new game room
app.post('/create-room', (req, res) => {
    const roomId = generateRoomId();
    gameRooms[roomId] = {
        players: [],
        status: 'waiting' // or 'in-progress'
    };
    res.json({ roomId });
});

// Define route for joining a game room
app.post('/join-room/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!gameRooms[roomId]) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }
    if (gameRooms[roomId].status !== 'waiting') {
        res.status(400).json({ error: 'Room is already in progress' });
        return;
    }
    // Add player to the room
    gameRooms[roomId].players.push({
        id: generatePlayerId(),
        username: req.body.username // assuming username is sent in request body
    });
    res.json({ roomId });
});

// Define route for getting list of active game rooms
app.get('/game-rooms', (req, res) => {
    res.json(Object.keys(gameRooms));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Helper functions
function generateRoomId() {
    // Generate a random 6-character alphanumeric string
    return Math.random().toString(36).substring(2, 8);
}

function generatePlayerId() {
    // Generate a random 6-digit numeric string
    return Math.floor(100000 + Math.random() * 900000).toString();
}
