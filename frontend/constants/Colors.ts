export const Colors = {
    dark: {
        background: '#0F0F0F', // Deep Black
        surface: '#1A1A1A', // Slightly lighter black for cards
        primary: '#D4AF37', // Metallic Gold
        primaryVariant: '#C5A000',
        secondary: '#FFD700', // Bright Gold
        text: '#FFFFFF',
        textSecondary: '#AAAAAA',
        border: '#333333',
        success: '#39FF14', // Neon Green (Available)
        info: '#00FFFF',    // Neon Blue (Reserved)
        error: '#FF0033',   // Neon Red (Occupied)
        cardGradient: ['#1A1A1A', '#0F0F0F'], // Example for LinearGradient if used
    },
    // Keep light mode for fallback or unused
    light: {
        background: '#FFFFFF',
        text: '#000000',
        primary: '#D4AF37',
    }
};

export const Theme = {
    ...Colors.dark, // Default to Dark Mode
};
