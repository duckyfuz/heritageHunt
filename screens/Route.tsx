import * as Location from "expo-location";
import { Card, Text, FAB, Button } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet } from "react-native";

import React, { useEffect, useState } from "react";

type LocationObject = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const MapStyle = [
  {
    featureType: "administrative",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.medical",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

type MarkerObject = {
  latlng: { latitude: number; longitude: number };
  title: string | undefined;
  description: string | undefined;
  image: number | ImageURISource | undefined;
};

type ImageURISource = { uri?: string | undefined };

const Route = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [markers, setMarkers] = useState<Array<MarkerObject> | null>([]);

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
    // Fetch location initially
    fetchLocation();
    // Set up an interval to fetch location every 5 seconds
    const interval = setInterval(fetchLocation, 5000);
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

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
        {location && (
          <MapView
            style={styles.map}
            ref={(ref) => {
              _mapView = ref;
            }}
            provider={PROVIDER_GOOGLE}
            customMapStyle={MapStyle}
            initialRegion={location}
            onRegionChange={this.onRegionChange}
            onPoiClick={(e) => {
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
                Array.from(
                  markers ? new Set([...markers, marker]) : new Set([marker])
                )
              );
              console.log(markers);
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
        )}
      </View>
      <Card style={styles.details}>
        <Card.Content style={{ height: "80%" }}>
          {markers?.map((marker: MarkerObject, index: number) => {
            return <Text>{marker.title}</Text>;
          })}
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => {
              console.log("Create route");
            }}
          >
            Create Route
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default Route;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  details: {
    flex: 0.8,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
  },
});
