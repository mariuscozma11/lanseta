# Lanseta - Romanian Fishing App

## Project Overview
Lanseta is a mobile and web app for Romanian fishermen, specifically targeting hobby anglers in Timis county/Timisoara. The app provides fishing spot maps, solunar activity insights, species database, and personal fishing journal.

## Tech Stack
- **Frontend**: React Native with Expo (mobile + web)
- **Backend**: Supabase (database, auth, serverless functions)
- **Language**: TypeScript
- **Primary Language**: Romanian (UI/content)

## Development Guidelines

### Code Style
- Use TypeScript strictly - no `any` types
- Functional components with hooks
- Follow React Native/Expo conventions
- Use consistent naming: camelCase for variables, PascalCase for components
- No comments unless absolutely necessary for complex logic

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # API calls, Supabase client
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── types/              # TypeScript type definitions
├── constants/          # App constants, colors, etc.
└── localization/       # Romanian text content
```

### Database Schema (Supabase)
- `fishing_spots`: Main spots with coordinates, rules, species
- `species`: Fish database with rigs, methods, baits
- `fishing_journal`: User catch logs
- `solunar_scores`: Daily/hourly activity scores

### Key Features Implementation
1. **Map Screen**: Main screen with interactive map and spot pins
2. **Solunar**: Custom algorithm based on lunar phase + sunrise/sunset
3. **Species Database**: Comprehensive fish info with fishing methods
4. **Fishing Journal**: Personal catch tracking
5. **Authentication**: Supabase Auth integration

### Development Rules
- All UI text must be in Romanian
- Focus on Timis county fishing spots initially
- Test on both mobile and web platforms
- Use Expo development build for maps testing
- Implement offline-friendly design (cache important data)

### Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Testing
- Test maps functionality on physical device
- Verify web compatibility regularly
- Test Romanian text rendering and input

### Deployment
- Mobile: Expo EAS Build → App Store / Play Store
- Web: Expo web build → Vercel/Netlify

## Romanian Fishing Context
- Focus on species common in Timis county rivers/lakes
- Include local fishing regulations and seasons
- Use Romanian fishing terminology
- Consider Romanian fishing culture and practices