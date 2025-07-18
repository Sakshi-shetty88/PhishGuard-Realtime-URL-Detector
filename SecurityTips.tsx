import React from 'react';
import { Lightbulb, ExternalLink } from 'lucide-react';

export const SecurityTips: React.FC = () => {
  const tips = [
    {
      title: "Verify the URL",
      description: "Always check the complete URL before clicking. Look for misspellings or unusual characters.",
      category: "Basic"
    },
    {
      title: "Check for HTTPS",
      description: "Legitimate websites use HTTPS (look for the lock icon). Never enter sensitive data on HTTP sites.",
      category: "Security"
    },
    {
      title: "Beware of Urgency",
      description: "Phishing attempts often create false urgency. Take time to verify suspicious messages.",
      category: "Psychology"
    },
    {
      title: "Use Bookmarks",
      description: "For important sites, use bookmarks instead of clicking links in emails or messages.",
      category: "Best Practice"
    },
    {
      title: "Enable 2FA",
      description: "Two-factor authentication adds an extra layer of security even if passwords are compromised.",
      category: "Security"
    },
    {
      title: "Keep Software Updated",
      description: "Regular updates patch security vulnerabilities that could be exploited by malicious sites.",
      category: "Maintenance"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Basic': return 'bg-blue-500/20 text-blue-400';
      case 'Security': return 'bg-red-500/20 text-red-400';
      case 'Psychology': return 'bg-purple-500/20 text-purple-400';
      case 'Best Practice': return 'bg-green-500/20 text-green-400';
      case 'Maintenance': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-semibold text-white">Security Tips</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-slate-900/50 rounded-xl p-4 hover:bg-slate-900/70 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-white">{tip.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(tip.category)}`}>
                {tip.category}
              </span>
            </div>
            <p className="text-slate-300 text-sm">{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">Want to learn more about cybersecurity?</p>
          <a
            href="https://www.cisa.gov/cybersecurity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors"
          >
            <span>CISA Resources</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};