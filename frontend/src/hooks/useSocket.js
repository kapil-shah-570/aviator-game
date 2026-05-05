import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });
    
    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);
  
  const emit = (event, data) => {
    socketRef.current?.emit(event, data);
  };
  
  const on = (event, callback) => {
    socketRef.current?.on(event, callback);
  };
  
  const off = (event, callback) => {
    socketRef.current?.off(event, callback);
  };
  
  return { socket: socketRef.current, isConnected, emit, on, off };
};
