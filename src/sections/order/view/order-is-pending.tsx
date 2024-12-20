import type { TableRowProps } from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

type TableIsPendingProps = TableRowProps & {};

export function TableIsPending({...other }: TableIsPendingProps) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
        <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  );
}
