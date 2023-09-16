import * as React from "react";
import { BottomNavigation, Button, Text } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { IdentificationScreen, RoutesScreen } from "./screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createStackNavigator } from "@react-navigation/stack";
import Converse from "./screens/Converse";
import Route from "./screens/Route";
import Quiz from "./screens/Quiz";
import HomeScreen from "./screens/HomeScreen";
import ScanScreen from "./screens/PoiItems/ScanScreen";

const Stack = createStackNavigator();
const RouteStack = createStackNavigator();
const QuizStack = createStackNavigator();

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
      key: "identification",
      title: "identification",
      focusedIcon: "account-cowboy-hat",
      unfocusedIcon: "account-cowboy-hat-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    identification: IdentificationScreen,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

function RouteStacks() {
  return (
    <RouteStack.Navigator>
      <Stack.Screen
        name="RoutesScreen"
        component={RoutesScreen}
        options={{ title: "Culture Trails", headerBackTitle: "Home" }}
      />
      <Stack.Screen
        name="Route"
        component={Route}
        options={{ title: "Trail Generation", headerBackTitle: "Trails" }}
      />
    </RouteStack.Navigator>
  );
}

function CommStack() {
  return (
    <QuizStack.Navigator>
      <QuizStack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{ title: "Scanner", headerBackTitle: "Home" }}
      />
      <QuizStack.Screen
        name="Converse"
        component={Converse}
        options={() => ({
          title: "Loading...",
          headerRight: () => <Button>Start Quiz</Button>,
        })}
      />
      <QuizStack.Screen
        name="Quiz"
        component={Quiz}
        options={() => ({
          title: "Dyno Quiz",
          headerBackTitle: "Back",
        })}
      />
    </QuizStack.Navigator>
  );
}

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
              name="RoutesStack"
              component={RouteStacks}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommStack"
              component={CommStack}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
