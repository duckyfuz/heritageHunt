import * as React from "react";
import { BottomNavigation } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ConverseScreen, IdentificationScreen, RoutesScreen } from "./screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createStackNavigator } from "@react-navigation/stack";
import Converse from "./screens/Converse";
import Route from "./screens/Route";

const Stack = createStackNavigator();

const BottomTabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "converse",
      title: "converse",
      focusedIcon: "comment-text",
      unfocusedIcon: "comment-text-outline",
    },
    {
      key: "identification",
      title: "identification",
      focusedIcon: "camera-marker",
      unfocusedIcon: "camera-marker-outline",
    },
    {
      key: "routes",
      title: "routes",
      focusedIcon: "map",
      unfocusedIcon: "map-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    converse: ConverseScreen,
    identification: IdentificationScreen,
    routes: RoutesScreen,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Navigator" component={BottomTabs} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Converse" component={Converse} />
            <Stack.Screen name="Route" component={Route} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
