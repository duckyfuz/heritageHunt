import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const ConverseScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Card>
        <Card.Actions>
          <Button
            icon="camera"
            mode="contained"
            onPress={() =>
              navigation.navigate("Route", { character: "custom" })
            }
          >
            Custom
          </Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};

export default ConverseScreen;
