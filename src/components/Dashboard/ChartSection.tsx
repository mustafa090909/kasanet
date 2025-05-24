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
import useAppState from '../../store/useAppState';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartSection() {
  const transactions = useAppState((state) => state.transactions);
  const isDarkMode = useAppState((state) => state.isDarkMode);

  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    
    acc[monthYear] += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Balance',
        data: Object.values(monthlyData),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? 'white' : 'black'
        }
      },
      title: {
        display: true,
        text: 'Monthly Financial Overview',
        color: isDarkMode ? 'white' : 'black'
      }
    },
    scales: {
      y: {
        ticks: {
          color: isDarkMode ? 'white' : 'black'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? 'white' : 'black'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
}