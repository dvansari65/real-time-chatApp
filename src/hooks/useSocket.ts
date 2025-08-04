// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001", { withCredentials: true });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return socket;
};
