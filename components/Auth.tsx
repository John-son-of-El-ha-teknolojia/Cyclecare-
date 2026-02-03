
import React, { useState } from 'react';
import { Heart, User, ArrowRight, Sparkles, Fingerprint } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    
    // Normalize to handle both emails and simple names
    const name = identifier.split('@')[0];
    onLogin(identifier.toLowerCase().trim(), name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-rose-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-6 sm:p-8 pb-0 text-center">
          <div className="inline-flex p-3 sm:p-4 bg-rose-100 dark:bg-rose-900/30 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 fill-current" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 dark:text-white">CycleCare+</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter your name or email to start tracking
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Profile Identifier</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. Jane Doe or jane@example.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all dark:text-white text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 sm:py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span>Cloud sync enabled automatically</span>
          </div>
          
          <p className="mt-6 text-center text-[10px] text-slate-400 leading-relaxed px-4">
            Use the same name on any device to see your data. No passwords needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
