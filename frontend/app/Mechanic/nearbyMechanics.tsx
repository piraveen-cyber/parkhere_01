import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { supabase } from '../../config/supabaseClient';
import api from '../../services/api';

const MOCK_MECHANICS = [
    {
        id: 'm1',
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        reviews: 124,
        distance: '1.2 km',
        eta: '10 min',
        skills: ['Engine', 'Brake'],
        price: '$$',
        priceValue: 2,
        isOnline: true,
        specialist: 'General'
    },
    {
        id: 'm2',
        name: 'Nimal Auto Fix',
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4.5,
        reviews: 89,
        distance: '3.5 km',
        eta: '25 min',
        skills: ['Electric', 'Battery'],
        price: '$',
        priceValue: 1,
        isOnline: true,
        specialist: 'EV'
    },
    {
        id: 'm3',
        name: 'City Garage Mobile',
        photo: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 4.9,
        reviews: 210,
        distance: '5.0 km',
        eta: '35 min',
        skills: ['Tyre', 'Towing'],
        price: '$$$',
        priceValue: 3,
        isOnline: false,
        specialist: 'Heavy'
    },
    {
        id: 'm4',
        name: 'Sameera Tech',
        photo: 'https://randomuser.me/api/portraits/men/12.jpg',
        rating: 4.7,
        reviews: 56,
        distance: '2.0 km',
        eta: '15 min',
        skills: ['AC', 'Diagnostics'],
        price: '$$',
        priceValue: 2,
        isOnline: true,
        specialist: 'EV'
    }
];

export default function NearbyMechanics() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [filter, setFilter] = useState<'closest' | 'cheapest' | 'rating' | 'ev'>('closest');
    const [bookingId, setBookingId] = useState<string | null>(null);

    // Initial Filter Logic
    const getFilteredMechanics = () => {
        let sorted = [...MOCK_MECHANICS];

        switch (filter) {
            case 'closest':
                sorted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'cheapest':
                sorted.sort((a, b) => a.priceValue - b.priceValue);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'ev':
                sorted = sorted.filter(m => m.specialist === 'EV');
                break;
        }
        return sorted;
    };

    const handleBook = (mechanic: any) => {
        // Navigate to Profile
        router.push({
            pathname: '/Mechanic/mechanicProfile',
            params: {
                ...params, // Carry over all previous params (location, issues, etc.)
                mechanic: JSON.stringify(mechanic), // Pass mechanic object
                distance: mechanic.distance // Pass specific distance for profile stat
            }
        });
    };

    const renderMechanic = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
            {/* Header: Photo + Info */}
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                        {item.specialist === 'EV' && (
                            <View style={[styles.evBadge, { backgroundColor: isDark ? 'rgba(0, 255, 0, 0.2)' : '#E8F5E9' }]}>
                                <Ionicons name="flash" size={10} color="#00C853" />
                                <Text style={[styles.evText, { color: '#00C853' }]}>EV</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color={accent} />
                        <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
                        <Text style={{ color: colors.subText, fontSize: 12 }}> ({item.reviews})</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={14} color={colors.subText} />
                            <Text style={[styles.metaText, { color: colors.subText }]}>{item.distance}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color={colors.subText} />
                            <Text style={[styles.metaText, { color: colors.subText }]}>{item.eta}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.price, { color: accent }]}>{item.price}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.isOnline ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)' }]}>
                        <View style={[styles.statusDot, { backgroundColor: item.isOnline ? '#00FF00' : '#FF0000' }]} />
                        <Text style={[styles.statusText, { color: item.isOnline ? '#00FF00' : '#FF0000' }]}>
                            {item.isOnline ? 'On-Duty' : 'Busy'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Skills */}
            <View style={styles.skillsRow}>
                {item.skills.map((skill: string, index: number) => (
                    <View key={index} style={[styles.skillChip, { borderColor: isDark ? '#333' : '#EEE', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
                        <Text style={[styles.skillText, { color: colors.subText }]}>{skill}</Text>
                    </View>
                ))}
            </View>

            {/* Book Button */}
            <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: item.isOnline ? accent : (isDark ? '#333' : '#E0E0E0'), shadowColor: item.isOnline ? accent : 'transparent' }]}
                disabled={!item.isOnline}
                onPress={() => handleBook(item)}
            >
                <Text style={[styles.bookText, { color: item.isOnline ? (isDark ? '#FFF' : '#000') : (isDark ? '#666' : '#999') }]}>
                    {item.isOnline ? 'VIEW PROFILE' : 'UNAVAILABLE'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const FilterChip = ({ id, label, icon }: any) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                {
                    backgroundColor: filter === id ? accent : (isDark ? 'rgba(255,255,255,0.1)' : '#F0F0F0'),
                    borderColor: filter === id ? accent : 'transparent'
                }
            ]}
            onPress={() => setFilter(id)}
        >
            {icon && <Ionicons name={icon} size={16} color={filter === id ? (isDark ? '#FFF' : '#000') : colors.text} style={{ marginRight: 5 }} />}
            <Text style={{ color: filter === id ? (isDark ? '#FFF' : '#000') : colors.text, fontWeight: '600' }}>{label}</Text>
        </TouchableOpacity>
    );

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
                    <Text style={[styles.title, { color: colors.text }]}>Nearby Mechanics</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>Found {MOCK_MECHANICS.length} pros near you</Text>
                </View>
            </View>

            {/* FILTERS */}
            <View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 15 }}
                    data={[
                        { id: 'closest', label: 'Closest', icon: 'location' },
                        { id: 'cheapest', label: 'Cheapest', icon: 'pricetag' },
                        { id: 'rating', label: 'Top Rated', icon: 'star' },
                        { id: 'ev', label: 'EV Specialist', icon: 'flash' },
                    ]}
                    keyExtractor={i => i.id}
                    renderItem={({ item }) => <FilterChip {...item} />}
                />
            </View>

            {/* MECHANIC LIST */}
            <FlatList
                contentContainerStyle={{ padding: 25, paddingTop: 10, paddingBottom: 100 }}
                data={getFilteredMechanics()}
                keyExtractor={item => item.id}
                renderItem={renderMechanic}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: colors.subText }}>No mechanics found for this filter.</Text>
                    </View>
                }
            />

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

    filterChip: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, marginRight: 10, borderWidth: 1
    },

    card: {
        borderRadius: 20, padding: 15, marginBottom: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8
    },
    cardHeader: { flexDirection: 'row' },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#333' },

    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    name: { fontSize: 16, fontWeight: '700' },
    evBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 2
    },
    evText: { fontSize: 9, fontWeight: '800' },

    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    rating: { fontWeight: '700', fontSize: 14, marginLeft: 4 },

    metaRow: { flexDirection: 'row', marginTop: 8, gap: 15 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12 },

    price: { fontSize: 16, fontWeight: '700' },
    statusBadge: {
        flexDirection: 'row', alignItems: 'center', marginTop: 5,
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 5
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

    skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15, marginBottom: 15 },
    skillChip: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    skillText: { fontSize: 12 },

    bookBtn: {
        height: 44, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        shadowOpacity: 0.3, shadowRadius: 6
    },
    bookText: { fontWeight: '800', letterSpacing: 0.5, fontSize: 14 }
});
