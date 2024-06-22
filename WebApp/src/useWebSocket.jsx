import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [receivedData, setReceivedData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = async (event) => {
      const message = await event.data.text();
      console.log('Message from server:', message);
      try {
        const jsonData = JSON.parse(message);
        setReceivedData(jsonData);
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed', event);
      if (event.wasClean) {
        console.log('Connection closed cleanly');
      } else {
        console.error('Connection closed with error', event);
      }
    };

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