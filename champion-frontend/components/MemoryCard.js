import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function MemoryCard({ word, language, isFlipped, isMatched, onPress }) {
  // Determine background color based on language and match status
  const getBackgroundColor = () => {
    if (isMatched) {
      return '#A8E6CF'; // Light green for matched cards
    }
    if (!isFlipped) {
      return '#F3F4F6'; // Light grey for face-down cards
    }
    return language === 'english' ? '#4FACFE' : '#FFB347'; // Blue for English, Orange for Cham
  };

  // Get the text to display
  const getDisplayText = () => {
    if (!isFlipped && !isMatched) {
      return '❓'; // Question mark for face-down cards
    }
    return word;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: getBackgroundColor() },
        isMatched && styles.matchedCard
      ]}
      onPress={onPress}
      disabled={isFlipped || isMatched}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.text,
        isFlipped && !isMatched && styles.flippedText,
        isMatched && styles.matchedText,
        !isFlipped && styles.hiddenText
      ]}>
        {getDisplayText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    margin: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    color: '#2D3748',
  },
  flippedText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  hiddenText: {
    fontSize: 36, // Larger size for the question mark
  },
  matchedCard: {
    borderWidth: 2,
    borderColor: '#68D391', // Green border for matched cards
  },
  matchedText: {
    color: '#276749', // Darker green for matched text
  },
}); 