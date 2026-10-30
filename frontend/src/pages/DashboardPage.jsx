import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, IndianRupee, Tags } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseChart from '../components/expenses/ExpenseChart';
import CategoryProgress from '../components/expenses/CategoryProgress';
import ExpenseTable from '../components/expenses/ExpenseTable';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { expenses, totalAmount, categoryTotals } = useExpenses();

  const uniqueCategories = useMemo(
    () => Object.keys(categoryTotals).length,
    [categoryTotals]
  );

  const summaryCards = [
    {
      label: 'Total Expenses',
      value: expenses.length,
      icon: Receipt,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalAmount),
      icon: IndianRupee,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Categories',
      value: uniqueCategories,
      icon: Tags,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            {...fadeUp}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form + Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.25 }}>
          <ExpenseForm />
        </motion.div>
        <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.3 }}>
          <ExpenseChart />
        </motion.div>
      </div>

      {/* Category progress */}
      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.35 }}>
        <CategoryProgress />
      </motion.div>

      {/* Expense table */}
      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.4 }}>
        <ExpenseTable />
      </motion.div>
    </div>
  );
}
