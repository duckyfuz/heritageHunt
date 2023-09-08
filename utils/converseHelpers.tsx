import axios from "axios";

export const banned = ["gpt", "fuck", "llm"];

export function giftedToGPT(inputData: any, prompt: any) {
  // console.log(inputData);
  const filteredData = [];
  let skipNext = false;

  for (let i = 0; i < inputData.length; i++) {
    const currentItem = inputData[i];
    if (skipNext) {
      // Skip the current item if we've marked it for removal
      skipNext = false;
      continue;
    }
    if (currentItem.user._id === 3) {
      // Mark the current item for removal and the next item as well
      skipNext = true;
      continue;
    }
    // Add the current item to the filteredData array
    filteredData.push(currentItem);
  }

  if (prompt.length !== 0) {
    filteredData.push({ text: prompt, user: { _id: 1 }, _id: 1 });
  }

  const messages = filteredData.reverse().map((item: any) => {
    return {
      role: item.user._id === 1 ? "user" : "system",
      content: item.text,
    };
  });
  // console.log(messages);
  return messages;
}

export function toConvo(conversationData: any, char: string) {
  let formattedConversation = "";
  conversationData.forEach((item: any) => {
    const role = item.role;
    const content = item.content;
    formattedConversation += `${role === "system" ? char : role}: ${content}\n`;
  });
  return formattedConversation;
}

export async function callGPT(messages: any, tokens: Number, temp: Number) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: tokens,
      temperature: temp,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
    }
  );
  return response;
}

export function createQuizPrompt(char: string, formattedChat: string) {
  const combinedPrompt =
    `Create a quiz based on the conversation below between a user and the ${char}. Generate 5 MCQ question in the following format where Q: represents Question; A, B, C and D represents the options to choose from; and the answer is given in the following format Answer: A/B/C/D. The options are one line apart and start one line after the question. The answer starts one line after the last option. A new question starts two line after the answer to the last question. Do not add anything other messages or acknowlegements\n` +
    formattedChat;
  return combinedPrompt;
}
