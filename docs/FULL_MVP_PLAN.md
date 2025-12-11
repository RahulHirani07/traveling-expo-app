# Full MVP Development Plan - Japan Travel App

## 📋 Project Overview

**AI-Powered Mobile Application for Japan Travel**

A comprehensive mobile app integrating AI itinerary generation, UGC-based map, 10-second video posting, and curated discovery of local craft/cultural experiences in Japan.

---

## 🎯 Core Features

### 1. AI Itinerary Generation
- **Input**: User preferences (dates, interests, budget, travel style)
- **Processing**: OpenAI GPT-4 via Supabase Edge Functions
- **Output**: Day-by-day itinerary with locations, activities, timing
- **Features**: 
  - Save/edit itineraries
  - Share with friends
  - Export to calendar
  - Real-time updates based on weather/events

### 2. UGC-Based Map
- **Interactive Map**: React Native Maps with custom markers
- **User Posts**: Photos/videos geo-tagged to locations
- **Clustering**: Group nearby posts for better performance
- **Filters**: By type (food, attractions, hidden gems), date, popularity
- **Features**:
  - Tap marker to see posts
  - Full-screen media preview
  - User profiles and following

### 3. 10-Second Video Posting
- **Recording**: In-app camera with 10s limit
- **Editing**: Trim, filters, text overlay
- **Upload**: Optimized compression and streaming
- **Discovery**: Feed of recent videos, trending spots
- **Features**:
  - Geo-tagging required
  - Hashtags and mentions
  - Like, comment, share

### 4. Curated Craft Discovery
- **Database**: Local artisans, workshops, experiences
- **Categories**: Pottery, textiles, tea ceremony, calligraphy, etc.
- **Booking**: Direct booking integration
- **Reviews**: User ratings and photos
- **Features**:
  - Search by location/category
  - Availability calendar
  - Price comparison
  - Verified artisans

---

## 🏗️ Technical Architecture

### Frontend (React Native + Expo)

#### App Structure
```
travel-app/
├── app/                          # Screens (Expo Router)
│   ├── (tabs)/                  # Tab navigation
│   │   ├── home.tsx            # Dashboard
│   │   ├── map.tsx             # UGC Map
│   │   ├── discover.tsx        # Craft discovery
│   │   ├── itinerary.tsx       # AI itineraries
│   │   └── profile.tsx         # User profile
│   ├── auth/                    # Authentication
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── post/                    # Post management
│   │   ├── create.tsx          # Create post/video
│   │   ├── [id].tsx            # View post
│   │   └── edit/[id].tsx       # Edit post
│   ├── craft/                   # Craft experiences
│   │   ├── [id].tsx            # Craft detail
│   │   └── booking/[id].tsx    # Booking flow
│   └── itinerary/
│       ├── create.tsx           # AI generation
│       ├── [id].tsx            # View itinerary
│       └── edit/[id].tsx       # Edit itinerary
├── src/
│   ├── api/                     # API layer
│   │   ├── supabase.ts         # Client config
│   │   ├── auth.api.ts         # Authentication
│   │   ├── posts.api.ts        # Posts CRUD
│   │   ├── itinerary.api.ts    # Itinerary operations
│   │   ├── craft.api.ts        # Craft experiences
│   │   ├── map.api.ts          # Geospatial queries
│   │   └── ai.api.ts           # AI endpoints
│   ├── components/              # Reusable components
│   │   ├── common/             # Buttons, inputs, cards
│   │   ├── map/                # Map components
│   │   ├── media/              # Image/video players
│   │   ├── itinerary/          # Itinerary components
│   │   └── craft/              # Craft components
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useLocation.ts
│   │   ├── useMediaUpload.ts
│   │   ├── useItinerary.ts
│   │   └── useCraft.ts
│   ├── store/                   # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── mapStore.ts
│   │   └── uiStore.ts
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # Helper functions
│   ├── constants/               # App constants
│   └── styles/                  # Global styles
└── supabase/
    ├── migrations/              # Database migrations
    ├── functions/               # Edge Functions
    │   ├── generate-itinerary/
    │   ├── process-video/
    │   └── moderate-content/
    └── seed/                    # Seed data
```

#### Key Technologies
- **Framework**: Expo SDK 51+ with TypeScript
- **Navigation**: Expo Router (file-based)
- **State**: React Query (server) + Zustand (client)
- **UI**: React Native Paper + Custom components
- **Maps**: react-native-maps with clustering
- **Media**: expo-av, expo-image-picker, expo-camera
- **Forms**: React Hook Form + Zod validation
- **Animations**: React Native Reanimated

### Backend (Supabase)

#### Database Schema

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (UGC)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  thumbnail_url TEXT,
  caption TEXT,
  location GEOGRAPHY(POINT),
  location_name TEXT,
  tags TEXT[],
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable PostGIS for geospatial queries
CREATE INDEX posts_location_idx ON posts USING GIST(location);

-- Itineraries
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  days JSONB, -- Array of day objects
  preferences JSONB,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Craft Experiences
CREATE TABLE craft_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES profiles,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location GEOGRAPHY(POINT),
  location_name TEXT,
  price_range TEXT,
  duration_minutes INT,
  max_participants INT,
  images TEXT[],
  rating DECIMAL(3,2),
  reviews_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  experience_id UUID REFERENCES craft_experiences NOT NULL,
  booking_date DATE,
  participants INT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follows
CREATE TABLE follows (
  follower_id UUID REFERENCES profiles,
  following_id UUID REFERENCES profiles,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Likes
CREATE TABLE likes (
  user_id UUID REFERENCES profiles,
  post_id UUID REFERENCES posts,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);
```

#### Edge Functions

1. **generate-itinerary**
   - Input: User preferences, dates, interests
   - Process: Call OpenAI GPT-4 with context
   - Output: Structured itinerary JSON

2. **process-video**
   - Input: Video file
   - Process: Compress, generate thumbnail, validate
   - Output: Optimized video + thumbnail URLs

3. **moderate-content**
   - Input: Post content (text/image)
   - Process: AI moderation check
   - Output: Approval/rejection with reasons

4. **geospatial-query**
   - Input: Location, radius, filters
   - Process: PostGIS spatial query
   - Output: Nearby posts/experiences

---

## 🔒 Security Implementation

### Row Level Security (RLS)

```sql
-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own posts
CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public posts are viewable by all
CREATE POLICY "Public posts viewable"
  ON posts FOR SELECT
  USING (true);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

### Data Protection
- Encrypted storage (Supabase default)
- Secure token storage (expo-secure-store)
- API request validation
- Rate limiting on Edge Functions
- Content moderation before publishing

---

## 📊 Performance Optimization

### Frontend
- **Code Splitting**: Lazy load screens
- **Image Optimization**: Cached, compressed, lazy loaded
- **Video Streaming**: HLS for large videos
- **Map Clustering**: Reduce markers for performance
- **Pagination**: Infinite scroll with React Query
- **Offline Support**: Cache critical data

### Backend
- **Database Indexes**: On frequently queried fields
- **CDN**: Supabase Storage with CDN
- **Edge Functions**: Deployed globally
- **Caching**: Redis for hot data
- **Connection Pooling**: PgBouncer

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
- Utility functions
- Custom hooks
- API functions (mocked)

### Integration Tests
- API endpoints
- Database operations
- Edge Functions

### E2E Tests (Detox)
- Critical user flows
- Cross-platform testing

### Manual Testing
- Device testing (iOS/Android)
- Network conditions
- Edge cases

---

## 🚀 Deployment Strategy

### Development
- Expo Go for rapid testing
- Development builds for native features

### Staging
- EAS Build for internal testing
- TestFlight (iOS) + Internal Testing (Android)

### Production
- EAS Build with production config
- App Store + Google Play submission
- OTA updates for bug fixes

---

## 📅 Development Timeline (12 Weeks)

### Phase 1: Foundation (Weeks 1-2)
- ✅ Project setup and architecture
- ✅ Authentication flow
- ✅ Basic navigation
- ✅ Database schema
- ✅ RLS policies

### Phase 2: Core Features (Weeks 3-6)
- UGC posting with media upload
- Map integration with geospatial queries
- Video recording and playback
- User profiles and following

### Phase 3: AI & Discovery (Weeks 7-9)
- AI itinerary generation
- Craft experience database
- Booking system
- Search and filters

### Phase 4: Polish & Testing (Weeks 10-11)
- Performance optimization
- Bug fixes
- E2E testing
- UI/UX refinements

### Phase 5: Launch Prep (Week 12)
- App Store assets
- Documentation
- Beta testing
- Production deployment

---

## 🎯 Success Metrics

### User Engagement
- Daily Active Users (DAU)
- Posts per user
- Time in app
- Itineraries created

### Business Metrics
- Craft bookings
- Revenue per user
- User retention (D1, D7, D30)
- App Store rating

---

## 🔄 Future Enhancements

### Phase 2 Features
- Social features (comments, shares)
- Push notifications
- In-app messaging
- Gamification (badges, levels)

### Advanced Features
- AR experiences
- Offline maps
- Multi-language support
- Payment integration
- Admin dashboard

---

## 📚 Documentation

- **API Documentation**: Swagger/OpenAPI
- **Component Library**: Storybook
- **User Guide**: In-app tutorials
- **Developer Docs**: README, architecture diagrams

---

## 🎓 Team Requirements

### Must Have
- React Native/Expo expertise
- Supabase/PostgreSQL knowledge
- TypeScript proficiency
- Mobile UX understanding

### Nice to Have
- AI/ML experience
- Geospatial data experience
- Video processing knowledge
- Japanese language/culture knowledge

---

**This plan provides a solid foundation for a production-ready, scalable Japan Travel App with AI-powered features and strong security practices.**
