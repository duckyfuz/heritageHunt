import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { GiftedChat } from "react-native-gifted-chat";
import { useEffect, useState } from "react";
import axios from "axios";

import { rafflesStatue } from "../prompts/rafflesStatue";

function giftedToGPT(inputData) {
  inputData.push({ text: rafflesStatue, user: { _id: 1 }, _id: 1 });
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
  useEffect(() => {
    console.log(route.params.character);
  });
  const [messages, setMessages] = useState([]);

  const handleSend = async (newMessages = []) => {
    console.log(process);
    try {
      const userMessage = newMessages[0];

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
      // console.log(messages);

      let messagesss = giftedToGPT(messages);
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
          max_tokens: 100,
          temperature: 0.1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => handleSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Converse;
