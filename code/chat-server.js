// Load the TCP Library
var net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort;

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  socket.write("Bienvenido " + socket.name + '\n');
  broadcast(socket.name + " se unió al chat", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    broadcast(socket.name + "> " + data, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " se retiró del chat.", socket);
  });

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      if (client == sender) return;
      client.write(message + '\n');
    });
  }

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("MedellínJS chat server corriendo en puerto 5000\n");
