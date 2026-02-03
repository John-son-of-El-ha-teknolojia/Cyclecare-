
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Calendar from './components/Calendar.tsx';
import AddUserForm from './components/AddUserForm.tsx';
import DailySuggestions from './components/DailySuggestions.tsx';
import Settings from './components/Settings.tsx';
import Auth from './components/Auth.tsx';
import { UserProfile } from './types.ts';
import { Menu, X, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [authEmail, setAuthEmail] = useState<string | null>(() => localStorage.getItem('cyclecare_auth_email'));
  const [authName, setAuthName] = useState<string>(() => localStorage.getItem('cyclecare_auth_name') || '');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cyclecare_dark_mode') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (authEmail) {
      const db = JSON.parse(localStorage.getItem('cyclecare_db_profiles') || '{}');
      setUserProfile(db[authEmail] || null);
    } else {
      setUserProfile(null);
    }
  }, [authEmail]);

  useEffect(() => {
    localStorage.setItem('cyclecare_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (email: string, name: string) => {
    setAuthEmail(email);
    setAuthName(name);
    localStorage.setItem('cyclecare_auth_email', email);
    localStorage.setItem('cyclecare_auth_name', name);
  };

  const handleLogout = () => {
    setAuthEmail(null);
    setAuthName('');
    localStorage.removeItem('cyclecare_auth_email');
    localStorage.removeItem('cyclecare_auth_name');
    setActiveTab('calendar');
  };

  const handleSaveProfile = (profile: UserProfile) => {
    if (!authEmail) return;
    const db = JSON.parse(localStorage.getItem('cyclecare_db_profiles') || '{}');
    db[authEmail] = profile;
    localStorage.setItem('cyclecare_db_profiles', JSON.stringify(db));
    setUserProfile(profile);
    setActiveTab('calendar');
  };

  const handleUpdatePeriodDate = (newDate: string) => {
    if (!authEmail || !userProfile) return;
    const updatedProfile = { ...userProfile, lastPeriodStart: newDate };
    handleSaveProfile(updatedProfile);
  };

  const handleDeleteProfile = () => {
    if (!authEmail) return;
    const db = JSON.parse(localStorage.getItem('cyclecare_db_profiles') || '{}');
    delete db[authEmail];
    localStorage.setItem('cyclecare_db_profiles', JSON.stringify(db));
    setUserProfile(null);
  };

  const renderContent = () => {
    if (!userProfile) {
      return (
        <div className="min-h-full flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-rose-100 dark:bg-rose-900/30 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-10 shadow-xl shadow-rose-100 dark:shadow-none">
            <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-rose-500 fill-current" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 tracking-tight">Welcome, {authName}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-sm mb-10 sm:mb-16 text-base sm:text-lg leading-relaxed">
            Configure your cycle profile to get accurate predictions and daily support.
          </p>
          <AddUserForm onAdd={handleSaveProfile} />
        </div>
      );
    }

    switch (activeTab) {
      case 'calendar':
        return <Calendar user={userProfile} onUpdatePeriod={handleUpdatePeriodDate} />;
      case 'suggestions':
        return <DailySuggestions user={userProfile} />;
      case 'settings':
        return (
          <Settings 
            users={[userProfile]} 
            onDeleteUser={handleDeleteProfile} 
            onClearAll={handleLogout} 
          />
        );
      default:
        return null;
    }
  };

  if (!authEmail) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <aside className="hidden lg:block w-72 h-full flex-shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={userProfile}
          authUserName={authName}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 transform transition-transform duration-300 lg:hidden shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(t) => {
            setActiveTab(t);
            setIsSidebarOpen(false);
          }} 
          currentUser={userProfile}
          authUserName={authName}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 lg:hidden transition-transform active:scale-90"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="font-serif font-bold text-rose-500 text-lg sm:text-xl flex items-center tracking-tight">
            <Heart className="w-5 h-5 mr-2 fill-current" />
            CycleCare+
          </div>
          <div className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-14 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
