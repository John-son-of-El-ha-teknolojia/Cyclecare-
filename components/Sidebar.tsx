
import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  Heart, 
  Moon,
  Sun,
  UserCircle,
  User as UserIcon
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  authUserName: string;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  authUserName,
  onLogout,
  darkMode,
  toggleDarkMode
}) => {
  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 font-medium' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-serif font-bold text-rose-500 flex items-center">
          <Heart className="w-6 h-6 mr-2 fill-current" />
          CycleCare+
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavItem id="calendar" icon={CalendarIcon} label="My Calendar" />
        <NavItem id="suggestions" icon={Heart} label="Daily Suggestions" />
        <NavItem id="settings" icon={SettingsIcon} label="Settings" />
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white shadow-md">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{authUserName}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Active Profile</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
          >
            <UserCircle className="w-4 h-4" />
            <span>Switch Profile</span>
          </button>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all hover:brightness-95"
        >
          <span className="text-sm font-medium">Appearance</span>
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
