import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const GARAGES = [
    {
        id: 'g1',
        name: 'AutoFix Pro Garage',
        address: '123 Main St, Colombo',
        rating: 4.8,
        reviews: 120,
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=2000',
        lat: 6.9271, lng: 79.8612,
        services: ['Engine', 'Body', 'Paint'],
        openUntil: '20:00'
    },
    {
        id: 'g2',
        name: 'City Car Care',
        address: '45 Lake Rd, Colombo',
        rating: 4.5,
        reviews: 85,
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1597762470488-387751f538c6?q=80&w=2000',
        lat: 6.9300, lng: 79.8500,
        services: ['Tires', 'Oil', 'Wash'],
        openUntil: '18:00'
    },
    {
        id: 'g3',
        name: 'Express Mechanics',
        address: '88 Union Pl, Colombo',
        rating: 4.9,
        reviews: 210,
        distance: '3.1 km',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=2000',
        lat: 6.9350, lng: 79.8650,
        services: ['Hybrid', 'Electric', 'Diagnostics'],
        openUntil: '22:00'
    }
];

export default function NearbyGarages() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [search, setSearch] = useState('');

    const filteredGarages = GARAGES.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    const handleSelectGarage = (garage: any) => {
        router.push({
            pathname: '/Mechanic/garageProfile',
            params: {
                ...params,
                garage: JSON.stringify(garage)
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* MAP VIEW */}
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={StyleSheet.absoluteFill}
                    initialRegion={{
                        latitude: 6.9271,
                        longitude: 79.8612,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    customMapStyle={isDark ? DARK_MAP_STYLE : []}
                >
                    {GARAGES.map(g => (
                        <Marker
                            key={g.id}
                            coordinate={{ latitude: g.lat, longitude: g.lng }}
                            title={g.name}
                            description={g.address}
                        >
                            <View style={[styles.marker, { backgroundColor: accent }]}>
                                <MaterialCommunityIcons name="garage" size={20} color={isDark ? "#FFF" : "#000"} />
                            </View>
                        </Marker>
                    ))}
                </MapView>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* SEARCH BAR */}
                <View style={[styles.searchContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
                    <Ionicons name="search" size={20} color={colors.subText} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search garages..."
                        placeholderTextColor={colors.subText}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* LIST VIEW */}
            <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
                <View style={styles.dragger} />
                <Text style={[styles.listTitle, { color: colors.text }]}>Nearby Garages ({filteredGarages.length})</Text>

                <FlatList
                    data={filteredGarages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9', borderColor: isDark ? '#333' : '#EEE' }]}
                            onPress={() => handleSelectGarage(item)}
                        >
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <View style={styles.cardContent}>
                                <View style={styles.row}>
                                    <Text style={[styles.garageName, { color: colors.text }]}>{item.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#FFD700" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.cardAddress, { color: colors.subText }]}>{item.address}</Text>

                                <View style={styles.tags}>
                                    {item.services.slice(0, 3).map((s, i) => (
                                        <View key={i} style={[styles.tag, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
                                            <Text style={[styles.tagText, { color: colors.subText }]}>{s}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.row}>
                                    <Text style={[styles.distance, { color: accent }]}>{item.distance} away</Text>
                                    <Text style={{ color: '#00C853', fontSize: 12, fontWeight: '600' }}>Open until {item.openUntil}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

const DARK_MAP_STYLE = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapContainer: { flex: 0.5 },

    backButton: {
        position: 'absolute', top: 50, left: 20,
        backgroundColor: '#FFF', width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center', elevation: 5
    },

    searchContainer: {
        position: 'absolute', top: 50, left: 70, right: 20,
        height: 40, borderRadius: 20,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
        gap: 10
    },
    searchInput: { flex: 1, fontFamily: 'System' },

    marker: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#FFF'
    },

    listContainer: {
        flex: 0.5, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: 20, paddingTop: 10,
        shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
    },
    dragger: {
        width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#CCC',
        alignSelf: 'center', marginBottom: 15
    },
    listTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },

    card: {
        flexDirection: 'row', padding: 10, borderRadius: 16, marginBottom: 15,
        borderWidth: 1
    },
    cardImage: { width: 80, height: 80, borderRadius: 12, marginRight: 15 },
    cardContent: { flex: 1, justifyContent: 'space-between' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    garageName: { fontSize: 16, fontWeight: '700' },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { fontSize: 12, fontWeight: '700', color: '#555' },
    cardAddress: { fontSize: 12, marginBottom: 5 },
    tags: { flexDirection: 'row', gap: 5, marginBottom: 5 },
    tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    tagText: { fontSize: 10 },
    distance: { fontSize: 12, fontWeight: '700' },
});
