/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { setupOrder } from 'src/service/network/lib/order.network';

import { Iconify } from 'src/components/iconify';

export function OrderSetup({ orderId, inSetup }: { orderId: string, inSetup: boolean }) {
  const [open, setOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const setupOrderMutation = useMutation({
    mutationFn: setupOrder,
    onSuccess: () => {
      enqueueSnackbar(`${inSetup ? 'Dipositivo em setup' : 'Dipositivo saiu de setup'}`, {
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const operation = inSetup ? 'STOP' : 'START';
    setupOrderMutation.mutate({ id: orderId, operation });
  };

  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <Iconify icon="solar:danger-triangle-bold-duotone" />
        {inSetup ? 'Parar' : 'Iniciar'} Setup
      </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>{inSetup ? 'Para' : 'Iniciar'} Setup</DialogTitle>
        <DialogContent>
          {!inSetup && <DialogContentText>
            Deseja colocar o dispositivo em setup? A ordem continuara ativa porém o dispositivo não ira mais registrar as contagens.
          </DialogContentText>}
          {inSetup && <DialogContentText>
            Deseja tirar o dispositivo do setup? O dispositivo voltara a registrar as contagens na orderm atual.
          </DialogContentText>}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" disabled={setupOrderMutation.isPending}>
            {setupOrderMutation.isPending ? 'Enviando...' : `${inSetup ? 'Sim, tirar do setup' : 'Sim, colocar em setup'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
