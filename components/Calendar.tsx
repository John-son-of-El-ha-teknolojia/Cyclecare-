
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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, PlusCircle, X, Droplet, Sparkles } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-none truncate">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1 truncate">Profile: {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsUpdatingPeriod(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-rose-500 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Update Period</span>
          </button>

          <div className="flex space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button onClick={prevMonth} className="p-2 sm:p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 sm:p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {isUpdatingPeriod && (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border-2 border-rose-300 dark:border-rose-900/40 shadow-2xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 sm:mb-8 relative z-10">
            <div className="flex items-center space-x-3">
               <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                 <Droplet className="w-5 h-5 text-rose-600" />
               </div>
               <h3 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200">Log Period Start</h3>
            </div>
            <button onClick={() => setIsUpdatingPeriod(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-end gap-4 relative z-10">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">New Start Date</label>
              <input 
                type="date" 
                required
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-rose-200 transition-all dark:text-white text-sm"
              />
            </div>
            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 text-sm">
              Save Changes
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[3.5rem] p-2 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-7 mb-3 sm:mb-6">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          {days.map((day, idx) => {
            const { phase, isFertile, dayOfCycle } = getCycleInfo(day, user);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isMenstrual = phase === 'Menstrual';

            return (
              <div 
                key={idx}
                className={`relative min-h-[60px] sm:min-h-[100px] p-1 sm:p-3 rounded-xl sm:rounded-[1.5rem] transition-all duration-300 border border-transparent flex flex-col items-center justify-start ${
                  !isCurrentMonth ? 'opacity-10 pointer-events-none' : 'opacity-100'
                } ${isToday ? 'ring-2 ring-rose-500 scale-105 z-10 bg-white dark:bg-slate-800 shadow-xl' : ''}`}
              >
                <div className={`w-full h-full absolute inset-0 rounded-xl sm:rounded-[1.5rem] transition-opacity ${
                  isMenstrual ? 'opacity-40' : 'opacity-15'
                } ${PHASE_COLORS[phase]}`} />
                
                <span className={`relative text-[10px] sm:text-base font-bold z-10 ${isToday ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
                  {format(day, 'd')}
                </span>

                <div className="relative mt-auto mb-1 z-10 flex flex-col items-center space-y-0.5 sm:space-y-1">
                  {isMenstrual && (
                    <Droplet className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-rose-500 fill-current" />
                  )}
                  {isFertile && !isMenstrual && (
                    <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  )}
                  <span className="text-[7px] sm:text-[9px] font-bold text-slate-500/50 uppercase tracking-tighter">
                    D{dayOfCycle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {Object.entries(PHASE_COLORS).map(([name, color]) => (
            <div key={name} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
              <h4 className="text-[9px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{name}</h4>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;
