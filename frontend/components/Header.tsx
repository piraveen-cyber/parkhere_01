import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";

interface HeaderProps {
    title: string;
    onBack: () => void;
}

export default function Header({ title, onBack }: HeaderProps) {
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <TouchableOpacity
                onPress={onBack}
                style={{
                    padding: 8,
                    marginRight: 15,
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border
                }}
            >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>{title}</Text>
        </View>
    );
}
