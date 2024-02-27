function calculateReadTime(wordCount, averageWordsPerMinute) {

  // Calculate the read time in minutes and round it up
  const readTimeMinutes = Math.ceil(wordCount / averageWordsPerMinute);

  return readTimeMinutes;
}

// Export the function
export { calculateReadTime };
