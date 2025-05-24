import { useState } from 'react';
import useAppState from '../../store/useAppState';
import { db } from '../../firebase/config';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function TransactionSection() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const user = useAppState((state) => state.user);
  const transactions = useAppState((state) => state.transactions);
  const addTransaction = useAppState((state) => state.addTransaction);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const transaction = {
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: new Date(),
      userId: user.uid
    };

    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    addTransaction({ ...transaction, id: docRef.id });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
    // Update local state through Zustand
    useAppState.setState((state) => ({
      transactions: state.transactions.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Transactions</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </form>

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
          >
            <div>
              <span className={`font-bold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{transaction.category}</span>
            </div>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}