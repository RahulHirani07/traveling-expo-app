import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compress an image to reduce file size
 * Target: Max 1920px width, 80% quality
 * Uses expo-image-manipulator which is compatible with Expo Go
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1920 } }], // Resize to max 1920px width, maintains aspect ratio
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log('Image compressed successfully');
    return result.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original URI if compression fails
    return uri;
  }
};

/**
 * Compress a video to reduce file size
 * For demo purposes, returns original URI
 * In production, use expo-video-thumbnails or ffmpeg
 */
export const compressVideo = async (uri: string): Promise<string> => {
  console.log('Video compression placeholder - returning original URI');
  // TODO: Implement video compression for production
  // Options: expo-video-thumbnails, react-native-ffmpeg, or backend processing
  return uri;
};

/**
 * Validate file size
 * @param fileSize - Size in bytes
 * @param maxSizeMB - Maximum size in MB
 */
export const validateFileSize = (fileSize: number, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
