import React, { useState, useEffect } from 'react';
import { Shield, Activity, Users, Globe } from 'lucide-react';
import { URLScanner } from './components/URLScanner';
import { AnalysisHistory } from './components/AnalysisHistory';
import { SecurityStats } from './components/SecurityStats';
import { SecurityTips } from './components/SecurityTips';
import { URLAnalysis } from './types';

function App() {
  const [analyses, setAnalyses] = useState<URLAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'stats' | 'tips'>('scanner');

  // Load analyses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('phishing-analyses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((analysis: any) => ({
          ...analysis,
          timestamp: new Date(analysis.timestamp)
        }));
        setAnalyses(withDates);
      } catch (error) {
        console.error('Failed to load saved analyses:', error);
      }
    }
  }, []);

  // Save analyses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('phishing-analyses', JSON.stringify(analyses));
  }, [analyses]);

  const handleAnalysisComplete = (analysis: URLAnalysis) => {
    setAnalyses(prev => [analysis, ...prev].slice(0, 100)); // Keep last 100 analyses
  };

  const handleClearHistory = () => {
    setAnalyses([]);
    localStorage.removeItem('phishing-analyses');
  };

  const tabs = [
    { id: 'scanner', label: 'URL Scanner', icon: Shield },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'stats', label: 'Statistics', icon: Globe },
    { id: 'tips', label: 'Security Tips', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.1%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">PhishGuard</h1>
                  <p className="text-slate-400 text-sm">Real-time URL threat detection</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div>Scans: {analyses.length}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'scanner' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">URL Security Scanner</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Analyze URLs in real-time to detect phishing attempts, malicious links, and security threats. 
                  Our advanced detection algorithms identify suspicious patterns and domain spoofing.
                </p>
              </div>
              <URLScanner onAnalysisComplete={handleAnalysisComplete} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Analysis History</h2>
                <p className="text-slate-400">
                  Review your previous URL scans and export analysis reports for security auditing.
                </p>
              </div>
              <AnalysisHistory analyses={analyses} onClear={handleClearHistory} />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Security Statistics</h2>
                <p className="text-slate-400">
                  Monitor your scanning activity and threat detection patterns over time.
                </p>
              </div>
              <SecurityStats analyses={analyses} />
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Security Best Practices</h2>
                <p className="text-slate-400">
                  Learn essential cybersecurity practices to protect yourself from phishing and online threats.
                </p>
              </div>
              <SecurityTips />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-md mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <p>© 2025 PhishGuard. Advanced threat detection technology.</p>
              <div className="flex items-center space-x-4">
                <span>Made with security in mind</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;