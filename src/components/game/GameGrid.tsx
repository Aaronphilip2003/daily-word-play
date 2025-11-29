import { LetterStatus } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";

interface GameGridProps {
  guesses: string[];
  currentGuess: string;
  evaluations: Map<number, { letter: string; status: LetterStatus }[]>;
  maxGuesses?: number;
  shake?: boolean;
}

const GameGrid = ({ 
  guesses, 
  currentGuess, 
  evaluations,
  maxGuesses = 6,
  shake = false
}: GameGridProps) => {
  const empties = maxGuesses - guesses.length - (currentGuess ? 1 : 0);

  const getTileClass = (status: LetterStatus, delay: number = 0) => {
    const baseClass = "w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold rounded-lg transition-all duration-300";
    
    const statusClasses = {
      correct: "bg-correct text-correct-foreground border-correct",
      present: "bg-present text-present-foreground border-present",
      absent: "bg-absent text-absent-foreground border-absent",
      empty: "bg-tile-empty border-tile-border",
    };

    return cn(
      baseClass,
      statusClasses[status],
      status !== 'empty' && "animate-flip-in"
    );
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {/* Previous guesses */}
      {guesses.map((guess, rowIndex) => {
        const evaluation = evaluations.get(rowIndex) || [];
        return (
          <div key={rowIndex} className="flex gap-1.5 sm:gap-2">
            {guess.split('').map((letter, colIndex) => {
              const letterState = evaluation[colIndex];
              return (
                <div
                  key={colIndex}
                  className={getTileClass(letterState?.status || 'empty', colIndex * 100)}
                  style={{ animationDelay: `${colIndex * 100}ms` }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Current guess */}
      {currentGuess && (
        <div className={cn("flex gap-1.5 sm:gap-2", shake && "animate-shake")}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                getTileClass('empty'),
                currentGuess[i] && "border-foreground animate-pop"
              )}
            >
              {currentGuess[i] || ''}
            </div>
          ))}
        </div>
      )}

      {/* Empty rows */}
      {Array.from({ length: empties }).map((_, rowIndex) => (
        <div key={`empty-${rowIndex}`} className="flex gap-1.5 sm:gap-2">
          {Array.from({ length: 5 }).map((_, colIndex) => (
            <div key={colIndex} className={getTileClass('empty')} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
