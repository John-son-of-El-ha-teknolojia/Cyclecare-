
export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface UserProfile {
  id: string;
  name: string;
  lastPeriodStart: string; // ISO String
  cycleLength: number;
  periodDuration: number;
  createdAt: number;
}

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase?: CyclePhase;
  isFertile?: boolean;
}

export interface AppState {
  users: UserProfile[];
  currentUserId: string | null;
  darkMode: boolean;
}
