import { useContext } from "react";

import { DeviceStreamContext } from "src/contexts/device-stream.context";

export const useDeviceStream = () => {
  const context = useContext(DeviceStreamContext);
  if (context === undefined) {
    throw new Error('useDeviceStream must be used within a DeviceStreamProvider');
  }
  return context;
};