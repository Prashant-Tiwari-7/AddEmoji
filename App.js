import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

import { StatusBar } from "expo-status-bar";
import ImageViewer from "./component/imageViewer";
import Button from "./component/Button";
import CircleButton from "./component/CircleButton";
import IconButton from "./component/IconButton";
import EmojiPicker from "./component/EmojiPicker";

const placeholderImage = require("./assets/about-thumbnail3.png");
import * as ImagePicker from "expo-image-picker";
import EmojiList from "./component/EmojiList";
import EmojiSticker from "./component/EmojiSticker";

export default function App() {
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  if (status === null) {
    requestPermission();
  }
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null)
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
    <View >
      <View ref={imageRef} collapsable={false}>
        <ImageViewer placeholderImage={placeholderImage} selectedImage={selectedImage} />
         {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null}
      </View>
      {showAppOptions ? (
        <View style={styles.footerContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton
                icon="save-alt"
                label="Save"
                onPress={onSaveImageAsync}
              />
            </View>
        </View>
      ) : (
        <View>
          <View style={styles.footerContainer}>
            <Button
              theme="primary"
              label="Choose a photo"
              onPress={pickImageAsync}
            />
          </View>
          <View style={styles.footerContainer}>
            <Button
              label="Edit this photo"
              onPress={() => setShowAppOptions(true)}
            />
          </View>
        </View>
      )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* A list of emoji component will go here */}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar backgroundColor="#fff" style="light" hidden={true} />
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 20,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
