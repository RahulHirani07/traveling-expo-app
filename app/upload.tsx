import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, TextInput, Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MediaPicker } from '../src/components/MediaPicker';
import { UploadProgress } from '../src/components/UploadProgress';
import { useMediaPicker } from '../src/hooks/useMediaPicker';
import { useMediaUpload } from '../src/hooks/useMediaUpload';
import { MediaAsset } from '../src/types/post.types';
import { MaterialIcons } from '@expo/vector-icons';

export default function UploadScreen() {
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [caption, setCaption] = useState('');
  
  const { pickFromGallery, pickFromCamera } = useMediaPicker();
  const { state, progress, error, upload, reset, isUploading } = useMediaUpload();

  const handlePickFromGallery = async () => {
    const media = await pickFromGallery();
    if (media) {
      setSelectedMedia(media);
      reset();
    }
  };

  const handlePickFromCamera = async () => {
    const media = await pickFromCamera();
    if (media) {
      setSelectedMedia(media);
      reset();
    }
  };

  const handleUpload = async () => {
    if (!selectedMedia) {
      Toast.show({
        type: 'error',
        text1: 'No Media Selected',
        text2: 'Please select an image or video first',
      });
      return;
    }

    const success = await upload(selectedMedia, caption);
    
    if (success) {
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Upload Successful! 🎉',
        text2: 'Check the Posts tab to see your upload',
      });
      
      // Reset form
      setSelectedMedia(null);
      setCaption('');
    } else {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error || 'Please try again',
      });
    }
  };

  const handleClear = () => {
    setSelectedMedia(null);
    setCaption('');
    reset();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text variant="headlineMedium" style={styles.title}>
              Upload Media
            </Text>

            <MediaPicker
              onPickFromGallery={handlePickFromGallery}
              onPickFromCamera={handlePickFromCamera}
              disabled={isUploading}
            />

            {selectedMedia && (
              <Surface style={styles.previewContainer} elevation={2}>
                <View style={styles.previewHeader}>
                  <Text variant="titleSmall">Selected Media</Text>
                  <Button
                    mode="text"
                    onPress={handleClear}
                    disabled={isUploading}
                    icon={() => <MaterialIcons name="close" size={20} />}
                  >
                    Clear
                  </Button>
                </View>

                <Image
                  source={{ uri: selectedMedia.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />

                <View style={styles.mediaInfo}>
                  <Text variant="bodySmall">
                    Type: {selectedMedia.type}
                  </Text>
                  <Text variant="bodySmall">
                    Size: {(selectedMedia.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>

                <TextInput
                  label="Caption (optional)"
                  value={caption}
                  onChangeText={setCaption}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  disabled={isUploading}
                  style={styles.captionInput}
                />

                <Button
                  mode="contained"
                  onPress={handleUpload}
                  disabled={isUploading}
                  style={styles.uploadButton}
                  icon={() => <MaterialIcons name="cloud-upload" size={24} color="white" />}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </Surface>
            )}

            <UploadProgress state={state} progress={progress} />

            {error && (
              <Surface style={styles.errorContainer} elevation={1}>
                <MaterialIcons name="error" size={24} color="#B00020" />
                <Text variant="bodyMedium" style={styles.errorText}>
                  {error}
                </Text>
                <Button mode="outlined" onPress={reset} style={styles.retryButton}>
                  Try Again
                </Button>
              </Surface>
            )}

            {state === 'success' && (
              <Surface style={styles.successContainer} elevation={1}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                <Text variant="bodyMedium" style={styles.successText}>
                  Upload successful! Check the Posts tab to see your upload.
                </Text>
              </Surface>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom for keyboard
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#6200ee',
  },
  previewContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  mediaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  captionInput: {
    marginTop: 16,
  },
  uploadButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    alignItems: 'center',
  },
  errorText: {
    color: '#B00020',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
  },
  successContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
  },
  successText: {
    color: '#2e7d32',
    marginTop: 8,
    textAlign: 'center',
  },
});
