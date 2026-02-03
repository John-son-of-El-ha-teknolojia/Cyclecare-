
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Calendar from './components/Calendar.tsx';
import AddUserForm from './components/AddUserForm.tsx';
import DailySuggestions from './components/DailySuggestions.tsx';
import Settings from './components/Settings.tsx';
import Auth from './components/Auth.tsx';
import { UserModel, CycleModel, UserProfile } from './types.ts';
import { Menu, X, Heart } from 'lucide-react';
import { dbService } from './utils/db.ts';

const App: React.FC = () => {
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [authName, setAuthName] = useState<string>('');
  const [userDoc, setUserDoc] = useState<UserModel | null>(null);
  
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cyclecare_dark_mode') === 'true');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const session = await dbService.getActiveSession();
        if (session) {
          setAuthEmail(session.email);
          setAuthName(session.name);
          const doc = await dbService.findUserByEmail(session.email);
          setUserDoc(doc);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsAppLoading(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (authEmail && !userDoc) {
        const doc = await dbService.findUserByEmail(authEmail);
        setUserDoc(doc);
      }
    };
    sync();
  }, [authEmail, userDoc]);

  useEffect(() => {
    localStorage.setItem('cyclecare_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (email: string, name: string) => {
    setIsAppLoading(true);
    try {
      const existing = await dbService.findUserByEmail(email);
      const displayName = existing?.name || name;
      
      await dbService.saveSession(email, displayName);
      setAuthEmail(email);
      setAuthName(displayName);
      
      const doc = existing || await dbService.updateUserInfo(email, { name: displayName });
      setUserDoc(doc);
    } catch (err) {
      console.error("Access Error:", err);
    } finally {
      setIsAppLoading(false);
    }
  };

  const handleLogout = async () => {
    await dbService.clearSession();
    setAuthEmail(null);
    setAuthName('');
    setUserDoc(null);
    setActiveTab('calendar');
  };

  const handleSaveCycleProfile = async (cycle: CycleModel) => {
    if (!authEmail) return;
    try {
      const updated = await dbService.updateUserInfo(authEmail, { profile: cycle });
      setUserDoc(updated);
      setActiveTab('calendar');
    } catch (err) {
      console.error("Profile save error:", err);
    }
  };

  const handleUpdatePeriodDate = async (newDate: string) => {
    if (!authEmail || !userDoc?.profile) return;
    const updatedProfile = { ...userDoc.profile, lastPeriodStart: newDate };
    await handleSaveCycleProfile(updatedProfile);
  };

  const handleDeleteAccount = async () => {
    if (!authEmail) return;
    if (confirm("Permanently delete this profile and all its data?")) {
      await dbService.deleteUser(authEmail);
      handleLogout();
    }
  };

  if (isAppLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Heart className="w-16 h-16 text-rose-500 fill-current animate-pulse" />
        <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing data...</p>
      </div>
    );
  }

  if (!authEmail) {
    return <Auth onLogin={handleLogin} />;
  }

  const legacyProfile: UserProfile | null = userDoc?.profile ? {
    id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    lastPeriodStart: userDoc.profile.lastPeriodStart,
    cycleLength: userDoc.profile.cycleLength,
    periodDuration: userDoc.profile.periodDuration,
    createdAt: userDoc.createdAt,
    _id: userDoc._id,
    profile: userDoc.profile
  } : null;

  const renderContent = () => {
    if (!legacyProfile) {
      return (
        <div className="min-h-full flex flex-col items-center justify-center text-center p-4 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-xl">
            <Heart className="w-10 h-10 text-rose-500 fill-current" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Setup Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-16 text-lg leading-relaxed">
            Welcome, {authName}. Set your cycle details once to begin tracking.
          </p>
          <AddUserForm onSave={handleSaveCycleProfile} />
        </div>
      );
    }

    switch (activeTab) {
      case 'calendar':
        return <Calendar user={legacyProfile} onUpdatePeriod={handleUpdatePeriodDate} />;
      case 'suggestions':
        return <DailySuggestions user={legacyProfile} />;
      case 'settings':
        return <Settings users={[legacyProfile]} onDeleteUser={handleDeleteAccount} onClearAll={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <aside className="hidden lg:block w-72 h-full flex-shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={legacyProfile} authUserName={authName} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      </aside>

      {isSidebarOpen && <div className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 transform transition-transform duration-300 lg:hidden shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} currentUser={legacyProfile} authUserName={authName} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"><X className="w-5 h-5" /></button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl"><Menu className="w-6 h-6" /></button>
          <div className="font-serif font-bold text-rose-500 text-lg flex items-center"><Heart className="w-5 h-5 mr-2 fill-current" />CycleCare+</div>
          <div className="w-10" />
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-10"><div className="max-w-5xl mx-auto h-full">{renderContent()}</div></div>
      </main>
    </div>
  );
};

export default App;
