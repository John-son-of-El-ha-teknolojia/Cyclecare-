
import React, { useState } from 'react';
import { Heart, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = isLogin ? (email.split('@')[0]) : name;
    onLogin(email, displayName);
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
            {isLogin ? 'Welcome back to your sanctuary' : 'Begin your tracking journey'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all ${isLogin ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-400'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all ${!isLogin ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-400'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all dark:text-white text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none transition-all dark:text-white text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 sm:py-4 mt-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-slate-400">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span>Encrypted local session enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
