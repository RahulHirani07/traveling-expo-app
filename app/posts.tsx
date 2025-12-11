import React from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { PostCard } from '../src/components/PostCard';
import { usePosts } from '../src/hooks/usePosts';
import { MaterialIcons } from '@expo/vector-icons';

export default function PostsScreen() {
  const { posts, isLoading, error, refetch } = usePosts();
  const [refreshing, setRefreshing] = React.useState(false);

  // Auto-refetch when tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Full-screen loader on initial load
  if (isLoading && !refreshing && posts.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading posts...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={64} color="#B00020" />
        <Text variant="titleMedium" style={styles.errorText}>
          Failed to load posts
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (posts.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MaterialIcons name="photo-library" size={64} color="#999" />
        <Text variant="titleMedium" style={styles.emptyTitle}>
          No posts yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptyMessage}>
          Upload your first photo or video to get started!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Posts
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    color: '#6200ee',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    color: '#B00020',
  },
  errorMessage: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#666',
  },
  emptyMessage: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
});
