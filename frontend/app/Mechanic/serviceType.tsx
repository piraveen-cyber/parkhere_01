import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

export default function ServiceType() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [selectedType, setSelectedType] = useState<string | null>(null);

    const bookingTypes = [
        {
            id: 'roadside',
            title: 'Roadside Assistance',
            description: 'Stuck heavily? We come to you.',
            icon: 'tow-truck',
            lib: MaterialCommunityIcons
        },
        {
            id: 'home',
            title: 'Home Service',
            description: 'Schedule a repair at your driveway.',
            icon: 'home',
            lib: Ionicons
        },
        {
            id: 'garage',
            title: 'Garage Visit',
            description: 'Bring your vehicle to our workshop.',
            icon: 'garage',
            lib: MaterialCommunityIcons
        }
    ];

    const handleContinue = () => {
        if (!selectedType) return;

        if (selectedType === 'garage') {
            router.push({
                pathname: '/Mechanic/nearbyGarages',
                params: { ...params, bookingType: selectedType }
            });
        } else {
            router.push({
                pathname: '/Mechanic/confirmLocation',
                params: { ...params, bookingType: selectedType }
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <LinearGradient
                colors={isDark ? ['#000000', '#141414', '#000000'] : ['#FFFFFF', '#F0F2F5', '#E1E5EA']}
                style={StyleSheet.absoluteFill}
            />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Service Mode</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>How would you like to proceed?</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {bookingTypes.map((item) => {
                    const IconLib = item.lib;
                    const isSelected = selectedType === item.id;

                    return (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [
                                styles.card,
                                {
                                    backgroundColor: isSelected
                                        ? (isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(57, 255, 20, 0.1)')
                                        : (isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'),
                                    borderColor: isSelected ? accent : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                                    transform: [{ scale: pressed ? 0.98 : 1 }],
                                    shadowOpacity: isDark ? 0 : 0.05
                                }
                            ]}
                            onPress={() => setSelectedType(item.id)}
                        >
                            <View style={[
                                styles.iconBox,
                                {
                                    backgroundColor: isSelected ? accent : (isDark ? '#222' : '#F5F5F5'),
                                    borderColor: isDark ? '#333' : '#EEE',
                                    borderWidth: 1
                                }
                            ]}>
                                <IconLib name={item.icon as any} size={32} color={isSelected ? (isDark ? '#FFF' : '#000') : (isDark ? '#FFF' : '#555')} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={[styles.cardTitle, { color: isSelected ? accent : colors.text }]}>{item.title}</Text>
                                <Text style={[styles.cardDesc, { color: colors.subText }]}>{item.description}</Text>
                            </View>

                            <View style={[styles.radio, { borderColor: isSelected ? accent : '#666' }]}>
                                {isSelected && <View style={[styles.radioDot, { backgroundColor: accent }]} />}
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View style={[styles.footer, {
                backgroundColor: isDark ? '#141414' : '#FFF',
                borderTopColor: isDark ? '#333' : '#EEE'
            }]}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: accent, opacity: selectedType ? 1 : 0.5, shadowColor: accent }]}
                    disabled={!selectedType}
                    onPress={handleContinue}
                >
                    <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#000' }]}>CONTINUE</Text>
                    <Ionicons name="arrow-forward" size={20} color={isDark ? '#FFF' : '#000'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center'
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center', marginRight: 15
    },
    title: { fontSize: 24, fontWeight: '800' },
    subtitle: { fontSize: 14, marginTop: 4 },

    scrollContent: { padding: 25, paddingBottom: 100, gap: 15 },

    card: {
        flexDirection: 'row', alignItems: 'center',
        padding: 20, borderRadius: 20,
        borderWidth: 1.5,
        marginBottom: 5,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowRadius: 5
    },
    iconBox: {
        width: 60, height: 60, borderRadius: 30,
        justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    cardContent: { flex: 1, paddingRight: 10 },
    cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    cardDesc: { fontSize: 13, lineHeight: 18 },

    radio: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
        justifyContent: 'center', alignItems: 'center'
    },
    radioDot: { width: 12, height: 12, borderRadius: 6 },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40,
        borderTopWidth: 1
    },
    btn: {
        height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowOpacity: 0.4, shadowRadius: 10
    },
    btnText: { fontSize: 18, fontWeight: '800', letterSpacing: 1 }
});
