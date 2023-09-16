import React from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const IdentificationScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} />
      <Text style={{ marginTop: 10 }} variant="titleSmall">
        This page is being worked on!
      </Text>
      <Text variant="titleSmall">Please try again in a while...</Text>
    </View>
  );
};

export default IdentificationScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
