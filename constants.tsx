
import React from 'react';
import { 
  Heart, 
  Coffee, 
  Sparkles, 
  Moon, 
  Flower2, 
  Utensils, 
  MapPin, 
  BookOpen 
} from 'lucide-react';
import { CyclePhase } from './types';

export const PHASE_COLORS: Record<CyclePhase, string> = {
  Menstrual: 'bg-red-300 dark:bg-red-600',
  Follicular: 'bg-blue-300 dark:bg-blue-600',
  Ovulation: 'bg-green-300 dark:bg-green-600',
  Luteal: 'bg-yellow-300 dark:bg-yellow-600',
};

export const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  Menstrual: "Rest and restoration. Focus on comfort.",
  Follicular: "Energy begins to rise. Perfect for planning.",
  Ovulation: "Peak energy and social drive. High fertility.",
  Luteal: "Turning inward. Gentleness and stability are key.",
};

export const ROMANTIC_SUGGESTIONS: Record<CyclePhase, { text: string; icon: React.ReactNode }[]> = {
  Menstrual: [
    { text: "Prepare a warm compress and their favorite tea.", icon: <Coffee className="w-5 h-5" /> },
    { text: "Offer a gentle foot massage or back rub.", icon: <Heart className="w-5 h-5" /> },
    { text: "Take over their chores so they can rest.", icon: <Sparkles className="w-5 h-5" /> },
    { text: "Cook a nutrient-rich warm meal like a stew.", icon: <Utensils className="w-5 h-5" /> },
  ],
  Follicular: [
    { text: "Plan an exciting weekend getaway or day trip.", icon: <MapPin className="w-5 h-5" /> },
    { text: "Surprise them with a small 'just because' gift.", icon: <Sparkles className="w-5 h-5" /> },
    { text: "Go for a scenic walk or try a new hobby together.", icon: <Flower2 className="w-5 h-5" /> },
    { text: "Write a list of things you appreciate about them.", icon: <BookOpen className="w-5 h-5" /> },
  ],
  Ovulation: [
    { text: "Dress up and go for a fancy candlelit dinner.", icon: <Utensils className="w-5 h-5" /> },
    { text: "Write a deeply heartfelt love letter.", icon: <Heart className="w-5 h-5" /> },
    { text: "Plan a social evening with your favorite couple friends.", icon: <Sparkles className="w-5 h-5" /> },
    { text: "Initiate a meaningful conversation about your future.", icon: <Moon className="w-5 h-5" /> },
  ],
  Luteal: [
    { text: "Create a cozy 'nest' at home for a movie marathon.", icon: <Moon className="w-5 h-5" /> },
    { text: "Listen deeply and offer validation without fixing.", icon: <Heart className="w-5 h-5" /> },
    { text: "Order their favorite comfort food for delivery.", icon: <Utensils className="w-5 h-5" /> },
    { text: "Spend a quiet evening reading side-by-side.", icon: <BookOpen className="w-5 h-5" /> },
  ],
};
