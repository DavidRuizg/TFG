import { WebSocketServer, WebSocket } from 'ws';

// Inicialización del servidor WebSocket estableciendo el puerto de escucha en 8080
const server = new WebSocketServer({ port: 8080 });

// Manejador de eventos que se ejecuta cuando un cliente se conecta al servidor
server.on('connection', socket => {
  console.log('Client connected');
  // Manejador de eventos que se ejecuta cuando el servidor recibe un mensaje de un cliente
  socket.on('message', message => {
    console.log(`Received: ${message}`);
    // Reenvío del mensaje a todos los clientes conectados al servidor
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) { // Comprobación del estado de conexión del cliente
        client.send(message);
        console.log(`Message sent to client ${client}: ${message}`);
      }
    });
  });
  // Manejador de eventos que se ejecuta cuando un cliente se desconecta del servidor
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
