/* eslint-disable import/no-extraneous-dependencies */
import type { CreateOrderProps } from 'src/service/network/lib/order.network';

import React from 'react';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Grid, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';

import { createOrder } from 'src/service/network/lib/order.network';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { Iconify } from 'src/components/iconify';

export function OrderCreate() {
  const [open, setOpen] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState('');

  const { enqueueSnackbar } = useSnackbar();

  const { data: devices = [], isLoading: isLoadingDevices, isError: isErrorDevices, error: errorDevice } = useQuery({
    queryKey: ['devices'],
    queryFn: findAllDevices,
  });

  const queryClient = useQueryClient();
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      enqueueSnackbar('Ordem criada com sucesso!', {
        variant: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refresh order list on success
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, {
        variant: 'error'
      });
      console.error('Failed to create order:', { error });
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
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as unknown as CreateOrderProps;

    createOrderMutation.mutate({
      ...formJson,
      deviceId
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="mingcute:add-line" />}
        onClick={handleClickOpen}
      >
        Adicionar ordem
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Adicionar Ordem de Produto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insira os detalhes da ordem de produto. Certifique-se de preencher todos os campos obrigatórios para garantir o processamento correto.
          </DialogContentText>

          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="productOrderId"
                name="productOrderId"
                label="Nº da Ordem de Produto"
                type="text"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="name"
                name="name"
                label="Título"
                type="text"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Descrição"
                type="text"
                fullWidth
                multiline
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={createOrderMutation.isPending}>
            {createOrderMutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
