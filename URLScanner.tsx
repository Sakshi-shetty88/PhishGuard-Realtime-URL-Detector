import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PhishingDetector } from '../utils/phishingDetector';
import { URLAnalysis } from '../types';

interface URLScannerProps {
  onAnalysisComplete: (analysis: URLAnalysis) => void;
}

export const URLScanner: React.FC<URLScannerProps> = ({ onAnalysisComplete }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<URLAnalysis | null>(null);

  const detector = new PhishingDetector();

  const handleScan = async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setCurrentAnalysis(null);

    try {
      const analysis = await detector.analyzeURL(url);
      setCurrentAnalysis(analysis);
      onAnalysisComplete(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsScanning(false);
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'MEDIUM': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'HIGH': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'CRITICAL': return <XCircle className="w-6 h-6 text-red-400" />;
      default: return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* URL Input Section */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., https://example.com)"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          
          <button
            onClick={handleScan}
            disabled={!url.trim() || isScanning}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Scan URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 space-y-6">
          {/* Risk Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRiskIcon(currentAnalysis.riskLevel)}
              <div>
                <h3 className="text-xl font-semibold text-white">Analysis Complete</h3>
                <p className="text-slate-400">Completed in {currentAnalysis.analysisTime}ms</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getRiskColor(currentAnalysis.riskLevel)}`}>
                {currentAnalysis.riskScore}/100
              </div>
              <div className={`text-sm font-medium ${getRiskColor(currentAnalysis.riskLevel)}`}>
                {currentAnalysis.riskLevel} RISK
              </div>
            </div>
          </div>

          {/* URL Info */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Analyzed URL:</span>
              <span className={currentAnalysis.isPhishing ? 'text-red-400' : 'text-green-400'}>
                {currentAnalysis.isPhishing ? 'PHISHING DETECTED' : 'NO THREATS DETECTED'}
              </span>
            </div>
            <p className="text-white font-mono text-sm break-all">{currentAnalysis.url}</p>
            <p className="text-slate-400 text-sm mt-1">Domain: {currentAnalysis.domain}</p>
          </div>

          {/* Threats */}
          {currentAnalysis.threats.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span>Security Threats ({currentAnalysis.threats.length})</span>
              </h4>
              <div className="space-y-3">
                {currentAnalysis.threats.map((threat, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-xl p-4 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{threat.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        threat.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                        threat.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {threat.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{threat.description}</p>
                    <p className="text-slate-400 text-xs italic">{threat.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentAnalysis.threats.length === 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium">No security threats detected</p>
              <p className="text-slate-400 text-sm">This URL appears to be safe</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};