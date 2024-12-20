/* eslint-disable import/no-extraneous-dependencies */
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { _orders } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { findAllOrders } from 'src/service/network/lib/order.network';

import { Scrollbar } from 'src/components/scrollbar';

import { OrderCreate } from '../create';
import { TableNoData } from './order-no-data';
import { OrderTableRow } from './order-table-row';
import { TableIsPending } from './order-is-pending';
import { OrderTableHead } from './order-table-head';
import { TableEmptyRows } from './order-empty-rows';
import { OrderTableToolbar } from './order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';

import type { OrderProps } from '../types/order.type';

// ----------------------------------------------------------------------

export function OrderView() {
  const { data, isLoading, error, isError } = useQuery({ queryKey: ['orders'], queryFn: findAllOrders, refetchInterval: 2000 })
  const _orders = data || [];

  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: OrderProps[] | undefined = applyFilter({
    inputData: _orders,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName || isError

  if (isError) {
    enqueueSnackbar(error.message, {
      variant: 'error'
    });
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Ordens de Produto
        </Typography>
        <OrderCreate />
      </Box>

      <Card>
        <OrderTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_orders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _orders.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'productOrderId', label: 'Nº da Ordem' },
                  { id: 'name', label: 'Titulo' },
                  { id: 'description', label: 'Descrição' },
                  { id: 'status', label: 'Status' },
                  { id: 'createdAt', label: 'Data Inicio' },
                  { id: 'updatedAt', label: 'Data Fim' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _orders.length)}
                />
                {isLoading && <TableIsPending />}
                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_orders.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `mais do que ${to}`}`}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('productOrderId');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
