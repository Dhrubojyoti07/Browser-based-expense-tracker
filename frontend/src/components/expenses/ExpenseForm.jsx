import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../utils/constants';

export default function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!category) newErrors.category = 'Select a category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addExpense({ name: name.trim(), amount: Number(amount), category });
      setName('');
      setAmount('');
      setCategory('');
      setErrors({});

      // Brief success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to add expense' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">Add Expense</h2>

      {errors.form && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="expense-name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Expense Name
          </label>
          <input
            id="expense-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
            }`}
            placeholder="e.g. Lunch, Taxi fare"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="expense-amount" className="mb-1.5 block text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <input
            id="expense-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.amount ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
            }`}
            placeholder="0.00"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="expense-category" className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.category ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
            }`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {submitting ? 'Adding…' : 'Add Expense'}
        </button>
      </form>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600"
          >
            <CheckCircle className="h-4 w-4" />
            Expense added successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
