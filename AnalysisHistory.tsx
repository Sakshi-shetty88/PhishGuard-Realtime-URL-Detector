import React from 'react';
import { Clock, Download, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { URLAnalysis } from '../types';

interface AnalysisHistoryProps {
  analyses: URLAnalysis[];
  onClear: () => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses, onClear }) => {
  const exportAnalyses = () => {
    const dataStr = JSON.stringify(analyses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `phishing_analysis_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'MEDIUM': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'CRITICAL': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 text-center">
        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Analysis History</h3>
        <p className="text-slate-400">Start by analyzing a URL to see your scan history here</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Analysis History</h3>
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
            {analyses.length} scans
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportAnalyses}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={onClear}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Analysis List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-900/70 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getRiskIcon(analysis.riskLevel)}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-mono text-sm truncate">{analysis.url}</p>
                  <p className="text-slate-400 text-xs">
                    {analysis.timestamp.toLocaleString()} • {analysis.analysisTime}ms
                  </p>
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className={`text-lg font-bold ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskScore}
                </div>
                <div className={`text-xs ${getRiskColor(analysis.riskLevel)}`}>
                  {analysis.riskLevel}
                </div>
              </div>
            </div>
            
            {analysis.threats.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-400 text-xs mb-2">
                  {analysis.threats.length} threat{analysis.threats.length !== 1 ? 's' : ''} detected:
                </p>
                <div className="flex flex-wrap gap-1">
                  {analysis.threats.slice(0, 3).map((threat, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        threat.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                        threat.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {threat.type}
                    </span>
                  ))}
                  {analysis.threats.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-600/20 text-slate-400">
                      +{analysis.threats.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};