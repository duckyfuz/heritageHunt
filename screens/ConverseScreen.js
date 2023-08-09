import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ConverseScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text variant="headlineLarge">Converse Prototype</Text>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate("Converse", { character: "rafflesStatue" })
        }
      >
        Raffles
      </Button>
    </SafeAreaView>
  );
};

export default ConverseScreen;
