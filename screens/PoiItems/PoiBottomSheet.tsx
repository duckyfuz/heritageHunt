import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

const PoiBottomSheet = (
  { bottomSheetModalRef, snapPoints, handleSheetChanges, poi }: any // Don't be lazy go and put the correct types later
) => {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {poi ? (
        <View style={styles.contentContainer}>
          <Text>{poi.title}</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} />
          <Text style={{ marginTop: 10 }} variant="titleSmall">
            Fetching location...
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
    alignItems: "center",
  },
});
