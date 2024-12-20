import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { findAllOrders } from 'src/service/network/lib/order.network';
import { findAllDevices } from 'src/service/network/lib/device.network';

import { Iconify } from 'src/components/iconify';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { data: dataOrders } = useQuery({ queryKey: ['orders'], queryFn: findAllOrders, refetchInterval: 2000 })
  const { data: dataDevices } = useQuery({ queryKey: ['devices'], queryFn: findAllDevices, refetchInterval: 2000 })

  const [activeOrders, totalOrderes, totalCounter] = useMemo(() => {
    const active = dataOrders?.filter(order => order.status === 'ACTIVE').length || 0
    const total = dataOrders?.length || 0

    const count = dataOrders?.reduce((acc, current) => {
      const { historics } = current;
      if (historics) {
        historics.forEach((historic) => {
          if (historic.status === 'ON')
            acc += historic.counter
        })
      }
      return acc
    }, 0)

    return [active, total, count]
  }, [dataOrders])


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
            total={totalOrderes}
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

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

      </Grid>
    </DashboardContent>
  );
}
