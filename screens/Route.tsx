import * as Location from "expo-location";
import { Card, Text, FAB, Button } from "react-native-paper";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet, Platform } from "react-native";

import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import axios from "axios";

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
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handlePoiClick = (e: any) => {
    // console.log(e.nativeEvent);
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

  const markerToShipments = (markersArray: Array<MarkerObject> | null) => {
    const pickupDuration = 120; // Duration for pickup and delivery

    if (markersArray === null) {
      console.log("markers is empty");
      return;
    }

    const mappedArray = markersArray.map((item, index) => {
      return {
        id: `order_${index + 1}`,
        pickup: { location_index: 0, duration: pickupDuration },
        delivery: {
          location: [item.latlng.longitude, item.latlng.latitude],
          duration: pickupDuration,
        },
      };
    });

    return mappedArray;
  };

  const createRouteHandler = () => {
    const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
    const apiUrl = "https://api.geoapify.com/v1/routeplanner";

    const body = {
      mode: "walk",
      agents: [
        {
          start_location: [location?.longitude, location?.latitude],
          time_windows: [[0, 14400]],
        },
      ],
      shipments: markerToShipments(markers),
      locations: [
        {
          id: "warehouse-0",
          location: [location?.longitude, location?.latitude],
        },
      ],
      type: "short",
      traffic: "approximated",
    };

    axios
      .post(`${apiUrl}?apiKey=${apiKey}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data.properties);
        // console.log(response.data.features[0].properties.waypoints);
        let waypoints = [];
        for (const latlng of response.data.features[0].properties.waypoints) {
          latlng.location && waypoints.push(latlng.location);
        }
        console.log(waypoints);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        )}
      </View>
      <View style={styles.details}>
        <ScrollView>
          {markers?.map((marker: MarkerObject, index: number) => {
            return <Text key={index}>{marker.title}</Text>;
          })}
        </ScrollView>
        <Button onPress={createRouteHandler}>Create Route</Button>
      </View>
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
    paddingBottom: Platform.OS === "android" ? 4 : 25,
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
  },
});
