
import React from 'react';
import { Trash2, AlertCircle, Info, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  users: UserProfile[];
  onDeleteUser: (id: string) => void;
  onClearAll: () => void;
}

const Settings: React.FC<SettingsProps> = ({ users, onDeleteUser, onClearAll }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
          <Database className="w-5 h-5 mr-2 text-rose-500" />
          Manage Profiles
        </h2>
        
        {users.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 italic">No profiles created yet.</p>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-400">
                    {user.cycleLength} day cycle • Tracked since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => onDeleteUser(user.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400">Danger Zone</h3>
            <p className="text-red-600 dark:text-red-500/70 text-sm mb-4">
              Clearing all data will permanently remove all profiles and cycle history from this browser. This cannot be undone.
            </p>
            <button 
              onClick={() => {
                if (confirm('Are you absolutely sure you want to clear ALL data?')) {
                  onClearAll();
                }
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center mb-3">
          <Info className="w-4 h-4 mr-2 text-slate-400" />
          About CycleCare+
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          CycleCare+ is designed to help partners provide better support by understanding menstrual phases. 
          All calculations are estimations based on provided averages. No data is sent to external servers; 
          everything is stored in your browser's local storage.
        </p>
      </div>
    </div>
  );
};

export default Settings;
