# 🎣 Lanseta - Romanian Fishing App

Lanseta is a comprehensive mobile and web application designed for hobby anglers in Romania, initially focused on Timis county and Timisoara area. The app provides interactive fishing spot maps, species database, solunar activity insights, and personal fishing journal features.

## 🌟 Features

### 🗺️ Interactive Fishing Map
- **Interactive map** with fishing spot markers for rivers and lakes
- **Detailed spot information** including rules, prices, and present species
- **Search and filter** functionality for spots
- **Focus on Timis county** with plans to expand nationwide

### 🐟 Species Database
- **Comprehensive fish database** with Romanian names and descriptions
- **Fishing guidance** including best rigs, methods, and baits for each species
- **Local species focus** common in Romanian waters

### 🌙 Solunar Activity
- **Daily and hourly fishing activity scores** based on lunar phases
- **Local sunrise/sunset integration** for optimal fishing times
- **Simple, explainable scoring model** that anglers can understand and trust

### 📝 Personal Fishing Journal
- **Log your catches** with details like species, location, bait, and method
- **Personal statistics** and fishing history
- **Track your favorite spots** and successful techniques

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo (Cross-platform mobile + web)
- **Backend**: Supabase (Database, Authentication, Serverless Functions)
- **Language**: TypeScript
- **Maps**: React Native Maps
- **UI Language**: Romanian

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lanseta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Set up Supabase database**
   
   Run the SQL commands in your Supabase SQL Editor (see CLAUDE.md for details):
   - Create `fishing_spots` table
   - Create `species` table  
   - Create `fishing_journal` table
   - Enable Row Level Security policies

### Running the App

```bash
# Start the development server
npm start

# Run on specific platforms
npm run android  # Android emulator
npm run ios      # iOS simulator  
npm run web      # Web browser
```

## 📱 Usage

### For Mobile
- Install Expo Go from App Store/Play Store
- Scan the QR code from terminal
- App will load on your device

### For Web
- Press `w` in terminal or visit `http://localhost:8081`
- Full web compatibility for desktop users

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components  
├── services/           # API calls, Supabase client
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── types/              # TypeScript type definitions
├── constants/          # App constants, colors, themes
└── localization/       # Romanian text content

app/
├── (tabs)/            # Tab navigation screens
│   ├── index.tsx      # Map screen (main)
│   ├── species.tsx    # Species database
│   ├── journal.tsx    # Fishing journal
│   └── profile.tsx    # User profile
└── _layout.tsx        # Root layout
```

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and basic navigation
- [ ] Interactive map with fishing spots
- [ ] Basic species database
- [ ] Simple fishing journal
- [ ] User authentication

### Phase 2: Enhanced Features
- [ ] Advanced solunar calculations
- [ ] Offline map support
- [ ] Weather integration
- [ ] Social features (sharing catches)
- [ ] Advanced filtering and search

### Phase 3: Scale & Polish
- [ ] Expand to all Romanian counties  
- [ ] iOS/Android app store deployment
- [ ] Admin panel for spot management
- [ ] Analytics and user insights

## 🇷🇴 Romanian Fishing Context

Lanseta is built specifically for Romanian anglers with:
- **Local species database** featuring fish common in Romanian rivers and lakes
- **Regional fishing regulations** and seasonal information
- **Romanian fishing terminology** and cultural practices
- **Local community focus** starting with Timis county

## 🤝 Contributing

This project follows Romanian fishing culture and practices. Contributions should maintain:
- Romanian language for all UI text
- Local fishing knowledge accuracy
- Focus on hobby/recreational fishing
- Family-friendly content

## 📄 Development Guidelines

See `CLAUDE.md` for detailed development guidelines including:
- Code style and conventions
- Database schema details
- Testing procedures
- Deployment instructions

## 📞 Contact & Support

Built for Romanian fishing enthusiasts by anglers who understand the local fishing culture.

---

**🎣 Tight lines and good fishing! / Noduri tari și pescuit bun!**