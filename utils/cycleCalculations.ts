
import { 
  addDays, 
  differenceInDays, 
  startOfDay 
} from 'date-fns';
import { UserProfile, CyclePhase } from '../types.ts';

/**
 * Calculates the current phase of the cycle for a given date based on user profile.
 * Uses a timezone-safe approach to parsing the lastPeriodStart string.
 */
export const getCycleInfo = (date: Date, user: UserProfile) => {
  const checkDate = startOfDay(date);
  
  // Safely parse the "YYYY-MM-DD" string into a local date
  const [year, month, day] = user.lastPeriodStart.split('-').map(Number);
  const cycleStart = startOfDay(new Date(year, month - 1, day));
  
  // Calculate days since the last period started
  let daysSinceStart = differenceInDays(checkDate, cycleStart);
  
  // Handle backwards projection for previous cycles or wrapping around
  if (daysSinceStart < 0) {
    const cyclesBack = Math.ceil(Math.abs(daysSinceStart) / user.cycleLength);
    daysSinceStart = (daysSinceStart + (cyclesBack * user.cycleLength)) % user.cycleLength;
  } else {
    daysSinceStart = daysSinceStart % user.cycleLength;
  }

  const dayOfCycle = daysSinceStart + 1; // 1-indexed for the UI

  const ovulationDay = user.cycleLength - 14;
  const fertileWindowStart = ovulationDay - 2;
  const fertileWindowEnd = ovulationDay + 2;

  let phase: CyclePhase = 'Follicular';
  let isFertile = false;

  // 1. Menstrual: Day 1 to periodDuration (usually 5 days)
  if (dayOfCycle <= user.periodDuration) {
    phase = 'Menstrual';
  } 
  // 2. Ovulation/Fertile Window
  else if (dayOfCycle >= fertileWindowStart && dayOfCycle <= fertileWindowEnd) {
    phase = 'Ovulation';
    isFertile = true;
  } 
  // 3. Follicular: Between period and ovulation
  else if (dayOfCycle < fertileWindowStart) {
    phase = 'Follicular';
  } 
  // 4. Luteal: After ovulation until next period
  else {
    phase = 'Luteal';
  }

  return { dayOfCycle, phase, isFertile };
};

export const getNextPeriodDate = (user: UserProfile) => {
  const [year, month, day] = user.lastPeriodStart.split('-').map(Number);
  const lastStart = startOfDay(new Date(year, month - 1, day));
  const today = startOfDay(new Date());
  
  let nextDate = addDays(lastStart, user.cycleLength);
  while (nextDate < today) {
    nextDate = addDays(nextDate, user.cycleLength);
  }
  
  return nextDate;
};
