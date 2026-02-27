# Noted

**The quiet, encrypted workspace for your life's essential data.**

Noted is a comprehensive, privacy-first web application designed to help you capture your thoughts, manage your tasks, and track your finances—all within a unified, distraction-free environment. Built with modern web technologies, it emphasizes a sleek "Glass Garden" aesthetic and implements zero-knowledge architecture to ensure that your data remains securely yours.

![Noted Hero Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200)

## Core Capabilities

### Encrypted Thoughts
Your notes are locked securely before leaving your device using AES-GCM 256-bit encryption. A completely private, distraction-free environment for your mind. Only you hold the key.

### Financial Tracking
Keep a transparent log of your income and expenses. Understand your cash flow instantly inside the same ecosystem with intuitive, beautiful charting built right in.

### Task Mastery
Organize your daily agenda alongside your thoughts. Tick off tasks and track your productivity across beautiful charts to never miss a beat.

### Intelligent Assist
Summon the built-in AI assistant to brainstorm, rewrite, or generate imagery right inside the rich text editor without breaking your focus.

---


## Tech Stack

- **Frontend Framework:** React (Vite)
- **Styling:** Vanilla CSS & Tailwind CSS (Custom "Glass Garden" design system)
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Routing:** React Router v6
- **Animations:** GSAP (GreenSock)
- **Icons:** Lucide React
- **Backend/BaaS:** Supabase (PostgreSQL, Auth, RLS)
- **LLM/Image AI:** Pollinations AI


## Security & Privacy

Noted relies on Supabase's Row Level Security (RLS) to ensure that users can only access their authenticated data. Furthermore, Noted utilizes native Web Crypto APIs to execute AES-GCM encryption on the client side. Your notes and encrypted content are decrypted solely within your browser session, meaning the database only ever stores ciphertexts.


*Designed and developed by [djulTrb](https://github.com/djulTrb).*
