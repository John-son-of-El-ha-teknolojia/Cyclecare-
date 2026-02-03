
import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon, PlusCircle, X, Droplet } from 'lucide-react';
import { UserProfile } from '../types.ts';
import { getCycleInfo } from '../utils/cycleCalculations.ts';
import { PHASE_COLORS, PHASE_DESCRIPTIONS } from '../constants.tsx';

interface CalendarProps {
  user: UserProfile;
  onUpdatePeriod?: (newDate: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ user, onUpdatePeriod }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isUpdatingPeriod, setIsUpdatingPeriod] = useState(false);
  const [newPeriodDate, setNewPeriodDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePeriod) {
      onUpdatePeriod(newPeriodDate);
      setIsUpdatingPeriod(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracking for {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsUpdatingPeriod(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all shadow-md shadow-rose-100 dark:shadow-none"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log New Period</span>
          </button>

          <div className="flex space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isUpdatingPeriod && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-rose-300 dark:border-rose-900/40 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
               <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                 <Droplet className="w-5 h-5 text-rose-600" />
               </div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Log Period Start Date</h3>
            </div>
            <button onClick={() => setIsUpdatingPeriod(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">When did it start?</label>
              <input 
                type="date" 
                required
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-rose-200 dark:focus:ring-rose-900/40 transition-all dark:text-white"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all active:scale-95"
            >
              Save New Cycle
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((day, idx) => {
              const { phase, isFertile } = getCycleInfo(day, user);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isMenstrual = phase === 'Menstrual';

              return (
                <div 
                  key={idx}
                  className={`relative min-h-[100px] p-3 rounded-[1.5rem] transition-all duration-300 border border-transparent flex flex-col items-center justify-start group ${
                    !isCurrentMonth ? 'opacity-20 grayscale-[50%]' : 'opacity-100'
                  } ${isToday ? 'ring-2 ring-rose-500 ring-offset-4 dark:ring-offset-slate-900 scale-105 z-20 shadow-xl bg-white dark:bg-slate-800' : ''}`}
                >
                  <div className={`w-full h-full absolute inset-0 rounded-[1.5rem] transition-opacity duration-300 ${
                    isMenstrual ? 'opacity-30' : 'opacity-15'
                  } group-hover:opacity-40 ${PHASE_COLORS[phase]}`} />
                  
                  <span className={`relative text-sm font-bold z-10 mt-1 ${isToday ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {isMenstrual && (
                    <div className="relative mt-2 z-10 flex flex-col items-center animate-in fade-in zoom-in">
                      <Droplet className="w-5 h-5 text-rose-500 fill-current" />
                      <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 uppercase mt-1 tracking-tighter">Bleeding</span>
                    </div>
                  )}

                  {isFertile && (
                    <div className="relative mt-auto mb-2 flex flex-col items-center z-10">
                      <div className="w-2 h-2 rounded-full bg-green-500 dot-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                      <span className="text-[8px] font-bold text-green-700 dark:text-green-400 uppercase mt-1">Fertile</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <Info className="w-4 h-4 text-rose-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Cycle Phase Guide</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(PHASE_COLORS).map(([name, color]) => (
            <div key={name} className="group flex flex-col space-y-3 p-5 rounded-3xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform`} />
                <div>
                   <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">{name}</p>
                   {name === 'Menstrual' && <span className="text-[9px] text-rose-500 font-bold uppercase">Bleeding Days</span>}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{PHASE_DESCRIPTIONS[name as any]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
