function getMessage() {
  var $chatBox = $('#chat-message');

  var text = $chatBox.val();
  // $chatBox.val("");

  return text;
}

function sendMessage(chatObj, message) {
  chatObj.sendMessage(message);
}

function displayMessage(message) {
  var $el = $('<li></li>');
  $el.text(message);
  $('#message-display').prepend($el);
}

function displayUsers(nicknames) {
  $('#users').empty();
  nicknames.forEach(function(nickname) {
    var $el = $('<li></li>');
    $('#users').append($el.text(nickname));
  });
}

function addUser(nickname) {
  var $el = $('<li></li>')
  $('#users').append($el.text(nickname));
}


$(document).ready(function() {
  var socket = io.connect();
  var chat = new Chat(socket)

  $('#chat-form').on('submit', function(event) {
    event.preventDefault();
    var message = getMessage();
    sendMessage(chat, message);
    // displayMessage(message);
    $('#chat-message').val("");
  });

  socket.on('server_message', function(message) {
    displayMessage(message.text);
  });

  socket.on('user_list', function(nicknames) {
    displayUsers(nicknames.nicknames);
  });

  socket.on('add_user', function(nickname) {
    addUser(nickname.nickname);
  });


});
