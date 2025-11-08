
import React from 'react';
import { useAuth } from '../hooks/useAuth';

type View = 'analyzer' | 'interview' | 'builder';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'analyzer', label: 'Resume Analyzer' },
    { id: 'interview', label: 'Mock Interview' },
    { id: 'builder', label: 'Resume Builder' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">
              Career<span className="text-indigo-400">Hub</span> AI
            </h1>
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
              {user && <span className="text-sm text-slate-400 hidden sm:block">Welcome, {user.name}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;