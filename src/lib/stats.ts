export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // Index represents number of guesses (1-6)
  lastPlayedDate: string | null;
}

const STATS_KEY = 'wordle-stats';

export const getStats = (): GameStats => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastPlayedDate: null,
  };
};

export const updateStats = (won: boolean, guessCount: number): GameStats => {
  const stats = getStats();
  const today = new Date().toDateString();

  stats.gamesPlayed += 1;
  
  if (won) {
    stats.gamesWon += 1;
    stats.guessDistribution[guessCount - 1] += 1;
    
    // Update streak
    if (stats.lastPlayedDate === today) {
      // Already played today, don't update streak
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (stats.lastPlayedDate === yesterday || stats.lastPlayedDate === null) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    }
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
};

export const resetStats = (): void => {
  localStorage.removeItem(STATS_KEY);
};
