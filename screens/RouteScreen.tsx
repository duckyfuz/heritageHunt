import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import MapView from "react-native-maps";
import { View, StyleSheet } from "react-native";

import * as Location from "expo-location";
import { useEffect, useState } from "react";

const RouteScreen = () => {
  const [location, setLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <MapView
  //       style={styles.map}
  //       initialRegion={{
  //         latitude: 1.3521,
  //         longitude: 103.8198,
  //         latitudeDelta: 0.003,
  //         longitudeDelta: 0.003,
  //       }}
  //     />
  //   </View>
  // );
};

export default RouteScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
