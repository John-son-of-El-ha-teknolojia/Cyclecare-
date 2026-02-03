
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center shadow-inner">
            <CalendarIcon className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-none">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Cycle Tracking: {user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsUpdatingPeriod(true)}
            className="group flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 dark:shadow-none active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log New Period</span>
          </button>

          <div className="flex space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4">
            <button 
              onClick={prevMonth}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isUpdatingPeriod && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-rose-300 dark:border-rose-900/40 shadow-2xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-24 h-24 text-rose-500" />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center space-x-4">
               <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl">
                 <Droplet className="w-6 h-6 text-rose-600" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Update Period Start</h3>
                 <p className="text-xs text-slate-500 mt-1">This will recalculate all future predictions.</p>
               </div>
            </div>
            <button onClick={() => setIsUpdatingPeriod(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row items-end gap-6 relative z-10">
            <div className="flex-1 space-y-3 w-full">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Start Date</label>
              <input 
                type="date" 
                required
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
                className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none outline-none ring-2 ring-transparent focus:ring-rose-200 dark:focus:ring-rose-900/40 transition-all dark:text-white font-medium"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto px-12 py-4.5 bg-rose-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all active:scale-95 text-lg"
            >
              Update History
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="min-w-[750px]">
          <div className="grid grid-cols-7 mb-8">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {days.map((day, idx) => {
              const { phase, isFertile, dayOfCycle } = getCycleInfo(day, user);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isMenstrual = phase === 'Menstrual';

              return (
                <div 
                  key={idx}
                  className={`relative min-h-[110px] p-4 rounded-[2rem] transition-all duration-500 border border-transparent flex flex-col items-center justify-start group ${
                    !isCurrentMonth ? 'opacity-20 pointer-events-none' : 'opacity-100'
                  } ${isToday ? 'ring-2 ring-rose-500 ring-offset-8 dark:ring-offset-slate-900 scale-105 z-20 shadow-2xl bg-white dark:bg-slate-800' : ''}`}
                >
                  {/* Phase Background Overlay */}
                  <div className={`w-full h-full absolute inset-0 rounded-[2rem] transition-opacity duration-500 ${
                    isMenstrual ? 'opacity-40' : 'opacity-15'
                  } group-hover:opacity-60 ${PHASE_COLORS[phase]}`} />
                  
                  {/* Day Number */}
                  <span className={`relative text-base font-bold z-10 ${isToday ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
                    {format(day, 'd')}
                  </span>

                  {/* Indicators Container */}
                  <div className="relative mt-2 z-10 flex flex-col items-center flex-1 justify-center space-y-2">
                    {isMenstrual && (
                      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Droplet className="w-5 h-5 text-rose-500 fill-current" />
                        <span className="text-[8px] font-black text-rose-700 dark:text-rose-300 uppercase tracking-tighter mt-1">Day {dayOfCycle}</span>
                      </div>
                    )}

                    {isFertile && !isMenstrual && (
                      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 dot-pulse shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
                        <span className="text-[8px] font-bold text-green-700 dark:text-green-400 uppercase mt-2 tracking-widest">Fertile</span>
                      </div>
                    )}
                  </div>

                  {/* Subtle Cycle Day Marker for other phases */}
                  {!isMenstrual && !isFertile && (
                     <span className="relative text-[7px] font-bold text-slate-400/50 uppercase tracking-widest z-10 mb-1">
                       Day {dayOfCycle}
                     </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simplified Phase Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(PHASE_COLORS).map(([name, color]) => (
            <div key={name} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${color} flex-shrink-0`} />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{PHASE_DESCRIPTIONS[name as any]}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Calendar;
