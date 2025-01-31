import React from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, Button, MenuItem, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import { openOrder } from "src/service/network/lib/order.network";

import { Iconify } from "src/components/iconify";

export function OrderOpen({ orderId }: { orderId: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const openOrderMutation = useMutation({
    mutationFn: openOrder,
    onSuccess: () => {
      enqueueSnackbar('Ordem aberta com sucesso!', {
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

  const handleCloseOrder = (id: string) => {
    openOrderMutation.mutate(id);
  }

  return (
    <>
      <MenuItem sx={{ color: 'success.main' }} onClick={handleClickOpen}>
        <Iconify icon="solar:check-square-bold-duotone" />
        Abrir
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deseja re-abrir a ordem de produção?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao reabrir a ordem de produção, o processo de contagem ira contituar e modificar o histórico de contagens.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => handleCloseOrder(orderId)} autoFocus>
            Abrir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}