import React from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog, Button, MenuItem, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";

import { removeOrder } from "src/service/network/lib/order.network";

import { Iconify } from "src/components/iconify";

export function OrderRemove({ orderId }: { orderId: string }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const removeOrderMutation = useMutation({
    mutationFn: removeOrder,
    onSuccess: () => {
      enqueueSnackbar('Ordem fechada com sucesso!', {
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
    removeOrderMutation.mutate(id);
  }

  return (
    <>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleClickOpen}>
        <Iconify icon="solar:trash-bin-2-bold-duotone" />
        Remover
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deseja remove a ordem de produção?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Ao remover a ordem de produção, todos os dados associados a ela serão permanentemente excluídos do sistema. Essa ação é irreversível. Certifique-se de que deseja prosseguir antes de confirmar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => handleCloseOrder(orderId)} autoFocus>
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}