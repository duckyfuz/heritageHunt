import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text, FAB, Button, ActivityIndicator } from "react-native-paper";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";

import * as Location from "expo-location";

import * as MapStyle from "../utils/mapStyle.json";
import {
  LocationObject,
  MarkerObject,
  createRouteHandler,
  requestPlacesAPI,
} from "../utils/routeHelpers";

const Route = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [markers, setMarkers] = useState<Array<MarkerObject>>([]);

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

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
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
    setMarkers(
      Array.from(markers ? new Set([...markers, marker]) : new Set([marker]))
    );
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
        <MapView
          style={styles.map}
          ref={(ref) => {
            _mapView = ref;
          }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapStyle}
          initialRegion={location}
          // onRegionChange={this.onRegionChange}
          onPoiClick={(e) => {
            handlePoiClick(e);
          }}
        >
          {markers?.map((marker: MarkerObject, index: number) => {
            return (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              />
            );
          })}
        </MapView>
      </View>
      <View style={styles.details}>
        <ScrollView>
          {markers?.map((marker: MarkerObject, index: number) => {
            return <Text key={index}>{marker.title}</Text>;
          })}
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained-tonal"
            onPress={async () => {
              const newMarkers = await requestPlacesAPI(location);
              setMarkers((prevMarkers) => {
                const uniqueNewMarkers = newMarkers.filter((newMarker) => {
                  return !prevMarkers.some(
                    (prevMarker) =>
                      prevMarker.description === newMarker.description
                  );
                });
                return [...prevMarkers, ...uniqueNewMarkers];
              });
            }}
          >
            Suggest POIs
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              createRouteHandler(location, markers);
            }}
          >
            Create Route
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Route;

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
  details: {
    flex: 0.8,
    paddingBottom: Platform.OS === "android" ? 4 : 25,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 60,
  },
});
