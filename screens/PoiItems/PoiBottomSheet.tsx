import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

const PoiBottomSheet = ({
  bottomSheetModalRef,
  snapPoints,
  handleSheetChanges,
  poi,
  navigation,
}: any) => {
  function removeAfterFirstLine(text) {
    const lines = text.split("\n");
    return lines[0];
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {poi ? (
        <View style={styles.contentContainer}>
          <View>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {removeAfterFirstLine(poi.title)}
            </Text>
            <Text variant="bodyMedium">Description goes here!</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate("CommStack");
              }}
            >
              Scan Identification Code
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} />
          <Text style={{ marginTop: 10 }} variant="titleSmall">
            Awaiting data...
          </Text>
        </View>
      )}
    </BottomSheetModal>
  );
};

export default PoiBottomSheet;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
    margin: 10,
  },
});
