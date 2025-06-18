import React, { useState, useEffect } from "react";
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
  Modal,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { getAudioFile, hasAudio } from "../config/audioConfig";

const QuizQuestion = ({ question, onCorrectAnswer }) => {
  const [userInput, setUserInput] = useState("");
  const [sound, setSound] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInput, setModalInput] = useState("");

  // Set up audio session when component mounts
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log("Audio session set up successfully");
      } catch (error) {
        console.error("Error setting up audio session:", error);
      }
    };

    setupAudio();

    // Cleanup function to unload sound when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      let audioSource;
      console.log("Question audio URL:", question.audioUrl);

      // Check if it's a local audio file (no http/https)
      if (!question.audioUrl.startsWith("http")) {
        try {
          // Get the audio file from the config
          const audioFile = getAudioFile(question.englishName);

          if (audioFile) {
            audioSource = audioFile;
            console.log("Local audio source loaded successfully:", audioSource);
          } else {
            throw new Error(
              `Audio file not found for "${question.englishName}"`
            );
          }
        } catch (error) {
          console.error("Local audio file not found:", error);
          alert(
            `Audio file not found for "${question.englishName}". Please add the file: ${question.englishName}_audio.mp3`
          );
          return;
        }
      } else {
        // For remote URLs
        audioSource = { uri: question.audioUrl };
      }

      console.log("Audio source:", audioSource);

      // Create the sound object
      const { sound } = await Audio.Sound.createAsync(audioSource);
      console.log("Sound object created:", sound);

      setSound(sound);

      // Get the status before playing
      const status = await sound.getStatusAsync();
      console.log("Sound status before playing:", status);

      // Play the sound
      await sound.playAsync();
      console.log("Play command sent");

      // Get the status after playing
      const statusAfter = await sound.getStatusAsync();
      console.log("Sound status after playing:", statusAfter);

      console.log("Audio played successfully");
    } catch (error) {
      console.error("Error playing sound:", error);
      alert("Error playing audio: " + error.message);
    }
  };

  const handleSubmit = () => {
    console.log("User input:", `"${userInput}"`);
    console.log("Expected answer:", `"${question.englishName}"`);
    console.log("User input length:", userInput.length);
    console.log("Expected answer length:", question.englishName.length);

    // Trim whitespace and convert to lowercase
    const cleanUserInput = userInput.trim().toLowerCase();
    const cleanExpectedAnswer = question.englishName.trim().toLowerCase();

    console.log("Clean user input:", `"${cleanUserInput}"`);
    console.log("Clean expected answer:", `"${cleanExpectedAnswer}"`);
    console.log("Are they equal?", cleanUserInput === cleanExpectedAnswer);

    if (cleanUserInput === cleanExpectedAnswer) {
      Keyboard.dismiss();
      onCorrectAnswer();
      setUserInput("");
    } else {
      // You might want to add some feedback for incorrect answers
      alert("Try again!");
    }
  };

  const openModal = () => {
    setModalInput("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalInput("");
  };

  const submitModalAnswer = () => {
    if (modalInput.trim()) {
      console.log("Modal user input:", `"${modalInput}"`);
      console.log("Expected answer:", `"${question.englishName}"`);
      console.log("Modal user input length:", modalInput.length);
      console.log("Expected answer length:", question.englishName.length);

      // Trim whitespace and convert to lowercase
      const cleanUserInput = modalInput.trim().toLowerCase();
      const cleanExpectedAnswer = question.englishName.trim().toLowerCase();

      console.log("Clean modal user input:", `"${cleanUserInput}"`);
      console.log("Clean expected answer:", `"${cleanExpectedAnswer}"`);
      console.log("Are they equal?", cleanUserInput === cleanExpectedAnswer);

      if (cleanUserInput === cleanExpectedAnswer) {
        closeModal();
        onCorrectAnswer();
      } else {
        // Show error but keep modal open for retry
        Alert.alert(
          "Try again!",
          "That's not the correct answer. Please try again."
        );
        setModalInput(""); // Clear the input for retry
      }
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
            <Text style={styles.audioButtonText}>🔊🔊🔊 Play Audio</Text>
          </TouchableOpacity>

          <Text style={styles.englishWord}>{question.englishName}</Text>
          <Text style={styles.chamWord}>{question.chamName}</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.inputButton} onPress={openModal}>
              <Text style={styles.inputButtonText}>
                {userInput ? userInput : "Tap to type your answer..."}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal for typing answer */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{question.englishName}</Text>
              <Text style={styles.modalSubtitle}>
                Type your answer / វាយបញ្ចូលចម្លើយរបស់អ្នក
              </Text>

              <TextInput
                style={styles.modalInput}
                value={modalInput}
                onChangeText={setModalInput}
                placeholder="Type here..."
                autoCapitalize="none"
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={submitModalAnswer}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={submitModalAnswer}
                >
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20, // Add margin at the bottom
  },
  inputButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff", // Ensure input has a background
    justifyContent: "center",
    alignItems: "center",
  },
  inputButtonText: {
    color: "#666",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    color: "#666",
  },
  modalInput: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
    fontSize: 18,
    textAlign: "center",
  },
  modalButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  modalCancelButton: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSubmitButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  modalSubmitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default QuizQuestion;
