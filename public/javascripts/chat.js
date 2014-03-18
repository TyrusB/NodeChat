(function(root) {
  var Chat = root.Chat = function(socket) {
    this.socket = socket;
  }

  Chat.prototype.sendMessage = function(message) {
    this.socket.emit("client_message", message);
  }

})(this);
