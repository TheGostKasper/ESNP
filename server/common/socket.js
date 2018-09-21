

module.exports = function (io, socket) {
    return {
        send: (paraObj) => {
            // sending to all clients, include sender
            io.emit(paraObj.func, paraObj.data);
        },
        sendOthers: (paraObj) => {
            // sending to all clients except sender
            socket.broadcast.emit(paraObj.func, paraObj.data);
        },
        sendOthersRoom: (paraObj) => {
            // sending to all clients in 'game' room(channel) except sender
            socket.broadcast.to(paraObj.room).emit(paraObj.func, paraObj.data);
        },
        sendRoom: (paraObj) => {
            // sending to all clients in 'game' room(channel), include sender
            io.in(paraObj.room).emit(paraObj.func, paraObj.data);
        },
        sendRoomIfThere: (paraObj) => {
            // sending to sender client, only if they are in 'game' room(channel)
            socket.to(paraObj.room).emit(paraObj.func, paraObj.data);
        },
        sendNamespace: (paraObj) => {
            // sending to all clients in namespace 'myNamespace', include sender
            io.of(paraObj.namespace).emit(paraObj.func, paraObj.data);
        },
        sendClient: (paraObj) => {
            // sending to individual socketid
            socket.broadcast.to(paraObj.con_id).emit(paraObj.func, paraObj.data);
        }
    }
}














