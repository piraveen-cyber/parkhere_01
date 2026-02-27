import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Animated, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../config/supabaseClient";
import api from "../../services/api";
import { useTheme } from "../../context/themeContext";

export default function EV() {
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
        { id: 'charging', title: 'Mobile Charging', price: '4000', icon: 'ev-station', lib: MaterialIcons },
        { id: 'battery_check', title: 'Battery Health', price: '3000', icon: 'battery-charging-full', lib: MaterialIcons },
        { id: 'towing_ev', title: 'Flatbed Towing', price: '6000', icon: 'tow-truck', lib: MaterialCommunityIcons },
        { id: 'scooter_fix', title: 'E-Scooter Repair', price: '2500', icon: 'electric-scooter', lib: MaterialIcons },
        { id: 'firmware', title: 'System Diagnostics', price: '3500', icon: 'laptop', lib: MaterialIcons },
        { id: 'others', title: 'Other Issue', price: '0', icon: 'help-circle', lib: Ionicons },
    ];

    const handleRequest = async () => {
        if (!selectedService || submitting) return;
        setSubmitting(true);

        try {
            // DEMO MODE: Bypass Auth
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
                    <Text style={[styles.headerTitle, { color: textPrimary }]}>EV / Hybrid Service</Text>
                    <View style={{ width: 40 }} />
                </Animated.View>

                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <Text style={[styles.sectionTitle, { color: textSecondary }]}>SELECT SERVICE TYPE</Text>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        <View style={styles.grid}>
                            {services.map((service, index) => {
                                const IconLib = service.lib;
                                const isSelected = selectedService === service.id;
                                const isOthers = service.id === 'others';

                                return (
                                    <Pressable
                                        key={service.id}
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: isSelected
                                                    ? (isDark ? 'rgba(229, 9, 20, 0.15)' : '#FFF0F0')
                                                    : (isOthers
                                                        ? (isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA')
                                                        : (isDark ? '#141414' : '#FFFFFF')),
                                                borderColor: isSelected
                                                    ? accent
                                                    : (isOthers
                                                        ? (isDark ? '#444' : '#DDD')
                                                        : (isDark ? '#333' : 'transparent')),
                                                borderWidth: isOthers ? 1 : (isSelected ? 1.5 : (isDark ? 1 : 0)),
                                                borderStyle: isOthers ? 'dashed' : 'solid',
                                                shadowOpacity: isDark ? 0 : 0.1,
                                            }
                                        ]}
                                        onPress={() => setSelectedService(service.id)}
                                    >
                                        <View style={[
                                            styles.iconBox,
                                            {
                                                backgroundColor: isSelected
                                                    ? accent
                                                    : (isOthers ? 'transparent' : (isDark ? '#222' : '#F0F2F5')),
                                                borderWidth: isOthers ? 1 : 0,
                                                borderColor: isDark ? '#444' : '#DDD'
                                            }
                                        ]}>
                                            <IconLib name={service.icon as any} size={28} color={isSelected ? '#FFF' : (isDark ? '#FFF' : '#555')} />
                                        </View>
                                        <Text style={[styles.cardTitle, { color: textPrimary }]}>{service.title}</Text>
                                        <Text style={[
                                            styles.priceTag,
                                            { color: isOthers ? textSecondary : accent }
                                        ]}>
                                            {isOthers ? 'Custom' : `LKR ${service.price}`}
                                        </Text>

                                        {isSelected && (
                                            <View style={[styles.checkCircle, { backgroundColor: accent }]}>
                                                <Ionicons name="checkmark" size={14} color="#FFF" />
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>
                </Animated.View>

            </SafeAreaView>

            {/* BOTTOM BAR */}
            <Animated.View style={[styles.bottomBar, { transform: [{ translateY: selectedService ? 0 : 100 }], opacity: selectedService ? 1 : 0 }]}>
                <Pressable
                    style={[styles.continueBtn, { backgroundColor: accent, shadowColor: accent }]}
                    onPress={handleRequest}
                    disabled={submitting}
                >
                    <Text style={[styles.continueText, { color: '#FFF' }]}>{submitting ? 'PROCESSING...' : 'CONTINUE'}</Text>
                    {!submitting && <Ionicons name="arrow-forward" size={24} color="#FFF" />}
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, marginBottom: 20
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: '700' },

    content: { flex: 1, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 15 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
        width: '48%', padding: 15, borderRadius: 20, marginBottom: 15,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10
    },
    iconBox: {
        width: 60, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center', marginBottom: 10
    },
    cardTitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
    priceTag: { fontSize: 12, fontWeight: '800' },

    checkCircle: {
        position: 'absolute', top: 10, right: 10,
        width: 20, height: 20, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center'
    },

    bottomBar: {
        position: 'absolute', bottom: 30, left: 20, right: 20,
        alignItems: 'center'
    },
    continueBtn: {
        width: '100%', height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowOpacity: 0.4, shadowRadius: 10
    },
    continueText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }
});
