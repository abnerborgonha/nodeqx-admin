

import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Grid, Card, Paper, Drawer, Divider, Typography, IconButton, CardContent } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { DeviceItem } from '../../device/device-item'

import type { OrderProps } from '../types/order.type';

export const OrderDetail = ({ row }: { row: OrderProps }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  const labelOrderStatus: Record<any, any> = {
    'ACTIVE': <Label color="success">ATIVO</Label>,
    'CLOSED': <Label color="error">FECHADA</Label>,
  }

  return (
    <>
      {/* Button to open Drawer */}
      <IconButton onClick={toggleDrawer(true)}>
        <Iconify icon="mdi:file-document-edit" />
      </IconButton>

      {/* Drawer Component */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            height: '100%',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 2,
          },
        }}
      >
        {/* Drawer Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" padding={2}>
          <Typography variant="h6" gutterBottom>
            Detalhes da Ordem de Produção
          </Typography>
          <Icon
            icon="mdi:close"
            fontSize={24}
            style={{ cursor: 'pointer' }}
            onClick={toggleDrawer(false)}
          />
        </Box>
        <Divider />

        {/* Drawer Content */}
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
          <Grid container spacing={2}>
            {/* Order Details Section */}
            <Grid item xs={12} md={6}>

              {/* Order Details Card */}
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: 400,
                }}
              >
                <CardContent>
                  <Box display='flex' justifyContent='space-between' alignItems='center' sx={{
                    marginBottom: 2,
                  }}>
                    <Typography variant="subtitle2">
                      {row.productOrderId}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                      marginBottom: 2,
                    }}
                  >

                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Status: {labelOrderStatus[row.status]}
                    </Typography>

                  </Box>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Box display='flex' flexDirection='column' gap='6px'>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                          Criado: {format(row.createdAt, 'dd/MM/yyyy HH:mm:ss')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                          Atualizado: {format(row.updatedAt, 'dd/MM/yyyy HH:mm:ss')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Device Details Section */}
            <Grid item xs={12} md={6} >
              <DeviceItem device={row.device} simpleView />
            </Grid>

            {/* Timeline Section */}
            <Grid item xs={12} >
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <Icon icon="mdi:timeline-text" fontSize={20} style={{ marginRight: 8 }} />
                  Histórico
                </Typography>
                {/* Add timeline content here */}
              </Paper>
            </Grid>


          </Grid>
        </Box>
      </Drawer>
    </>
  );
};



