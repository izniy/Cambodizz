import { supabase } from "../config/supabase";

// Function to upload audio file to Supabase Storage
export const uploadAudioFile = async (filePath, fileName) => {
  try {
    // Read the file as a blob
    const response = await fetch(filePath);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("quiz-audio")
      .upload(fileName, blob, {
        contentType: "audio/mpeg", // Adjust based on your audio format
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("quiz-audio")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAudioFile:", error);
    throw error;
  }
};

// Function to get audio URL from Supabase Storage
export const getAudioUrl = (fileName) => {
  const { data } = supabase.storage.from("quiz-audio").getPublicUrl(fileName);

  return data.publicUrl;
};

// Function to list all audio files in storage
export const listAudioFiles = async () => {
  try {
    const { data, error } = await supabase.storage.from("quiz-audio").list();

    if (error) {
      console.error("Error listing audio files:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in listAudioFiles:", error);
    throw error;
  }
};
