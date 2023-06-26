import { Image, StyleSheet, Text, View } from "react-native";

export default function ImageViewer({ placeholderImage, selectedImage }) {
    const imageSource = selectedImage !== null ? { uri: selectedImage } : placeholderImage;
  return (
    <View style={styles.imageContainer}>
      <Image source={imageSource} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
    imageContainer: {
        height:450,
        alignContent:"center",
        justifyContent:"center"
      },
    image: {
      width: 340,
      height: 400,
      borderRadius: 18,
    },
  });