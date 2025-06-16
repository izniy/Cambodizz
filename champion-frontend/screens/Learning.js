import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import { categories } from "../data/categoryData";

const CategoryButton = ({ category, onPress }) => {
  const [sound, setSound] = useState();

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: category.audioUrl,
      });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <View style={styles.categoryButtonContainer}>
      <TouchableOpacity style={styles.audioButton} onPress={playSound}>
        <Text style={styles.audioButtonText}>🔊</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => onPress(category.id)}
      >
        <Text style={styles.categoryButtonText}>{category.englishName}</Text>
        <Text style={styles.chamNameText}>{category.chamName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Learning = ({ navigation }) => {
  const handleCategoryPress = (categoryId) => {
    navigation.navigate("Quiz", { category: categoryId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  categoryButtonContainer: {
    position: "relative",
    minWidth: 150,
  },
  audioButton: {
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  audioButtonText: {
    fontSize: 16,
  },
  categoryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 150,
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
  categoryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  chamNameText: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
  },
});

export default Learning;
