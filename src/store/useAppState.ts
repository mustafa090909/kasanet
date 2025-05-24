import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  isDarkMode: boolean;
  transactions: Transaction[];
  dailyBudget: number;
  goals: Goal[];
  debts: Debt[];
  setUser: (user: User | null) => void;
  toggleDarkMode: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateDailyBudget: (amount: number) => void;
  addGoal: (goal: Goal) => void;
  addDebt: (debt: Debt) => void;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description: string;
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
}

interface Debt {
  id: string;
  title: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
}

const useAppState = create<AppState>((set) => ({
  user: null,
  isDarkMode: false,
  transactions: [],
  dailyBudget: 0,
  goals: [],
  debts: [],
  
  setUser: (user) => set({ user }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [...state.transactions, transaction] 
  })),
  updateDailyBudget: (amount) => set({ dailyBudget: amount }),
  addGoal: (goal) => set((state) => ({ 
    goals: [...state.goals, goal] 
  })),
  addDebt: (debt) => set((state) => ({ 
    debts: [...state.debts, debt] 
  })),
}));

export default useAppState;