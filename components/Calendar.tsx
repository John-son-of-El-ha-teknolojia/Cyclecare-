
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
import { ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon, PlusCircle, X, Droplet, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-none">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-1 sm:mt-2 truncate">Tracking: {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 w-full sm:w-auto">
          <button 
            onClick={() => setIsUpdatingPeriod(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-rose-500 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 dark:shadow-none active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Cycle</span>
          </button>

          <div className="flex space-x-1 sm:space-x-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-4">
            <button 
              onClick={prevMonth}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {isUpdatingPeriod && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border-2 border-rose-300 dark:border-rose-900/40 shadow-2xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 text-rose-500" />
          </div>
          <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
            <div className="flex items-center space-x-3 sm:space-x-4">
               <div className="p-2 sm:p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl sm:rounded-2xl">
                 <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
               </div>
               <div>
                 <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">Log Period Start</h3>
                 <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">This updates your cycle predictions.</p>
               </div>
            </div>
            <button onClick={() => setIsUpdatingPeriod(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-end gap-4 sm:gap-6 relative z-10">
            <div className="flex-1 space-y-2 sm:space-y-3 w-full">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Start Date</label>
              <input 
                type="date" 
                required
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-rose-200 dark:focus:ring-rose-900/40 transition-all dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4.5 bg-rose-600 text-white rounded-xl sm:rounded-[1.5rem] font-bold shadow-xl shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all active:scale-95 text-sm sm:text-lg"
            >
              Save Change
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[3.5rem] p-4 sm:p-10 shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
        <div className="min-w-[650px] sm:min-w-[750px]">
          <div className="grid grid-cols-7 mb-4 sm:mb-8">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] sm:tracking-[0.25em]">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {days.map((day, idx) => {
              const { phase, isFertile, dayOfCycle } = getCycleInfo(day, user);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isMenstrual = phase === 'Menstrual';

              return (
                <div 
                  key={idx}
                  className={`relative min-h-[90px] sm:min-h-[110px] p-2 sm:p-4 rounded-[1.2rem] sm:rounded-[2rem] transition-all duration-500 border border-transparent flex flex-col items-center justify-start group ${
                    !isCurrentMonth ? 'opacity-20 pointer-events-none' : 'opacity-100'
                  } ${isToday ? 'ring-2 ring-rose-500 ring-offset-4 sm:ring-offset-8 dark:ring-offset-slate-900 scale-105 z-20 shadow-2xl bg-white dark:bg-slate-800' : ''}`}
                >
                  <div className={`w-full h-full absolute inset-0 rounded-[1.2rem] sm:rounded-[2rem] transition-opacity duration-500 ${
                    isMenstrual ? 'opacity-40' : 'opacity-15'
                  } group-hover:opacity-60 ${PHASE_COLORS[phase]}`} />
                  
                  <span className={`relative text-xs sm:text-base font-bold z-10 ${isToday ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
                    {format(day, 'd')}
                  </span>

                  <div className="relative mt-1 sm:mt-2 z-10 flex flex-col items-center flex-1 justify-center space-y-1 sm:space-y-2">
                    {isMenstrual && (
                      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-current" />
                        <span className="text-[7px] sm:text-[8px] font-black text-rose-700 dark:text-rose-300 uppercase tracking-tighter mt-1">Day {dayOfCycle}</span>
                      </div>
                    )}

                    {isFertile && !isMenstrual && (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-500 dot-pulse shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
                        <span className="text-[7px] sm:text-[8px] font-bold text-green-700 dark:text-green-400 uppercase mt-1 sm:mt-2 tracking-widest">Fertile</span>
                      </div>
                    )}
                  </div>

                  {!isMenstrual && !isFertile && (
                     <span className="relative text-[6px] sm:text-[7px] font-bold text-slate-400/50 uppercase tracking-widest z-10 mb-0.5 sm:mb-1">
                       Day {dayOfCycle}
                     </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(PHASE_COLORS).map(([name, color]) => (
            <div key={name} className="bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-2 sm:space-x-4">
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${color} flex-shrink-0`} />
              <div className="min-w-0">
                <h4 className="text-[10px] sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{name}</h4>
                <p className="hidden sm:block text-[10px] text-slate-400 line-clamp-1">{PHASE_DESCRIPTIONS[name as any]}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;
