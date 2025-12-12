import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Animated, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../context/themeContext";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { supabase } from "../../config/supabaseClient";
import api from "../../services/api";

export default function HevyVehicle() {
    const { colors } = useTheme();

    // THEME COLORS (Consistent)
    const bg = colors.background;
    const cardBg = colors.card;
    const accent = colors.primary;
    const textPrimary = colors.text;
    const textSecondary = colors.subText;

    const [selectedService, setSelectedService] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }, []);

    const services = [
        { id: 'heavy_tow', title: 'Heavy Duty Towing', price: '8000', icon: 'tow-truck', lib: MaterialCommunityIcons },
        { id: 'air_brake', title: 'Air Brake Check', price: '4500', icon: 'alert-octagon', lib: Ionicons },
        { id: 'hydraulics', title: 'Hydraulic System', price: '6000', icon: 'oil-level', lib: MaterialCommunityIcons },
        { id: 'tire_heavy', title: 'Heavy Tire Change', price: '3500', icon: 'disc', lib: Ionicons },
    ];

    // ... inside component ...
    const handleRequest = async () => {
        if (!selectedService) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || 'guest_user';

            const selectedItem = services.find(s => s.id === selectedService);

            // Create Service Request in Backend
            await api.post('/services', {
                userId,
                serviceType: selectedService,
                notes: `Requested Heavy Service: ${selectedItem?.title}`,
                price: selectedItem?.price
            });

            router.push('../parking/paymentCard');
        } catch (error) {
            console.error("Failed to request service:", error);
            Alert.alert("Error", "Failed to submit request.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={textPrimary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: textPrimary }]}>Heavy Vehicle Service</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>

                <Animated.Text style={[styles.sectionTitle, { color: accent, opacity: fadeAnim }]}>
                    Heavy Assistance
                </Animated.Text>
                <Text style={{ color: textSecondary, marginBottom: 20 }}>Specialized care for buses, lorries, and trucks.</Text>

                <View style={styles.grid}>
                    {services.map((item) => {
                        const IconLib = item.lib;
                        const isSelected = selectedService === item.id;
                        return (
                            <Pressable
                                key={item.id}
                                style={({ pressed }) => [
                                    styles.card,
                                    {
                                        backgroundColor: isSelected ? "rgba(255, 212, 0, 0.15)" : cardBg,
                                        borderColor: isSelected ? accent : "transparent",
                                        transform: [{ scale: pressed ? 0.98 : 1 }]
                                    }
                                ]}
                                onPress={() => setSelectedService(item.id)}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: isSelected ? accent : "#2A3B55" }]}>
                                    <IconLib name={item.icon as any} size={28} color={isSelected ? "#000" : textSecondary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.serviceTitle, { color: textPrimary }]}>{item.title}</Text>
                                    <Text style={[styles.servicePrice, { color: accent }]}>LKR {item.price}</Text>
                                </View>
                                {isSelected && <Ionicons name="checkmark-circle" size={24} color={accent} />}
                            </Pressable>
                        )
                    })}
                </View>

            </ScrollView>

            {selectedService && (
                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Pressable style={[styles.btn, { backgroundColor: accent }]} onPress={handleRequest}>
                        <Text style={styles.btnText}>REQUEST HEAVY SERVICE</Text>
                        <Ionicons name="arrow-forward" size={24} color="#000" />
                    </Pressable>
                </Animated.View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 10 },
    backBtn: { padding: 10, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: "700" },

    sectionTitle: { fontSize: 24, fontWeight: "800", marginBottom: 5 },
    grid: { gap: 15 },

    card: {
        flexDirection: "row", alignItems: "center",
        padding: 15, borderRadius: 16, borderWidth: 1,
        elevation: 3
    },
    iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    serviceTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
    servicePrice: { fontSize: 14, fontWeight: "600" },

    footer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    btn: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
        padding: 18, borderRadius: 30, elevation: 10, shadowColor: "#FFD400", shadowOpacity: 0.4, shadowRadius: 10
    },
    btnText: { fontSize: 16, fontWeight: "800", color: "#000" }
});
