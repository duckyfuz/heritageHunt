import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  Avatar,
} from "react-native-paper";
import heritageHuntLogo from "./QuizQuestions/logo.png";

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

  const styles = StyleSheet.create({
    button1: {
      borderWidth: 0,
      backgroundColor: "#dfe7e8",
      borderRadius: 7,
    },
    buttonCorrect: {
      borderWidth: 0,
      backgroundColor: "#38eb91",
      borderRadius: 7,
    },
    buttonWrong: {
      borderWidth: 0,
      backgroundColor: "#ed4554",
      borderRadius: 7,
    },
    button1Text: {
      color: "#2a2b2b",
      fontSize: 18,
      alignSelf: "flex-start",
    },
  });

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        position: "absolute",
      }}
    >
      {/* Add in heritageHunt Logo */}
      <View style={{ flex: 1, margin: 10 }}>
        <Avatar.Image
          size={75}
          source={heritageHuntLogo}
          style={{ padding: 0 }}
        />
      </View>
      {/* Question */}
      <View
        style={{
          flex: 3,
          marginLeft: 10,
          marginTop: 0,
          marginBottom: 10,
          marginRight: 10,
        }}
      >
        <Text
          variant="displayLarge"
          style={{ fontSize: 26, fontWeight: "bold" }}
        >
          Will HeritageHunt win cloudhacks 2023?
        </Text>
      </View>
      {/* Questions and options */}
      <View style={{ flex: 6, marginHorizontal: 10 }}>
        <Card>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ fontSize: 18, fontWeight: "bold", color: "#6b6868" }}
            >
              Select one
            </Text>
          </Card.Content>
          <Card.Actions
            style={{
              flexDirection: "column",
              rowGap: 20,
              width: "100%",
              alignItems: "stretch",
            }}
          >
            <Button
              style={styles.button1}
              labelStyle={styles.button1Text}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Option 1
            </Button>
            <Button
              style={styles.buttonCorrect}
              labelStyle={styles.button1Text}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Correct Option
            </Button>
            <Button
              style={styles.buttonWrong}
              labelStyle={styles.button1Text}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Wong Option
            </Button>
            <Button
              style={styles.button1}
              labelStyle={styles.button1Text}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Last Option
            </Button>
          </Card.Actions>
        </Card>

        {/*Submit Button */}
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Button mode="contained">Done</Button>
        </View>
      </View>
    </View>
  );
}

export default QuizScreen;
