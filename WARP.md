# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development Tasks
```bash
# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development (includes dev tools)
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview

# Clean up Supabase books database (removes non-curated books)
npm run cleanup:supabase
```

### Dependencies
```bash
# Install all dependencies
npm i

# If using alternative package manager (Bun is configured):
bun install
```

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn-ui components
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Routing**: React Router DOM with lazy-loaded pages
- **UI Components**: Radix UI primitives via shadcn-ui

### Database Schema (Supabase)
- **profiles**: User profiles created after auth
- **BOOKS**: Book catalog with ISBN, titles, authors, images
- **user_book_preferences**: User likes/dislikes for books
- **matches**: Tracks when users like the same books
- **messages**: Chat functionality between matched users

### Core Application Flow
1. **Landing Page** (`/`): Marketing page with features overview
2. **Authentication**: Google OAuth via Supabase (`/signin`, `/signup`)
3. **Book Swiping** (`/swipe`): Main feature - Tinder-like book discovery
4. **Matching System**: Users who like the same books can connect
5. **Community** (`/community`): View matches and other users
6. **Chat System** (`/chat/:recipientId`, `/book-chat/:bookId`): Messaging between matched users

### Key Hooks & State Management
- **useAuth**: Handles authentication state, Google sign-in, profile creation
- **useBooks**: Manages book loading, swiping logic, preference persistence, match detection
- **useProfile**: User profile management
- **React Query**: Server state caching for API calls

### Book Data Management
- **Curated Books**: Hardcoded list of quality children's books in `src/data/books.ts`
- **Dynamic Loading**: Books sync to Supabase on first load for persistence
- **Preference Tracking**: User swipes stored as `user_book_preferences`
- **Match Detection**: Real-time matching when users like the same books

### File Structure Patterns
```
src/
├── components/
│   ├── ui/           # shadcn-ui components (auto-generated)
│   └── BookCard.tsx  # Custom book display component
├── pages/            # Route components (lazy-loaded)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── data/             # Static data (curated books)
├── integrations/
│   └── supabase/     # Supabase client & types
└── assets/           # Static assets
```

### Environment & Configuration
- **Vite Config**: Custom port 8080, path aliases (@/* → src/*)
- **TypeScript**: Relaxed config (allows implicit any, unused vars)
- **ESLint**: React + TypeScript rules with some warnings disabled
- **Supabase**: Project ID `yyupyzapcugtgjzubvie`

## Development Guidelines

### Authentication Flow
- Email-based signup with confirmation required
- Google OAuth redirects to `/auth/callback`
- Enhanced AuthCallback component shows success/error states with user feedback
- Profile auto-created on first sign-in using user metadata
- All main features require authentication except landing page
- See `SUPABASE_AUTH_SETUP.md` for Supabase dashboard configuration requirements

### Database Operations
- Use the `supabase` client from `@/integrations/supabase/client`
- Books are inserted on-demand when users interact with them
- Preferences use upsert pattern for user likes/dislikes
- Match detection runs after each like action

### UI/UX Patterns
- Responsive design with mobile-first approach
- Gradient backgrounds and blur effects for visual appeal
- Loading states with animated spinners and skeleton components  
- Toast notifications for user feedback (sonner + shadcn toast)
- Lazy loading for all page components

### Performance Considerations
- Books load immediately from local curated data for fast first paint
- Background sync to Supabase for persistence
- React Query caching prevents unnecessary API calls
- Component lazy loading reduces initial bundle size

### Testing & Quality
- No test framework currently configured
- ESLint for code quality (relaxed TypeScript rules)
- Manual testing workflow via development server

### Deployment
- Built for Lovable platform deployment
- Static build output via Vite
- Environment variables handled via Supabase dashboard

## Common Patterns

### Adding New Pages
1. Create component in `src/pages/`
2. Add lazy import to `App.tsx`
3. Define route in the Routes component
4. Handle authentication requirements in component

### Database Queries
```typescript
// Standard pattern for Supabase queries
const { data, error } = await supabase
  .from('table_name')
  .select('columns')
  .eq('column', value)
  .maybeSingle();
```

### State Management
- Use React Query for server state
- Local state with useState for UI state
- Custom hooks for complex state logic (auth, books, profile)

### Component Development
- Follow shadcn-ui patterns for UI components
- Use Tailwind CSS utility classes
- Implement proper TypeScript types
- Handle loading and error states

## Troubleshooting

### Authentication Issues
- **Email confirmation not working**: Check `SUPABASE_AUTH_SETUP.md` for required Supabase dashboard configuration
- **"Invalid redirect URL" error**: Ensure callback URLs are added to Supabase Auth settings
- **Users see error after clicking email link**: The improved `AuthCallback` component now shows proper success/error states

### Development Issues
- **Build failures**: Run `npm run lint` to check for TypeScript/ESLint issues
- **Supabase connection issues**: Verify environment variables in `.env`
- **Component import errors**: Check if path aliases are working (`@/*` → `src/*`)
