# Noted

**The quiet, encrypted workspace for your life's essential data.**

Noted is a comprehensive, privacy-first web application designed to help you capture your thoughts, manage your tasks, and track your finances—all within a unified, distraction-free environment. Built with modern web technologies, it emphasizes a sleek "Glass Garden" aesthetic and implements zero-knowledge architecture to ensure that your data remains securely yours.

![Noted Hero Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200)

## 🌟 Core Capabilities

### 🔒 Encrypted Thoughts
Your notes are locked securely before leaving your device using AES-GCM 256-bit encryption. A completely private, distraction-free environment for your mind. Only you hold the key.

### 💰 Financial Tracking
Keep a transparent log of your income and expenses. Understand your cash flow instantly inside the same ecosystem with intuitive, beautiful charting built right in.

### ✅ Task Mastery
Organize your daily agenda alongside your thoughts. Tick off tasks and track your productivity across beautiful charts to never miss a beat.

### ✨ Intelligent Assist
Summon the built-in AI assistant to brainstorm, rewrite, or generate imagery right inside the rich text editor without breaking your focus.

---

## 📸 Screenshots

| Dashboard & Statistics | Rich Text & AI Editor |
| :---: | :---: |
| *(Add your screenshot here)* | *(Add your screenshot here)* |
| **Financial Tracking** | **Task Mastery** |
| *(Add your screenshot here)* | *(Add your screenshot here)* |

---

## 🚀 Tech Stack

- **Frontend Framework:** React (Vite)
- **Styling:** Vanilla CSS & Tailwind CSS (Custom "Glass Garden" design system)
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Routing:** React Router v6
- **Animations:** GSAP (GreenSock)
- **Icons:** Lucide React
- **Backend/BaaS:** Supabase (PostgreSQL, Auth, RLS)
- **LLM/Image AI:** Pollinations AI

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/djulTrb/Noted-App.git
   cd Noted-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and configure your Supabase instance:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🔒 Security & Privacy

Noted relies on Supabase's Row Level Security (RLS) to ensure that users can only access their authenticated data. Furthermore, Noted utilizes native Web Crypto APIs to execute AES-GCM encryption on the client side. Your notes and encrypted content are decrypted solely within your browser session, meaning the database only ever stores ciphertexts.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/djulTrb/Noted-App/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Designed and developed by [djulTrb](https://github.com/djulTrb).*
