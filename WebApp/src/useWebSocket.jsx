import { useEffect, useState } from 'react';

// Hook personalizado para la gestión de conexiones WebSocket
// Recibe como parámetro la URL del servidor WebSocket
const useWebSocket = (url) => {
  // Definición de los estados del hook:
  // - socket: estado que almacena el objeto WebSocket y actualiza su estado
  const [socket, setSocket] = useState(null);
  // - receivedData: estado que almacena los datos recibidos del servidor WebSocket y actualiza su estado
  const [receivedData, setReceivedData] = useState(null);

  // Efecto que se ejecuta al renderizar el componente por un cambio en la URL del servidor WebSocket
  useEffect(() => {
    // Creación de un nuevo objeto WebSocket con la URL del servidor
    const ws = new WebSocket(url);
    // Manejadores de eventos del objeto WebSocket:
    // - onopen: se ejecuta cuando se abre la conexión WebSocket
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
    // - onmessage: se ejecuta cuando se recibe un mensaje del servidor WebSocket
    ws.onmessage = async (event) => {
      // Obtener el mensaje del evento y convertirlo a texto
      const message = await event.data.text();
      console.log('Message from server:', message);
      try {
        // Convertir el mensaje a un objeto JSON y almacenarlo 
        const jsonData = JSON.parse(message);
        setReceivedData(jsonData);
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    // - onclose: se ejecuta cuando se cierra la conexión WebSocket
    ws.onclose = (event) => {
      // Imprime en la consola un mensaje indicando la forma en que se cerró la conexión
      console.log('WebSocket connection closed', event);
      if (event.wasClean) {
        console.log('Connection closed cleanly');
      } else {
        console.error('Connection closed with error', event);
      }
    };
    // - onerror: se ejecuta cuando se produce un error en la conexión WebSocket
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  return {socket, receivedData};
};

export default useWebSocket;