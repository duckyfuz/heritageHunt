{
  /* <View
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

{/* QuizQuestion */
}
<View style={{ marginTop: 20, position: "absolute", top: 100 }}>
  <Card style={{ padding: 20, borderRadius: 10 }}>
    {/* Display the question */}
    <Text style={{ fontSize: 18, marginBottom: 20 }}>{currentQuestion}</Text>

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
</View>;
{
  /* Next Question */
}
{
  answerCompleted ? (
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
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
            {`Quiz Score: ${scoreCounter}`}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
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
  ) : null;
}
