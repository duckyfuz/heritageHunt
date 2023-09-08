import { GiftedChat } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button, Text } from "react-native-paper";
import { Platform, View, ActivityIndicator, StyleSheet } from "react-native";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";

import { banned, giftedToGPT, toConvo } from "../utils/converseHelpers";

const Converse = ({ route, navigation }) => {
  const isKeyboardVisible = useKeyboardVisible();
  const [messages, setMessages] = useState([]);

  const [quizOutput, setQuizOutput] = useState(""); // Store quiz responses here

  const [isLoading, setIsLoading] = useState(false);

  const APIKEY = process.env.REACT_APP_OPENAI_API_KEY;

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

    // Restrict certain words, set a default kinda reply
    const messageText = userMessage.text.toLowerCase();
    if (banned.some((ban) => messageText.includes(ban))) {
      const banReply = {
        _id: Math.floor(Math.random() * 10000),
        text: "That's not very nice... Let's start over.",
        createdAt: new Date(),
        user: {
          _id: 3,
          name: "Moderator",
        },
      };
      setMessages((prevMessages) => GiftedChat.append(prevMessages, banReply));
      return;
    }

    // Ceating a new log for GPT
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

    // Fetching response from GPT
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: chronoMessages,
        max_tokens: 500,
        temperature: 0.1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APIKEY}`,
        },
      }
    );

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
    console.log(messages);
    const formattedChat = toConvo(
      giftedToGPT(messages, ""),
      route.params.character.name
    );

    const combinedPrompt =
      `Create a quiz based on the conversation below between a user and the ${route.params.character.name}. Generate 5 MCQ question in the following format where Q: represents Question; A, B, C and D represents the options to choose from; and the answer is given in the following format Answer: A/B/C/D. The options are one line apart and start one line after the question. The answer starts one line after the last option. A new question starts two line after the answer to the last question. Do not add anything other messages or acknowlegements\n` +
      formattedChat;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: combinedPrompt }],
          max_tokens: 1000,
          temperature: 0.1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIKEY}`,
          },
        }
      );

      const answer = response.data.choices[0].message.content;
      const lines = answer.split("\n").filter((line) => line !== "");

      // I feel like this is hardcoded mannn
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
      // setQuizOutput(quizData);
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
        // Render the loading indicator in the center of the screen
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} />
          <Text style={{ marginTop: 10 }} variant="titleSmall">
            Generating Quiz...
          </Text>
        </View>
      ) : (
        // Render the GiftedChat when not loading
        <GiftedChat
          style={{}}
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
