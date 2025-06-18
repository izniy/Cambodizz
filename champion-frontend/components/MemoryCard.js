import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';

export default function MemoryCard({ word, language, isFlipped, isMatched, onPress }) {
  // Determine background color based on language and match status
  const getBackgroundColor = () => {
    if (isMatched) {
      return '#A8E6CF'; // Light green for matched cards
    }
    if (!isFlipped) {
      return '#D1C4E9'; // Light purple for face-down cards
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
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.text,
          isFlipped && !isMatched && styles.flippedText,
          isMatched && styles.matchedText,
          !isFlipped && styles.hiddenText
        ]}
      >
        {getDisplayText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 100,
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    color: '#2D3748',
    fontFamily: Platform.select({
      ios: 'Chalkboard SE',
      android: 'Comic Sans MS',
      default: 'System'
    })
  },
  flippedText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hiddenText: {
    fontSize: 28,
  },
  matchedCard: {
    borderWidth: 2,
    borderColor: '#68D391',
  },
  matchedText: {
    color: '#276749',
  },
}); 