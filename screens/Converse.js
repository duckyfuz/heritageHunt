import { GiftedChat } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import axios from "axios";

import { rafflesStatue } from "../prompts/rafflesStatue";
import { Button, Text } from "react-native-paper";
import { Platform, View, ActivityIndicator, StyleSheet } from "react-native";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";

import { QuizPrompt } from "../prompts/QuizGenerator";

function giftedToGPT(inputData, prompt) {
  inputData.push({ text: prompt, user: { _id: 1 }, _id: 1 });
  console.log(inputData);
  const messages = inputData.reverse().map((item) => {
    return {
      role: item.user.name === "Statue" ? "system" : "user",
      content: item.text,
    };
  });

  return messages;
}

const Converse = ({ route, navigation }) => {
  const isKeyboardVisible = useKeyboardVisible();
  const [messages, setMessages] = useState([]);

  const [quizOutput, setQuizOutput] = useState(""); // Store quiz responses here
  const [chatHistory, setChatHistory] = useState([]); // Store chat history

  const [quizStarted, setQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const APIKEY = "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";

  useEffect(() => {
    console.log(route.params.character);
    navigation.setOptions({
      headerTitle: () => <Text>{route.params.character.name}</Text>,
      headerRight: () => (
        <Button
          onPress={() => {
            setIsLoading(true);
            handleStartQuiz();
          }}
          // mode="contained"
          buttonColor="#00000000"
          // rippleColor={"#00000000"}
          style={{ borderRadius: 10, marginRight: 10 }}
        >
          Start Quiz
        </Button>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (quizStarted) {
      navigation.navigate("Quiz", { passedQuizOutput: quizOutput });
      setQuizStarted(false);
    }
  }, [quizStarted, navigation]);

  const handleSend = async (newMessages = []) => {
    console.log(process);
    console.log(`Ernest: newMessages = ${newMessages}`);
    try {
      const userMessage = newMessages[0];

      //takes in the previous messages and adds in the current userMessage
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, userMessage)
      );
      const messageText = userMessage.text.toLowerCase();
      const banned = ["GPT"]; // Banned words
      if (banned.some((ban) => messageText.includes(ban))) {
        const botMessage = {
          _id: Math.floor(Math.random() * 10000),
          text: "That's not very nice... Let's start over.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Statue",
          },
        };
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, botMessage)
        );
        return;
      }
      console.log(`Ernest: ${messages}`);

      let messagesss = giftedToGPT(messages, route.params.character.prompt);
      messagesss.push({
        role: "user",
        content: userMessage.text,
      });
      console.log(messagesss);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: messagesss,
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

      console.log(response.data);

      const answer = response.data.choices[0].message.content.trim();
      const botMessage = {
        _id: Math.floor(Math.random() * 10000),
        text: answer,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Statue",
        },
      };

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, botMessage)
      );

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userMessage.text },
        { role: "assistant", content: answer },
      ]);
    } catch (error) {
      console.log(error);
    }

    // Append the user's message and ChatGPT's response to the chat history
  };

  const handleStartQuiz = async () => {
    // Combine the chat history with your "startQuiz" prompt
    console.log("handleStartQuiz Executing");
    const combinedPrompt =
      chatHistory.map((message) => message.content).join("\n") +
      "\n\n" +
      QuizPrompt; // Add your "startQuiz" prompt here

    console.log(`Input passed to chatGPT: ${combinedPrompt}`);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: combinedPrompt }, // Combined prompt
          ],
          max_tokens: 500,
          temperature: 0.1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIKEY}`, // Replace with your OpenAI API key
          },
        }
      );
      const answer = response.data.choices[0].message.content;

      console.log(`Output from chatGPT: ${answer}`);

      const lines = answer.split("\n").filter((line) => line !== "");

      console.log(`lines: ${lines}`);

      //add the questions and options into the quizOutput state
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

      quizData.forEach((quizItem, index) => {
        console.log(`Question ${index + 1}:`);
        console.log("Question:", quizItem.question);
        console.log("Options:", quizItem.options);
        console.log("Answer:", quizItem.answer);
        console.log("\n"); // Add a newline for readability
      });

      setQuizOutput(quizData);
    } catch (error) {
      console.log(error);
    }

    setQuizStarted(true);
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
