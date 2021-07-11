var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

/*io.on('connection', function(socket){
  console.log('Socket Ok');
});*/

socketApi.sendType5 = function(data) {
  io.sockets.emit('type5', data);
}

socketApi.sendLocation = function(data) {
  io.sockets.emit('location', data);
}

module.exports = socketApi;