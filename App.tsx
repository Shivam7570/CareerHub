
import React, { useState } from 'react';
import Header from './components/Header';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import MockInterview from './components/MockInterview';
import ResumeBuilder from './components/ResumeBuilder';

type View = 'analyzer' | 'interview' | 'builder';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('analyzer');

  const renderView = () => {
    switch (currentView) {
      case 'analyzer':
        return <ResumeAnalyzer />;
      case 'interview':
        return <MockInterview />;
      case 'builder':
        return <ResumeBuilder />;
      default:
        return <ResumeAnalyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;