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
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ResultsChart = ({ data }) => {
  const chartData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    datasets: [
      {
        label: 'Exhale-Inhale',
        data: data.exhaleInhale,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Front-Rear',
        data: data.frontRear,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      },
      {
        label: 'Left-Right',
        data: data.leftRight,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Measurement Patterns'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ResultsChart;
