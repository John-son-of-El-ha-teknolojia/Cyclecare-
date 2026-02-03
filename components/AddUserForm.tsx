
import React, { useState } from 'react';
import { UserPlus, Calendar, Info, Sparkles, ChevronRight, Heart } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface AddUserFormProps {
  onAdd: (user: UserProfile) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [cycleType, setCycleType] = useState<'regular' | 'irregular'>('regular');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastPeriodStart) return;

    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      lastPeriodStart,
      cycleLength: cycleType === 'regular' ? 28 : Number(cycleLength),
      periodDuration: Number(periodDuration),
      createdAt: Date.now(),
    };

    onAdd(newUser);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-rose-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/3 bg-rose-500 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <Heart className="w-8 h-8 lg:w-12 lg:h-12 mb-4 lg:mb-6 fill-white opacity-20" />
              <h2 className="text-2xl lg:text-3xl font-serif font-bold leading-tight mb-4">Set up your rhythm.</h2>
              <p className="text-rose-100 text-xs lg:text-sm leading-relaxed">
                Provide your basic cycle details to get accurate predictions and daily support.
              </p>
            </div>
            <div className="relative z-10 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-rose-200">
              <Sparkles className="w-4 h-4" />
              <span>Personalized for You</span>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-6 sm:p-10 lg:p-16">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-rose-600">01</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identify</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Profile Nickname</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                    placeholder="e.g., My Cycle Tracker"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-rose-600">02</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculations</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Last Period Start</label>
                    <input
                      type="date"
                      required
                      value={lastPeriodStart}
                      onChange={(e) => setLastPeriodStart(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Cycle Type</label>
                    <select 
                      value={cycleType} 
                      onChange={(e) => setCycleType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                    >
                      <option value="regular">Regular (28 days)</option>
                      <option value="irregular">Custom / Irregular</option>
                    </select>
                  </div>
                </div>

                {cycleType === 'irregular' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Avg. Cycle Length (Days)</label>
                      <input
                        type="number"
                        min="20"
                        max="50"
                        value={cycleLength}
                        onChange={(e) => setCycleLength(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Avg. Period Duration</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={periodDuration}
                        onChange={(e) => setPeriodDuration(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </section>

              <button
                type="submit"
                className="group w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Save Profile & Start Tracking</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
