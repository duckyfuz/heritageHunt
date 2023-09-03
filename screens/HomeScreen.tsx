import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB, ActivityIndicator } from "react-native-paper";

import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

import * as MapStyle from "../utils/mapStyle.json";
import { LocationObject, MarkerObject } from "../utils/routeHelpers";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [location, setLocation] = useState<LocationObject | null>(null);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let newLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  };

  // Continuously check the location of user
  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePoiClick = (e: any) => {
    console.log(e.nativeEvent);
    const marker: MarkerObject = {
      latlng: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
      title: e.nativeEvent.name,
      description: e.nativeEvent.placeId,
      image: undefined,
    };
    console.log(marker);
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} />
        <Text style={{ marginTop: 10 }} variant="titleSmall">
          Fetching location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <FAB
          icon="map-marker-radius"
          style={styles.fab}
          onPress={() => {
            console.log(location);
            _mapView.animateToRegion(location, 500);
          }}
        />
        <FAB
          icon="run" // Probably wna change this in the future
          style={[styles.fab, { bottom: 75 }]}
          onPress={() => {
            console.log(location);
            navigation.navigate("RoutesScreen");
          }}
        />
        <FAB
          icon="fire" // This will be under a POI click
          style={[styles.fab, { bottom: 150 }]}
          onPress={() => {
            console.log(location);
            navigation.navigate("CommStack");
          }}
        />
        <MapView
          style={styles.map}
          ref={(ref) => {
            _mapView = ref;
          }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapStyle}
          initialRegion={location}
          onPoiClick={(e) => {
            handlePoiClick(e);
          }}
        >
          <Circle
            center={location}
            radius={10}
            strokeWidth={1}
            strokeColor={"#1a66ff"}
            fillColor={"rgba(65, 104, 187, 0.5)"}
          />
        </MapView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
  },
});
