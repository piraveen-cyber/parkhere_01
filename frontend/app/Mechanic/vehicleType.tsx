import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/themeContext";

export default function MechanicVehicleType() {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';

    // PREMIUM THEME COLORS
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
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const vehicleTypes = [
        {
            id: 'light',
            title: 'Light Vehicle',
            subtitle: 'Car, Van, Jeep, SUV',
            icon: 'car-sport',
            route: '/Mechanic/lightVehicle'
        },
        {
            id: 'heavy',
            title: 'Heavy Vehicle',
            subtitle: 'Bus, Lorry, Truck',
            icon: 'bus',
            route: '/Mechanic/heavyVehicle'
        },
        {
            id: 'ev',
            title: 'Electric Vehicle',
            subtitle: 'EV Car, Scooter, Hybrid',
            icon: 'flash',
            route: '/Mechanic/EV'
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <LinearGradient
                colors={isDark ? ['#000000', '#141414', '#000000'] : ['#FFFFFF', '#FAFAFA', '#F0F0F0']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 25 }}>

                    {/* HEADER */}
                    <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Pressable onPress={() => router.back()} style={[styles.backBtn, {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        }]}>
                            <Ionicons name="chevron-back" size={24} color={colors.text} />
                        </Pressable>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={[styles.headerTitle, { color: textPrimary }]}>Request Assistance</Text>
                        </View>
                        <Pressable onPress={() => router.push('../Mechanic/issueSelector')} style={[styles.backBtn, {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        }]}>
                            <Ionicons name="time-outline" size={24} color={colors.text} />
                        </Pressable>
                    </Animated.View>

                    <Animated.View style={[styles.intro, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={[styles.introTitle, { color: accent }]}>Which vehicle needs help?</Text>
                        <Text style={[styles.introSub, { color: textSecondary }]}>Select your vehicle type to continue.</Text>
                    </Animated.View>

                    {/* CARDS LIST */}
                    <View style={styles.list}>
                        {vehicleTypes.map((item, index) => (
                            <VehicleCard
                                key={item.id}
                                item={item}
                                index={index}
                                isDark={isDark}
                                accent={accent}
                                textPrimary={textPrimary}
                                textSecondary={textSecondary}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const VehicleCard = ({ item, index, isDark, accent, textPrimary, textSecondary }: any) => {
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
            })
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: cardFade,
                transform: [{ translateY: cardAnim }]
            }}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    {
                        backgroundColor: isDark ? '#141414' : '#FFFFFF',
                        borderColor: isDark ? '#333' : '#E5E5E5',
                        transform: [{ scale: pressed ? 0.98 : 1 }]
                    }
                ]}
                onPress={() => router.push(item.route as any)}
            >
                <View style={[styles.iconBox, {
                    backgroundColor: isDark ? 'rgba(229, 9, 20, 0.1)' : 'rgba(57, 255, 20, 0.1)'
                }]}>
                    <Ionicons name={item.icon as any} size={32} color={accent} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.cardSub, { color: textSecondary }]}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={textSecondary} />
            </Pressable>
        </Animated.View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    intro: {
        marginBottom: 30,
    },
    introTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    introSub: {
        fontSize: 16,
    },
    list: {
        gap: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSub: {
        fontSize: 13,
    },
});
