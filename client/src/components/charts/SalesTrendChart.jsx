import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SalesTrendChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const labels = data.map((d) => d.month);
  const salesValues = data.map((d) => d.sales);

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Monthly Sales (₹)',
        data: salesValues,
        borderColor: '#3B82F6',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3B82F6',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDark ? '#111827' : '#FFFFFF',
        titleColor: isDark ? '#F9FAFB' : '#0F172A',
        bodyColor: isDark ? '#9CA3AF' : '#475569',
        borderColor: isDark ? '#1F2937' : '#E2E8F0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#6B7280' : '#94A3B8' },
      },
      y: {
        grid: { color: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: isDark ? '#6B7280' : '#94A3B8' },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
