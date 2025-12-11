export type MediaType = 'image' | 'video';

export interface Post {
  id: string;
  user_id: string;  // TEXT type for demo (no auth required)
  media_url: string;
  media_type: MediaType;
  caption?: string;
  created_at: string;
}

export interface MediaAsset {
  uri: string;
  type: MediaType;
  fileName: string;
  fileSize: number;
}

export type UploadState = 'idle' | 'compressing' | 'uploading' | 'saving' | 'success' | 'error';

export interface UploadProgress {
  state: UploadState;
  progress: number;
  error?: string;
}
