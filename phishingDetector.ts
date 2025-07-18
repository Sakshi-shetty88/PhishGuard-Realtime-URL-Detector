import { URLAnalysis, Threat, DomainInfo } from '../types';

export class PhishingDetector {
  private suspiciousDomains = [
    'bit.ly', 'tinyurl.com', 'short.link', 'ow.ly', 't.co'
  ];

  private legitimateDomains = [
    'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 
    'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
    'github.com', 'stackoverflow.com', 'wikipedia.org'
  ];

  private phishingKeywords = [
    'verify', 'suspend', 'urgent', 'immediate', 'confirm', 'update',
    'security', 'alert', 'warning', 'action', 'required', 'click',
    'limited', 'expires', 'temporary', 'restore', 'validate'
  ];

  async analyzeURL(url: string): Promise<URLAnalysis> {
    const startTime = Date.now();
    const threats: Threat[] = [];
    let riskScore = 0;

    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname.toLowerCase();
      
      // Check for suspicious patterns
      threats.push(...this.checkSuspiciousPatterns(url, parsedUrl));
      threats.push(...this.checkDomainReputation(domain));
      threats.push(...this.checkURLStructure(parsedUrl));
      threats.push(...this.checkPhishingKeywords(url));
      threats.push(...this.checkSSLSecurity(parsedUrl));

      // Calculate risk score
      riskScore = this.calculateRiskScore(threats);
      
      const riskLevel = this.getRiskLevel(riskScore);
      const isPhishing = riskScore >= 70;

      return {
        id: crypto.randomUUID(),
        url,
        timestamp: new Date(),
        riskScore,
        riskLevel,
        threats,
        domain,
        isPhishing,
        analysisTime: Date.now() - startTime
      };
    } catch (error) {
      threats.push({
        type: 'Invalid URL',
        severity: 'HIGH',
        description: 'The provided URL is malformed or invalid',
        recommendation: 'Verify the URL format and try again'
      });

      return {
        id: crypto.randomUUID(),
        url,
        timestamp: new Date(),
        riskScore: 90,
        riskLevel: 'CRITICAL',
        threats,
        domain: 'unknown',
        isPhishing: true,
        analysisTime: Date.now() - startTime
      };
    }
  }

  private checkSuspiciousPatterns(url: string, parsedUrl: URL): Threat[] {
    const threats: Threat[] = [];
    const domain = parsedUrl.hostname.toLowerCase();

    // Check for URL shorteners
    if (this.suspiciousDomains.some(suspicious => domain.includes(suspicious))) {
      threats.push({
        type: 'URL Shortener',
        severity: 'MEDIUM',
        description: 'URL uses a link shortening service',
        recommendation: 'Be cautious with shortened URLs as they can hide the true destination'
      });
    }

    // Check for IP addresses instead of domains
    if (/^https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
      threats.push({
        type: 'IP Address',
        severity: 'HIGH',
        description: 'URL uses IP address instead of domain name',
        recommendation: 'Legitimate websites typically use domain names, not IP addresses'
      });
    }

    // Check for suspicious subdomains
    const subdomains = domain.split('.');
    if (subdomains.length > 3) {
      threats.push({
        type: 'Suspicious Subdomain',
        severity: 'MEDIUM',
        description: 'URL contains multiple subdomains',
        recommendation: 'Verify this is the legitimate website you intended to visit'
      });
    }

    // Check for homograph attacks
    if (/[а-яё]/i.test(domain) || /[αβγδεζηθικλμνξοπρστυφχψω]/i.test(domain)) {
      threats.push({
        type: 'Homograph Attack',
        severity: 'HIGH',
        description: 'Domain contains non-Latin characters that may mimic legitimate sites',
        recommendation: 'Verify the domain spelling carefully'
      });
    }

    return threats;
  }

  private checkDomainReputation(domain: string): Threat[] {
    const threats: Threat[] = [];

    // Check against known legitimate domains
    const isLegitimate = this.legitimateDomains.some(legit => 
      domain === legit || domain.endsWith('.' + legit)
    );

    if (!isLegitimate) {
      // Check for domain spoofing
      const similarDomain = this.legitimateDomains.find(legit => {
        const similarity = this.calculateSimilarity(domain, legit);
        return similarity > 0.7 && similarity < 1.0;
      });

      if (similarDomain) {
        threats.push({
          type: 'Domain Spoofing',
          severity: 'CRITICAL',
          description: `Domain is similar to legitimate domain: ${similarDomain}`,
          recommendation: 'This appears to be a spoofed domain. Do not enter credentials.'
        });
      }
    }

    return threats;
  }

  private checkURLStructure(parsedUrl: URL): Threat[] {
    const threats: Threat[] = [];

    // Check for excessive URL length
    if (parsedUrl.href.length > 200) {
      threats.push({
        type: 'Long URL',
        severity: 'MEDIUM',
        description: 'URL is unusually long',
        recommendation: 'Long URLs may be used to hide malicious content'
      });
    }

    // Check for suspicious parameters
    const suspiciousParams = ['redirect', 'goto', 'next', 'url', 'link', 'target'];
    const hasRedirect = suspiciousParams.some(param => 
      parsedUrl.searchParams.has(param)
    );

    if (hasRedirect) {
      threats.push({
        type: 'Redirect Parameter',
        severity: 'MEDIUM',
        description: 'URL contains redirect parameters',
        recommendation: 'Be cautious of URLs that redirect to other sites'
      });
    }

    // Check for excessive dashes or dots
    if ((parsedUrl.hostname.match(/-/g) || []).length > 3) {
      threats.push({
        type: 'Suspicious Characters',
        severity: 'MEDIUM',
        description: 'Domain contains excessive dashes',
        recommendation: 'Legitimate domains rarely use many dashes'
      });
    }

    return threats;
  }

  private checkPhishingKeywords(url: string): Threat[] {
    const threats: Threat[] = [];
    const lowerUrl = url.toLowerCase();

    const foundKeywords = this.phishingKeywords.filter(keyword => 
      lowerUrl.includes(keyword)
    );

    if (foundKeywords.length > 2) {
      threats.push({
        type: 'Phishing Keywords',
        severity: 'HIGH',
        description: `Contains suspicious keywords: ${foundKeywords.join(', ')}`,
        recommendation: 'Be extremely cautious with URLs containing urgency keywords'
      });
    }

    return threats;
  }

  private checkSSLSecurity(parsedUrl: URL): Threat[] {
    const threats: Threat[] = [];

    if (parsedUrl.protocol !== 'https:') {
      threats.push({
        type: 'No SSL',
        severity: 'HIGH',
        description: 'Website does not use secure HTTPS protocol',
        recommendation: 'Never enter sensitive information on non-HTTPS sites'
      });
    }

    return threats;
  }

  private calculateRiskScore(threats: Threat[]): number {
    const severityWeights = {
      'LOW': 10,
      'MEDIUM': 25,
      'HIGH': 50,
      'CRITICAL': 100
    };

    return Math.min(100, threats.reduce((score, threat) => 
      score + severityWeights[threat.severity], 0
    ));
  }

  private getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 90) return 'CRITICAL';
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}