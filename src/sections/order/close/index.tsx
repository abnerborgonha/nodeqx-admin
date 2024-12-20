import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MenuItem } from "@mui/material";

import { closeOrder } from "src/service/network/lib/order.network";

import { Iconify } from "src/components/iconify";

export function OrderClose({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const closeOrderMutation = useMutation({
    mutationFn: closeOrder,
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
    closeOrderMutation.mutate(id);
  }

  return (
    <MenuItem sx={{ color: 'error.main' }} onClick={() => handleCloseOrder(orderId)}>
      <Iconify icon="solar:close-square-bold" />
      Fechar
    </MenuItem>)
}