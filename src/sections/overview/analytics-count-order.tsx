import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: Record<
    string,
    {
      counter: number;
      status: string;
      updatedAt: Date;
    }
  >;
};

export function AnalyticsCountOrders({ title, subheader, data, ...other }: Props) {
  const theme = useTheme();

  // Define cores para os status
  const statusColors: Record<string, string> = {
    ON: theme.palette.success.main,
    OFF: theme.palette.divider,
    PAUSE: theme.palette.warning.main,
    EMERGENCY: theme.palette.error.main,
  };

  // Prepara os dados do gráfico
  const categories = Object.keys(data); // productOrderIds
  const series = [
    {
      name: 'Orders',
      data: categories.map((key) => data[key].counter), // Counter para cada productOrderId
    },
  ];

  const chartColors = categories.map((key) => statusColors[data[key].status] || theme.palette.grey[500]);

  const chartOptions = useChart({
    plotOptions: {
      bar: {
        distributed: true, // Ativa cores distintas por barra
        dataLabels: {
          position: 'top', // Posição dos data labels
        },
      },
    },
    colors: chartColors, // Aplica as cores dinâmicas
    stroke: {
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value: number, { dataPointIndex }: { dataPointIndex: number }) => {
          const productId = categories[dataPointIndex];
          const { status, counter, updatedAt } = data[productId];
          return `${counter} Counts | Status: ${status} | ${new Date(updatedAt).toLocaleString()}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="bar"
        series={series}
        options={chartOptions}
        height={364}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
        {Object.entries(statusColors).map(([status, color]) => (
          <Box key={status} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{ width: 16, height: 16, backgroundColor: color, mr: 1, borderRadius: '50%' }} />
            <Typography variant="body2">{status}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
