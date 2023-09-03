import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ConverseScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text variant="headlineLarge">Converse Prototype</Text>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate("Converse", { character: "rafflesStatue" })
        }
      >
        Raffles
      </Button>
    </>
  );
};

export default ConverseScreen;
