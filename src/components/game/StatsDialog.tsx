import { GameStats } from "@/lib/stats";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: GameStats;
  onNewGame: () => void;
  gameWon: boolean;
  gameLost: boolean;
}

const StatsDialog = ({ 
  open, 
  onOpenChange, 
  stats, 
  onNewGame,
  gameWon,
  gameLost 
}: StatsDialogProps) => {
  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {gameWon && "🎉 You Won!"}
            {gameLost && "Game Over"}
            {!gameWon && !gameLost && "Statistics"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.gamesPlayed}</div>
              <div className="text-xs text-muted-foreground">Played</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{winRate}</div>
              <div className="text-xs text-muted-foreground">Win %</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{stats.maxStreak}</div>
              <div className="text-xs text-muted-foreground">Max</div>
            </div>
          </div>

          {/* Guess Distribution */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Guess Distribution</h3>
            <div className="space-y-1">
              {stats.guessDistribution.map((count, index) => {
                const percentage = maxDistribution > 0 
                  ? (count / maxDistribution) * 100 
                  : 0;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 text-xs text-muted-foreground font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 h-6 relative bg-muted rounded">
                      <div
                        className="absolute inset-y-0 left-0 bg-correct rounded flex items-center justify-end pr-2 min-w-[2rem]"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      >
                        <span className="text-xs font-bold text-correct-foreground">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Game Button */}
          <Button 
            onClick={onNewGame}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog;
