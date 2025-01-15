import type { ReactNode } from 'react';

import { io } from 'socket.io-client';
import { useState, useEffect, createContext } from 'react';


export type DeviceStream = {
  availability: 'AVAILABLE' | 'UNAVAILABLE';
  networkStatus: 'CONNECTED' | 'DISCONNECTED';
};

export type DeviceStreamStorager = { [key: string]: Partial<DeviceStream> };

interface DeviceStreamContextProps {
  deviceStream: DeviceStreamStorager;
  getDeviceByKey: (key: string) => Partial<DeviceStream>;
}

export const DeviceStreamContext = createContext<DeviceStreamContextProps>({} as unknown as DeviceStreamContextProps);

export const DeviceStreamProvider = ({ children }: { children: ReactNode }) => {
  const [deviceStream, setDeviceStream] = useState<DeviceStreamStorager>({});


  const getDeviceByKey = (key: string) => deviceStream[key];

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL);

    socket.on('connect', () => {
      console.log('[DEVICE] Connected to server');
    });

    socket.on('disconnect', () => { 
      console.log('[DEVICE] Disconnected from server');
    });

    socket.on('devices', (data: DeviceStreamStorager) => {
      setDeviceStream(data)
    })

    return () => {
      socket.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <DeviceStreamContext.Provider value={{ deviceStream, getDeviceByKey }} >
      {children}
    </DeviceStreamContext.Provider>
  );
};
