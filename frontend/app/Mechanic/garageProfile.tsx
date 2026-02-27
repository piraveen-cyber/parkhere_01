import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

const { width } = Dimensions.get('window');

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function GarageProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const garage = params.garage ? JSON.parse(params.garage as string) : {
        name: 'AutoFix Pro Garage',
        address: '123 Main St, Colombo',
        image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=2000',
        rating: 4.8,
        reviews: 120,
        services: ['Engine Repair', 'Body Shop', 'Paint', 'Detailing'],
        openUntil: '20:00'
    };

    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleBook = () => {
        if (!selectedSlot) return;

        router.push({
            pathname: '/Mechanic/garageBookingSummary',
            params: {
                ...params,
                garage: JSON.stringify(garage),
                timeSlot: selectedSlot
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* HER IMAGE */}
            <View style={styles.header}>
                <Image source={{ uri: garage.image }} style={styles.headerImg} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                />
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Text style={styles.garageName}>{garage.name}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{garage.rating} ({garage.reviews} Reviews)</Text>
                        <Text style={{ color: '#DDD', marginHorizontal: 8 }}>•</Text>
                        <Text style={{ color: '#00C853', fontWeight: '700' }}>Open until {garage.openUntil}</Text>
                    </View>
                    <Text style={styles.address}><Ionicons name="location" size={14} /> {garage.address}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* SERVICES */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Services</Text>
                    <View style={styles.chipRow}>
                        {garage.services.map((s: string, i: number) => (
                            <View key={i} style={[styles.chip, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
                                <Text style={[styles.chipText, { color: colors.text }]}>{s}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* TIME SLOTS */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time Slot</Text>
                    <View style={styles.slotGrid}>
                        {TIME_SLOTS.map((slot, i) => {
                            const isSelected = selectedSlot === slot;
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.slot,
                                        {
                                            backgroundColor: isSelected ? accent : (isDark ? '#333' : '#F5F5F5'),
                                            borderColor: isSelected ? accent : (isDark ? '#444' : '#DDD')
                                        }
                                    ]}
                                    onPress={() => setSelectedSlot(slot)}
                                >
                                    <Text style={[
                                        styles.slotText,
                                        { color: isSelected ? (isDark ? '#FFF' : '#000') : colors.text }
                                    ]}>{slot}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#141414' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <View>
                    <Text style={[styles.priceLabel, { color: colors.subText }]}>Booking Fee</Text>
                    <Text style={[styles.price, { color: colors.text }]}>$15.00</Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookBtn, { backgroundColor: accent, opacity: selectedSlot ? 1 : 0.5 }]}
                    disabled={!selectedSlot}
                    onPress={handleBook}
                >
                    <Text style={[styles.bookBtnText, { color: isDark ? '#FFF' : '#000' }]}>BOOK VISIT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { height: 250, justifyContent: 'flex-end', padding: 20 },
    headerImg: { width: '100%', height: '100%', position: 'absolute' },
    backBtn: {
        position: 'absolute', top: 50, left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center'
    },
    headerContent: { zIndex: 1 },
    garageName: { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 5 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    ratingText: { color: '#FFF', fontWeight: '600', marginLeft: 5 },
    address: { color: '#EEE', fontSize: 13 },

    content: { padding: 25 },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    chipText: { fontSize: 12, fontWeight: '600' },

    slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    slot: {
        width: (width - 70) / 3, paddingVertical: 12, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1
    },
    slotText: { fontSize: 13, fontWeight: '600' },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 20, paddingBottom: 40, borderTopWidth: 1
    },
    priceLabel: { fontSize: 12 },
    price: { fontSize: 24, fontWeight: '800' },
    bookBtn: {
        paddingHorizontal: 30, paddingVertical: 15, borderRadius: 16,
        alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 5
    },
    bookBtnText: { fontWeight: '800', fontSize: 16 }
});
