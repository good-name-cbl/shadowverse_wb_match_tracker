# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Shadowverse Worlds Beyond match tracking application** built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and AWS Amplify Gen2. The app allows users to manage decks, record match results, and view detailed statistics about their gameplay.

**Current State**: The app supports **hybrid data storage**:
- **Guest mode (not logged in)**: Data is stored in LocalStorage, all features available
- **Authenticated mode**: Data is stored in DynamoDB via AppSync GraphQL API
- **Data migration**: When logging in, users can migrate LocalStorage data to DynamoDB

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### AWS Amplify Commands
```bash
npx ampx sandbox     # Start Amplify sandbox environment
npx ampx generate    # Generate GraphQL client types
```

## Architecture

### High-Level Structure

The application follows a **4-layer architecture**:

```
┌─────────────────────────────────┐
│  Presentation Layer             │  ← React components (components/*)
├─────────────────────────────────┤
│  State Management Layer         │  ← Context API + useState + Amplify Data
├─────────────────────────────────┤
│  Business Logic Layer           │  ← Utils (statistics, templates)
├─────────────────────────────────┤
│  Data Layer                     │  ← LocalStorage (guest mode)
│                                 │    DynamoDB (authenticated mode)
│                                 │    Cognito (authentication)
└─────────────────────────────────┘
```

### Key Design Patterns

1. **Unidirectional Data Flow**: Data flows from `app/page.tsx` down to child components via props. Child components call handler functions to update state in the parent.

2. **State Management**:
   - **Global State**: Authentication state managed via `AuthContext` (React Context) with AWS Cognito
   - **Page-Local State**: Decks, match records, and current deck managed in `app/page.tsx` using `useState`, loaded from DynamoDB on mount
   - **Component-Local State**: Form inputs and UI state managed with `useState` in individual components

3. **Hybrid Data Management**: The `useHybridData` hook automatically switches between LocalStorage (guest) and DynamoDB (authenticated) based on authentication state. All CRUD operations are performed through the appropriate data source with optimistic UI updates.

4. **Performance Optimization**: Heavy statistics calculations use `useMemo` to prevent unnecessary recalculations (see `StatsSection`).

## Core Data Flow

### Application Startup
```
app/layout.tsx
  ↓ Wraps with <AuthProvider> + <Authenticator.Provider>
contexts/AuthContext.tsx
  ↓ Checks Cognito session via getCurrentUser() and fetchAuthSession()
app/page.tsx
  ↓ Checks authentication state
  ├─ Not authenticated → <AuthPage>
  └─ Authenticated → Fetches decks/records from DynamoDB → Main app
```

### Data Relationships
```
User (1) ──┬── Deck (many)
           └── MatchRecord (many)

Deck (1) ── MatchRecord (many)
            (linked via myDeckId)
```

### Critical State in app/page.tsx
- `decks`: Array of user's registered decks (fetched from DynamoDB, managed with `useState`)
- `records`: Array of match records (fetched from DynamoDB, managed with `useState`)
- `currentDeckId`: ID of the currently selected deck (component state)
- `activeTab`: Current tab ('decks' | 'matches' | 'stats')
- `seasons`: Array of seasons (fetched from DynamoDB)
- `currentSeasonId`: ID of the currently selected season

## Important Component Hierarchies

### Main Page Structure
```
app/page.tsx (data owner)
├─ Layout
│   └─ Header (shows current deck, logout)
├─ DeckSection (when activeTab === 'decks')
│   ├─ DeckForm (add new deck)
│   │   └─ DeckTemplateSelector (optional deck templates)
│   └─ DeckList (display registered decks)
├─ MatchSection (when activeTab === 'matches')
│   ├─ DeckSelector (select deck for matches)
│   ├─ MatchForm (record match result)
│   ├─ MatchHistory (desktop table view)
│   └─ MatchHistoryMobile (mobile card view)
└─ StatsSection (when activeTab === 'stats')
    ├─ DeckFilter (filter by specific deck)
    ├─ OverallStats (win/loss/win rate)
    ├─ ClassStats / ClassStatsMobile (stats vs each class)
    └─ DeckTypeStats (stats by deck type, first/second)
```

## Key Files and Their Responsibilities

### Core Application
- `app/page.tsx`: **Main controller** - manages all data and event handlers
- `app/layout.tsx`: Root layout with font loading and AuthProvider wrapper

### Type Definitions
- `types/index.ts`: All TypeScript type definitions (ClassType, User, Deck, MatchRecord, Statistics types)

### State Management
- `contexts/AuthContext.tsx`: Global authentication state with AWS Cognito (login/logout/signup/confirmSignUp/resetPassword/deleteAccount)
- `hooks/useHybridData.ts`: Main data hook - switches between LocalStorage and DynamoDB based on auth state
- `hooks/useSeasonData.ts`: Fetches season info from DynamoDB (publicApiKey, no auth required)
- `hooks/useLocalStorageData.ts`: LocalStorage CRUD operations (guest mode)
- `hooks/useDynamoDBData.ts`: DynamoDB CRUD operations (authenticated mode)
- `hooks/useLocalStorage.ts`: Base hook for LocalStorage sync

### Business Logic
- `utils/statistics.ts`: Functions for calculating match statistics
  - `calculateOverallStats()`: Total games, wins, losses, win rate
  - `calculateClassStats()`: Stats grouped by opponent class
  - `calculateDeckTypeStats()`: Stats by opponent deck type with first/second player breakdowns
  - `filterRecordsByDeck()`: Filter records by specific deck
- `utils/constants.ts`: Class names, colors, and helper functions like `getWinRateColor()`
- `utils/deckTemplates.ts`: Pre-defined deck templates organized by class

### Components (by feature)
- `components/auth/`: Authentication UI (LoginForm, SignupForm, ResetPasswordForm, AuthPage)
- `components/deck/`: Deck management (DeckForm, DeckList, DeckSection, DeckTemplateSelector)
- `components/match/`: Match recording (MatchForm, MatchHistory, DeckSelector)
- `components/stats/`: Statistics display (OverallStats, ClassStats, DeckTypeStats, DeckFilter)
- `components/layout/`: Common layout (Header, Layout)
- `components/ui/`: Reusable UI primitives (Button, Input, Select, RadioGroup)

## AWS Amplify Integration (Current Implementation)

The app is fully integrated with AWS Amplify Gen2:

### Authentication (`contexts/AuthContext.tsx`)
Uses AWS Cognito via Amplify Auth:
```typescript
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession,
         confirmSignUp, resetPassword, confirmResetPassword, deleteUser } from 'aws-amplify/auth';
```

### Data Models (`amplify/data/resource.ts`)
DynamoDB tables with owner-based authorization:
- **Deck**: userId, className, deckName, createdAt
- **MatchRecord**: userId, myDeckId, opponentClass, opponentDeckType, result, isFirst, playedAt, seasonId
- **Season**: name, startDate, endDate, isCurrent
- **AggregatedStats**: For public statistics (Lambda-generated)

### Data Access (`app/page.tsx`)
Uses Amplify Data client for all CRUD operations:
```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// Fetch user's decks
const { data: decks } = await client.models.Deck.list({
  filter: { userId: { eq: user.id } }
});

// Create deck with optimistic UI
await client.models.Deck.create({ userId, className, deckName, createdAt });

// Delete with cascade (deck + related records)
await client.models.Deck.delete({ id: deckId });
```

### Lambda Functions (`amplify/functions/`)
- **aggregate-stats**: Aggregates all users' match data for public statistics (triggered by EventBridge)

## Code Style and Conventions

### TypeScript
- Strict mode enabled
- All data types defined in `types/index.ts`
- Use type annotations for props and state

### Component Structure
- Functional components with TypeScript
- Props interfaces defined inline or imported from types
- Use `'use client'` directive for components with hooks or interactivity

### Naming Conventions
- Components: PascalCase (e.g., `DeckForm`)
- Files: PascalCase for components (e.g., `DeckForm.tsx`)
- Utilities: camelCase (e.g., `statistics.ts`)
- Event handlers: `handle` prefix (e.g., `handleAddDeck`)

### Styling
- Tailwind CSS for all styling
- Responsive design with mobile-first approach
- Class-based colors defined in `utils/constants.ts` (CLASS_COLORS)

## Testing and Validation

When making changes:
1. Test authentication flow (login, signup, logout)
2. Test deck creation and deletion (ensure related match records are deleted)
3. Test match recording (ensure a deck is selected first)
4. Verify statistics calculations update correctly
5. Check responsive design on mobile and desktop

## Path Aliases

TypeScript is configured with path aliases:
```json
"@/*": ["./*"]
```

Use `@/` for imports from the root directory:
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { ClassType } from '@/types';
```

## Important Notes

1. **Deck Deletion**: When deleting a deck via `handleDeleteDeck`, all associated match records are also deleted from DynamoDB.

2. **Current Deck Selection**: Users must select a deck before recording matches.

3. **Statistics Filtering**: Stats can be viewed for all decks or filtered to a specific deck using DeckFilter.

4. **Japanese Class Names**: The 7 Shadowverse classes use Japanese names (エルフ, ロイヤル, ウィッチ, ドラゴン, ナイトメア, ビショップ, ネメシス). These are defined in the ClassType union.

5. **Responsive Design**: Match history and class stats have separate mobile/desktop components for optimal UX.

6. **Hybrid Data Persistence**:
   - Guest users: Data stored in LocalStorage (browser-only, lost if cleared)
   - Logged-in users: Data stored in DynamoDB (cloud sync, cross-device access)
   - Migration: LocalStorage data can be migrated to DynamoDB on login

7. **Optimistic UI**: CRUD operations use optimistic updates for better UX - the UI updates immediately while the backend operation happens in the background.

8. **Public Statistics**: The `/stats` page shows aggregated statistics from all users, accessible without authentication.

9. **Season Data**: Season information is fetched from DynamoDB using `publicApiKey`, allowing guest users to have proper season context for their match records.
