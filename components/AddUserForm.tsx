
import React, { useState } from 'react';
import { UserPlus, Calendar, Info } from 'lucide-react';
import { UserProfile } from '../types';

interface AddUserFormProps {
  onAdd: (user: UserProfile) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [cycleType, setCycleType] = useState<'regular' | 'irregular'>('regular');
  const [cycleLength, setCycleLength] = useState(28);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastPeriodStart) return;

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      lastPeriodStart,
      cycleLength: cycleType === 'regular' ? 28 : cycleLength,
      periodDuration: 5,
      createdAt: Date.now(),
    };

    onAdd(newUser);
    setName('');
    setLastPeriodStart('');
    setCycleLength(28);
    setCycleType('regular');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center mb-8">
        <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-full mb-4">
          <UserPlus className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">Create New Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Data stays local to this device.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Partner's Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-400 outline-none transition-all"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Day of Last Period</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="date"
              required
              value={lastPeriodStart}
              onChange={(e) => setLastPeriodStart(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-400 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cycle Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCycleType('regular')}
              className={`py-3 rounded-xl border transition-all text-sm font-medium ${
                cycleType === 'regular'
                  ? 'bg-rose-50 border-rose-400 text-rose-600 dark:bg-rose-900/20'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              Regular (28d)
            </button>
            <button
              type="button"
              onClick={() => setCycleType('irregular')}
              className={`py-3 rounded-xl border transition-all text-sm font-medium ${
                cycleType === 'irregular'
                  ? 'bg-rose-50 border-rose-400 text-rose-600 dark:bg-rose-900/20'
                  : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {cycleType === 'irregular' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Average Cycle Length (Days)</label>
            <input
              type="number"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-400 outline-none transition-all"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
