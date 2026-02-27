import React from "react";
import { ArrowLeft, Menu } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  onBack?: () => void;
  onMenu?: () => void;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  showMenu = true,
  onBack,
  onMenu,
  className = "",
}) => {
  return (
    <header
      className={`sticky top-0 z-40 bg-neome-bg/90 backdrop-blur-lg px-4 py-3 ${className}`}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="w-10">
          {showBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 rounded-xl text-neome-primary hover:bg-neome-peach/30 transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
          )}
        </div>

        <div className="flex-1 text-center">
          {title ? (
            <h1 className="font-lufga font-semibold text-lg text-neome-primary">
              {title}
            </h1>
          ) : (
            <span className="font-lufga font-bold text-xl tracking-tight text-neome-primary">
              NeoMe
            </span>
          )}
        </div>

        <div className="w-10 flex justify-end">
          {showMenu && (
            <button
              onClick={onMenu}
              className="p-1 -mr-1 rounded-xl text-neome-primary hover:bg-neome-peach/30 transition-colors"
            >
              <Menu size={22} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
