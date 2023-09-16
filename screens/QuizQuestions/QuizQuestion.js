import React from 'react';
import {Text } from 'react-native';
import { Card, Button } from 'react-native-paper';

function QuizQuestion({ question, options, onSelectOption }) {
  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      {/* Display the question */}
      <Text style={{ fontSize: 18, marginBottom: 20 }}>{question}</Text>
      
      {/* Display the answer options as buttons */}
      {options.map((option, index) => (
        <Button
          key={index}
          mode="contained"
          style={{ borderRadius: 10, marginBottom: 10 }}
          onPress={() => onSelectOption(option)}
          contentStyle={{ textAlign: 'left' }}
          labelStyle={{ textAlign: 'left' }}
        >
          {option}
        </Button>
      ))}
    </Card>
  );
}

export default QuizQuestion;