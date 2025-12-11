import { MediaType } from '../types/post.types';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * SIMPLIFIED STORAGE FOR DEMO
 * Converts images to base64 data URLs instead of uploading to Supabase Storage
 * This bypasses network issues and gets the demo working immediately
 */

/**
 * Upload media file - converts to base64 data URL
 * @param uri - Local file URI
 * @param userId - User ID (not used in this simplified version)
 * @param mediaType - Type of media (image or video)
 * @param onProgress - Optional progress callback (0-100)
 * @returns Data URL of the image
 */
export const uploadMedia = async (
  uri: string,
  userId: string,
  mediaType: MediaType,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log('📤 Starting upload (base64 conversion)...');
    console.log('URI:', uri);
    
    if (onProgress) onProgress(20);

    // For images, convert to base64 data URL
    if (mediaType === 'image') {
      console.log('🔄 Converting image to base64...');
      
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      
      if (onProgress) onProgress(70);
      
      // Create data URL
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      
      console.log('✓ Conversion successful, size:', dataUrl.length, 'chars');
      if (onProgress) onProgress(100);
      
      return dataUrl;
    } else {
      // For videos, just return the URI (videos are too large for base64)
      console.log('📹 Video - returning local URI');
      if (onProgress) onProgress(100);
      return uri;
    }
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

/**
 * Delete media file - no-op for base64 storage
 */
export const deleteMedia = async (filePath: string): Promise<void> => {
  console.log('Delete not needed for base64 storage');
};

/**
 * Get public URL - returns the data URL as-is
 */
export const getPublicUrl = (filePath: string): string => {
  return filePath;
};
