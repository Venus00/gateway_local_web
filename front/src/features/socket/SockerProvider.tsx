import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext<ReturnType<typeof io> | null>(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    console.log("trying to connect");
    console.log(`${SOCKET_URL}`);
    const newSocket = io(`${SOCKET_URL}`);
    //const newSocket = io(`${window.location.hostname}:5000`);
    newSocket.on("connect", () => {
      console.log("connected to socket");
    });
    newSocket.on("disconnect", () => {
      console.log("disconnected from socket");
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
