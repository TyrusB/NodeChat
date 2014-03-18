
function createChat(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    socket.on('client_message', function(message) {
      io.sockets.emit('server_message', { text: message })
    });
  });
}

module.exports.createChat = createChat;