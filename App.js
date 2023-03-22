import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ImageViewer from './components/ImageViewer'
import Button from './components/Button';

const PlaceholderImage = require('./assets/images/background-image.png');

import { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

import domtoimage from 'dom-to-image';
import { Platform } from 'react-native';

export default function App() {
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (status === null) {
    requestPermission();
  }
  const pickImageasync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You didn't select an image")
    }
  }

  const onReset = () => {
    setShowAppOptions(false);
  }

  const onAddSticker = () => {
    setIsModalVisible(true);
  }

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          format: 'png',
          quality: 1,
          height: 440
        })

        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) {
          alert('Image saved successfully!')
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 1,
          width: 320,
          height: 440,
        })
        .then(dataUrl => {
          let link = document.createElement('a');
          link.download = `sticker-smash-${Date.now()}.jpeg`;
          link.href = dataUrl;
          link.click();
        })
        .catch(e => {
          console.log(e);
        });
    }

  }


  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon='save-alt' label='save' onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button theme='primary' label="Choose a Photo" onPress={pickImageasync} />
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
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
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});
