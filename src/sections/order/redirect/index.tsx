/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Grid, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';

import { redirectOrder } from 'src/service/network/lib/order.network';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { Iconify } from 'src/components/iconify';

export function OrderRedirect({ orderId }: { orderId: string }) {
  const [open, setOpen] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState('');

  const { enqueueSnackbar } = useSnackbar();

  const { data: devices = [], isLoading: isLoadingDevices, isError: isErrorDevices, error: errorDevice } = useQuery({
    queryKey: ['devices'],
    queryFn: findAllDevices,
  });

  const queryClient = useQueryClient();
  const redirectOrderMutation = useMutation({
    mutationFn: redirectOrder,
    onSuccess: () => {
      enqueueSnackbar('Ordem redirecionada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: 'error'
      });
      console.error('Failed to redirect order:', { error });
    },
  });

  if (isErrorDevices) {
    enqueueSnackbar(errorDevice.message, { variant: 'error' })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeviceId('');
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    redirectOrderMutation.mutate({
      id: orderId,
      deviceId
    });
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <Iconify icon="solar:login-3-broken" />
        Redirecionar
      </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Redirecionar Ordem de Produto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira os dispositivo para qual será redirecionado a ordem. Certifique-se de preencher todos os campos obrigatórios para garantir o processamento correto.
          </DialogContentText>

          <Grid container spacing={1} marginTop={2}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="device-iot-label">Dispositivo IoT</InputLabel>
              {isLoadingDevices ? (
                <CircularProgress size={24} />
              ) : isErrorDevices ? (
                <p>Erro ao carregar dispositivos</p>
              ) : (
                <Select
                  label="Dipositivo IoT"
                  labelId="device-iot-label"
                  id="deviceId"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  fullWidth
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.deviceId}>
                      {device.deviceId}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={redirectOrderMutation.isPending}>
            {redirectOrderMutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
