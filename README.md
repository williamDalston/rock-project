# Lithos

AI-powered rock and mineral identification with social trading features.

## Features

- **AI Rock Identification** - Scan rocks using your camera and get instant AI-powered analysis including name, type, luster, texture, and rarity score
- **Personal Vault** - Build your personal collection of identified specimens
- **Global Market** - Share discoveries and browse specimens from geologists worldwide
- **Trading System** - Propose trades with other collectors

## Tech Stack

- **React 18** + **TypeScript** - Type-safe UI development
- **Vite** - Lightning-fast build tooling
- **Tailwind CSS** - Utility-first styling
- **Firebase** - Authentication & Firestore database
- **Google Gemini AI** - Rock identification and analysis
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Firebase project
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lithos.git
   cd lithos
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_APP_ID=lithos
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── layout/      # Layout components (NavBar)
│   ├── modals/      # Modal components (TradeModal)
│   └── ui/          # Reusable UI components
├── constants/       # App constants and config
├── hooks/           # Custom React hooks
├── services/        # External service integrations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── views/           # Page-level components
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Anonymous sign-in
3. Create a Firestore database
4. Add your Firebase config to `.env`

### Firestore Structure

```
artifacts/
└── {appId}/
    ├── users/
    │   └── {userId}/
    │       └── rocks/
    │           └── {rockId}
    └── public/
        └── data/
            └── market_rocks/
                └── {rockId}
```

## License

MIT License - see [LICENSE](LICENSE) for details.
