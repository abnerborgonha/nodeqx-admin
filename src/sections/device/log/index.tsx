import type { DeviceProps } from 'src/service/network/lib/device.network';

import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import {
  Box,
  List,
  Button,
  Drawer,
  Divider,
  ListItem,
  Typography
} from '@mui/material';

import { Label } from 'src/components/label';

export const LogDrawer = ({ device }: { device: DeviceProps }) => {
  const anchor = 'right';
  const [state, setState] = useState({ [anchor]: false });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, [anchor]: open });
  };

  const labelNetworkStatus: Record<any, any> = {
    'CONNECTED': <Label color="success">CONECTADO</Label>,
    'DISCONNECTED': <Label color="error">DESCONECTADO</Label>,
  }

  const labelDeviceStatus: Record<any, any> = {
    'AVAILABLE': <Label color="success">DISPONIVEL</Label>,
    'UNAVAILABLE': <Label color="warning">INDISPONIVEL</Label>,
  }

  const list = () => (
    <Box
      role="presentation"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.default',
        color: 'text.primary',
        padding: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Logs: {device.deviceId}
        </Typography>
        <Icon
          icon="mdi:close"
          fontSize={24}
          style={{ cursor: 'pointer' }}
          onClick={toggleDrawer(false)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          marginBottom: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: '#888' }}>
          Network: {labelNetworkStatus[device.networkStatus]}
        </Typography>

        <Typography variant="caption" sx={{ color: '#888' }}>
          Status: {labelDeviceStatus[device.availability]}
        </Typography>

      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {device.logs?.map(({ title, info, timestamp }, index) => (
            <ListItem key={index} divider>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontFamily="monospace">
                    {title}
                  </Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Typography variant="body2" fontFamily="monospace">
                    {info}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontFamily="monospace" width={100}>
                    {format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss:ms')}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ padding: 1, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="caption" color="text.secondary">
          Logs atualizado em tempo real
        </Typography>
      </Box>
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        size='small'
        variant="text"
        color="primary"
        startIcon={<Icon icon="mdi:console" fontSize={24} />}
        sx={{
          marginBottom: 2,
        }}
      >
        Logs
      </Button>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: {
            width: '60%',
          },
        }}
      >
        {list()}
      </Drawer>
    </div>
  );
};
