import { Alert, AlertDescription } from "../../ui/alert";
import { Button } from "../../ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import { colors } from "../../../theme/warmDusk";

interface DataSaveWarningProps {
  onUpgrade: () => void;
  className?: string;
  compact?: boolean;
}

export function DataSaveWarning({ onUpgrade, className = "", compact = false }: DataSaveWarningProps) {
  if (compact) {
    return (
      <div 
        className={`px-3 py-2 rounded-xl flex items-center gap-2 ${className}`}
        style={{ 
          backgroundColor: `${colors.accent}10`,
          border: `1px solid ${colors.accent}20`,
        }}
      >
        <AlertTriangle size={14} style={{ color: colors.accent }} />
        <span 
          className="text-xs flex-1"
          style={{ color: colors.textSecondary }}
        >
          Údaje sa neuložia bez predplatného
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onUpgrade}
          className="h-6 px-2 text-xs font-medium hover:bg-transparent"
          style={{ color: colors.accent }}
        >
          Upgradni
        </Button>
      </div>
    );
  }

  return (
    <Alert 
      className={`border-0 shadow-none ${className}`}
      style={{ 
        backgroundColor: `${colors.accent}08`,
        border: `1px solid ${colors.accent}20`,
      }}
    >
      <AlertTriangle 
        className="h-4 w-4" 
        style={{ color: colors.accent }}
      />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span 
            className="font-medium text-sm"
            style={{ color: colors.textPrimary }}
          >
            Tvoje údaje sa neuložia
          </span>
          <p 
            className="text-xs mt-1"
            style={{ color: colors.textSecondary }}
          >
            V bezplatnej verzii sa pokroky a preferencie neukladajú trvale.
          </p>
        </div>
        
        <Button
          size="sm"
          onClick={onUpgrade}
          className="ml-4 font-medium border-0 shadow-sm"
          style={{
            backgroundColor: colors.accent,
            color: 'white',
          }}
        >
          <Crown size={14} className="mr-1" />
          Upgradni
        </Button>
      </AlertDescription>
    </Alert>
  );
}