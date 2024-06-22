import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });

server.on('connection', socket => {
  console.log('Client connected');
  
  socket.on('message', message => {
    console.log(`Received: ${message}`);
    // Broadcast the message to all connected clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log(`Message sent to client ${client}: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
