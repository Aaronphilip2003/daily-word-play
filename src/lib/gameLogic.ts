export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  solution: string;
}

export interface LetterState {
  letter: string;
  status: LetterStatus;
}

export const checkGuess = (guess: string, solution: string): LetterState[] => {
  const result: LetterState[] = [];
  const solutionLetters = solution.split('');
  const guessLetters = guess.split('');

  // First pass: mark correct letters
  const remainingSolution = [...solutionLetters];
  guessLetters.forEach((letter, i) => {
    if (letter === solutionLetters[i]) {
      result[i] = { letter, status: 'correct' };
      remainingSolution[i] = '';
    }
  });

  // Second pass: mark present and absent letters
  guessLetters.forEach((letter, i) => {
    if (result[i]) return; // Already marked as correct
    
    const index = remainingSolution.indexOf(letter);
    if (index !== -1) {
      result[i] = { letter, status: 'present' };
      remainingSolution[index] = '';
    } else {
      result[i] = { letter, status: 'absent' };
    }
  });

  return result;
};

export const getKeyboardLetterStatus = (
  guesses: string[],
  solution: string
): Map<string, LetterStatus> => {
  const statusMap = new Map<string, LetterStatus>();

  guesses.forEach(guess => {
    const letterStates = checkGuess(guess, solution);
    letterStates.forEach(({ letter, status }) => {
      const currentStatus = statusMap.get(letter);
      // Prioritize: correct > present > absent
      if (status === 'correct') {
        statusMap.set(letter, 'correct');
      } else if (status === 'present' && currentStatus !== 'correct') {
        statusMap.set(letter, 'present');
      } else if (!currentStatus) {
        statusMap.set(letter, status);
      }
    });
  });

  return statusMap;
};
