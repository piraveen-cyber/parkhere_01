import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Animated, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../config/supabaseClient";
import api from "../../services/api";
import { useTheme } from "../../context/themeContext";

export default function HeavyVehicle() {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    // THEME COLORS
    const accent = colors.primary;
    const textPrimary = colors.text;
    const textSecondary = colors.subText;

    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const services = [
        { id: 'heavy_tow', title: 'Heavy Duty Towing', price: '8000', icon: 'tow-truck', lib: MaterialCommunityIcons },
        { id: 'air_brake', title: 'Air Brake Check', price: '4500', icon: 'alert-octagon', lib: Ionicons },
        { id: 'hydraulics', title: 'Hydraulic System', price: '6000', icon: 'oil-level', lib: MaterialCommunityIcons },
        { id: 'tire_heavy', title: 'Heavy Tire Change', price: '3500', icon: 'disc', lib: Ionicons },
        { id: 'engine_heavy', title: 'Diesel Engine Fix', price: '12000', icon: 'engine', lib: MaterialCommunityIcons },
        { id: 'others', title: 'Other Issue', price: '0', icon: 'help-circle', lib: Ionicons },
    ];

    const handleRequest = async () => {
        if (!selectedService || submitting) return;
        setSubmitting(true);

        try {
            // DEMO MODE: Bypass Auth
            // const { data: { session } } = await supabase.auth.getSession();
            // const userId = session?.user?.id;

            // if (!userId) {
            //     Alert.alert("Login Required", "Please login to request a service.");
            //     setSubmitting(false);
            //     return;
            // }
            const userId = "demo_user_123";

            const selectedItem = services.find(s => s.id === selectedService);

            if (selectedService === 'others') {
                router.push({
                    pathname: '/Mechanic/issueSelector',
                    params: {
                        serviceType: selectedService,
                        price: selectedItem?.price,
                        serviceName: selectedItem?.title
                    }
                });
            } else {
                router.push({
                    pathname: '/Mechanic/serviceType',
                    params: {
                        serviceType: selectedService,
                        price: selectedItem?.price,
                        serviceName: selectedItem?.title,
                        issues: JSON.stringify([selectedItem?.title])
                    }
                });
            }

        } catch (error) {
            console.error("Failed to request service:", error);
            Alert.alert("Error", "Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={isDark ? ['#000000', '#141414', '#000000'] : ['#FFFFFF', '#F0F2F5', '#E1E5EA']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>

                {/* HEADER */}
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Pressable onPress={() => router.back()} style={[styles.backBtn, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }]}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: textPrimary }]}>Heavy Vehicle Service</Text>
                </Animated.View>

                <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 100 }}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <Text style={[styles.sectionTitle, { color: accent }]}>
                            Heavy Assistance
                        </Text>
                        <Text style={{ color: textSecondary, marginBottom: 25, fontSize: 16 }}>
                            Specialized care for buses, lorries, and trucks.
                        </Text>

                        <View style={styles.grid}>
                            {services.map((item) => {
                                const IconLib = item.lib;
                                const isSelected = selectedService === item.id;
                                const isOthers = item.id === 'others';

                                return (
                                    <Pressable
                                        key={item.id}
                                        style={({ pressed }) => [
                                            styles.card,
                                            {
                                                backgroundColor: isSelected
                                                    ? (isDark ? 'rgba(229, 9, 20, 0.15)' : '#FFF0F0')
                                                    : (isOthers
                                                        ? (isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA')
                                                        : (isDark ? '#141414' : '#FFFFFF')),
                                                borderColor: isSelected
                                                    ? accent
                                                    : (isOthers ? (isDark ? '#555' : '#DDD') : (isDark ? "#333" : "rgba(255,255,255,0.1)")), // Adjusted border
                                                borderWidth: isOthers ? 1 : 1.5,
                                                borderStyle: isOthers ? 'dashed' : 'solid',
                                                transform: [{ scale: pressed ? 0.98 : 1 }],
                                                shadowOpacity: isDark ? 0 : 0.1,
                                            }
                                        ]}
                                        onPress={() => setSelectedService(item.id)}
                                    >
                                        <View style={[
                                            styles.iconCircle,
                                            {
                                                backgroundColor: isSelected ? accent : (isOthers ? 'transparent' : (isDark ? "#2A3B55" : "#EEE")),
                                                borderWidth: isOthers ? 1 : 0,
                                                borderColor: isDark ? '#555' : '#DDD'
                                            }
                                        ]}>
                                            <IconLib name={item.icon as any} size={24} color={isSelected ? "#FFF" : (isDark ? "#FFF" : "#333")} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.serviceTitle, { color: textPrimary }]}>{item.title}</Text>
                                            <Text style={[
                                                styles.servicePrice,
                                                { color: isOthers ? textSecondary : accent }
                                            ]}>
                                                {isOthers ? 'Custom' : `LKR ${item.price}`}
                                            </Text>
                                        </View>
                                        <View style={[styles.checkCircle, { borderColor: isSelected ? accent : (isDark ? '#444' : '#CCC') }]}>
                                            {isSelected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: accent }} />}
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* FOOTER */}
                {selectedService && (
                    <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                        <LinearGradient
                            colors={isDark ? ['#000000', 'transparent'] : ['#FFFFFF', 'transparent']} // Inverted for footer
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
                            pointerEvents="none"
                        />
                        {/* Actually standard footer gradient is usually bottom up */}

                        <Pressable
                            style={[styles.btn, { backgroundColor: accent, opacity: submitting ? 0.7 : 1 }]}
                            onPress={handleRequest}
                            disabled={submitting}
                        >
                            <Text style={[styles.btnText, { color: '#FFF' }]}>{submitting ? "REQUESTING..." : "CONFIRM HEAVY SERVICE"}</Text>
                            {!submitting && <Ionicons name="arrow-forward" size={20} color="#FFF" />}
                        </Pressable>
                    </Animated.View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 25, marginBottom: 15 },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: "center", justifyContent: "center", marginRight: 15,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.1)"
    },
    headerTitle: { fontSize: 20, fontWeight: "700" },

    sectionTitle: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
    grid: { gap: 15 },

    card: {
        flexDirection: "row", alignItems: "center",
        padding: 16, borderRadius: 20, borderWidth: 1,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4
    },
    iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    serviceTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
    servicePrice: { fontSize: 14, fontWeight: "700" },

    checkCircle: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
        justifyContent: 'center', alignItems: 'center'
    },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 30, paddingBottom: 40,
        // Background color handles visibility
    },
    btn: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
        padding: 18, borderRadius: 18,
        shadowColor: "#E50914", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    btnText: { fontSize: 16, fontWeight: "800", letterSpacing: 0.5 }
});
