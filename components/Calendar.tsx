
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
import { ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon } from 'lucide-react';
import { UserProfile, DayData } from '../types';
import { getCycleInfo } from '../utils/cycleCalculations';
import { PHASE_COLORS, PHASE_DESCRIPTIONS } from '../constants';

interface CalendarProps {
  user: UserProfile;
}

const Calendar: React.FC<CalendarProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-rose-500" />
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex space-x-2">
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

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-7 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const { phase, isFertile } = getCycleInfo(day, user);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={idx}
                className={`relative min-h-[90px] p-2 rounded-2xl transition-all duration-300 border border-transparent flex flex-col items-center justify-start group ${
                  !isCurrentMonth ? 'opacity-20' : 'opacity-100'
                } ${isToday ? 'ring-2 ring-rose-500 ring-offset-4 dark:ring-offset-slate-900 scale-105 z-20 shadow-lg' : ''}`}
              >
                <div className={`w-full h-full absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity ${PHASE_COLORS[phase]}`} />
                
                <span className={`relative text-sm font-bold z-10 mt-1 ${isToday ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                  {format(day, 'd')}
                </span>
                
                {isFertile && (
                  <div className="relative mt-auto mb-2 flex flex-col items-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 dot-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[8px] font-bold text-green-700 dark:text-green-400 uppercase mt-1">Fertile</span>
                  </div>
                )}

                {/* Mobile Phase Dot */}
                {!isFertile && (
                   <div className="relative mt-auto mb-2 z-10">
                      <div className={`w-1 h-1 rounded-full opacity-60 ${PHASE_COLORS[phase].replace('bg-', 'bg-')}`} />
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Legend / Key Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Color Guide & Phases</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Auto-Calculated Estimates</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(PHASE_COLORS).map(([name, color]) => (
            <div key={name} className="flex flex-col space-y-3 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${color} shadow-sm ring-2 ring-white dark:ring-slate-700`} />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{name}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{PHASE_DESCRIPTIONS[name as any]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-full border border-green-100 dark:border-green-900/20">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 dot-pulse" />
              <span className="text-xs font-bold text-green-700 dark:text-green-400">Fertile Window Indicator</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/10 rounded-full border border-rose-100 dark:border-rose-900/20">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Current Day</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
