import type { ReactNode } from 'react';

import { io } from 'socket.io-client';
import React, { useState, useEffect, useContext, createContext } from 'react';

type StreamStatus = 'ON' | 'PAUSE' | 'EMERGENCY' | 'STOP' | 'OFF';

interface Stream {
  device: string;
  order: string;
  counter: number;
  status: StreamStatus;
}

interface StreamContextProps {
  stream: Map<any, any>
}

const StreamContext = createContext<StreamContextProps | undefined>(undefined);

export const StreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
    reconnectionDelay: 5000
  });
  const [stream, setStream] = useState<Map<string, Stream>>(new Map());

  const updateStream = (newStream: Stream) => {
    if (!newStream.device) return;
    setStream(prev => prev.set(newStream.device, newStream));
  }


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('orders', (data: any) => {
      console.log(data);
      updateStream(data)
    });

    return () => {
      socket.disconnect();
    }

  }, [socket])


  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StreamContext.Provider value={{ stream }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = (): StreamContextProps => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};