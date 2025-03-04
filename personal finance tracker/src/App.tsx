import React, { useState } from 'react';
import { PlusCircle, Wallet, ArrowUpCircle, ArrowDownCircle, PieChart, Trash2 } from 'lucide-react';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
};

// Format number to Indian currency format
const formatIndianCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formatter.format(amount);
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: Number(amount),
      type,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount('');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const balance = transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Wallet className="text-indigo-600" />
              Finance Tracker
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg">Balance</p>
                <PieChart className="h-6 w-6 opacity-75" />
              </div>
              <p className="text-2xl font-bold">{formatIndianCurrency(balance)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg">Income</p>
                <ArrowUpCircle className="h-6 w-6 opacity-75" />
              </div>
              <p className="text-2xl font-bold">{formatIndianCurrency(income)}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg">Expenses</p>
                <ArrowDownCircle className="h-6 w-6 opacity-75" />
              </div>
              <p className="text-2xl font-bold">{formatIndianCurrency(expenses)}</p>
            </div>
          </div>

          {/* Add Transaction Form */}
          <form onSubmit={addTransaction} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount in ₹"
                className="w-full md:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="w-full md:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Add
              </button>
            </div>
          </form>

          {/* Transactions List */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="h-5 w-5" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatIndianCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No transactions yet. Add one to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;