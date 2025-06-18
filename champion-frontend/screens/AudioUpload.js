import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { uploadAudioFile, listAudioFiles } from "../utils/audioUpload";

const AudioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      await uploadFile(file);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick audio file");
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fileName = file.name;
      const publicUrl = await uploadAudioFile(file.uri, fileName);

      Alert.alert(
        "Success",
        `Audio uploaded successfully!\nURL: ${publicUrl}`,
        [
          { text: "Copy URL", onPress: () => console.log("URL:", publicUrl) },
          { text: "OK" },
        ]
      );

      // Refresh the list
      loadAudioFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Failed to upload audio file");
    } finally {
      setUploading(false);
    }
  };

  const loadAudioFiles = async () => {
    try {
      const files = await listAudioFiles();
      setAudioFiles(files);
    } catch (error) {
      console.error("Error loading audio files:", error);
    }
  };

  React.useEffect(() => {
    loadAudioFiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Upload</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickAudioFile}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? "Uploading..." : "Pick Audio File"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Uploaded Files:</Text>
      <ScrollView style={styles.fileList}>
        {audioFiles.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.fileSize}>
              {(file.metadata?.size / 1024).toFixed(2)} KB
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default AudioUpload;
