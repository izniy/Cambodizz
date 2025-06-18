// Audio file configuration - add new audio files here
export const audioFiles = {
  apple: require("../assets/audio/apple_audio.mp3"),
  banana: require("../assets/audio/banana_audio.mp3"),
  // car: require("../assets/audio/car_audio.mp3"),
  // dog: require("../assets/audio/dog_audio.mp3"),
  // elephant: require("../assets/audio/elephant_audio.mp3"),
  // fish: require("../assets/audio/fish_audio.mp3"),
  // giraffe: require("../assets/audio/giraffe_audio.mp3"),
  // house: require("../assets/audio/house_audio.mp3"),
  // ice: require("../assets/audio/ice_audio.mp3"),
  // juice: require("../assets/audio/juice_audio.mp3"),
};

// Helper function to get audio file
export const getAudioFile = (englishName) => {
  return audioFiles[englishName] || null;
};

// Helper function to check if audio exists
export const hasAudio = (englishName) => {
  return englishName in audioFiles;
};
