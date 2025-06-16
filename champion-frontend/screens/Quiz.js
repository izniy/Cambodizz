import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
} from "react-native";
import QuizQuestion from "../components/QuizQuestion";
import { getQuestionsByCategory } from "../data/quizData";

const ProgressBar = ({ progress }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

const Quiz = ({ route, navigation }) => {
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Get questions for the selected category
    const categoryQuestions = getQuestionsByCategory(category);
    setQuestions(categoryQuestions);
  }, [category]);

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  const handleCorrectAnswer = () => {
    // Mark current question as passed
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      passed: true,
    };
    setQuestions(updatedQuestions);

    setScore(score + 1);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      const passedCount = updatedQuestions.filter((q) => q.passed).length;
      alert(
        `Congratulations! You've completed the ${category} quiz with a score of ${passedCount}/${questions.length}`
      );
      navigation.goBack();
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <ProgressBar progress={progress} />
          <Text style={styles.category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <Text style={styles.progress}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <QuizQuestion
          question={questions[currentQuestionIndex]}
          onCorrectAnswer={handleCorrectAnswer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#34C759",
    borderRadius: 4,
  },
  category: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  progress: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default Quiz;
