/* eslint-disable import/no-extraneous-dependencies */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { findAllOrders } from 'src/service/network/lib/order.network';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { Iconify } from 'src/components/iconify';

import { AnalyticsCountOrders } from '../analytics-count-order';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { data: dataOrders } = useQuery({ queryKey: ['orders'], queryFn: findAllOrders, refetchInterval: 2000 })
  const { data: dataDevices } = useQuery({ queryKey: ['devices'], queryFn: findAllDevices, refetchInterval: 2000 })



  const [activeOrders, totalOrders, totalCounter, groupedData] = useMemo(() => {
    let active = 0;
    let total = 0;
    let count = 0;

    const grouped: Record<string, { counter: number; updatedAt: Date; status: string }> = {};

    if (Array.isArray(dataOrders)) {
      total = dataOrders.length;

      dataOrders.forEach(({ status, historics, productOrderId }) => {
        if (status === 'ACTIVE') active += 1;

        if (Array.isArray(historics)) {
          count += historics.reduce((acc, { status: historicStatus, counter }) =>
            historicStatus === 'ON' ? acc + counter : acc, 0);

          // Obter o histórico mais recente
          const latestHistoric = historics.reduce((latest, current) =>
            new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest,
            historics[0]
          );

          // Adicionar ao agrupamento
          if (productOrderId) {
            grouped[productOrderId] = {
              counter: latestHistoric?.counter,
              updatedAt: latestHistoric?.updatedAt,
              status: latestHistoric?.status,
            };
          }
        }
      });
    }

    console.log('grouped...', grouped)

    return [active, total, count, grouped];
  }, [dataOrders]);

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
            title="Total de contagens"
            percent={3.6}
            total={totalCounter || 0}
            color="error"
            icon={<Iconify width={60} icon="solar:box-minimalistic-bold-duotone" />}
          />
        </Grid>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid xs={12}>
            <AnalyticsCountOrders
              title="Ordens x Contagens (Atual)"
              subheader="Veja a contagem de cada ordem ativas no momento"
              data={groupedData}
            />
          </Grid>
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

      </Grid>
    </DashboardContent>
  );
}
