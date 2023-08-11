import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { Button, StyleSheet, TouchableOpacity, View } from "react-native";

const IdentificationScreen = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<any>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicHandler = async () => {
    if (!_camera) return;
    const photo = await _camera.takePictureAsync();
    setCapturedImage(photo);
    console.log(photo);
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => {
          _camera = ref;
        }}
        style={styles.camera}
        type={CameraType.back}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicHandler}>
            <Text style={styles.text}>Take Image</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default IdentificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
