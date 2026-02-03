
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, HeartHandshake, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
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
    if (!process.env.API_KEY) {
      setAiInsight("Set your API_KEY to enable daily AI coaching insights.");
      return;
    }

    setIsLoadingAi(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user is currently in the ${phase} phase (Day ${dayOfCycle} of a ${user.cycleLength}-day cycle). 
        Provide a brief, supportive, and romantic tip (max 2 sentences) for their partner to help them feel loved and understood today. 
        Focus on the hormonal shift of the ${phase} phase.`,
        config: {
          systemInstruction: "You are a thoughtful relationship and wellness coach for CycleCare+. Be concise, warm, and encouraging.",
          temperature: 0.7,
        }
      });
      
      if (response && response.text) {
        setAiInsight(response.text);
      } else {
        throw new Error("No response text");
      }
    } catch (err) {
      console.error("Gemini AI Error:", err);
      setError("Unable to reach AI coach.");
      setAiInsight("Focus on gentle presence and active listening today.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsight();
  }, [phase, user.id]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 shadow-sm ${PHASE_COLORS[phase]} bg-opacity-10 dark:bg-opacity-20 border-opacity-30`}>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex-1">
            <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${PHASE_COLORS[phase]} text-white mb-3 sm:mb-4 inline-block`}>
              {phase} Phase
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 dark:text-white">
              Suggestions for {user.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
              Day <span className="font-bold text-slate-800 dark:text-slate-200">{dayOfCycle}</span> of their unique cycle.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm xl:min-w-[320px]">
            <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 ${error ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {error ? <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /> : <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">AI Coach Insight</p>
              {isLoadingAi ? (
                <div className="flex items-center space-x-2 py-1">
                  <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-[10px] sm:text-xs text-slate-400 italic">Curating advice...</span>
                </div>
              ) : (
                <p className="text-[11px] sm:text-xs italic text-slate-600 dark:text-slate-300 leading-snug line-clamp-3">
                  {aiInsight}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all hover:shadow-md"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2.5 sm:p-3 rounded-xl ${PHASE_COLORS[phase]} bg-opacity-20 dark:bg-opacity-30 text-rose-500 flex-shrink-0`}>
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {suggestion.text}
                </p>
              </div>
              <ArrowRight className="hidden sm:block w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-slate-800 p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <HeartHandshake className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
        </div>
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-xl sm:text-2xl font-serif text-white mb-2 sm:mb-3">Bonding Journey</h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          Nurture your connection daily with empathy and AI-powered insights tailored to her rhythm.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/5 border border-white/10 rounded-full text-[8px] sm:text-[10px] text-white/40 uppercase tracking-widest whitespace-nowrap">Powered by Gemini</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/5 border border-white/10 rounded-full text-[8px] sm:text-[10px] text-white/40 uppercase tracking-widest whitespace-nowrap">Local & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default DailySuggestions;
