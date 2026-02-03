
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
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-rose-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Decorative Side - Hidden on small mobile, compact on tablet */}
          <div className="hidden md:flex md:w-1/3 bg-rose-500 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <Heart className="w-8 h-8 lg:w-12 lg:h-12 mb-4 lg:mb-6 fill-white opacity-20" />
              <h2 className="text-2xl lg:text-3xl font-serif font-bold leading-tight mb-4">Set up your rhythm.</h2>
              <p className="text-rose-100 text-xs lg:text-sm leading-relaxed">
                We'll use this to predict your phases and provide romantic daily suggestions.
              </p>
            </div>
            <div className="relative z-10 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-rose-200">
              <Sparkles className="w-4 h-4" />
              <span>Private & Local</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full -ml-16 -mb-16 blur-3xl opacity-30" />
          </div>

          {/* Right Form Side */}
          <div className="w-full md:w-2/3 p-6 sm:p-10 lg:p-16">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-rose-600">01</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Profile Details</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Profile Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-rose-300 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-sm sm:text-base text-slate-800 dark:text-white"
                    placeholder="Who are we tracking for?"
                  />
                </div>
              </section>

              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-rose-600">02</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Cycle History</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Last Period Start</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={lastPeriodStart}
                        onChange={(e) => setLastPeriodStart(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-rose-300 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-sm sm:text-base text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Cycle Type</label>
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setCycleType('regular')}
                        className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                          cycleType === 'regular'
                            ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        Regular (28d)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCycleType('irregular')}
                        className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                          cycleType === 'irregular'
                            ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>
                </div>

                {cycleType === 'irregular' && (
                  <div className="animate-in slide-in-from-top-4 duration-300 space-y-1">
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Avg Cycle Length (Days)</label>
                    <input
                      type="number"
                      min="20"
                      max="45"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-rose-300 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-sm sm:text-base text-slate-800 dark:text-white"
                    />
                  </div>
                )}
              </section>

              <button
                type="submit"
                className="group w-full py-4 sm:py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl sm:rounded-[2rem] font-bold text-base sm:text-lg shadow-xl shadow-rose-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Complete Profile</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-3 text-slate-400 px-4">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span className="text-[10px] sm:text-xs font-medium text-center">Update your dates anytime from the calendar dashboard.</span>
      </div>
    </div>
  );
};

export default AddUserForm;
