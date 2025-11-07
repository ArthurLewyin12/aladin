# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aladin is a Next.js 15 educational platform frontend for students in Côte d'Ivoire. It provides quiz generation, course content, group learning, subscription management, and study tracking features. The backend API is at `https://aladin.yira.pro` (configurable via `.env`).

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with shadcn/ui components
- **State Management:** Zustand for client state
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios with custom middleware chain
- **Forms:** React Hook Form with Zod validation
- **Math Rendering:** KaTeX for mathematical expressions

## Development Commands

```bash
# Install dependencies
pnpm add

# Run development server (with Turbopack)
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Run linter
pnpm run lint
```

The dev server runs on `http://localhost:3000`.

## Architecture Overview

### Directory Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (account)/           # Protected routes (student features)
│   │   └── student/         # Student dashboard, quiz, courses, groups
│   ├── (auth)/              # Authentication pages (login, register, reset)
│   └── (default)/           # Public pages (landing, donation, payment status)
├── components/
│   ├── guards/              # Route protection (AuthGuard, LandingPageGuard)
│   ├── layouts/             # Reusable layouts (navbar, footer)
│   ├── pages/               # Page-specific components
│   └── ui/                  # shadcn/ui components + custom UI
├── constants/               # API endpoints, environment config, types
├── lib/                     # Core utilities (request wrapper, toast, utils)
├── services/
│   ├── controllers/         # API functions organized by domain
│   ├── hooks/               # TanStack Query hooks for data fetching
│   └── middlewares/         # Request/response interceptors
└── stores/                  # Zustand stores (time tracking, document upload)
```

### Authentication Flow

- Uses Bearer token authentication stored in cookies (`token_${UNIVERSE}`)
- User data cached in cookies (`user_${UNIVERSE}`) and TanStack Query
- Session management via `useSession` hook (src/services/hooks/auth/useSession.ts)
- Protected routes use `<AuthGuard>` component that redirects to `/login` if not authenticated
- Token refresh handled automatically via middleware (src/services/middlewares/token-manager.middleware.ts)

### API Communication Pattern

All API calls follow this pattern:

1. **Controller** (src/services/controllers/\*.controller.ts): Define API functions using `request` wrapper
2. **Hook** (src/services/hooks/\*/\*.ts): Wrap controllers with TanStack Query (useQuery/useMutation)
3. **Component**: Import hook, handle loading/error/success states

Example:
```typescript
// 1. Controller
export const getQuizzes = async (): Promise<QuizzesResponse> => {
  return request.get<QuizzesResponse>(QuizEndpoints.GET_QUIZZES);
};

// 2. Hook
export const useQuizzes = () => {
  return useQuery({
    queryKey: createQueryKey("quizzes"),
    queryFn: getQuizzes,
  });
};

// 3. Component
const { data, isLoading, error } = useQuizzes();
```

### Request Middleware Chain

The Axios instance (src/lib/request.ts) uses middleware chains:

- **Request middleware:** Adds Bearer token to headers (requestHeaderMiddleware)
- **Response middleware:**
  - Token management and refresh (tokenMiddleware)
  - Error handling and toast notifications (errorHandlingMiddleware)

### Path Aliases

Import using `@/*` alias:
```typescript
import { request } from "@/lib/request";
import { Button } from "@/components/ui/button";
import { useSession } from "@/services/hooks/auth/useSession";
```

## Key Features Implementation

### Time Tracking System

- **Store:** `useTimeTracking` (src/stores/useTimeTracking.ts) - Zustand store with persistence
- **Tracks:** Quiz and revision (course) study time
- **API:** POST /api/tracking/time with sessions payload
- **Auto-send:** Every 5 minutes or when user stops tracking
- **Spec:** See TRACKING_API_SPECS.md for full API details

### Subscription & Payment System

- **Wave Payment:** Integration for direct payments (XOF currency)
- **Coupon System:** Students can activate subscriptions via promo codes
- **Trial Period:** 7-day free trial system
- **Donor Flow:** Bulk coupon purchase for sponsors
- **Spec:** See REGISTER_MANAGEMENT_FLOW.md for complete flow
- **Implementation:** See INTEGRATION_PLAN.md for frontend integration details

### Groups & Quizzes

- Students can join groups, take group quizzes, and view shared results
- Quiz generation with document upload support
- Math expression rendering with KaTeX (use `<MathText>` component)

## Important Conventions

### TypeScript Types

- API response types in `src/services/controllers/types/`
- Organized by domain (auth.types.ts, quiz.types.ts, etc.)
- Common types in `src/services/controllers/types/common/`

### API Endpoints

- All endpoints defined in `src/constants/endpoints.ts`
- Never hardcode API paths in components or controllers

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `NEXT_PUBLIC_UNIVERSE`: Environment identifier (DEV/PROD) - used for cookie namespacing

### Form Handling

- Use React Hook Form with Zod schema validation
- Use `@hookform/resolvers` for Zod integration
- Validation schemas typically co-located with form components

### Toast Notifications

- Use custom toast system: `import { toast } from "@/lib/toast"`
- Variants: default, success, error, info
- Auto-displayed by error middleware for API errors

### Math Content

- Use `<MathText>` component for rendering LaTeX/math expressions
- KaTeX handles rendering automatically

## Testing & Debugging

- Development logging enabled for all API requests (method + URL logged)
- Cookie-based state persistence for offline development
- Use React Query DevTools (if installed) for query debugging

## Documentation Files

- **README.md**: Basic Next.js setup
- **TRACKING_API_SPECS.md**: Time tracking API specifications
- **REGISTER_MANAGEMENT_FLOW.md**: Subscription, payment & coupon flow
- **INTEGRATION_PLAN.md**: Frontend integration plan for payments
- **IMPLEMENTATION_PLAN.md**: General implementation roadmap
- **groupe.md, Groupe_quizInfo.md**: Group feature specifications
- **documentImplementation.md**: Document upload feature specs
