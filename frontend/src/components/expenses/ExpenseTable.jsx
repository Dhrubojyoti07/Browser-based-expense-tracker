import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../utils/constants';

export default function ExpenseTable() {
  const { expenses, deleteExpense } = useExpenses();

  // Sort by date descending (newest first)
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort(
      (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
    );
  }, [expenses]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      deleteExpense(id);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-400">
          No expenses yet. Add one above to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {sortedExpenses.map((expense) => {
                  const id = expense._id || expense.id;
                  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

                  return (
                    <motion.tr
                      key={id}
                      layout
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-6 py-3.5 font-medium text-gray-900">
                        {expense.name}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${color}18`,
                            color: color,
                          }}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-700">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">
                        {formatDate(expense.createdAt || expense.date)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(id, expense.name)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
