import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORY_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart() {
  const { categoryTotals, totalAmount } = useExpenses();

  const hasData = Object.keys(categoryTotals).length > 0;

  const chartData = useMemo(() => {
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map((cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [categoryTotals]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 10,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed;
              const pct = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
              return ` ${formatCurrency(value)} (${pct}%)`;
            },
          },
        },
      },
    }),
    [totalAmount]
  );

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">Spending by Category</h2>

      {hasData ? (
        <div className="relative mx-auto h-64 w-full max-w-xs">
          <Doughnut data={chartData} options={chartOptions} />
          {/* Center text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          Add expenses to see chart
        </div>
      )}
    </div>
  );
}
