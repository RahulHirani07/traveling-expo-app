import { useState } from 'react';
import { uploadMedia } from '../api/storage.api';
import { createPost } from '../api/posts.api';
import { compressImage, compressVideo } from '../utils/mediaCompression';
import { MediaAsset, UploadState } from '../types/post.types';

// Mock user ID for demo purposes
// In production, get this from authentication context
const MOCK_USER_ID = 'demo-user-' + Date.now();

export const useMediaUpload = () => {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (media: MediaAsset, caption?: string) => {
    try {
      // Reset state
      setError(null);
      setState('compressing');
      setProgress(10);

      // Compress media
      let compressedUri: string;
      if (media.type === 'image') {
        compressedUri = await compressImage(media.uri);
      } else {
        compressedUri = await compressVideo(media.uri);
      }

      setProgress(30);
      setState('uploading');

      // Upload to storage with progress tracking
      const mediaUrl = await uploadMedia(
        compressedUri,
        MOCK_USER_ID,
        media.type,
        (uploadProgress) => {
          // Map upload progress to 30-90% range
          setProgress(30 + uploadProgress * 0.6);
        }
      );

      setProgress(90);
      setState('saving');

      // Create post record in database
      await createPost(mediaUrl, media.type, MOCK_USER_ID, caption);

      setProgress(100);
      setState('success');

      // Auto-reset after success
      setTimeout(() => {
        reset();
      }, 1500);

      return true; // Indicate success
    } catch (err) {
      setState('error');
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(errorMessage);
      console.error('Upload error:', err);
      return false; // Indicate failure
    }
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setError(null);
  };

  return {
    state,
    progress,
    error,
    upload,
    reset,
    isUploading: state !== 'idle' && state !== 'success' && state !== 'error',
  };
};
