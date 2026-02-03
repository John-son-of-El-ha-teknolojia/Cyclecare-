
import React, { useState } from 'react';
import { Sparkles, ChevronRight, Heart, Calendar } from 'lucide-react';
import { CycleModel } from '../types.ts';

interface AddUserFormProps {
  onSave: (cycle: CycleModel) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSave }) => {
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [cycleType, setCycleType] = useState<'regular' | 'irregular'>('regular');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriodStart) return;

    const cycleData: CycleModel = {
      lastPeriodStart,
      cycleLength: cycleType === 'regular' ? 28 : Number(cycleLength),
      periodDuration: Number(periodDuration),
    };

    onSave(cycleData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-rose-100 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex md:w-1/3 bg-rose-500 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <Heart className="w-8 h-8 lg:w-12 lg:h-12 mb-4 lg:mb-6 fill-white opacity-20" />
              <h2 className="text-2xl lg:text-3xl font-serif font-bold leading-tight mb-4">Your Cycle Profile.</h2>
              <p className="text-rose-100 text-xs lg:text-sm leading-relaxed">
                Set this once. We'll use these averages to predict your phases and provide romantic suggestions.
              </p>
            </div>
            <div className="relative z-10 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-rose-200">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Setup</span>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-6 sm:p-10 lg:p-16">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-rose-600" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cycle Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Last Period Start Date</label>
                    <input
                      type="date"
                      required
                      value={lastPeriodStart}
                      onChange={(e) => setLastPeriodStart(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-rose-300 transition-all text-sm dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Usual Cycle Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCycleType('regular')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all ${cycleType === 'regular' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                      >
                        Regular (28d)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCycleType('irregular')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all ${cycleType === 'irregular' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                      >
                        Irregular
                      </button>
                    </div>
                  </div>

                  {cycleType === 'irregular' && (
                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Avg. Cycle Length</label>
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
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Avg. Period Days</label>
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
                </div>
              </section>

              <button
                type="submit"
                className="group w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Save and Continue</span>
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
