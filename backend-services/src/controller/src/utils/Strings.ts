export const capitalizeFirstLetter = (str) => {
  try {
    if (str.charAt(0) === ' ') {
      str = str.slice(1);
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  } catch (error) {
    throw error;
  }
};

export const removeDuplicateString = (array) => {
  const uniqueArray = [];
  const uniqueWords = new Set();

  array.forEach((word) => {
    const lowerCaseWord = word.toLowerCase();
    if (!uniqueWords.has(lowerCaseWord)) {
      uniqueWords.add(lowerCaseWord);
      uniqueArray.push(word);
    }
  });

  return uniqueArray;
};
