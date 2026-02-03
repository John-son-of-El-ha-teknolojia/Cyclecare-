
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { getCycleInfo } from '../utils/cycleCalculations';
import { ROMANTIC_SUGGESTIONS, PHASE_COLORS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface DailySuggestionsProps {
  user: UserProfile;
}

const DailySuggestions: React.FC<DailySuggestionsProps> = ({ user }) => {
  const { phase, dayOfCycle } = getCycleInfo(new Date(), user);
  const suggestions = ROMANTIC_SUGGESTIONS[phase];
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAiInsight = async () => {
    setIsLoadingAi(true);
    setError(null);
    try {
      // Fix: Use process.env.API_KEY exclusively for initialization as per @google/genai guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user is in the ${phase} phase (Day ${dayOfCycle} of ${user.cycleLength} days). 
        Provide one single brief romantic suggestion for her partner to help her feel loved. Maximum 20 words.`,
        config: {
          systemInstruction: "You are a warm relationship expert.",
          temperature: 0.8,
        }
      });
      
      const text = response.text;
      if (text) {
        setAiInsight(text);
      } else {
        throw new Error("Empty AI response");
      }
    } catch (err) {
      console.error("AI Insight Error:", err);
      setError("AI Offline");
      setAiInsight("A gentle hug and listening ear are always the perfect choice today.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsight();
  }, [phase, user.id]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className={`p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 shadow-sm ${PHASE_COLORS[phase]} bg-opacity-10 dark:bg-opacity-20 border-opacity-30`}>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex-1">
            <span className={`px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider ${PHASE_COLORS[phase]} text-white mb-2 sm:mb-4 inline-block`}>
              {phase} Phase
            </span>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-800 dark:text-white">
              Suggestions for {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Currently on Day <span className="font-bold text-slate-800 dark:text-slate-200">{dayOfCycle}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm xl:min-w-[320px]">
            <div className={`p-2 rounded-xl flex-shrink-0 ${error ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
              {error ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <BrainCircuit className="w-5 h-5 text-rose-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">AI Insights</p>
              {isLoadingAi ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 text-rose-400 animate-spin" />
                  <span className="text-[10px] text-slate-400 italic">Thinking...</span>
                </div>
              ) : (
                <p className="text-[10px] sm:text-xs italic text-slate-600 dark:text-slate-300 leading-snug">
                  {aiInsight}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-rose-300 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2.5 rounded-xl ${PHASE_COLORS[phase]} bg-opacity-20 text-rose-500 flex-shrink-0`}>
                {suggestion.icon}
              </div>
              <p className="text-xs sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {suggestion.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] text-center relative overflow-hidden">
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-lg sm:text-2xl font-serif text-white mb-2">Bonding Journey</h3>
        <p className="text-[10px] sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
          Nurture your connection with empathy and insights tailored to her unique rhythm.
        </p>
      </div>
    </div>
  );
};

export default DailySuggestions;
