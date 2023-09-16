import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";

function QuizScreen({ route }) {
  // Access passedQuizOutput from route.params
  const passedQuizOutput = route.params?.passedQuizOutput || "";
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOption, setCurrentOption] = useState([]);
  const [answerCompleted, setAnswerCompleted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState("");
  const [scoreCounter, setScoreCounter] = useState(0);
  const [endQuiz, setEndQuiz] = useState(false);

  function replaceFirstWord(originalString, newFirstWord) {
    const words = originalString.split(" ");

    if (words.length >= 2) {
      words[0] = newFirstWord;

      const newString = words.join(" ");

      return newString;
    } else {
      // If there are less than two words, simply return the new first word
      return newFirstWord;
    }
  }

  // Use useEffect to update currentQuestion and currentOption when passedQuizOutput changes
  useEffect(() => {
    if (passedQuizOutput && passedQuizOutput.length > 0) {
      const currentQuestionNumber = questionNumber + 1;
      setCurrentQuestion(
        replaceFirstWord(
          passedQuizOutput[questionNumber].question,
          `Q${currentQuestionNumber}:`
        )
      );
      setCurrentOption(passedQuizOutput[questionNumber].options);
    }
  }, [passedQuizOutput, questionNumber]);

  const handleSelectOption = (selectedOption) => {
    passedQuizOutput.forEach((quizItem, index) => {
      console.log(`Question ${index + 1}:`);
      console.log("Question:", quizItem.question);
      console.log("Options:", quizItem.options);
      console.log("Answer:", quizItem.answer);
      console.log("\n"); // Add a newline for readability
    });

    console.log(selectedOption);
    if (selectedOption[0] === passedQuizOutput[questionNumber].answer) {
      setIsAnswerCorrect("Correct!");
      let currentScore = scoreCounter;
      setScoreCounter((currentScore += 1));
    } else {
      setIsAnswerCorrect(
        `Incorrect, the correct answer is ${passedQuizOutput[questionNumber].answer}`
      );
    }

    setAnswerCompleted(true);
    questionNumber === 4 ? setEndQuiz(true) : null;
  };

  const handleNextQuestion = () => {
    let currentQuestionNumber = questionNumber;
    setQuestionNumber((currentQuestionNumber += 1));
    setAnswerCompleted(false);
  };

  const forFun = () => {
    console.log("Hi");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <View
        style={{
          padding: 10,
          position: "absolute",
          top: 20, // Adjust the distance from the top as needed
          left: 20, // Adjust the distance from the left as needed
          width: "90%",
          alignSelf: "center",
        }}
      >
        <ProgressBar
          progress={(questionNumber + 1) / passedQuizOutput.length}
          color={"blue"}
          style={{ width: "100%" }}
        />
      </View>
      <View
        style={{
          backgroundColor: isAnswerCorrect === "Correct!" ? "green" : "red",
          padding: 10,
          borderRadius: 20,
          position: "absolute",
          top: 50, // Adjust the distance from the top as needed
          left: 20, // Adjust the distance from the left as needed
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Score: {scoreCounter}/5
        </Text>
      </View>

      {/* QuizQuestion */}
      <View style={{ marginTop: 20, position: "absolute", top: 100 }}>
        <Card style={{ padding: 20, borderRadius: 10 }}>
          {/* Display the question */}
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            {currentQuestion}
          </Text>

          {/* Display the answer options as buttons */}
          {currentOption.map((currentOption, index) => (
            <Button
              key={index}
              mode="contained"
              style={{ borderRadius: 10, marginBottom: 10 }}
              onPress={() => {
                if (!answerCompleted) {
                  handleSelectOption(currentOption);
                } else {
                  forFun();
                }
              }}
              contentStyle={{ textAlign: "left" }}
              labelStyle={{ textAlign: "left" }}
            >
              {currentOption}
            </Button>
          ))}
        </Card>
      </View>
      {/* Next Question */}
      {answerCompleted ? (
        <View style={{ marginTop: 450 }}>
          <Text
            style={{
              fontSize: 13,
              marginBottom: 10,
              color: isAnswerCorrect === "Correct!" ? "green" : "red",
            }}
          >{`Your Answer is ${isAnswerCorrect}!`}</Text>
          {!endQuiz ? (
            <Button
              mode="contained"
              style={{
                marginBottom: 10,
                paddingHorizontal: 20, // Add padding to the button
              }}
              labelStyle={{ fontSize: 16, fontWeight: "bold" }}
              onPress={handleNextQuestion}
            >
              Next Question
            </Button>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}
              >
                {`Quiz Score: ${scoreCounter}`}
              </Text>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}
              >
                Accumulated Score: 94
              </Text>

              <Image
                source={require("./QuizQuestions/reward_shop.png")} // Replace with the path to your image
                style={{ width: 75, height: 75, marginBottom: 0 }}
              />

              <Button
                mode="contained"
                style={{
                  marginBottom: 10,
                  paddingHorizontal: 20, // Add padding to the button
                }}
                labelStyle={{ fontSize: 16, fontWeight: "bold" }}
              >
                Go to Rewards
              </Button>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

export default QuizScreen;
