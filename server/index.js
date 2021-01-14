const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origin: '*'}});

const port = process.env.PORT || 3001;


app.get('/', (req, res) => {
    res.send({ response: "I am alive" }).status(200);

});

io.on('connection', (socket) => {
    console.log('a user connected');
    const roomId = socket.handshake.query.roomId;

    socket.on('join', (roomId) => {
        console.log(`Socket ${socket.id} joining roomId: ${roomId}`);
        socket.join(roomId);
    });

    socket.on('chat message', (msg) => {
        console.log('RoomId: ' + msg.roomId + ' message: ' + msg.text);
        io.to(msg.roomId).emit('chat message', msg);

    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(port, () => console.log(`Listening on port ${port}`));
