
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
    // Check if API key is available
    if (!process.env.API_KEY) {
      setAiInsight("Set your API_KEY in Netlify environment variables to enable AI insights.");
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`p-8 rounded-[2rem] border-2 shadow-sm ${PHASE_COLORS[phase]} bg-opacity-10 dark:bg-opacity-20 border-opacity-30`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${PHASE_COLORS[phase]} text-white mb-4 inline-block`}>
              {phase} Phase
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">
              Suggestions for {user.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Currently on Day <span className="font-bold text-slate-800 dark:text-slate-200">{dayOfCycle}</span> of their cycle.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-[280px]">
            <div className={`p-3 rounded-2xl ${error ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
              {error ? <AlertCircle className="w-6 h-6 text-amber-500" /> : <BrainCircuit className="w-6 h-6 text-purple-500" />}
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Coach Insight</p>
              {isLoadingAi ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                  <span className="text-xs text-slate-400 italic">Thinking...</span>
                </div>
              ) : (
                <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-snug">
                  {aiInsight}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion, idx) => (
          <div 
            key={idx}
            className="group relative bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 transition-all hover:shadow-md"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${PHASE_COLORS[phase]} bg-opacity-20 dark:bg-opacity-30 text-rose-500`}>
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {suggestion.text}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[2.5rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <HeartHandshake className="w-48 h-48 text-white" />
        </div>
        <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-serif text-white mb-3">Bonding Journey</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Understanding the {phase} phase allows for deeper empathy. Use these AI-powered insights to nurture your connection daily.
        </p>
        <div className="flex justify-center items-center space-x-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-widest">Powered by Gemini</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-widest">Netlify SSL Secure</span>
        </div>
      </div>
    </div>
  );
};

export default DailySuggestions;
