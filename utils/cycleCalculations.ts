
import { 
  addDays, 
  differenceInDays, 
  startOfDay, 
  isSameDay 
} from 'date-fns';
import { UserProfile, CyclePhase } from '../types';

/**
 * Calculates the current phase of the cycle for a given date based on user profile.
 */
export const getCycleInfo = (date: Date, user: UserProfile) => {
  const checkDate = startOfDay(date);
  const cycleStart = startOfDay(new Date(user.lastPeriodStart));
  
  // Calculate days since the last period started
  let daysSinceStart = differenceInDays(checkDate, cycleStart);
  
  // If date is before the tracked start, we project backwards
  // but for simplicity in this tracker, we focus on current/future projections
  if (daysSinceStart < 0) {
    const cyclesBack = Math.ceil(Math.abs(daysSinceStart) / user.cycleLength);
    daysSinceStart = (daysSinceStart + (cyclesBack * user.cycleLength)) % user.cycleLength;
  } else {
    daysSinceStart = daysSinceStart % user.cycleLength;
  }

  const dayOfCycle = daysSinceStart + 1; // 1-indexed for the UI

  // Standard estimation:
  // 1. Menstrual: Day 1 to periodDuration
  // 2. Ovulation: CycleLength - 14 (± 2 days for window)
  // 3. Follicular: After Menstrual, before Ovulation
  // 4. Luteal: After Ovulation window
  
  const ovulationDay = user.cycleLength - 14;
  const fertileWindowStart = ovulationDay - 2;
  const fertileWindowEnd = ovulationDay + 2;

  let phase: CyclePhase = 'Follicular';
  let isFertile = false;

  if (dayOfCycle <= user.periodDuration) {
    phase = 'Menstrual';
  } else if (dayOfCycle >= fertileWindowStart && dayOfCycle <= fertileWindowEnd) {
    phase = 'Ovulation';
    isFertile = true;
  } else if (dayOfCycle < fertileWindowStart) {
    phase = 'Follicular';
  } else {
    phase = 'Luteal';
  }

  return { dayOfCycle, phase, isFertile };
};

export const getNextPeriodDate = (user: UserProfile) => {
  const lastStart = new Date(user.lastPeriodStart);
  const today = startOfDay(new Date());
  
  let nextDate = addDays(lastStart, user.cycleLength);
  while (nextDate < today) {
    nextDate = addDays(nextDate, user.cycleLength);
  }
  
  return nextDate;
};
