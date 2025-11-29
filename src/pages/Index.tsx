import { useState, useEffect, useCallback } from "react";
import { BarChart3, HelpCircle, Play } from "lucide-react";
import GameGrid from "@/components/game/GameGrid";
import Keyboard from "@/components/game/Keyboard";
import StatsDialog from "@/components/game/StatsDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRandomWord, isValidWord } from "@/lib/wordList";
import { checkGuess, getKeyboardLetterStatus, LetterStatus } from "@/lib/gameLogic";
import { getStats, updateStats, GameStats } from "@/lib/stats";
import { toast } from "sonner";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

const Index = () => {
  const [solution, setSolution] = useState(getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [evaluations, setEvaluations] = useState<Map<number, { letter: string; status: LetterStatus }[]>>(new Map());
  const [letterStatuses, setLetterStatuses] = useState<Map<string, LetterStatus>>(new Map());
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState<GameStats>(getStats());
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Update keyboard letter statuses whenever guesses change
  useEffect(() => {
    setLetterStatuses(getKeyboardLetterStatus(guesses, solution));
  }, [guesses, solution]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        toast.error("Not enough letters");
        return;
      }

      if (!isValidWord(currentGuess)) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        toast.error("Not in word list");
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      const evaluation = checkGuess(currentGuess, solution);
      setEvaluations(new Map(evaluations).set(guesses.length, evaluation));

      if (currentGuess === solution) {
        setGameStatus('won');
        const newStats = updateStats(true, newGuesses.length);
        setStats(newStats);
        setTimeout(() => setShowStats(true), 1500);
        toast.success("Congratulations! 🎉");
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
        const newStats = updateStats(false, newGuesses.length);
        setStats(newStats);
        setTimeout(() => setShowStats(true), 1500);
        toast.error(`The word was ${solution}`);
      }

      setCurrentGuess("");
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  }, [currentGuess, guesses, solution, gameStatus, evaluations]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const startNewGame = () => {
    setSolution(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus('playing');
    setEvaluations(new Map());
    setLetterStatuses(new Map());
    setShowStats(false);
    setStats(getStats());
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-bg)' }}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Wordle Unlimited
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStats(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-between gap-8">
        <div className="flex-1 flex items-center">
          <GameGrid
            guesses={guesses}
            currentGuess={currentGuess}
            evaluations={evaluations}
            maxGuesses={MAX_GUESSES}
            shake={shake}
          />
        </div>

        {gameStatus !== 'playing' && (
          <Button
            onClick={startNewGame}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Play className="w-4 h-4" />
            New Game
          </Button>
        )}

        <Keyboard
          onKeyPress={handleKeyPress}
          letterStatuses={letterStatuses}
        />
      </main>

      {/* Stats Dialog */}
      <StatsDialog
        open={showStats}
        onOpenChange={setShowStats}
        stats={stats}
        onNewGame={startNewGame}
        gameWon={gameStatus === 'won'}
        gameLost={gameStatus === 'lost'}
      />

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">How to Play</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Guess the word in 6 tries. After each guess, the color of the tiles will change to show how close your guess was.
            </p>
            
            <div className="space-y-3">
              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 bg-correct text-correct-foreground flex items-center justify-center font-bold rounded">
                    W
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    O
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    R
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    D
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    S
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">W</span> is in the word and in the correct spot
                </p>
              </div>

              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    P
                  </div>
                  <div className="w-10 h-10 bg-present text-present-foreground flex items-center justify-center font-bold rounded">
                    L
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    A
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    N
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    T
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">L</span> is in the word but in the wrong spot
                </p>
              </div>

              <div>
                <div className="flex gap-1 mb-2">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    V
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    A
                  </div>
                  <div className="w-10 h-10 bg-absent text-absent-foreground flex items-center justify-center font-bold rounded">
                    G
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    U
                  </div>
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-bold rounded">
                    E
                  </div>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">G</span> is not in the word
                </p>
              </div>
            </div>

            <p className="text-accent font-semibold">
              Play as many times as you want - no daily limit!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
