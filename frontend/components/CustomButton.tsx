import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    Platform,
} from "react-native";
import { useTheme } from "../context/themeContext";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: "filled" | "outlined" | "ghost";
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function CustomButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = "filled",
    style,
    textStyle,
}: CustomButtonProps) {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.card; // Disabled state
        if (variant === "filled") return colors.primary;
        return "transparent";
    };

    const getTextColor = () => {
        if (disabled) return colors.subText;
        if (variant === "filled") return "#000000"; // Primary button text usually black on gold
        return colors.primary;
    };

    const getBorderColor = () => {
        if (variant === "outlined") return colors.primary;
        return "transparent";
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === "outlined" ? 2 : 0,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === "filled" ? "#000" : colors.primary} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        { color: getTextColor() },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    text: {
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});
