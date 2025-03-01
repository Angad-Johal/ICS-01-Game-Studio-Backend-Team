// Server Setup & Dependancies 
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*', // You can restrict this to specific domains if needed.
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static('public'));

// Our Imports
const clientConnect = require('./client/clientConnect.js');
const clientIdentify = require('./client/clientIdentify.js')
const clientLogin = require('./client/clientLogin.js');
const clientMessage = require('./client/clientMessage.js');
const clientDisconnect = require('./client/clientDisconnect.js');
const sortUsersByPoints = require('./datamanagement/getLeaderboard.js')

// Generate Food
require('./foodManagement.js');

let intervalID;

io.on('connection', (socket) => {
//joe on a boat is very cool
    // Handle Client Connections
    clientConnect(socket);

    // Handle Client Messages
    socket.on('ident', (message) => {
        clientIdentify(message, socket, io)
    });

    socket.on('login', (message) => {
        clientLogin(message, socket, io)
    });

    // Handle Client Messages
    socket.on('message', (message) => {
        clientMessage(message, socket, io)
    });

    // Handle Client Disconnections
    socket.on('disconnect', () => {
        clientDisconnect(socket, io);
    });

    // Start sending test messages to all clients in the 'users' room
    if (!intervalID) {
        intervalID = setInterval(() => {
            //console.log("Test message sent to users")
            io.to('user').emit(
                'message',
                'This is a test message from the server!');
        }, 10000);
    }
        
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);


});

// Sort user data by points
sortUsersByPoints();
