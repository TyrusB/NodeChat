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
  var $messageEl = $('<li></li>');
  $('#message-display').prepend($messageEl.html("<i>Welcome " + nickname + "!</i>"));
}

function dropUser(nickname) {
  var $userEl = $('#users li:contains("' + nickname + '")');
  $userEl.remove();
  var $messageEl = $('<li></li>');
  $('#message-display').prepend($messageEl.html("<i>" + nickname + " has left the room!</i>"));
}

function changeNickname(oldNick, newNick) {
  var $userEl = $('#users li:contains("' + oldNick + '")');
  $userEl.text(newNick);
  var $messageEl = $('<li></li>');
  $('#message-display').prepend($messageEl.html("<i>" + oldNick + " is now " + newNick + "</i>"));

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

  socket.on('server_message', function(response) {
    displayMessage(response.text);
  });

  socket.on('user_list', function(response) {
    displayUsers(response.nicknames);
  });

  socket.on('add_user', function(response) {
    addUser(response.nickname);
  });

  socket.on('drop_user', function(response) {
    dropUser(response.nickname);
  });

  socket.on('change_nickname', function(response) {
    changeNickname(response.oldNick, response.newNick)
  });


});
