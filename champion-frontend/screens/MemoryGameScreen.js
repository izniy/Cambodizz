import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated, TouchableOpacity } from 'react-native';
import { getVocabularyWords } from '../lib/getVocabularyWords';
import MemoryCard from '../components/MemoryCard';
import ConfettiCannon from 'react-native-confetti-cannon';

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
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const confettiRef = useRef(null);

  // Calculate progress for the progress bar
  const progress = matchedPairs / 10; // 10 total pairs

  const resetGame = async () => {
    setShowCelebration(false);
    setMatchedPairs(0);
    setFlippedCards([]);
    setIsCheckingMatch(false);
    
    // Fetch and shuffle new cards
    try {
      const vocabularyWords = await getVocabularyWords();
      const first10Words = vocabularyWords.slice(0, 10);
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
      const shuffledCards = shuffleArray([...cardPairs]);
      setCards(shuffledCards);
    } catch (err) {
      console.error('Error resetting game:', err);
      setError('Failed to reset game');
    }
  };

  useEffect(() => {
    async function loadVocabularyCards() {
      try {
        const vocabularyWords = await getVocabularyWords();
        const first10Words = vocabularyWords.slice(0, 10);

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

  // Update matched pairs count and check for game completion
  const updateMatchedPairs = (updatedCards) => {
    const uniqueMatchedPairs = new Set(
      updatedCards
        .filter(card => card.isMatched)
        .map(card => card.pairId)
    ).size;
    
    setMatchedPairs(uniqueMatchedPairs);

    // Check for game completion
    if (uniqueMatchedPairs === 10) {
      setTimeout(() => {
        setShowCelebration(true);
        confettiRef.current?.start();
      }, 500);
    }
  };

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
        setCards(prevCards => {
          const updatedCards = prevCards.map(card =>
            card.pairId === firstCard.pairId ? { ...card, isMatched: true } : card
          );
          updateMatchedPairs(updatedCards);
          return updatedCards;
        });
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
      {/* Progress Tracker */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {matchedPairs}/10 matches
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

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

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{x: -10, y: 0}}
        autoStart={false}
        fadeOut={true}
      />

      {showCelebration && (
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContent}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationEmoji}>🌟</Text>
            <Text style={styles.celebrationEmoji}>🎈</Text>
            <TouchableOpacity
              style={styles.replayButton}
              onPress={resetGame}
            >
              <Text style={styles.replayIcon}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  progressContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Chalkboard SE',
      android: 'Comic Sans MS',
      default: 'System'
    }),
    color: '#2D3748',
  },
  progressBarContainer: {
    width: '80%',
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4FD1C5',
    borderRadius: 6,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  celebrationContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationEmoji: {
    fontSize: 64,
    marginVertical: 10,
  },
  replayButton: {
    marginTop: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4FD1C5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  replayIcon: {
    fontSize: 40,
  },
}); 