import React from "react";

const SpeedDialContext = React.createContext<{
  open: boolean | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
} | null>(null);

export default SpeedDialContext;

export function useSpeedDialContext() {
  const context = React.useContext(SpeedDialContext);
  if (!context) {
    throw new Error(
      `useSpeedDialContext Context must be used within a SpeedDialContext Provider`,
    );
  }
  return context;
}
