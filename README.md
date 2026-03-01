🚀 PrepFlow AI
The Intelligent Study Partner for JAMB & WAEC Candidates
PrepFlow AI is a Progressive Web App (PWA) designed to transform handwritten notes and textbook pages into organized, high-yield study insights. Built with a "Gemini-first" design philosophy, it uses advanced AI to bridge the gap between physical notes and digital mastery.

[Insert Screenshot of your PWA Dashboard here]

✨ Key Features
PrepFlow Lens: An intelligent viewfinder that "scans" documents with a real-time AI overlay.

Deep Dive Analysis: Automatically summarizes notes and identifies key exam topics for Biology, Physics, Maths, and more.

AI Quiz Generation: Instant JAMB-style mock exams generated directly from your specific scanned notes.

Smart Library: A glassmorphism-inspired archive to manage your study materials by subject.

Native PWA Experience: Installable on Android and iOS with offline support and edge-to-edge branding.

🛠️ Tech Stack
Frontend: React.js + Vite

UI Framework: Material UI (MUI)

PWA Engine: vite-plugin-pwa

Animations: Framer Motion & CSS Keyframes

AI Engine: [Mention your API here, e.g., Google Gemini API / OpenAI]

Deployment: [e.g., Vercel / Netlify]

📦 Installation & Setup
Clone the repository

Bash
git clone https://github.com/yourusername/prepflow-ai.git
cd prepflow-ai
Install dependencies

Bash
npm install
Configure Environment Variables
Create a .env file in the root and add your AI API keys:

Code snippet
VITE_AI_API_KEY=your_key_here
Run in Development

Bash
npm run dev
📱 PWA Configuration (Important)
To ensure the "White Box" fix works and the app looks native on mobile:

Place all icons in the /public folder.

Ensure manifest.json (via vite.config.js) includes the maskable icon purpose.

Check index.html for the apple-touch-icon meta tags.

🇳🇬 Target Exams
JAMB (UTME): Focuses on speed and accuracy.

WAEC/NECO: Focuses on theoretical depth and definitions.

🤝 Contributing
Contributions are welcome! If you're a developer in the Nigerian tech space looking to improve education, feel free to fork and PR.
