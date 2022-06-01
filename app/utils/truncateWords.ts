export const truncateWords = (words: string, num: number): string => {
  if (words.length <= num) return words;

  return words.slice(0, num) + "...";
};
