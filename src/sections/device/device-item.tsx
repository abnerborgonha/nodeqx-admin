import { useState } from 'react';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid, Button, Tooltip, CardContent, CardActions } from '@mui/material';

import { removeDevice, type DeviceProps } from 'src/service/network/lib/device.network';

import { Label } from 'src/components/label';

import { LogDrawer } from './log';


// ----------------------------------------------------------------------

export function DeviceItem({ device: { id, availability, deviceId, networkStatus, status, logs, createdAt, updatedAt }, simpleView = false }: { device: DeviceProps, simpleView?: boolean }) {

  const [visableRemoveButton, setVisebleRemoveButton] = useState(false);


  const queryClient = useQueryClient();
  const closeOrderMutation = useMutation({
    mutationFn: removeDevice,
    onSuccess: () => {
      enqueueSnackbar('Dispositivo removido com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refresh order list on success
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: 'error'
      });
      console.error('Failed to create order:', { error });
    },
  });

  const handleRemoveDevice = (dId: string) => {
    closeOrderMutation.mutate(dId);
  }


  const labelNetworkStatus: Record<any, any> = {
    'CONNECTED': <Label color="success">CONECTADO</Label>,
    'DISCONNECTED': <Label color="error">DESCONECTADO</Label>,
  }

  const labelDeviceStatus: Record<any, any> = {
    'AVAILABLE': <Label color="success">DISPONIVEL</Label>,
    'UNAVAILABLE': <Label color="warning">INDISPONIVEL</Label>,
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
      }}
    >
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{
          marginBottom: 2,
        }}>
          <Typography variant="subtitle2">
            {deviceId}
          </Typography>
          <LogDrawer device={ { id, availability, deviceId, status, networkStatus, logs, createdAt, updatedAt }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            marginBottom: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#888' }}>
            Network: {labelNetworkStatus[networkStatus]}
          </Typography>

          <Typography variant="caption" sx={{ color: '#888' }}>
            Status: {labelDeviceStatus[availability]}
          </Typography>

        </Box>
        <Grid container spacing={1} style={{ display: `${simpleView && 'none'}` }}>
          <Grid item>
            <Box display='flex' flexDirection='column' gap='6px'>
              <Typography variant="caption" sx={{ color: '#888' }}>
                Criado: {format(createdAt, 'dd/MM/yyyy HH:mm:ss')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#888' }}>
                Atualizado: {format(updatedAt, 'dd/MM/yyyy HH:mm:ss')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ display: `${simpleView ? 'none' : 'flex'}`, justifyContent: 'space-between' }}>
        {!visableRemoveButton && <Button size="small" onClick={() => setVisebleRemoveButton(prev => !prev)}>Excluir</Button>}
        {visableRemoveButton && <Tooltip title="Ao excluir não será mias possivel utilizar esse dipositivo. (Clique duas vezes caso queria excluir)"><Button size="small" color="error" onDoubleClick={() => handleRemoveDevice(id)} >Excluir</Button></Tooltip>}

      </CardActions>
    </Card>
  );
}
