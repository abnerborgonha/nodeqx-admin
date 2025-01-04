
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { DeviceItem } from '../device-item';

// ----------------------------------------------------------------------


export function DeviceView() {
  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: findAllDevices,
    refetchInterval: 1000
  });

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Dispositivos IoT
      </Typography>

      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid key={device.id} xs={12} sm={6} md={3}>
            <DeviceItem device={device} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
