
import { 
  addDays, 
  differenceInDays, 
  startOfDay 
} from 'date-fns';
import { UserProfile, CyclePhase } from '../types.ts';

/**
 * Calculates the current phase of the cycle for a given date based on user profile.
 * Ensures the 'Menstrual' phase starts exactly on the recorded Day 1.
 */
export const getCycleInfo = (date: Date, user: UserProfile) => {
  const checkDate = startOfDay(date);
  
  // Safely parse the "YYYY-MM-DD" string into a local date
  const [year, month, day] = user.lastPeriodStart.split('-').map(Number);
  const cycleStart = startOfDay(new Date(year, month - 1, day));
  
  // Calculate raw days difference
  const rawDiff = differenceInDays(checkDate, cycleStart);
  
  // Robust modulo operation that works for both positive and negative numbers
  // This allows us to project the cycle infinitely in both directions
  let daysSinceStart = ((rawDiff % user.cycleLength) + user.cycleLength) % user.cycleLength;

  const dayOfCycle = daysSinceStart + 1; // 1-indexed (Day 1, Day 2...)

  const ovulationDay = user.cycleLength - 14;
  const fertileWindowStart = ovulationDay - 2;
  const fertileWindowEnd = ovulationDay + 2;

  let phase: CyclePhase = 'Follicular';
  let isFertile = false;

  // 1. Menstrual: Day 1 through periodDuration
  if (dayOfCycle <= user.periodDuration) {
    phase = 'Menstrual';
  } 
  // 2. Ovulation/Fertile Window
  else if (dayOfCycle >= fertileWindowStart && dayOfCycle <= fertileWindowEnd) {
    phase = 'Ovulation';
    isFertile = true;
  } 
  // 3. Follicular: Days between period and ovulation
  else if (dayOfCycle < fertileWindowStart) {
    phase = 'Follicular';
  } 
  // 4. Luteal: Days after ovulation until the next period
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
  // Keep projecting forward until we find the date after today
  while (nextDate <= today) {
    nextDate = addDays(nextDate, user.cycleLength);
  }
  
  return nextDate;
};
