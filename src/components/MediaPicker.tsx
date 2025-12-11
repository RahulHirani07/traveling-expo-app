import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface MediaPickerProps {
  onPickFromGallery: () => void;
  onPickFromCamera: () => void;
  disabled?: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onPickFromGallery,
  onPickFromCamera,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Select Media
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={onPickFromGallery}
          disabled={disabled}
          style={styles.button}
          icon={() => <MaterialIcons name="photo-library" size={24} color="white" />}
        >
          From Gallery
        </Button>

        <Button
          mode="outlined"
          onPress={onPickFromCamera}
          disabled={disabled}
          style={styles.button}
          icon={() => <MaterialIcons name="camera-alt" size={24} color="#6200ee" />}
        >
          Take Photo
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 8,
  },
});
