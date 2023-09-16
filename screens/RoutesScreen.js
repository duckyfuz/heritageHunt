import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import heritage_trail from "./../assets/trails/heritage-starter.jpg";
import chinatown from "./../assets/trails/chinatown.jpg";
import { TouchableOpacity } from "react-native-gesture-handler";

const RoutesScreen = () => {
  const navigation = useNavigation();

  const TrailCard = ({ image, title, content, handlePress }) => {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.6}
        style={{ marginVertical: 5, minWidth: "95%", maxWidth: "95%" }}
      >
        <Card>
          <Card.Cover
            source={image}
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              height: 150,
            }}
          />
          <Card.Content style={{ marginTop: 10, gap: 5 }}>
            <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
              {title}
            </Text>
            {content}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{}}>
      <ScrollView
        style={{ height: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TrailCard
          image={heritage_trail}
          title="CulturAI Trails (Beta)"
          content={
            <View>
              <Text variant="bodyMedium">
                Come and test out our newest feature - dynamic trails customised
                just for YOU!
              </Text>
              <Text>
                Make no mistake, no two trails are the same. All we need if your
                location and preferences!
              </Text>
            </View>
          }
          handlePress={() => navigation.navigate("Route")}
        />
        <TrailCard
          image={chinatown}
          title="Chinatown Extravaganza"
          content={
            <View>
              <Text variant="bodyMedium">
                Have a great time in chinatown with us!
              </Text>
            </View>
          }
          handlePress={() =>
            Alert.alert(
              "Work in Progress",
              "This trail is being worked on! Why not try out our CustomAI trail?",
              [{ text: "Alright!" }]
            )
          }
        />
      </ScrollView>
    </View>
  );
};

export default RoutesScreen;
