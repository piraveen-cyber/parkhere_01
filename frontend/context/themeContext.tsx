// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

export type ThemeType = "light" | "dark";

export const Colors = {
  dark: {
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    subText: "#B0B0B0",
    primary: "#FFD700", // Gold
    secondary: "#C0C0C0", // Silver
    border: "#333333",
    error: "#CF6679",
    inputBg: "#2C2C2C"
  },
  light: {
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "#121212",
    subText: "#666666",
    primary: "#FFD700", // Gold (keeping branding consistent)
    secondary: "#A0A0A0",
    border: "#E0E0E0",
    error: "#B00020",
    inputBg: "#FFFFFF"
  }
};

type ThemeContextType = {
  theme: ThemeType;
  colors: typeof Colors.dark;
  setTheme: (t: ThemeType) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: any) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("dark"); // Default to dark for premium feel

  useEffect(() => {
    if (systemScheme) {
      setTheme(systemScheme);
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = Colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)!;
