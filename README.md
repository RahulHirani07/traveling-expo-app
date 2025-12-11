# UGC Upload Demo - Japan Travel App

A React Native demo app showcasing secure media upload with Supabase backend.

## 🚀 Quick Start (5 Minutes)

### 1. Install Expo Go App
- **iOS**: Download from App Store
- **Android**: Download from Play Store

### 2. Setup Supabase (2 minutes)
1. Go to https://supabase.com and create account
2. Create new project (wait ~2 min for setup)
3. Go to **SQL Editor** → **New Query**
4. Copy contents from `SETUP_DATABASE.sql`
5. Paste and click **Run** ✅

### 3. Configure App (1 minute)
1. Rename `.env.example` to `.env.local`
2. Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
   (Find these in Supabase Dashboard → Settings → API)

### 4. Run App
```bash
npm install
npx expo start
```

Scan QR code with Expo Go app on your phone!

## ✨ Features

### Upload Flow
- ✅ **Image/Video Selection** - Pick from gallery or camera
- ✅ **Image Compression** - Auto-compress using expo-image-manipulator
- ✅ **Base64 Storage** - Images stored as base64 data URLs in database
- ✅ **Progress Tracking** - Visual feedback during upload
- ✅ **Toast Notifications** - Success/error messages
- ✅ **Auto-Reset** - Form clears after successful upload
- ✅ **Keyboard Handling** - Smart keyboard avoidance

### Posts Display
- ✅ **Auto-Refresh** - Updates when switching to Posts tab
- ✅ **Full-Screen Preview** - Tap images for full-screen view with zoom
- ✅ **Video Playback** - Inline video preview with native controls
- ✅ **Pull-to-Refresh** - Manual refresh support
- ✅ **Loading States** - Full-screen loader on initial load
- ✅ **Empty/Error States** - Helpful messages and retry options

## 📱 How to Use

1. **Upload Tab**: 
   - Tap "From Gallery" or "Take Photo"
   - Select image/video
   - Add optional caption
   - Tap "Upload"
   - See success toast 🎉

2. **Posts Tab**: 
   - View all uploads
   - Tap image for full-screen preview
   - Videos play inline with controls
   - Pull down to refresh

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **State**: React Query (server) + React hooks (local)
- **UI**: React Native Paper
- **Navigation**: React Navigation (Bottom Tabs)
- **Media**: expo-image-picker, expo-image-manipulator, expo-av
- **Notifications**: react-native-toast-message
- **Image Viewer**: react-native-image-viewing

### Folder Structure
```
demo-app/
├── app/              # Screens
│   ├── upload.tsx   # Upload screen with keyboard handling
│   └── posts.tsx    # Posts list with auto-refresh
├── src/
│   ├── api/         # Supabase client & API calls
│   │   ├── supabase.ts
│   │   ├── storage.api.ts  # Base64 conversion
│   │   └── posts.api.ts
│   ├── components/  # Reusable UI components
│   │   ├── MediaPicker.tsx
│   │   ├── UploadProgress.tsx
│   │   └── PostCard.tsx  # With full-screen preview
│   ├── hooks/       # Custom React hooks
│   │   ├── useMediaUpload.ts
│   │   ├── useMediaPicker.ts
│   │   └── usePosts.ts
│   ├── types/       # TypeScript definitions
│   │   └── post.types.ts
│   └── utils/       # Helper functions
│       └── mediaCompression.ts
└── SETUP_DATABASE.sql  # Database schema
```

## 🔒 Security

### Database Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Public Access**: Demo allows all operations (no auth required)
- **Production Ready**: Schema supports user-based policies

### Storage Approach
**Current (Demo):**
- Images converted to base64 data URLs
- Stored directly in database
- No Supabase Storage setup needed
- Works perfectly with Expo Go

**Production Recommendation:**
- Use Supabase Storage for media files
- Implement signed URLs for uploads
- Add proper authentication
- Use CDN for delivery

## 🎨 Implementation Details

### Base64 Storage
Images are converted to base64 and stored in the database:
```typescript
// Convert image to base64
const base64 = await FileSystem.readAsStringAsync(uri, {
  encoding: 'base64',
});
const dataUrl = `data:image/jpeg;base64,${base64}`;
```

**Why Base64 for Demo:**
- ✅ No Supabase Storage setup needed
- ✅ Works immediately with Expo Go
- ✅ Bypasses network/CORS issues
- ✅ Perfect for demo/testing

**Trade-offs:**
- ⚠️ Larger database size
- ⚠️ Not ideal for production at scale
- ⚠️ Videos use local URI (too large for base64)

### Keyboard Handling
Upload screen uses `KeyboardAvoidingView`:
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
>
```
- Auto-adjusts when keyboard appears
- Tap outside to dismiss keyboard
- Smooth animations on both iOS/Android

### Full-Screen Image Preview
Posts use `react-native-image-viewing`:
```typescript
<TouchableOpacity onPress={() => setImageViewVisible(true)}>
  <Card.Cover source={{ uri: post.media_url }} />
</TouchableOpacity>
```
- Tap any image to view full-screen
- Pinch to zoom
- Swipe to dismiss

## 📊 Database Schema

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_url TEXT NOT NULL,  -- Base64 data URL or file path
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS enabled with public access for demo
CREATE POLICY "Allow all operations" ON posts 
  FOR ALL USING (true) WITH CHECK (true);
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Expo Go app on phone
- Supabase account (free tier)

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Run Development Server
```bash
npx expo start
```

### TypeScript Check
```bash
npx tsc --noEmit
```

## 🧪 Testing

### Manual Testing
1. **Upload Image**: Gallery → Select → Add caption → Upload
2. **Upload Video**: Gallery → Select video → Upload
3. **View Posts**: Switch to Posts tab (auto-refreshes)
4. **Full-Screen**: Tap image to view full-screen
5. **Video Playback**: Videos play inline with controls
6. **Keyboard**: Test caption input keyboard handling
7. **Refresh**: Pull down to refresh posts

### Expected Behavior
- ✅ Upload shows progress and success toast
- ✅ Form resets after successful upload
- ✅ Posts tab auto-refreshes on focus
- ✅ Images open in full-screen viewer
- ✅ Videos play with native controls
- ✅ Keyboard doesn't overlap input

## 🚧 Known Limitations

1. **Mock User ID**: Uses `demo-user-{timestamp}` instead of real auth
2. **Base64 Storage**: Not suitable for production at scale
3. **Video Storage**: Videos use local URI (not uploaded)
4. **No Authentication**: Public access for demo purposes
5. **No Offline Support**: Requires internet connection

## � Future Improvements

### High Priority
1. **Authentication**: Implement Supabase Auth
2. **Supabase Storage**: Use proper file storage instead of base64
3. **Video Upload**: Implement video compression and upload
4. **Signed URLs**: Use signed URLs for secure uploads

### Medium Priority
5. **Offline Support**: Queue uploads when offline
6. **Image Editing**: Filters, cropping, rotation
7. **Content Moderation**: AI-based moderation
8. **User Profiles**: Profile pages and following

### Low Priority
9. **Social Features**: Comments, likes, shares
10. **Analytics**: Track upload success rates
11. **Push Notifications**: New followers, likes
12. **Multi-language**: i18n support

## 📝 Notes

### Why Expo Go?
- ✅ No build required
- ✅ Test on real device instantly
- ✅ Fast iteration
- ✅ Perfect for demos

### Why Base64?
- ✅ Simplifies demo setup
- ✅ No storage configuration needed
- ✅ Works with Expo Go immediately
- ✅ Good for testing/prototyping

### Production Considerations
For production, replace base64 storage with:
1. Supabase Storage for files
2. CDN for delivery
3. Proper authentication
4. Video compression
5. Image optimization pipeline

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## 📄 License

Demo application for technical assessment.

---

**Setup Time**: 5 minutes  
**Works On**: iOS & Android via Expo Go  
**No Build Required**: Run directly on device! 🎉
