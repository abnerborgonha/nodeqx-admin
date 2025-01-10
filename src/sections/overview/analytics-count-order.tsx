
import type { CardProps } from '@mui/material/Card';

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Chart, useChart } from 'src/components/chart';

import type { Stream } from './view';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: Stream[];
};

function StatusItem({ status, color }: { status: string, color: string }) {
  return (
    <Box key={status} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <Box sx={{ width: 16, height: 16, backgroundColor: color, mr: 1, borderRadius: '50%' }} />
      <Typography variant="body2">{status}</Typography>
    </Box>
  )
}

export function AnalyticsCountOrders({ title, subheader, data, ...other }: Props) {
  const theme = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Define cores para os status
  const statusColors: Record<string, string> = {
    ON: theme.palette.success.main,
    // OFF: theme.palette.divider,
    PAUSE: theme.palette.warning.main,
    // EMERGENCY: theme.palette.error.main,
  };

  // Filtra os dados com base no status selecionado
  const filteredData = selectedStatus === 'ALL' ? data :
    data.filter((value) => value.status === selectedStatus)

  // Prepara os dados do gráfico
  const categories = filteredData.map((f) => f.order) // productOrderIds
  const series = [
    {
      name: 'Orders',
      data: filteredData.map(f => f.counter), // Counter para cada productOrderId
    },
  ];

  const chartColors = filteredData.map(f => statusColors[f.status]) || theme.palette.grey[500];

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
          const formatterData = filteredData.find(f => f.order === productId);
          const { status, counter } = formatterData || {};
          return `${counter} Counts | Status: ${status}`;
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
      <CardHeader title={title} subheader={subheader} action={
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="ALL">Todos</MenuItem>
            {Object.entries(statusColors).map(([status, color], index) => (
              <MenuItem key={status} value={status}>
                <StatusItem key={`${index}-${status}`} status={status} color={color} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      } />
      <Chart
        type="bar"
        series={series}
        options={chartOptions}
        height={364}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
        {Object.entries(statusColors).map(([status, color], index) => (
          <StatusItem key={index} status={status} color={color} />
        ))}
      </Box>
    </Card>
  );
}
