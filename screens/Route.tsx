import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  Text,
  FAB,
  Button,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";

import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";

import * as Location from "expo-location";

import { useDispatch } from "react-redux";
import { setWPs, setPOIs } from "../app/features/counter/counterSlice";

import * as MapStyle from "../utils/mapStyle.json";
import {
  LocationObject,
  MarkerObject,
  createDetailedRoute,
  createRouteHandler,
  requestPlacesAPI,
} from "../utils/routeHelpers";

import { useNavigation } from "@react-navigation/native";

const Route = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [markers, setMarkers] = useState<Array<MarkerObject>>([]);
  const [distance, setDistance] = useState<number>(800);
  const [time, setTime] = useState<number>(120);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    const newLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
      // latitude: 1.2976,
      // longitude: 103.854,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  };

  // Continuously check the location of user
  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 60000);
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

  const suggestPOIs = async () => {
    if (location) {
      const newMarkers = await requestPlacesAPI(location, distance);
      setMarkers((prevMarkers) => {
        const uniqueNewMarkers = newMarkers.filter((newMarker) => {
          return !prevMarkers.some(
            (prevMarker) => prevMarker.description === newMarker.description
          );
        });
        return [...prevMarkers, ...uniqueNewMarkers];
      });
    } else {
      console.log("Cannot fetch location.");
    }
  };

  const onChangeDistance = (distance: string) => {
    let newText = "";
    const numbers = "0123456789";

    for (let i = 0; i < distance.length; i++) {
      if (numbers.indexOf(distance[i]) > -1) {
        newText = newText + distance[i];
      }
    }
    setDistance(Number(newText));
  };

  const onChangeTime = (duration: string) => {
    let newText = "";
    const numbers = "0123456789";

    for (let i = 0; i < duration.length; i++) {
      if (numbers.indexOf(duration[i]) > -1) {
        newText = newText + duration[i];
      }
    }
    setTime(Number(newText));
  };

  const createRoute = () => {
    (async () => {
      const waypoints = await createRouteHandler(location, markers, time);
      const routeWaypoints = await createDetailedRoute(waypoints);
      // console.log(routeWaypoints);

      console.log(waypoints);
      console.log(markers);

      dispatch(setWPs(routeWaypoints));
      dispatch(setPOIs(markers));

      navigation.navigate("Navigator");
    })();
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
          <Circle
            center={location}
            radius={10}
            strokeWidth={1}
            strokeColor={"#1a66ff"}
            fillColor={"rgba(65, 104, 187, 0.5)"}
          />
        </MapView>
      </View>
      <View style={styles.details}>
        <View style={styles.textContainer}>
          <TextInput
            mode="outlined"
            label="Distance"
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(num) => onChangeDistance(num)}
            value={distance.toString()}
            maxLength={4} //setting limit of input
            right={<TextInput.Affix text="m" />}
          />
          <TextInput
            mode="outlined"
            label="Duration"
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(num) => onChangeTime(num)}
            value={time.toString()}
            maxLength={3} //setting limit of input
            right={<TextInput.Affix text="min" />}
          />
        </View>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          {markers?.map((marker: MarkerObject, index: number) => {
            return <Text key={index}>{marker.title}</Text>;
          })}
        </ScrollView>
        <View style={[styles.buttonsContainer, { gap: 15 }]}>
          <Button mode="contained-tonal" onPress={suggestPOIs}>
            Suggest POIs
          </Button>
          <Button
            disabled={markers.length === 0 ? true : false}
            mode="contained"
            onPress={createRoute}
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
    flex: 1.6,
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
    margin: 10,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
    margin: 10,
  },
  textInput: {
    width: 160,
    height: 35,
  },
});
