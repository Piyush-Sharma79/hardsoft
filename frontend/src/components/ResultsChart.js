import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsChart = ({ data }) => {
  const chartData = {
    labels: ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'],
    datasets: [
      {
        label: 'Inhale Measurements',
        data: [data.IUFL, data.IUFR, data.IURL, data.IURR],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Exhale Measurements',
        data: [data.EUFL, data.EUFR, data.EURL, data.EURR],
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(168, 85, 247, 0.7)',
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Udder Measurements Comparison',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        },
        color: '#1F2937'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6B7280'
        },
        title: {
          display: true,
          text: 'Measurement Value',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: 'medium'
          },
          color: '#4B5563',
          padding: { top: 10, bottom: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6B7280'
        },
        title: {
          display: true,
          text: 'Udder Quarter',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: 'medium'
          },
          color: '#4B5563',
          padding: { top: 10, bottom: 0 }
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] p-6 bg-white rounded-xl shadow-inner">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ResultsChart;
