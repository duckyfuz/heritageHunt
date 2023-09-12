import { GiftedChat } from "react-native-gifted-chat";
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native-paper";
import { Platform, View, ActivityIndicator, StyleSheet } from "react-native";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";
import {
  banned,
  callGPT,
  createQuizPrompt,
  giftedToGPT,
  toConvo,
} from "../utils/converseHelpers";

interface Character {
  name: string;
  prompt: string;
}

interface Route {
  params: {
    character: Character;
  };
}

interface Props {
  route: Route;
  navigation: any;
}

const Converse: React.FC<Props> = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isKeyboardVisible = useKeyboardVisible();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>{route.params.character.name}</Text>,
      headerRight: () => (
        <Button
          onPress={() => {
            setIsLoading(true);
            handleStartQuiz();
          }}
          buttonColor="#00000000"
          style={{ borderRadius: 10, marginRight: 10 }}
          disabled={!(messages.length > 5)}
        >
          Start Quiz
        </Button>
      ),
    });
  }, [navigation, messages]);

  const handleSend = async (newMessages = []) => {
    const userMessage = newMessages[0];
    setMessages((prevMessages) => GiftedChat.append(prevMessages, userMessage));

    const messageText = userMessage.text.toLowerCase();
    const wordsInMessage = messageText.split(" ");

    for (const word of wordsInMessage) {
      if (banned.includes(word)) {
        const banReply = {
          _id: Math.floor(Math.random() * 10000),
          text: "That's not very nice... Let's start over.",
          createdAt: new Date(),
          user: {
            _id: 3,
            name: "Moderator",
          },
        };
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, banReply)
        );
        return;
      }
    }

    const chronoMessages = giftedToGPT(
      messages,
      route.params.character.prompt,
      route.params.character.name
    );
    chronoMessages.push({
      role: "user",
      content:
        "Please reply to the following question or statement as if you were an actor playing the character of " +
        route.params.character.name +
        ":\n" +
        userMessage.text,
    });

    const response = await callGPT(chronoMessages, 500, 0.3);

    const reply = response.data.choices[0].message.content.trim();
    const GPTMessage = {
      _id: Math.floor(Math.random() * 10000),
      text: reply,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: route.params.character.name,
      },
    };

    setMessages((prevMessages) => GiftedChat.append(prevMessages, GPTMessage));
  };

  const handleStartQuiz = async () => {
    const combinedPrompt = createQuizPrompt(
      route.params.character.name,
      toConvo(giftedToGPT(messages, ""), route.params.character.name)
    );

    try {
      const message = [{ role: "user", content: combinedPrompt }];
      const response = await callGPT(message, 1000, 0.1);

      const answer = response.data.choices[0].message.content;
      const lines = answer.split("\n").filter((line) => line !== "");

      let quizData = [];
      for (let i = 0; i < 25; i += 6) {
        let answerr = lines[i + 5].split(" ");
        const newObj = {
          question: lines[i],
          options: [lines[i + 1], lines[i + 2], lines[i + 3], lines[i + 4]],
          answer: answerr[1],
        };
        quizData.push(newObj);
      }
      navigation.navigate("Quiz", { passedQuizOutput: quizData });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom: isKeyboardVisible || Platform.OS === "android" ? 0 : 25,
      }}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} />
          <Text style={{ marginTop: 10 }} variant="titleSmall">
            Generating Quiz...
          </Text>
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => handleSend(newMessages)}
          user={{
            _id: 1,
            name: "user",
          }}
        />
      )}
    </View>
  );
};

export default Converse;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
