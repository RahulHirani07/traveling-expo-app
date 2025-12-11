import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';
import { UploadState } from '../types/post.types';

interface UploadProgressProps {
  state: UploadState;
  progress: number;
}

const getStateMessage = (state: UploadState): string => {
  switch (state) {
    case 'compressing':
      return 'Compressing media...';
    case 'uploading':
      return 'Uploading to cloud...';
    case 'saving':
      return 'Saving post...';
    case 'success':
      return 'Upload successful!';
    case 'error':
      return 'Upload failed';
    default:
      return '';
  }
};

export const UploadProgress: React.FC<UploadProgressProps> = ({ state, progress }) => {
  if (state === 'idle') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium" style={styles.message}>
        {getStateMessage(state)}
      </Text>
      
      <ProgressBar
        progress={progress / 100}
        color={state === 'error' ? '#B00020' : '#6200ee'}
        style={styles.progressBar}
      />
      
      <Text variant="bodySmall" style={styles.percentage}>
        {Math.round(progress)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 16,
  },
  message: {
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
});
