export interface URLAnalysis {
  id: string;
  url: string;
  timestamp: Date;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threats: Threat[];
  domain: string;
  isPhishing: boolean;
  analysisTime: number;
}

export interface Threat {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
}

export interface DomainInfo {
  domain: string;
  age: number;
  registrar: string;
  isLegitimate: boolean;
  reputation: number;
}