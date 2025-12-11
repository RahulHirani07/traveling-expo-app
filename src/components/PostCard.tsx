import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import ImageView from 'react-native-image-viewing';
import { Post } from '../types/post.types';
import { MaterialIcons } from '@expo/vector-icons';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [imageViewVisible, setImageViewVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <Card style={styles.card}>
        {/* Media Preview */}
        {post.media_type === 'video' ? (
          <Video
            source={{ uri: post.media_url }}
            style={styles.cover}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
        ) : (
          <TouchableOpacity onPress={() => setImageViewVisible(true)}>
            <Card.Cover
              source={{ uri: post.media_url }}
              style={styles.cover}
            />
          </TouchableOpacity>
        )}
        
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Chip
              icon={() => (
                <MaterialIcons
                  name={post.media_type === 'video' ? 'videocam' : 'image'}
                  size={16}
                  color="#6200ee"
                />
              )}
              style={styles.chip}
            >
              {post.media_type}
            </Chip>
            
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(post.created_at)}
            </Text>
          </View>

          {post.caption && (
            <Text variant="bodyMedium" style={styles.caption}>
              {post.caption}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Full-screen Image Viewer */}
      {post.media_type === 'image' && (
        <ImageView
          images={[{ uri: post.media_url }]}
          imageIndex={0}
          visible={imageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  cover: {
    height: 200,
  },
  content: {
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#e8eaf6',
  },
  date: {
    color: '#666',
  },
  caption: {
    marginTop: 4,
  },
});
