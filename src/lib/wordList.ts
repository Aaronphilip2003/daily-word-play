import axios from 'axios';

export const getRandomWord = async (): Promise<string> => {
  try {
    const response = await axios.get('http://0.0.0.0:8000/get-word');
    console.log('Fetched word from backend:', response.data.word);
    return response.data.word.toUpperCase();
  } catch (error) {
    console.error('Error fetching word from backend:', error);
    throw new Error('Failed to fetch word');
  }
};

export const isValidWord = (word: string): boolean => {
  console.warn('isValidWord function is deprecated and may not work with backend integration.');
  return false; // Placeholder as validation logic may need backend support
};
