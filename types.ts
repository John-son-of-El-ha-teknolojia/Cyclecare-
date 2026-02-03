
export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

/**
 * MongoDB-style Models
 */
export interface CycleModel {
  lastPeriodStart: string; // ISO String (YYYY-MM-DD)
  cycleLength: number;     // e.g., 28 or custom value
  periodDuration: number;  // e.g., 5 days
}

export interface UserModel {
  _id: string;             // MongoDB unique identifier
  email: string;           // Primary key for lookup
  name: string;
  password?: string;
  profile?: CycleModel;    // Embedded cycle document
  createdAt: number;
}

export interface UserProfile extends UserModel {
  // UI helper extension (matches legacy components)
  id: string; 
  lastPeriodStart: string;
  cycleLength: number;
  periodDuration: number;
}

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase?: CyclePhase;
  isFertile?: boolean;
}

export interface AppState {
  users: UserModel[];
  currentUserId: string | null;
  darkMode: boolean;
}
