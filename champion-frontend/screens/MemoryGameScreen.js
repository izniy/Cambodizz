import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getVocabularyWords } from '../lib/getVocabularyWords';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function MemoryGameScreen() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadVocabularyCards() {
      try {
        // Fetch vocabulary words from Supabase
        const vocabularyWords = await getVocabularyWords();
        const first10Words = vocabularyWords.slice(0, 10);

        // Create card pairs from vocabulary words
        const cardPairs = first10Words.flatMap(word => {
          const pairId = word.id;
          return [
            {
              id: `${pairId}-english`,
              word: word.english_name,
              language: 'english',
              pairId,
              isFlipped: false,
              isMatched: false
            },
            {
              id: `${pairId}-cham`,
              word: word.cham_name,
              language: 'cham',
              pairId,
              isFlipped: false,
              isMatched: false
            }
          ];
        });

        // Shuffle the cards
        const shuffledCards = shuffleArray([...cardPairs]);
        setCards(shuffledCards);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading vocabulary cards:', err);
        setError('Failed to load vocabulary cards');
        setIsLoading(false);
      }
    }

    loadVocabularyCards();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading cards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Memory Game Screen — {cards.length} cards loaded
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
}); 