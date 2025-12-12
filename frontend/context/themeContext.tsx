// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
// import { useColorScheme } from "react-native";

export type ThemeType = "light" | "dark";

export const Colors = {
  dark: {
    background: "#0D1B2A", // Deep Premium Black / Blue
    card: "#1B263B",       // Rich Dark Grey / Blue
    text: "#FFFFFF",
    subText: "#8D99AE",
    primary: "#FFD400",    // Metallic Gold
    secondary: "#FFD700",  // Bright Gold
    border: "rgba(255, 255, 255, 0.1)",
    error: "#FF3B30",      // Neon Red
    success: "#39FF14",    // Neon Green
    info: "#00D4FF",       // Neon Cyan
    inputBg: "#2C2C2C",
    tabBar: "#121212",
    accessibleSlot: "#3B82F6",
    evSlot: "#E0FF22",
    headerIconBg: "#1B263B"
  },
  light: {
    background: "#F2F2F7", // iOS System Grey
    card: "#FFFFFF",
    text: "#000000",
    subText: "#8E8E93",
    primary: "#FFD400",    // Keep Gold Accent
    secondary: "#FFCC00",
    border: "rgba(0, 0, 0, 0.1)",
    error: "#FF3B30",
    success: "#34C759",
    info: "#007AFF",
    inputBg: "#E5E5EA",
    tabBar: "#F9F9F9",
    accessibleSlot: "#007AFF",
    evSlot: "#A4C639",
    headerIconBg: "#E5E5EA"
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
  const [theme, setTheme] = useState<ThemeType>("dark");
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
