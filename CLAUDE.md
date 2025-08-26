# Lanseta - Romanian Mobile Fishing App

## Project Overview
Lanseta is a native mobile app for Romanian fishermen, specifically targeting hobby anglers in Timis county/Timisoara. The app provides interactive fishing spot maps, solunar activity insights, species database, and personal fishing journal.

## Tech Stack
- **Frontend**: React Native with Expo (iOS & Android only)
- **Backend**: Supabase (database, auth, serverless functions)
- **Language**: TypeScript
- **Primary Language**: Romanian (UI/content)
- **Target Platforms**: iOS and Android mobile devices only

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
- Mobile-first design and development approach
- Use Expo development build for maps testing on real devices
- Implement offline-friendly design (cache important data)
- Optimize for touch interactions and mobile gestures

### Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Testing
- Test maps functionality on physical iOS and Android devices
- Test location permissions and GPS accuracy
- Verify Romanian text rendering and input on mobile keyboards
- Test touch interactions and gestures

### Deployment
- iOS: Expo EAS Build → Apple App Store
- Android: Expo EAS Build → Google Play Store

## Romanian Fishing Context
- Focus on species common in Timis county rivers/lakes
- Include local fishing regulations and seasons
- Use Romanian fishing terminology
- Consider Romanian fishing culture and practices