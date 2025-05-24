import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppState from '../../store/useAppState';
import ChartSection from './ChartSection';
import TransactionSection from './TransactionSection';
import DailyBudget from './DailyBudget';
import GoalTracker from './GoalTracker';
import DebtTracker from './DebtTracker';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppState((state) => state.user);
  const isDarkMode = useAppState((state) => state.isDarkMode);
  const toggleDarkMode = useAppState((state) => state.toggleDarkMode);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkAdminRole = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
      }
    };

    checkAdminRole();
  }, [user, navigate]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finance Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={() => auth.signOut()}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyBudget />
          <ChartSection />
          <TransactionSection />
          <GoalTracker />
          <DebtTracker />
        </div>
      </main>
    </div>
  );
}