import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ url:string,children: React.ReactNode }> = ({ children,url }) => {
  const [socket, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url); // Replace with your WebSocket server URL
    setWs(ws);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.log('WebSocket disconnected');

    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);