import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const RoutesScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text variant="headlineLarge">Custom Routes (Beta)</Text>
      <Button mode="outlined" onPress={() => navigation.navigate("Route")}>
        Custom
      </Button>
      <Text variant="headlineLarge">Nearby Trails</Text>
      <Button
        mode="outlined"
        onPress={() =>
          Alert.alert("STOP NOW", "Don't be impatient.", [
            {
              text: "Okay :(",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK!", onPress: () => console.log("OK Pressed") },
          ])
        }
      >
        Custom
      </Button>
    </>
  );
};

export default RoutesScreen;
