import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost as createPostApi, deletePost as deletePostApi } from '../api/posts.api';
import { Post, MediaType } from '../types/post.types';

export const usePosts = () => {
  const queryClient = useQueryClient();

  // Fetch posts
  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: 30000, // 30 seconds
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: ({ mediaUrl, mediaType, userId, caption }: { mediaUrl: string; mediaType: MediaType; userId: string; caption?: string }) =>
      createPostApi(mediaUrl, mediaType, userId, caption),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePostApi(postId),
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isCreating: createPostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
};
