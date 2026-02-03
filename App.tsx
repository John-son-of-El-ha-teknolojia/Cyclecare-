
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Calendar from './components/Calendar.tsx';
import AddUserForm from './components/AddUserForm.tsx';
import DailySuggestions from './components/DailySuggestions.tsx';
import Settings from './components/Settings.tsx';
import Auth from './components/Auth.tsx';
import { UserProfile } from './types.ts';
import { Menu, X, Heart } from 'lucide-react';
import { dbService } from './utils/db.ts';

/**
 * CycleCare+ Main Application
 * Persistent cycle tracking powered by IndexedDB.
 */
const App: React.FC = () => {
  // Authentication & Profile State
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authName, setAuthName] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // App UI State
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cyclecare_dark_mode') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize: Restore Session from Database
  useEffect(() => {
    const initApp = async () => {
      try {
        const session = await dbService.getActiveSession();
        if (session) {
          setAuthEmail(session.email);
          setAuthName(session.name);
          // Identity found, profile fetch will trigger via effect
        }
      } catch (err) {
        console.error("Failed to restore session from database:", err);
      } finally {
        setIsAppLoading(false);
      }
    };
    initApp();
  }, []);

  // Profile Synchronization: Fetch from Database when identity changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (authEmail) {
        const profile = await dbService.getProfile(authEmail);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    };
    fetchProfile();
  }, [authEmail]);

  // Global Appearance Effects
  useEffect(() => {
    localStorage.setItem('cyclecare_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (email: string, name: string, password?: string) => {
    setIsAppLoading(true);
    try {
      const existing = await dbService.getProfile(email);
      if (existing && password && existing.password !== password) {
        alert("Incorrect password for this account.");
        setIsAppLoading(false);
        return;
      }
      
      await dbService.saveSession(email, name);
      setAuthEmail(email);
      setAuthName(name);
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setIsAppLoading(false);
    }
  };

  const handleLogout = async () => {
    await dbService.clearSession();
    setAuthEmail(null);
    setAuthName('');
    setUserProfile(null);
    setActiveTab('calendar');
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    if (!authEmail) return;
    try {
      // Ensure the profile is linked to the current identity's email
      const profileToSave = { ...profile, email: authEmail };
      await dbService.saveProfile(authEmail, profileToSave);
      setUserProfile(profileToSave);
      setActiveTab('calendar');
    } catch (err) {
      console.error("Error saving profile to database:", err);
    }
  };

  const handleUpdatePeriodDate = async (newDate: string) => {
    if (!authEmail || !userProfile) return;
    const updatedProfile = { ...userProfile, lastPeriodStart: newDate };
    await handleSaveProfile(updatedProfile);
  };

  const handleDeleteProfile = async () => {
    if (!authEmail) return;
    if (confirm("Are you sure you want to delete this tracking profile?")) {
      await dbService.deleteProfile(authEmail);
      setUserProfile(null);
    }
  };

  if (isAppLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Heart className="w-16 h-16 text-rose-500 fill-current animate-pulse" />
        <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  if (!authEmail) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (!userProfile) {
      return (
        <div className="min-h-full flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-xl">
            <Heart className="w-10 h-10 text-rose-500 fill-current" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Welcome, {authName}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-16 text-lg leading-relaxed">
            Create your tracking profile to start predicting your cycle phases.
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
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="font-serif font-bold text-rose-500 text-lg flex items-center tracking-tight">
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
