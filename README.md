# PhishGuard-Realtime-URL-Detector
 AI-enhanced threat detection dashboard for phishing URLs
# 🛡️ PhishGuard – Real-Time URL Phishing Detector

PhishGuard is a modern, real-time phishing URL detection system designed to identify and analyze malicious URLs using advanced heuristics, real-time scanning, and intuitive security analytics.


---

## 🚀 Features

- ✅ **Real-Time URL Scanning**
- 🧠 **Heuristic-Based Threat Detection** (homograph attacks, suspicious keywords, domain spoofing)
- 📊 **Threat Scoring System** (0–100 based on threat severity)
- 🔒 **Visual Security Dashboard** with live stats
- 🧾 **Scan History & Risk Breakdown**
- 🟧 **Detection of URL Shorteners, Fake Logins & Spoofed Domains**
- 🎯 **Risk Categorization** – Low, Medium, High, Critical

---

## 🧠 How It Works

PhishGuard uses multiple detection layers to analyze and score URLs:

1. **Keyword Detection**: Identifies phishing keywords (e.g., `login`, `verify`, `update`, etc.)
2. **Domain Reputation Check**: Flags newly registered or blacklisted domains
3. **URL Pattern Analysis**: Detects suspicious structures like multiple subdomains, IP-based URLs
4. **Shortened URLs**: Flags URLs from shortening services (e.g., bit.ly, tinyurl)
5. **Risk Scoring**: Calculates an average score out of 100 and categorizes threat levels

---



## 🖥️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism Design
- **Icons/Assets**: Heroicons, Custom SVG
- **Build Tool**: Vite
- **Deployment**: Localhost (dev) – Ready for Netlify/Vercel




**Screenshots**


<img width="1877" height="1082" alt="Screenshot 2025-07-18 093524" src="https://github.com/user-attachments/assets/b2c00df3-96cb-4c8d-be9f-b7af3056bec8" />



<img width="1901" height="1076" alt="Screenshot 2025-07-18 093539" src="https://github.com/user-attachments/assets/ce26a690-f35f-41b5-b26e-9fc999131ea5" />



<img width="1901" height="1048" alt="Screenshot 2025-07-18 093550" src="https://github.com/user-attachments/assets/b3b78ac2-58be-4186-a7a8-19b6f61632ee" />



<img width="1861" height="1033" alt="Screenshot 2025-07-18 093601" src="https://github.com/user-attachments/assets/446fd70f-c8c5-45f6-87c2-250e301f4ac2" />




<img width="1864" height="1059" alt="Screenshot 2025-07-18 093652" src="https://github.com/user-attachments/assets/0886fb0d-54ef-4809-ada8-b216302295a3" />





🧪 Future Improvements
🔍 Integrate VirusTotal or WHOIS API for deeper URL reputation

🌐 Add browser extension for real-time protection

📥 Export threat reports as PDF

📡 WebSocket-based live feed for enterprise mode

