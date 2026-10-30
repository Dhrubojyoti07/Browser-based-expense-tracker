import { motion } from 'framer-motion';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORY_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function CategoryProgress() {
  const { categoryTotals, totalAmount } = useExpenses();

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (categories.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">Category Breakdown</h2>

      <div className="space-y-4">
        {categories.map(([category, amount]) => {
          const pct = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
          const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

          return (
            <div key={category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-500">
                  {formatCurrency(amount)}{' '}
                  <span className="text-xs">({pct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
