export const quizQuestions = [
  {
    id: 1,
    imageUrl:
      "https://static.vecteezy.com/system/resources/thumbnails/016/940/260/small/apple-fruit-isolated-on-white-background-photo.jpg",
    englishName: "apple",
    chamName: "ផ្លែប៉ោម",
    audioUrl: "https://example.com/audio/apple.mp3",
    categoryName: "fruits",
    passed: false,
  },
  {
    id: 2,
    imageUrl:
      "https://media.istockphoto.com/id/1154935375/photo/peeled-banana-on-white-background-photo-with-clipping-path.jpg?s=612x612&w=0&k=20&c=1k2Vczv77F2k6FhlFwL1xrtvQ1lq6_1aaO8Eo4rHKQ8=",
    englishName: "banana",
    chamName: "ចេក",
    audioUrl: "https://example.com/audio/banana.mp3",
    categoryName: "fruits",
    passed: false,
  },
  {
    id: 3,
    imageUrl: "https://example.com/images/car.jpg",
    englishName: "car",
    chamName: "ឡាន",
    audioUrl: "https://example.com/audio/car.mp3",
    categoryName: "vehicles",
    passed: false,
  },
  {
    id: 4,
    imageUrl: "https://example.com/images/dog.jpg",
    englishName: "dog",
    chamName: "ឆ្កែ",
    audioUrl: "https://example.com/audio/dog.mp3",
    categoryName: "animals",
    passed: false,
  },
  {
    id: 5,
    imageUrl: "https://example.com/images/elephant.jpg",
    englishName: "elephant",
    chamName: "ដំរី",
    audioUrl: "https://example.com/audio/elephant.mp3",
    categoryName: "animals",
    passed: false,
  },
  {
    id: 6,
    imageUrl: "https://example.com/images/fish.jpg",
    englishName: "fish",
    chamName: "ត្រី",
    audioUrl: "https://example.com/audio/fish.mp3",
    categoryName: "animals",
    passed: false,
  },
  {
    id: 7,
    imageUrl: "https://example.com/images/giraffe.jpg",
    englishName: "giraffe",
    chamName: "រមាស",
    audioUrl: "https://example.com/audio/giraffe.mp3",
    categoryName: "animals",
    passed: false,
  },
  {
    id: 8,
    imageUrl: "https://example.com/images/house.jpg",
    englishName: "house",
    chamName: "ផ្ទះ",
    audioUrl: "https://example.com/audio/house.mp3",
    categoryName: "buildings",
    passed: false,
  },
  {
    id: 9,
    imageUrl: "https://example.com/images/ice.jpg",
    englishName: "ice",
    chamName: "ទឹកកក",
    audioUrl: "https://example.com/audio/ice.mp3",
    categoryName: "weather",
    passed: false,
  },
  {
    id: 10,
    imageUrl: "https://example.com/images/juice.jpg",
    englishName: "juice",
    chamName: "ទឹកផ្លែឈើ",
    audioUrl: "https://example.com/audio/juice.mp3",
    categoryName: "drinks",
    passed: false,
  },
];

// Get unique categories
export const categories = [
  ...new Set(quizQuestions.map((q) => q.categoryName)),
];

// Get questions by category
export const getQuestionsByCategory = (category) => {
  return quizQuestions.filter((q) => q.categoryName === category).slice(0, 10); // Limit to 10 questions
};
