import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/themeContext";

export default function MechanicVehicleType() {
    const { colors } = useTheme();

    // PREMIUM THEME COLORS
    const bg = colors.background;
    const cardBg = colors.card;
    const accent = colors.primary;
    const textPrimary = colors.text;
    const textSecondary = colors.subText;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const vehicleTypes = [
        {
            id: 'light',
            title: 'Light Vehicle',
            subtitle: 'Car, Van, Jeep',
            icon: 'car-sport',
            lib: Ionicons,
            route: '../Mechanic/lightVehicle'
        },
        {
            id: 'heavy',
            title: 'Heavy Vehicle',
            subtitle: 'Bus, Lorry, Truck',
            icon: 'bus',
            lib: Ionicons, // Ionicons has 'bus'
            route: '../Mechanic/hevyVehicle'
        },
        {
            id: 'ev',
            title: 'Electric Vehicle',
            subtitle: 'EV Car, Scooter',
            icon: 'flash',
            lib: Ionicons,
            route: '../Mechanic/EV'
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <StatusBar barStyle={bg === "#0D1B2A" ? "light-content" : "dark-content"} />

            <ScrollView contentContainerStyle={{ padding: 20 }}>

                {/* HEADER */}
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={textPrimary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: textPrimary }]}>Request Assistance</Text>
                </Animated.View>

                <Animated.View style={[styles.intro, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={[styles.introTitle, { color: accent }]}>Which vehicle needs help?</Text>
                    <Text style={[styles.introSub, { color: textSecondary }]}>Select your vehicle type to continue.</Text>
                </Animated.View>

                {/* CARDS LIST */}
                <View style={styles.list}>
                    {vehicleTypes.map((item, index) => {
                        const IconLib = item.lib;
                        // Staggered Animation for cards
                        const cardAnim = useRef(new Animated.Value(50)).current;
                        const cardFade = useRef(new Animated.Value(0)).current;

                        useEffect(() => {
                            Animated.parallel([
                                Animated.timing(cardAnim, {
                                    toValue: 0,
                                    duration: 600,
                                    delay: index * 100,
                                    easing: Easing.out(Easing.back(1.2)),
                                    useNativeDriver: true,
                                }),
                                Animated.timing(cardFade, {
                                    toValue: 1,
                                    duration: 600,
                                    delay: index * 100,
                                    useNativeDriver: true,
                                }),
                            ]).start();
                        }, []);

                        return (
                            <Animated.View
                                key={item.id}
                                style={{ opacity: cardFade, transform: [{ translateY: cardAnim }] }}
                            >
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.card,
                                        { backgroundColor: cardBg, borderColor: pressed ? accent : 'transparent' },
                                        pressed && { transform: [{ scale: 0.98 }] }
                                    ]}
                                    onPress={() => router.push(item.route as any)}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: "rgba(255, 212, 0, 0.1)" }]}>
                                        <IconLib name={item.icon as any} size={32} color={accent} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={[styles.cardTitle, { color: textPrimary }]}>{item.title}</Text>
                                        <Text style={[styles.cardSubtitle, { color: textSecondary }]}>{item.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={24} color={accent} />
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: "row", alignItems: "center", marginBottom: 30,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center", justifyContent: "center", marginRight: 15
    },
    headerTitle: { fontSize: 20, fontWeight: "700" },

    intro: { marginBottom: 30 },
    introTitle: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
    introSub: { fontSize: 16 },

    list: { gap: 15 },

    card: {
        flexDirection: "row", alignItems: "center",
        padding: 20, borderRadius: 20,
        borderWidth: 1,
        elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2
    },
    iconContainer: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: "center", justifyContent: "center", marginRight: 15
    },
    textContainer: { flex: 1 },
    cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
    cardSubtitle: { fontSize: 14 },
});
