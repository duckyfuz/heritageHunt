import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { artifactsHash } from "../../utils/artifactsHash";

export default function ScanScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    if (data in artifactsHash) {
      navigation.navigate("Converse", { character: artifactsHash[data] });
    } else {
      setScanned(false);
      return;
    }
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
