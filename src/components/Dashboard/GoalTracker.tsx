import { useState } from 'react';
import useAppState from '../../store/useAppState';
import { db } from '../../firebase/config';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function GoalTracker() {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const user = useAppState((state) => state.user);
  const goals = useAppState((state) => state.goals);
  const addGoal = useAppState((state) => state.addGoal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const goal = {
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: new Date(deadline),
      userId: user.uid
    };

    const docRef = await addDoc(collection(db, 'goals'), goal);
    addGoal({ ...goal, id: docRef.id });

    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'goals', id));
    useAppState.setState((state) => ({
      goals: state.goals.filter(g => g.id !== id)
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Financial Goals</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal Title"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="Target Amount"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="Current Amount"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Add Goal
        </button>
      </form>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
              <button
                onClick={() => handleDelete(goal.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Progress: ${goal.currentAmount} / ${goal.targetAmount}</span>
                <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}