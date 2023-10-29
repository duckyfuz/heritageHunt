import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  Avatar,
  IconButton,
} from "react-native-paper";
import heritageHuntLogo from "./QuizQuestions/logo.png";

function QuizScreen({ route }) {
  // Access passedQuizOutput from route.params
  const passedQuizOutput = route.params?.passedQuizOutput || "";
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOption, setCurrentOption] = useState([]);
  const [answerCompleted, setAnswerCompleted] = useState(false);
  const [answerIndex, setAnswerIndex] = useState(5);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState("");
  const [scoreCounter, setScoreCounter] = useState(0);
  const [endQuiz, setEndQuiz] = useState(false);

  const [buttonColor, setButtonColor] = useState("");

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

  const handleSelectOption = (selectedOption, index) => {
    passedQuizOutput.forEach((quizItem, index) => {
      console.log(`Question ${index + 1}:`);
      console.log("Question:", quizItem.question);
      console.log("Options:", quizItem.options);
      console.log("Answer:", quizItem.answer);
      console.log("\n"); // Add a newline for readability
    });

    console.log(selectedOption);

    setAnswerIndex(index);

    if (selectedOption[0] === passedQuizOutput[questionNumber].answer) {
      setIsAnswerCorrect("Correct!");
      let currentScore = scoreCounter;
      setScoreCounter((currentScore += 1));
      //set button to green
      setButtonColor("#38eb91");
    } else {
      setIsAnswerCorrect(
        `Incorrect, the correct answer is ${passedQuizOutput[questionNumber].answer}`
      );
      //set button to red
      setButtonColor("#ed4554");
    }

    setAnswerCompleted(true);
    questionNumber === 4 ? setEndQuiz(true) : null;
  };

  const handleNextQuestion = () => {
    let currentQuestionNumber = questionNumber;
    setQuestionNumber((currentQuestionNumber += 1));
    setAnswerCompleted(false);
  };

  const styles = StyleSheet.create({
    button1: {
      borderWidth: 0,
      backgroundColor: "#dfe7e8",
      borderRadius: 7,
    },
    button2: {
      borderWidth: 0,
      backgroundColor: buttonColor,
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
      <View
        style={{
          flex: 1,
          margin: 10,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Avatar.Image
          size={75}
          source={heritageHuntLogo}
          style={{ padding: 0 }}
        />
        <View
          style={{
            backgroundColor: isAnswerCorrect === "Correct!" ? "green" : "red",
            padding: 10,
            margin: 10,
            marginLeft: 140,
            marginTop: 15,
            marginBottom: 15,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Score: {scoreCounter}/5
          </Text>
        </View>
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
          {currentQuestion}
        </Text>
      </View>
      {/*MCQ Options */}
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
              rowGap: 8,
              width: "100%",
              alignItems: "stretch",
              marginBottom: 5,
            }}
          >
            {currentOption.map((currentOption, index) => (
              // <Button
              //   // Change the style of button to buttonWrong/buttonCorrect if it is correct
              //   style={
              //     !answerCompleted
              //       ? styles.button1
              //       : answerCompleted && answerIndex === index
              //       ? styles.button2
              //       : styles.button1
              //   }
              //   labelStyle={styles.button1Text}
              //   contentStyle={{ justifyContent: "flex-start" }}
              //   key={index}
              //   id={`btn${index}`}
              //   onPress={() => {
              //     if (!answerCompleted) {
              //       handleSelectOption(currentOption, index);
              //     }
              //   }}
              // >
              //   <Text>{currentOption}</Text>
              // </Button>
              <IconButton
                key={index}
                style={[
                  {
                    width: "95%",
                    padding: 5,
                    height: Math.ceil(currentOption.length / 39) * 40,
                  },
                  !answerCompleted
                    ? styles.button1
                    : answerCompleted && answerIndex === index
                    ? styles.button2
                    : styles.button1,
                ]}
                labelStyle={styles.button1Text}
                contentStyle={{ justifyContent: "flex-start" }}
                icon={() => (
                  <Text
                    style={{
                      width: "90%",
                      textAlign: "left",
                    }}
                    // numberOfLines={4}
                  >
                    {currentOption}
                    {/* 1234567890123456789012345678901234567890 */}
                  </Text>
                )}
                onPress={() => {
                  if (!answerCompleted) {
                    handleSelectOption(currentOption, index);
                  }
                }}
              />
            ))}
          </Card.Actions>
        </Card>

        {/* Only toggle view when answer is completed */}
        {answerCompleted ? (
          <React.Fragment>
            {/* Question feedback */}
            <View
              style={{
                flex: 1,
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <Text
                style={{
                  color: isAnswerCorrect === "Correct!" ? "green" : "red",
                }}
              >{`Your Answer is ${isAnswerCorrect}!`}</Text>
            </View>
            {!endQuiz ? (
              //Submit Button
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
                <Button mode="contained" onPress={handleNextQuestion}>
                  Done
                </Button>
              </View>
            ) : (
              //End page screen
              <React.Fragment>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 5,
                      alignSelf: "center",
                    }}
                  >
                    {`Quiz Score: ${scoreCounter}/5`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      marginBottom: 5,
                      alignSelf: "center",
                    }}
                  >
                    Lifetime Score: 94
                  </Text>

                  <Image
                    source={require("./QuizQuestions/reward_shop.png")} // Replace with the path to your image
                    style={{
                      width: 75,
                      height: 75,
                      alignSelf: "center",
                    }}
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
              </React.Fragment>
            )}
          </React.Fragment>
        ) : null}
        {/*Feedback on the Answer */}
      </View>
    </View>
  );
}

export default QuizScreen;
