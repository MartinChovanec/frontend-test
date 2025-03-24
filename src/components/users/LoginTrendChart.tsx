'use client';

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type LoginHistoryEntry = {
  date: string;
};

type LoginTrendChartProps = {
  loginHistory: LoginHistoryEntry[];
};

const LoginTrendChart: React.FC<LoginTrendChartProps> = ({ loginHistory }) => {
  // Agregace loginů dle data
  const loginCounts: { [key: string]: number } = {};
  loginHistory.forEach((entry) => {
    // Extrahujeme jen datum ve formátu YYYY-MM-DD
    const dateKey = new Date(entry.date).toISOString().split("T")[0];
    loginCounts[dateKey] = (loginCounts[dateKey] || 0) + 1;
  });

  // Seřadíme data vzestupně
  const sortedDates = Object.keys(loginCounts).sort();
  const counts = sortedDates.map((date) => loginCounts[date]);

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: "Logins",
        data: counts,
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Overall login trend" },
    },
  };

  return <Line data={data} options={options} />;
};

export default LoginTrendChart;
