const app = require('express')();
const http = require('http').createServer(app);
const Io = require('socket.io');
const { Socket } = require("./socket");
const getStore = require('./store');

const port = process.env.PORT || 3001;
const store = getStore();
const io = Io(http, {
    cors: {origin: '*'},
    pingInterval: 20000,
    pingTimeout: 5000,
})
exports.getIO = () => io;

app.get('/', (req, res) => {
    res.send({ response: "I am alive" }).status(200);

});

io.on('connection', async (socket) => {
    console.log('user connected');
    const roomId = socket.handshake.query.roomId;

    new Socket({ roomId, socket });
});

http.listen(port, () => console.log(`Listening on port ${port}`));
