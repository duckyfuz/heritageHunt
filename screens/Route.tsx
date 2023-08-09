import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FAB, Text } from "react-native-paper";
import MapView from "react-native-maps";
import { View, StyleSheet } from "react-native";

import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

type LocationObject = {
  coords: {
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    latitude: number;
    longitude: number;
    speed: number | null;
  };
  mocked?: boolean | undefined;
  timestamp: number;
};

const Route = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let newLocation = await Location.getCurrentPositionAsync({});
      setLocation(newLocation);
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
      <FAB
        icon="map-marker-radius"
        style={styles.fab}
        onPress={() => console.log("Pressed")}
      />
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        />
      )}
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
