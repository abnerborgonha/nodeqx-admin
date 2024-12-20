// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';
import { Table, Collapse, TableBody, TableHead, Typography } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { OrderClose } from '../close';
import { OrderRemove } from '../remove';
import { OrderRedirect } from '../redirect';

import type { OrderProps } from '../types/order.type';

// ----------------------------------------------------------------------


type OrderTableRowProps = {
  row: OrderProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function OrderTableRow({ row, selected, onSelectRow }: OrderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openHistoric, setOpenHistoric] = useState<boolean>(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenHistoric = useCallback(() => {
    setOpenHistoric(prev => !prev);
  }, []);

  const statusHistoricOrder = {
    'ON': <Label color="success">ON</Label>,
    'PAUSE':  <Label color="warning">PAUSE</Label>,
    'EMERGENCY': <Label color="error">EMERGENCY</Label>,
    'STOP':  <Label color="info">STOP</Label>,
    'OFF':  <Label color="default">OFF</Label>
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleOpenHistoric}
          >
            {openHistoric ? <Iconify icon="solar:alt-arrow-up-linear" /> : <Iconify icon="solar:alt-arrow-down-linear" />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.productOrderId}
          </Box>
        </TableCell>

        <TableCell>{row.name}</TableCell>

        <TableCell>{row.description}</TableCell>

        <TableCell>
          <Label color={(row.status === 'CLOSED' && 'error') || 'success'}>{row.status === 'ACTIVE' ? 'ATIVO' : 'FECHADO'}</Label>
        </TableCell>

        <TableCell>{format(row.createdAt, 'dd/MM/yyyy HH:mm')}</TableCell>

        <TableCell>{format(row.updatedAt, 'dd/MM/yyyy HH:mm')}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openHistoric} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Historico
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Contagem</TableCell>
                    <TableCell>Data/Hora</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.historics?.map((historyRow) => (
                    <TableRow key={historyRow.id}>
                      <TableCell component="th" scope="row">
                        {statusHistoricOrder[historyRow.status]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.counter}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {format(historyRow.updatedAt, 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <OrderRedirect />
          <OrderClose orderId={row.id}/>
          <OrderRemove orderId={row.id} />
        </MenuList>
      </Popover>
    </>
  );
}
