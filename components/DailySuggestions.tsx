
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
    setIsLoadingAi(true);
    setError(null);
    try {
      // Assuming process.env.API_KEY is correctly injected by the build tool/platform
      const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `The user is currently in the ${phase} phase (Day ${dayOfCycle} of a ${user.cycleLength}-day cycle). 
        Provide a brief, supportive, and romantic tip (max 2 sentences) for their partner to help them feel loved and understood today. 
        Focus on the hormonal shift of the ${phase} phase.`,
        config: {
          systemInstruction: "You are a relationship and wellness coach. Be concise, warm, and encouraging.",
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
      setError("AI Insight paused");
      setAiInsight("Focus on gentle presence and listening to her needs today.");
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
              Day <span className="font-bold text-slate-800 dark:text-slate-200">{dayOfCycle}</span> of her cycle.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm xl:min-w-[320px]">
            <div className={`p-2 rounded-xl flex-shrink-0 ${error ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {error ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <BrainCircuit className="w-5 h-5 text-purple-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">AI Insights</p>
              {isLoadingAi ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-[10px] text-slate-400 italic">Thinking...</span>
                </div>
              ) : (
                <p className="text-[10px] sm:text-xs italic text-slate-600 dark:text-slate-300 leading-snug line-clamp-3">
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
