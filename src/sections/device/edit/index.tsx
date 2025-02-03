/* eslint-disable import/no-extraneous-dependencies */
import type { CreateOrderProps } from 'src/service/network/lib/order.network';

import React from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { deviceBoardConfig } from 'src/service/network/lib/device.network';


export function DeviceEdit({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const editDeviceMutation = useMutation({
    mutationFn: deviceBoardConfig,
    onSuccess: () => {
      enqueueSnackbar('Dipositivo atualizado com sucesso!', {
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as unknown as CreateOrderProps;

    editDeviceMutation.mutate({
      id,
      deviceId: formJson.deviceId,
    });
  };

  return (
    <>
      <Button
        size="small"
        onClick={handleClickOpen}
      >
        Editar
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Editar ID do Dispositivo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ao alterar o ID do dispositivo, o dispositivo reiniciara. Após ele se reconectar um no dipositivo com o ID informado será criado.
          </DialogContentText>

          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="deviceId"
                name="deviceId"
                label="ID do dispositvo"
                type="text"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={editDeviceMutation.isPending}>
            {editDeviceMutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
