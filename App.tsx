import * as React from "react";
import { BottomNavigation, Button, Text } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ConverseScreen, IdentificationScreen, RoutesScreen } from "./screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createStackNavigator } from "@react-navigation/stack";
import Converse from "./screens/Converse";
import Route from "./screens/Route";
import Quiz from "./screens/Quiz";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

const BottomTabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "home",
      focusedIcon: "map",
      unfocusedIcon: "map-outline",
    },
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
    home: HomeScreen,
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
            <Stack.Screen
              name="Converse"
              component={Converse}
              options={({ navigation, route }) => ({
                headerTitle: () => <Text>Loading...</Text>,
                // Add a placeholder button without the `onPress` to avoid flicker
                headerRight: () => <Button>Start Quiz</Button>,
              })}
            />
            <Stack.Screen name="Route" component={Route} />
            <Stack.Screen name="Quiz" component={Quiz} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
