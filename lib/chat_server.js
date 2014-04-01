var _ = require('lodash');

function createChat(server) {
  function testChangeRequest(nickname, socket) {
    if (nicknames.indexOf(nickname) === -1) {
      var oldNick = socketNicknames[socket.id]
      _.remove(nicknames, function(nickname) {
        return nickname === oldNick
      })

      socketNicknames[socket.id] = nickname;
      nicknames.push(nickname);

      io.sockets.emit('change_nickname', {
        oldNick: oldNick,
        newNick: nickname
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

    socket.emit('user_list', {
      nicknames: nicknames
    });

    nicknames.push(newNickname);

    socket.emit('nicknameChangeResult', {
      success: true,
      text: newNickname
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

    socket.on('disconnect', function() {
      var exitingNickname = socketNicknames[socket.id]
      io.sockets.emit('drop_user', { nickname: exitingNickname });

      _.remove(nicknames, function(nickname) {
        return nickname === exitingNickname
      })
      delete socketNicknames[socket.id];
    });

  });
}

module.exports.createChat = createChat;
