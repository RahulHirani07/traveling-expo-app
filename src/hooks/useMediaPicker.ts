import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MediaAsset } from '../types/post.types';
import { Alert } from 'react-native';

export const useMediaPicker = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant media library permissions to upload photos and videos.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickFromGallery = async (): Promise<MediaAsset | null> => {
    if (!hasPermission) {
      await requestPermissions();
      return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        fileName: asset.fileName || `media_${Date.now()}`,
        fileSize: asset.fileSize || 0,
      };
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media. Please try again.');
      return null;
    }
  };

  const pickFromCamera = async (): Promise<MediaAsset | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos.',
        [{ text: 'OK' }]
      );
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: 'image',
        fileName: asset.fileName || `photo_${Date.now()}`,
        fileSize: asset.fileSize || 0,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  };

  return {
    hasPermission,
    pickFromGallery,
    pickFromCamera,
    requestPermissions,
  };
};
