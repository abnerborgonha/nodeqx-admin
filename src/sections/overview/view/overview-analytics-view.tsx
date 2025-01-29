/* eslint-disable import/no-extraneous-dependencies */
import { io } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { useState, Suspense, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { Iconify } from 'src/components/iconify';

import { AnalyticsCountOrders } from '../analytics-count-order';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

type StreamStatus = 'ON' | 'PAUSE' | 'EMERGENCY' | 'STOP' | 'OFF';

export type Stream = {
  device: string;
  order: string;
  counter: number;
  status: StreamStatus;
}


export function OverviewAnalyticsView() {
  const [stream, setStream] = useState<Stream[]>([]);
  const [activeOrders, setActiveOrders] = useState<number>(0);
  const [totalCounter, setTotalCounter] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);


  const { data: dataDevices } = useQuery({ queryKey: ['devices'], queryFn: findAllDevices })

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('orders', (data: Stream[]) => {
      console.log('[STREAM ORDERS]', data);
      setStream(data);
    });

    socket.on('total-active-orders', (data: number) => {
      setActiveOrders(data);
    });

    socket.on('total-counts', (data: number) => {
      setTotalCounter(data);
    });

    socket.on('total-orders', (data: number) => {
      setTotalOrders(data);
    })

    return () => {
      socket.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Olá, Bem vindo de volta 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Ordens"
            percent={2.6}
            total={totalOrders}
            icon={<Iconify width={60} icon="solar:course-up-bold-duotone" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Ordens Ativas"
            percent={-0.1}
            total={activeOrders}
            color="secondary"
            icon={<Iconify width={60} icon="solar:clipboard-check-bold-duotone" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Dispositivos"
            percent={2.8}
            total={dataDevices?.length || 0}
            color="warning"
            icon={<Iconify width={60} icon="solar:home-wifi-angle-bold-duotone" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Contagens Ativas"
            percent={3.6}
            total={totalCounter || 0}
            color="error"
            icon={<Iconify width={60} icon="solar:box-minimalistic-bold-duotone" />}
          />
        </Grid>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid xs={12}>
            <Suspense fallback={<h1>Loading...</h1>}>
              <AnalyticsCountOrders
                title="Ordens x Contagens (Atual)"
                subheader="Veja a contagem de cada ordem ativas no momento"
                data={stream}
              />
            </Suspense>
          </Grid>
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

      </Grid>
    </DashboardContent>
  );
}
