// eslint-disable-next-line import/no-extraneous-dependencies
import { ptBR } from 'date-fns/locale';
import { format, formatDistance } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Table, Alert, styled, Collapse, TableBody, TableHead, Typography, TableContainer } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { DeviceItem } from 'src/sections/device/device-item';

import { OrderClose } from '../close';
import { OrderSetup } from '../setup';
import { OrderRemove } from '../remove';
import { OrderRedirect } from '../redirect';

import type { OrderProps } from '../types/order.type';

// ----------------------------------------------------------------------


type OrderTableRowProps = {
  row: OrderProps;
  selected: boolean;
  disabled: boolean;
  onSelectRow: () => void;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  }
}));


export function OrderTableRow({ row, selected, disabled = false, onSelectRow }: OrderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openHistoric, setOpenHistoric] = useState<boolean>(false);

  const [inSetup, setInSetup] = useState<boolean>(false);

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
    'PAUSE': <Label color="warning">PAUSE</Label>,
    'EMERGENCY': <Label color="error">EMERGENCY</Label>,
    'STOP': <Label color="info">STOP</Label>,
    'SETUP': <Label color="secondary">SETUP</Label>,
    'OFF': <Label color="default">OFF</Label>
  }

  useEffect(() => {
    if (row.historics?.[0]?.status === 'SETUP') {
      setInSetup(true);
    } else {
      setInSetup(false);
    }
  }, [row])

  return (
    <>
      <StyledTableRow hover tabIndex={-1} role="checkbox" selected={selected} style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}>
        <StyledTableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </StyledTableCell>

        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleOpenHistoric}
          >
            {openHistoric ? <Iconify icon="solar:alt-arrow-up-linear" /> : <Iconify icon="solar:alt-arrow-down-linear" />}
          </IconButton>
        </StyledTableCell>

        <StyledTableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.productOrderId}
          </Box>
        </StyledTableCell>

        <StyledTableCell>{row.name}</StyledTableCell>

        <StyledTableCell>
          <Label color={(row.status === 'CLOSED' && 'error') || 'success'}>{row.status === 'ACTIVE' ? 'ATIVO' : 'FECHADO'}</Label>
        </StyledTableCell>

        <StyledTableCell>{format(row.createdAt, 'dd/MM/yyyy HH:mm:ss:ms')}</StyledTableCell>

        <StyledTableCell>{format(row.updatedAt, 'dd/MM/yyyy HH:mm:ss:ms')}</StyledTableCell>

        <StyledTableCell>
          {row.status === 'CLOSED' && <Label color="info">
            {formatDistance(new Date(row.updatedAt), new Date(row.createdAt), { addSuffix: true, locale: ptBR })}
          </Label>}
        </StyledTableCell>

        <StyledTableCell>
          {row.status === 'ACTIVE' ? <DeviceItem device={row.device} simpleView /> : row.device.deviceId}
        </StyledTableCell>

        <StyledTableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </StyledTableCell>

      </StyledTableRow>
      <StyledTableCell colSpan={12}>
        {inSetup && <Alert severity='warning'>Maquina em setup. Lembre de tirar a maquina de setup para conseguir contituar o processo da OP.</Alert>}
      </StyledTableCell>



      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={openHistoric} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                Historico
              </Typography>
              <TableContainer sx={{ maxHeight: 200 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Contagem</StyledTableCell>
                      <StyledTableCell>Data/Hora (Inicio)</StyledTableCell>
                      <StyledTableCell>Data/Hora (Atual)</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.historics?.map((historyRow) => (
                      <TableRow key={historyRow.id}>
                        <StyledTableCell component="th" scope="row">
                          {statusHistoricOrder[historyRow.status]}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {historyRow.counter}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {format(historyRow.createdAt, 'dd/MM/yyyy HH:mm:ss:ms')}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {format(historyRow.updatedAt, 'dd/MM/yyyy HH:mm:ss:ms')}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>




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
            width: 240,
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
          {row.status === 'ACTIVE' && <OrderRedirect orderId={row.id} />}
          {row.status === 'ACTIVE' && <OrderSetup orderId={row.id} inSetup={inSetup} />}
          {row.status === 'ACTIVE' && <OrderClose orderId={row.id} />}
          {row.status === 'CLOSED' && <OrderRemove orderId={row.id} />}
        </MenuList>
      </Popover>


    </>
  );
}
