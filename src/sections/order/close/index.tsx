import React from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, Button, MenuItem, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import { closeOrder } from "src/service/network/lib/order.network";

import { Iconify } from "src/components/iconify";

export function OrderClose({ orderId }: { orderId: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const closeOrderMutation = useMutation({
    mutationFn: closeOrder,
    onSuccess: () => {
      enqueueSnackbar('Ordem fechada com sucesso!', {
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

  const handleCloseOrder = (id: string) => {
    closeOrderMutation.mutate(id);
  }

  return (
    <>
      <MenuItem sx={{ color: 'warning.main' }} onClick={handleClickOpen}>
        <Iconify icon="solar:close-square-bold" />
        Fechar
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deseja finalizar a ordem de produção?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao fechar a ordem de produção, os dados serão finalizados, o status será alterado para &quot;Fechada&quot; e os recursos liberados. Essa ação é irreversível. Certifique-se de que tudo está correto antes de continuar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => handleCloseOrder(orderId)} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}