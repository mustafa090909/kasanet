import { useState, useEffect } from 'react';
import useAppState from '../../store/useAppState';

export default function DailyBudget() {
  const transactions = useAppState((state) => state.transactions);
  const dailyBudget = useAppState((state) => state.dailyBudget);
  const updateDailyBudget = useAppState((state) => state.updateDailyBudget);
  const [remaining, setRemaining] = useState(dailyBudget);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        return t.type === 'expense' && transactionDate.getTime() === today.getTime();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    setRemaining(dailyBudget - todaysExpenses);
  }, [transactions, dailyBudget]);

  const handleUpdateBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseFloat(e.target.value) || 0;
    updateDailyBudget(newBudget);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Daily Budget</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Set Daily Budget
          </label>
          <input
            type="number"
            value={dailyBudget}
            onChange={handleUpdateBudget}
            className="mt-1 block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Remaining Today: ${remaining.toFixed(2)}
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full ${
                remaining > dailyBudget * 0.5 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${(remaining / dailyBudget) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}