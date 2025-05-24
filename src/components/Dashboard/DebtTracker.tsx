import { useState } from 'react';
import useAppState from '../../store/useAppState';
import { db } from '../../firebase/config';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function DebtTracker() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const user = useAppState((state) => state.user);
  const debts = useAppState((state) => state.debts);
  const addDebt = useAppState((state) => state.addDebt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const debt = {
      title,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      dueDate: new Date(dueDate),
      userId: user.uid
    };

    const docRef = await addDoc(collection(db, 'debts'), debt);
    addDebt({ ...debt, id: docRef.id });

    setTitle('');
    setAmount('');
    setInterestRate('');
    setDueDate('');
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'debts', id));
    useAppState.setState((state) => ({
      debts: state.debts.filter(d => d.id !== id)
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Debt Tracker</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Debt Title"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
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
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Interest Rate (%)"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Add Debt
        </button>
      </form>

      <div className="space-y-4">
        {debts.map((debt) => (
          <div key={debt.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{debt.title}</h3>
              <button
                onClick={() => handleDelete(debt.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>Amount: ${debt.amount}</p>
              <p>Interest Rate: {debt.interestRate}%</p>
              <p>Due Date: {new Date(debt.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}