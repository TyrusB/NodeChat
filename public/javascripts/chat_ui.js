function getMessage() {
  $chatBox = $('#chat-message');

  var text = $chatBox.val();
  // $chatBox.val("");

  return text;
}

function sendMessage(chatObj, message) {
  chatObj.sendMessage(message);
}

function displayMessage(message) {
  $el = $('<li></li>');
  $el.text(message);
  $('#message-display').prepend($el);
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


});
