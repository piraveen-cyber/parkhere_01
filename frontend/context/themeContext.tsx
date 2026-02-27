// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
// import { useColorScheme } from "react-native";

export type ThemeType = "light" | "dark";

export const Colors = {
  dark: {
    primary: '#f7af05', // Gold/Orange
    background: '#000000', // Pure Black
    text: '#FFFFFF',
    subText: '#B3B3B3',
    card: '#141414', // Netflix Card/Tile Gray
    border: '#333333',
    error: '#B9090B',
    success: '#46D369',
    info: "#00D4FF",
    inputBg: "#2C2C2C",
    tabBar: "#121212",
    accessibleSlot: "#3B82F6",
    evSlot: "#E0FF22",
    headerIconBg: "#1B263B",
    secondary: '#B9090B' // Darker Red for secondary
  },
  light: {
    primary: '#39FF14', // Neon Green
    background: '#FFFFFF',
    text: '#000000',
    subText: '#555555',
    card: '#FAFAFA',
    border: '#E0E0E0',
    error: '#B9090B',
    success: '#39FF14',
    // Keeping existing keys not explicitly replaced in the snippet
    info: "#007AFF",
    inputBg: "#F5F5F5",
    tabBar: "#FFFFFF",
    accessibleSlot: "#007AFF",
    evSlot: "#A4C639",
    headerIconBg: "#F0F0F0",
    secondary: "#32CD32", // Lime Green
  },
  // High Contrast Mode
  highContrast: {
    background: "#000000",
    card: "#000000",
    text: "#FFFFFF",
    subText: "#FFFF00",
    primary: "#FFFF00",
    secondary: "#FFFFFF",
    border: "#FFFFFF",
    error: "#FF0000",
    success: "#00FF00",
    info: "#00FFFF",
    inputBg: "#000000",
    tabBar: "#000000",
    accessibleSlot: "#00FFFF",
    evSlot: "#FFFFFF",
    headerIconBg: "#000000"
  }
};

type ThemeContextType = {
  theme: ThemeType;
  colors: any;
  setTheme: (t: ThemeType) => void;
  toggleTheme: () => void;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    voiceGuidance: boolean;
    toggleHighContrast: () => void;
    toggleLargeText: () => void;
    toggleVoice: () => void;
  }
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = highContrast ? Colors.highContrast : Colors[theme];

  const accessibility = {
    highContrast,
    largeText,
    voiceGuidance,
    toggleHighContrast: () => setHighContrast(!highContrast),
    toggleLargeText: () => setLargeText(!largeText),
    toggleVoice: () => setVoiceGuidance(!voiceGuidance),
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme, accessibility }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)!;
