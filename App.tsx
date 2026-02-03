
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
  // Authentication State
  const [authEmail, setAuthEmail] = useState<string | null>(() => {
    return localStorage.getItem('cyclecare_auth_email');
  });
  const [authName, setAuthName] = useState<string>(() => {
    return localStorage.getItem('cyclecare_auth_name') || '';
  });

  // Cycle Data State (Filtered by auth email)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [activeTab, setActiveTab] = useState('calendar');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cyclecare_dark_mode') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load user profile when authEmail changes
  useEffect(() => {
    if (authEmail) {
      const savedProfiles = JSON.parse(localStorage.getItem('cyclecare_db_profiles') || '{}');
      setUserProfile(savedProfiles[authEmail] || null);
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
        <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-rose-500 fill-current" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4">Hello, {authName}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
            You haven't set up your tracking profile yet. Let's create one specifically for your cycle.
          </p>
          <AddUserForm onAdd={handleSaveProfile} />
        </div>
      );
    }

    switch (activeTab) {
      case 'calendar':
        return <Calendar user={userProfile} />;
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
      <aside className="hidden lg:block w-72 h-full">
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
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-serif font-bold text-rose-500 text-lg">CycleCare+</div>
          <div className="w-10" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
