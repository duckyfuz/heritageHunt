import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { Text, FAB, ActivityIndicator } from "react-native-paper";

import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

import * as MapStyle from "../utils/mapStyle.json";
import { LocationObject, MarkerObject } from "../utils/routeHelpers";
import { useNavigation } from "@react-navigation/native";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import PoiBottomSheet from "./PoiItems/PoiBottomSheet";

import { useSelector } from "react-redux";
import { selectPOIs, selectWPs } from "../app/features/counter/counterSlice";

const HomeScreen = () => {
  const navigation = useNavigation();
  const waypoints = useSelector(selectWPs);
  const POIs = useSelector(selectPOIs);

  const [location, setLocation] = useState<LocationObject | null>(null);
  const [POI, setPOI] = useState<MarkerObject | null>(null);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    // const newLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      // latitude: newLocation.coords.latitude,
      // longitude: newLocation.coords.longitude,
      latitude: 1.27934,
      longitude: 103.84212,
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

  // Bottom Sheet Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Botton Sheet snap variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // Callbacks for Bottom Sheet
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    // setPOI(null);
  }, []);

  const handlePoiClick = (e: SyntheticEvent) => {
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
    setPOI(marker);
    handlePresentModalPress();
  };

  const FloatingButtons = () => {
    return (
      <>
        <FAB
          icon="map-marker-radius"
          style={styles.fab}
          onPress={() => {
            console.log(location);
            _mapView.animateToRegion(location, 500);
            console.log(waypoints);
          }}
        />
        <FAB
          icon="hiking" // Probably wna change this in the future
          style={[styles.fab, { bottom: 75 + 10 }]}
          onPress={() => {
            console.log(location);
            navigation.navigate("RoutesStack");
          }}
        />
      </>
    );
  };

  const PolylineComponent: React.FC<PolylineComponentProps> = ({
    coordinates,
  }) => {
    return (
      <Polyline
        coordinates={coordinates}
        strokeColor="#000"
        // strokeColors={[
        //   "#7F0000",
        //   "#00000000",
        //   "#B24112",
        //   "#E5845C",
        //   "#238C23",
        //   "#7F0000",
        // ]}
        strokeWidth={3}
      />
    );
  };

  const mapToLatLng = (
    coordinateSet: number[][]
  ): { latitude: number; longitude: number }[] => {
    return coordinateSet.map((coordinate) => {
      const [latitude, longitude] = coordinate;
      return { latitude, longitude };
    });
  };

  interface PolylineComponentProps {
    coordinates: { latitude: number; longitude: number }[];
  }

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
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.map}>
          <FloatingButtons />
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
            {waypoints.map((coordinateSet, index) => (
              <PolylineComponent
                key={index}
                coordinates={mapToLatLng(coordinateSet)}
              />
            ))}
            {POIs?.map((marker: MarkerObject, index: number) => {
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
          <PoiBottomSheet
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}
            poi={POI}
            navigation={navigation}
          />
        </View>
      </View>
    </BottomSheetModalProvider>
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
    left: 0,
    bottom: 20,
  },
});
