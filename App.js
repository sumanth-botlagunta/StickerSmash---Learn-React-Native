import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import ImageViewer from './components/ImageViewer'
import Button from './components/Button';

const PlaceholderImage = require('./assets/images/background-image.png');

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageasync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You didn't select an image")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme='primary' label="Choose a Photo" onPress={pickImageasync} />
        <Button label="Use this photo" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  }
});
