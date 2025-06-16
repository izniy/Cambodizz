import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";

const QuizQuestion = ({ question, onCorrectAnswer }) => {
  const [userInput, setUserInput] = useState("");
  const [sound, setSound] = useState();

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: question.audioUrl,
      });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleSubmit = () => {
    if (userInput.toLowerCase() === question.englishName.toLowerCase()) {
      Keyboard.dismiss();
      onCorrectAnswer();
      setUserInput("");
    } else {
      // You might want to add some feedback for incorrect answers
      alert("Try again!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Image
            source={{ uri: question.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onLoadStart={() => console.log("Loading started")}
            onLoad={() => console.log("Image loaded successfully")}
            onError={(error) =>
              console.log("Error loading image:", error.nativeEvent.error)
            }
          />

          <TouchableOpacity style={styles.audioButton} onPress={playSound}>
            <Text style={styles.audioButtonText}>🔊 Play Audio</Text>
          </TouchableOpacity>

          <Text style={styles.englishWord}>{question.englishName}</Text>
          <Text style={styles.chamWord}>{question.chamName}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type the word..."
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  audioButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  audioButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  englishWord: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chamWord: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, // Add margin at the bottom
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: "#fff", // Ensure input has a background
  },
  submitButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default QuizQuestion;
