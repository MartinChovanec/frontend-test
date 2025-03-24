'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrace komponent Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LoginFrequencyChartProps {
  loginHistory: { id: number; date: string | Date; device: string; browser: string; ip: string }[];
}

export const LoginFrequencyChart: React.FC<LoginFrequencyChartProps> = ({ loginHistory }) => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  // Inicializace objektu pro počet přihlášení pro každý den v posledních 30 dnech
  const frequency: { [key: string]: number } = {};

  // Vygenerování klíčů pro každý den
  for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    frequency[key] = 0;
  }

  // Agregace dat
  loginHistory.forEach((login) => {
    const loginDate = new Date(login.date);
    if (loginDate >= thirtyDaysAgo && loginDate <= now) {
      const key = loginDate.toISOString().split('T')[0];
      if (frequency[key] !== undefined) {
        frequency[key]++;
      }
    }
  });

  const labels = Object.keys(frequency);
  const dataCounts = Object.values(frequency);

  const data = {
    labels,
    datasets: [
      {
        label: 'Přihlášení',
        data: dataCounts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Frekvence přihlášení za posledních 30 dní' },
    },
  };

  return <Line data={data} options={options} />;
};

export default LoginFrequencyChart;
