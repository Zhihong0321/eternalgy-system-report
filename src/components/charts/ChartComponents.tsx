'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DepartmentStatsChartProps {
  data: Array<{
    user_department: string;
    total_interactions: number;
    active_users: number;
  }>;
}

export function DepartmentStatsChart({ data }: DepartmentStatsChartProps) {
  const chartData = {
    labels: data.map(d => d.user_department),
    datasets: [
      {
        label: 'Total Interactions',
        data: data.map(d => d.total_interactions),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Active Users',
        data: data.map(d => d.active_users),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Department Activity',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

interface SystemSectionChartProps {
  data: Array<{
    system_section: string;
    total_interactions: number;
    unique_users: number;
  }>;
}

export function SystemSectionChart({ data }: SystemSectionChartProps) {
  const chartData = {
    labels: data.map(d => d.system_section),
    datasets: [
      {
        label: 'Usage Count',
        data: data.map(d => d.total_interactions),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'System Section Usage',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}

interface HourlyActivityChartProps {
  data: Array<{
    hour: string;
    interaction_count: number;
  }>;
}

export function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const chartData = {
    labels: data.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: 'Interactions',
        data: data.map(d => d.interaction_count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hourly Activity Pattern',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

interface FunctionUsageChartProps {
  data: Array<{
    system_function: string;
    usage_count: number;
    system_section: string;
  }>;
}

export function FunctionUsageChart({ data }: FunctionUsageChartProps) {
  const chartData = {
    labels: data.map(d => d.system_function.length > 20 ? d.system_function.substring(0, 20) + '...' : d.system_function),
    datasets: [
      {
        label: 'Usage Count',
        data: data.map(d => d.usage_count),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Most Used Functions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

interface UserProductivityChartProps {
  data: Array<{
    user_uid: string;
    user_name?: string;
    user_department: string;
    quotations_generated: number;
    reports_written: number;
    total_interactions: number;
  }>;
}

export function UserProductivityChart({ data }: UserProductivityChartProps) {
  const chartData = {
    labels: data.map(d => d.user_name || d.user_uid),
    datasets: [
      {
        label: 'Quotations Generated',
        data: data.map(d => d.quotations_generated),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reports Written',
        data: data.map(d => d.reports_written),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Interactions',
        data: data.map(d => d.total_interactions),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Productivity (Sales Focus)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
