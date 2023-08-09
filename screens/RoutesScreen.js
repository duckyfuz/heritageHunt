import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ConverseScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text variant="headlineLarge">Routes Prototype</Text>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Route", { character: "custom" })}
      >
        Custom
      </Button>
    </SafeAreaView>
  );
};

export default ConverseScreen;
