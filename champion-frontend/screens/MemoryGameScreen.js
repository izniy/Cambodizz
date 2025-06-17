import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { getVocabularyWords } from '../lib/getVocabularyWords';
import MemoryCard from '../components/MemoryCard';

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
  const [flippedCards, setFlippedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);

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

  const handleCardPress = (pressedCard) => {
    // Ignore if card is already flipped, matched, or we're checking a match
    if (pressedCard.isFlipped || pressedCard.isMatched || isCheckingMatch) {
      return;
    }

    // Ignore if already have 2 cards flipped
    if (flippedCards.length >= 2) {
      return;
    }

    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === pressedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    const newFlippedCards = [...flippedCards, pressedCard];
    setFlippedCards(newFlippedCards);

    // Check for match if we now have 2 cards flipped
    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      
      // Check if cards match (same pairId but different languages)
      const isMatch = firstCard.pairId === secondCard.pairId && 
                     firstCard.language !== secondCard.language;

      if (isMatch) {
        // Mark both cards as matched
        setCards(prevCards =>
          prevCards.map(card =>
            card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
          )
        );
        setFlippedCards([]); // Reset flipped cards
      } else {
        // Cards don't match - flip them back after delay
        setIsCheckingMatch(true); // Prevent new cards from being flipped
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]); // Reset flipped cards
          setIsCheckingMatch(false); // Re-enable card flipping
        }, 800);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading cards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {cards.map(card => (
            <MemoryCard
              key={card.id}
              word={card.word}
              language={card.language}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5FE', // Light sky blue background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    gap: 6
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Chalkboard SE',
      android: 'Comic Sans MS',
      default: 'System'
    }),
    color: '#2D3748',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E53E3E',
    marginTop: 20,
  },
}); 