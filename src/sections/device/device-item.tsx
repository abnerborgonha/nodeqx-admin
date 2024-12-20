import { useState } from 'react';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Chip, Grid, Button, Tooltip, CardContent, CardActions } from '@mui/material';

import { removeDevice, type DeviceProps } from 'src/service/network/lib/device.network';


// ----------------------------------------------------------------------

export function DeviceItem({ device: { id, availability, deviceId, networkStatus, createdAt, updatedAt } }: { device: DeviceProps }) {
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

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        maxWidth: 400,
        padding: 2
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 2,
          }}
        >
          Dipositivo IoT: {deviceId}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            marginBottom: 2,
          }}
        >
          <Chip
            label={`Network: ${networkStatus === 'CONNECTED' ? 'CONECTADO' : 'DESCONECTADO'}`}
            color={networkStatus === 'CONNECTED' ? 'success' : 'error'}
            size="small"
            sx={{ width: 'fit-content' }}
          />
          <Chip
            label={`Disponibilidade: ${availability === 'AVAILABLE' ? 'DISPONIVEL' : 'INDIPONIVEL'}`}
            color={availability === 'AVAILABLE' ? 'success' : 'warning'}
            size="small"
            sx={{ width: 'fit-content' }}
          />
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Criado: {format(createdAt, 'dd/MM/yyyy HH:mm:ss')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Atualizado: {format(updatedAt, 'dd/MM/yyyy HH:mm:ss')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {!visableRemoveButton && <Button size="small" onClick={() => setVisebleRemoveButton(prev => !prev)}>Excluir</Button>}
        {visableRemoveButton && <Tooltip title="Ao excluir não será mias possivel utilizar esse dipositivo. (Clique duas vezes caso queria excluir)"><Button size="small" color="error" onDoubleClick={() => handleRemoveDevice(id)} >Excluir</Button></Tooltip>}
      </CardActions>
    </Card>
  );
}
