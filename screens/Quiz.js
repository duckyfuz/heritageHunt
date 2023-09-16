import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import QuizQuestion from "./QuizQuestions/QuizQuestion"; // Import the QuizQuestion component

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
      currentQuestionNumber = questionNumber + 1;
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
          backgroundColor: isAnswerCorrect === "Correct!" ? "green" : "red",
          padding: 10,
          borderRadius: 5,
          position: "absolute",
          top: 20, // Adjust the distance from the top as needed
          left: 20, // Adjust the distance from the left as needed
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Score: {scoreCounter}/5
        </Text>
      </View>
      {/* QuizQuestion */}
      <View style={{ marginTop: 20, position: "absolute", top: 100 }}>
        <QuizQuestion
          question={currentQuestion}
          options={currentOption}
          onSelectOption={
            !answerCompleted
              ? (selectedOption) => handleSelectOption(selectedOption)
              : () => forFun()
          }
        />
      </View>
      {/* Next Question */}
      {answerCompleted ? (
        <View style={{ marginTop: 200 }}>
          <Text>{`Your Answer is ${isAnswerCorrect}!`}</Text>
          {!endQuiz ? (
            <Button onPress={handleNextQuestion}>Next Question</Button>
          ) : (
            <Text>The Quiz has ended! Please return to the converse page.</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

export default QuizScreen;
