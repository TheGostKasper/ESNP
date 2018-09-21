const socket = require('socket.io');
const shSocket = require('./../common/socket');

module.exports = function (server) {
    const io = new socket(server);
    io.on('connection', function (socket) {
        let shelper = new shSocket(io.sockets, socket);

        console.log('made socket connection', socket.id);
        socket.on('chaty', data => {
            // shelper.send({ func: 'chaty', data: data });
            shelper.sendClient({ con_id: socket.id, func: 'chaty', data: data });
            // socket.broadcast.to(socket.id).emit('blah', data);
        });
        socket.on('blah', data => {
            socket.broadcast.emit('blah', data);
        });
    });


    return {
        shSocket: shSocket,
        io: io
    }
}