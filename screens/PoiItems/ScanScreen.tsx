import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { artifactsHash } from "../../utils/artifactsHash";

export default function ScanScreen() {
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = (
    { type, data }: any // Don't be lazy edit the type here later also
  ) => {
    setScanned(true);
    navigation.navigate("Converse", { character: artifactsHash[data] });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scanContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={styles.formContainer}>
        {scanned && (
          <Button onPress={() => setScanned(false)}>Scan Again</Button>
        )}
        <Button
          onPress={() =>
            navigation.navigate("Converse", {
              character: artifactsHash["ChIJN21BlAkZ2jERGmrNMLOQQEI"],
            })
          }
        >
          Demo only
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "center",
  },
  scanContainer: {
    flex: 2,
  },
  formContainer: {
    flex: 3,
    flexDirection: "column",
    // justifyContent: "center",
  },
});
