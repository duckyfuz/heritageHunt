export function giftedToGPT(inputData: any, prompt: any) {
  inputData.push({ text: prompt, user: { _id: 1 }, _id: 1 });
  console.log(inputData);
  const messages = inputData.reverse().map((item: any) => {
    return {
      role: item.user.name === "Statue" ? "system" : "user",
      content: item.text,
    };
  });

  return messages;
}

export const banned = ["gpt", "fuck", "llm"];
