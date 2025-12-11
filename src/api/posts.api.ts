import { supabase, handleSupabaseError } from './supabase';
import { Post, MediaType } from '../types/post.types';

/**
 * Create a new post in the database
 * @param mediaUrl - URL of uploaded media
 * @param mediaType - Type of media (image or video)
 * @param userId - User ID for the post
 * @param caption - Optional caption
 * @returns Created post object
 */
export const createPost = async (
  mediaUrl: string,
  mediaType: MediaType,
  userId: string,
  caption?: string
): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        media_url: mediaUrl,
        media_type: mediaType,
        caption: caption || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(handleSupabaseError(error));
    }

    return data as Post;
  } catch (error) {
    console.error('Create post failed:', error);
    throw error;
  }
};

/**
 * Get all posts, ordered by creation date (newest first)
 * @param limit - Maximum number of posts to fetch
 * @returns Array of posts
 */
export const getPosts = async (limit: number = 50): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(handleSupabaseError(error));
    }

    return data as Post[];
  } catch (error) {
    console.error('Get posts failed:', error);
    throw error;
  }
};

/**
 * Delete a post and its associated media
 * @param postId - ID of post to delete
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw new Error(handleSupabaseError(error));
    }
  } catch (error) {
    console.error('Delete post failed:', error);
    throw error;
  }
};

/**
 * Get a single post by ID
 * @param postId - ID of post to fetch
 */
export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      throw new Error(handleSupabaseError(error));
    }

    return data as Post;
  } catch (error) {
    console.error('Get post by ID failed:', error);
    throw error;
  }
};
