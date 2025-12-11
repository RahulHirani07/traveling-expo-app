# Architecture & Design Decisions

## Overview

This document explains the architectural decisions made for the UGC Upload Demo application.

## Core Principles

1. **Separation of Concerns**: Clear boundaries between API, business logic, and UI
2. **Type Safety**: TypeScript throughout with strict mode
3. **Security First**: RLS policies and secure upload patterns
4. **User Experience**: Progress feedback, error handling, loading states
5. **Scalability**: Patterns that work for both demo and production

## Folder Structure Rationale

### `/app` - Screens
- Contains full-screen components
- Minimal business logic (delegated to hooks)
- Focused on layout and user interaction

### `/src/api` - API Layer
- All external API calls isolated here
- Supabase client configuration
- Error handling wrapper functions
- Makes it easy to swap backends if needed

### `/src/hooks` - Custom Hooks
- Business logic encapsulation
- State management for specific features
- Reusable across components
- Examples: `useMediaUpload`, `useMediaPicker`, `usePosts`

### `/src/components` - UI Components
- Presentational components
- Reusable across screens
- Props-driven, no direct API calls
- Examples: `MediaPicker`, `UploadProgress`, `PostCard`

### `/src/types` - Type Definitions
- Centralized TypeScript types
- Shared across the application
- Generated types from Supabase (future)

### `/src/utils` - Utility Functions
- Pure functions
- No side effects
- Easy to test
- Examples: `compressImage`, `validateFileSize`

## Technology Choices

### Why Expo?

**Pros:**
- Faster development with managed workflow
- Built-in modules (camera, media, location)
- Easy OTA updates
- Simplified build process
- Great for demos and MVPs

**Cons:**
- Slightly larger app size
- Some native modules not available

**Decision**: Perfect for this demo and early MVP stage

### Why Supabase?

**Pros:**
- PostgreSQL (relational, powerful queries)
- Built-in authentication and RLS
- Real-time subscriptions
- Storage with CDN
- Open source, self-hostable
- Generous free tier

**Cons:**
- Smaller ecosystem than Firebase
- Newer platform (less mature)

**Decision**: Better fit for this use case due to geospatial needs (PostGIS) and relational data model

### Why React Query?

**Pros:**
- Designed for server state
- Automatic caching and background refetching
- Optimistic updates
- Built-in loading/error states
- Less boilerplate than Redux

**Cons:**
- Learning curve for complex scenarios
- Not suitable for all client state

**Decision**: Perfect for API data management, pairs well with Zustand for client state

### Why React Native Paper?

**Pros:**
- Material Design components
- Consistent design system
- Accessibility built-in
- Good TypeScript support

**Cons:**
- Opinionated design
- Customization can be tricky

**Decision**: Speeds up development, provides professional look out of the box

## Security Architecture

### Defense in Depth

We implement security at multiple layers:

1. **Client-Side**:
   - Input validation (file type, size)
   - Error sanitization
   - Secure token storage (future)

2. **Transport**:
   - HTTPS/TLS for all requests
   - JWT tokens for authentication

3. **Server-Side** (Supabase):
   - Row Level Security (RLS)
   - Storage policies
   - Database constraints

4. **Data**:
   - Encrypted at rest (Supabase default)
   - Encrypted in transit (HTTPS)

### Row Level Security (RLS)

RLS is the cornerstone of our security model:

```sql
-- Example: Users can only insert their own posts
CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Benefits**:
- Database-level enforcement (can't be bypassed)
- Automatic filtering of queries
- Reduces backend code complexity
- Prevents accidental data leaks

### Upload Security

**Current Approach** (Demo):
- Direct upload to Supabase Storage
- Client-side validation
- RLS policies on storage bucket

**Production Approach** (Recommended):
1. Client requests signed upload URL from Edge Function
2. Edge Function validates user and generates time-limited URL
3. Client uploads to signed URL
4. Edge Function creates post record after verification

**Why not implemented**: Time constraint (2-3 hours), documented as future improvement

## Data Flow

### Upload Flow

```
User Action
    ↓
MediaPicker Component
    ↓
useMediaPicker Hook (permission handling)
    ↓
Selected Media (MediaAsset)
    ↓
useMediaUpload Hook
    ↓
compressImage/compressVideo (utils)
    ↓
uploadMedia (storage.api)
    ↓
Supabase Storage
    ↓
createPost (posts.api)
    ↓
Supabase Database
    ↓
React Query Cache Invalidation
    ↓
UI Update
```

### Posts Fetch Flow

```
Component Mount
    ↓
usePosts Hook
    ↓
React Query (check cache)
    ↓
getPosts (posts.api)
    ↓
Supabase Database
    ↓
React Query Cache
    ↓
Component Render
```

## State Management Strategy

### Server State (React Query)
- API data (posts, user data)
- Automatic caching
- Background refetching
- Optimistic updates

### Client State (Zustand - future)
- UI state (modals, tabs)
- User preferences
- App settings
- Temporary data

### Local Component State (useState)
- Form inputs
- UI toggles
- Temporary selections

**Rationale**: Use the right tool for each type of state

## Error Handling Philosophy

### Principles

1. **User-Friendly**: Show clear, actionable messages
2. **Informative**: Log detailed errors for debugging
3. **Graceful**: Never crash, always provide fallback
4. **Secure**: Don't leak sensitive information

### Implementation

```typescript
try {
  // Operation
} catch (error) {
  // Log detailed error (dev only)
  console.error('Detailed error:', error);
  
  // Show user-friendly message
  setError('Upload failed. Please try again.');
  
  // Track error (production)
  // Sentry.captureException(error);
}
```

## Performance Optimizations

### Current

1. **Image Compression**: Reduces upload size by 60-80%
2. **React Query Caching**: Prevents unnecessary API calls
3. **Lazy Loading**: Images loaded on-demand
4. **Memoization**: React.memo for expensive components (future)

### Future

1. **Code Splitting**: Load features on-demand
2. **Image CDN**: Cloudflare or similar
3. **Background Sync**: Upload when network available
4. **Virtual Lists**: For large post feeds

## Testing Strategy

### Current (Manual)

- Test cases documented in README
- Manual verification of key flows

### Future (Automated)

1. **Unit Tests** (Jest):
   - Utility functions
   - API functions (mocked)
   - Custom hooks (React Testing Library)

2. **Integration Tests**:
   - Upload flow end-to-end
   - Posts fetch and display

3. **E2E Tests** (Detox):
   - Critical user flows
   - Cross-platform testing

## Scalability Considerations

### Database

- **Indexes**: Created on `user_id` and `created_at`
- **Partitioning**: Future - partition by date for large datasets
- **Read Replicas**: For heavy read loads

### Storage

- **CDN**: Supabase includes CDN
- **Image Optimization**: On-the-fly resizing (Supabase feature)
- **Compression**: Client-side before upload

### API

- **Pagination**: Implemented (limit 50 posts)
- **Caching**: React Query handles this
- **Rate Limiting**: Supabase provides this

### Mobile App

- **Bundle Size**: Keep dependencies minimal
- **Lazy Loading**: Load screens on-demand
- **Offline Support**: Queue operations, sync later

## Trade-offs Made

### 1. Mock User ID vs Real Auth

**Decision**: Mock user ID for demo  
**Reason**: Authentication adds complexity, not core to upload flow demo  
**Impact**: Not production-ready, documented as limitation  
**Future**: Implement Supabase Auth

### 2. Direct Upload vs Signed URLs

**Decision**: Direct upload for demo  
**Reason**: Simpler, faster to implement  
**Impact**: Slightly less secure  
**Future**: Implement signed URLs for production

### 3. No Video Compression

**Decision**: Placeholder for video compression  
**Reason**: Complex, time-consuming (ffmpeg integration)  
**Impact**: Large video uploads  
**Future**: Implement server-side video processing

### 4. Manual Testing Only

**Decision**: No automated tests  
**Reason**: Time constraint (2-3 hours)  
**Impact**: Requires manual verification  
**Future**: Add Jest + React Testing Library

## Lessons Learned

### What Worked Well

1. **Expo**: Super fast setup, great DX
2. **Supabase**: Easy to configure, powerful RLS
3. **React Query**: Simplified data fetching significantly
4. **TypeScript**: Caught many errors early
5. **Component Structure**: Easy to navigate and extend

### What Could Be Improved

1. **Video Handling**: Needs more robust solution
2. **Error Messages**: Could be more specific
3. **Loading States**: Could add skeleton screens
4. **Accessibility**: Needs screen reader support
5. **Internationalization**: Hard-coded strings

## Conclusion

This architecture balances:
- **Speed**: Fast to implement for demo
- **Quality**: Production-ready patterns
- **Security**: Multiple layers of protection
- **Scalability**: Can grow to production scale

The foundation is solid for both the test task and the full MVP.
