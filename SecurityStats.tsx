import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { URLAnalysis } from '../types';

interface SecurityStatsProps {
  analyses: URLAnalysis[];
}

export const SecurityStats: React.FC<SecurityStatsProps> = ({ analyses }) => {
  const totalScans = analyses.length;
  const phishingDetected = analyses.filter(a => a.isPhishing).length;
  const safeURLs = totalScans - phishingDetected;
  const avgRiskScore = totalScans > 0 ? 
    Math.round(analyses.reduce((sum, a) => sum + a.riskScore, 0) / totalScans) : 0;

  const riskDistribution = {
    LOW: analyses.filter(a => a.riskLevel === 'LOW').length,
    MEDIUM: analyses.filter(a => a.riskLevel === 'MEDIUM').length,
    HIGH: analyses.filter(a => a.riskLevel === 'HIGH').length,
    CRITICAL: analyses.filter(a => a.riskLevel === 'CRITICAL').length,
  };

  const detectionRate = totalScans > 0 ? Math.round((phishingDetected / totalScans) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Scans */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Total Scans</p>
            <p className="text-2xl font-bold text-white">{totalScans}</p>
          </div>
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Phishing Detected */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Threats Detected</p>
            <p className="text-2xl font-bold text-red-400">{phishingDetected}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>

      {/* Safe URLs */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Safe URLs</p>
            <p className="text-2xl font-bold text-green-400">{safeURLs}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      </div>

      {/* Detection Rate */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Detection Rate</p>
            <p className="text-2xl font-bold text-orange-400">{detectionRate}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-400" />
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 lg:col-span-2">
        <h4 className="text-white font-semibold mb-3">Risk Level Distribution</h4>
        <div className="space-y-2">
          {Object.entries(riskDistribution).map(([level, count]) => {
            const percentage = totalScans > 0 ? (count / totalScans) * 100 : 0;
            const color = {
              LOW: 'bg-green-500',
              MEDIUM: 'bg-yellow-500',
              HIGH: 'bg-orange-500',
              CRITICAL: 'bg-red-500'
            }[level];
            
            return (
              <div key={level} className="flex items-center space-x-3">
                <span className="text-slate-400 text-sm w-16">{level}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-slate-300 text-sm w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Average Risk Score */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 lg:col-span-2">
        <h4 className="text-white font-semibold mb-3">Average Risk Score</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="bg-slate-700 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  avgRiskScore >= 70 ? 'bg-red-500' :
                  avgRiskScore >= 40 ? 'bg-orange-500' :
                  avgRiskScore >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${avgRiskScore}%` }}
              ></div>
            </div>
          </div>
          <span className="text-2xl font-bold text-white">{avgRiskScore}/100</span>
        </div>
      </div>
    </div>
  );
};