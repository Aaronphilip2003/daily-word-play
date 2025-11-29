import { LetterStatus } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: Map<string, LetterStatus>;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

const Keyboard = ({ onKeyPress, letterStatuses }: KeyboardProps) => {
  const getKeyClass = (key: string) => {
    const status = letterStatuses.get(key);
    const baseClass = "font-bold rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center";
    
    const sizeClass = key === 'ENTER' || key === 'BACKSPACE'
      ? "px-3 sm:px-4 py-4 text-xs sm:text-sm"
      : "w-8 h-12 sm:w-10 sm:h-14 text-sm sm:text-base";

    const statusClasses = {
      correct: "bg-correct text-correct-foreground hover:opacity-90",
      present: "bg-present text-present-foreground hover:opacity-90",
      absent: "bg-absent text-absent-foreground hover:opacity-90",
      empty: "bg-muted text-foreground hover:bg-muted/80",
    };

    return cn(
      baseClass,
      sizeClass,
      statusClasses[status || 'empty']
    );
  };

  return (
    <div className="w-full max-w-lg space-y-1.5 sm:space-y-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={getKeyClass(key)}
            >
              {key === 'BACKSPACE' ? (
                <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
