import React from 'react';
import { View } from 'react-native';
import QuizQuestion from './QuizQuestions/QuizQuestion'; // Import the QuizQuestion component

function QuizScreen({route}) {

    const{quizOutput} = route.params;
  const handleSelectOption = (selectedOption) => {
    // Handle the selected option here
    debug.log(quizOutput)
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Example usage of QuizQuestion component */}
      <QuizQuestion
        question="What is the capital of France?"
        options={['London', 'Berlin', 'Madrid', 'Paris']}
        onSelectOption={handleSelectOption}
      />
    </View>
  );
}

export default QuizScreen;