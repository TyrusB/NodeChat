
function createChat(server) {
  function testChangeRequest(nickname, socket) {
    if (nicknames.indexOf(nickname) === -1) {
      socketNicknames[socket.id] = nickname;
      socket.emit('nicknameChangeResult', {
        success: true,
        text: nickname
      });
    } else {
      socket.emit('nicknameChangeResult', {
        success: false,
        text: "Name already taken"
      });
    }
  };

  var io = require('socket.io').listen(server);
  var guestnumber = 0;
  var socketNicknames = {};
  var nicknames = [];

  io.sockets.on('connection', function (socket) {
    guestnumber++;
    var newNickname = "guest_" + guestnumber;
    socketNicknames[socket.id] = newNickname;
    nicknames.push(newNickname);

    socket.emit('nicknameChangeResult', {
      success: true,
      text: newNickname
    });

    socket.emit('user_list', {
      nicknames: nicknames
    });


    io.sockets.emit('add_user', {
      nickname: newNickname
    });


    socket.on('client_message', function(message) {
      var accum = "";

      if (message[0] === "/") {
        var words = message.slice(1).split(" ");
        if (words[0] === "nick") {
          testChangeRequest(words[1], socket);
        }
      } else {
        var poster = socketNicknames[socket.id];
        io.sockets.emit('server_message', { text: poster + ": " + message })
      }

    });

  });
}

module.exports.createChat = createChat;