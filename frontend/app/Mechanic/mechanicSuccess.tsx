import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Animated, Easing, StatusBar, Linking, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Dark Map Style - Netflix Theme (Black/Gray/Red)
const DARK_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#404040' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#111111' }] },
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#333333' }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#E50914' }] }, // Red highways
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#E50914' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

export default function MechanicSuccess() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8
    };

    const [location, setLocation] = useState({
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // Mechanic Position (Simulated Movement)
    const [mechLocation, setMechLocation] = useState({
        latitude: 6.9240, longitude: 79.8580
    });

    // Animations
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Parse passed location if available
        if (params.gps_coordinates) {
            const loc = JSON.parse(params.gps_coordinates as string);
            setLocation({ ...loc, latitudeDelta: 0.015, longitudeDelta: 0.015 });
            // Offset mechanic slightly
            setMechLocation({ latitude: loc.latitude - 0.005, longitude: loc.longitude - 0.005 });
        }

        // SAVE BOOKING LOCALLY
        const saveBooking = async () => {
            try {
                const newBooking = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'mechanic',
                    title: mechanic.name || 'Mechanic Service',
                    subtitle: 'Roadside Assistance',
                    date: new Date().toISOString(),
                    price: '1500.00', // Estimate or pass from params
                    status: 'Active',
                    mechanicId: mechanic.id
                };

                const existing = await AsyncStorage.getItem('LOCAL_BOOKINGS');
                const bookings = existing ? JSON.parse(existing) : [];
                bookings.push(newBooking);
                await AsyncStorage.setItem('LOCAL_BOOKINGS', JSON.stringify(bookings));
                console.log('Mechanic Booking Saved:', newBooking);
            } catch (e) {
                console.error("Failed to save mechanic booking", e);
            }
        };
        saveBooking();

        // Run Entrance Animation
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                useNativeDriver: true
            })
        ]).start();

        // Simulate Mechanic Movement
        const interval = setInterval(() => {
            setMechLocation(prev => ({
                latitude: prev.latitude + 0.0001,
                longitude: prev.longitude + 0.0001
            }));
        }, 2000);

        return () => clearInterval(interval);

    }, []);

    const handleCall = () => Linking.openURL(`tel:+94771234567`);

    const handleChat = () => Alert.alert("Chat", "Opening chat...");

    const handleCancel = () => {
        Alert.alert(
            "Cancel Booking?",
            "A cancellation fee of LKR 300 may apply if the mechanic has already started moving.",
            [
                { text: "No, Keep it", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Cancelled", "Your booking has been cancelled.");
                        router.push('/(tabs)/home');
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* FULL SCREEN MAP */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                customMapStyle={isDark ? DARK_MAP_STYLE : []}
                region={location}
            >
                {/* User Marker */}
                <Marker coordinate={location}>
                    <View style={[styles.markerRing, { borderColor: accent, backgroundColor: isDark ? 'rgba(247, 175, 5, 0.2)' : 'rgba(57, 255, 20, 0.1)' }]}>
                        <View style={[styles.markerDot, { backgroundColor: accent }]} />
                    </View>
                </Marker>

                {/* Mechanic Marker */}
                <Marker coordinate={mechLocation}>
                    <View style={{ backgroundColor: '#FFF', padding: 5, borderRadius: 20, borderWidth: 2, borderColor: accent }}>
                        <MaterialIcons name="handyman" size={24} color={accent} />
                    </View>
                </Marker>
            </MapView>

            {/* SUCCESS OVERLAY */}

            {/* TOP HEADER - SUCCESS MESSAGE */}
            <Animated.View style={[styles.successHeader, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.successCircle, { backgroundColor: '#4CAF50', shadowColor: '#4CAF50' }]}>
                    <Ionicons name="checkmark" size={40} color="#FFF" />
                </View>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successSub}>Help is on the way.</Text>
            </Animated.View>


            {/* BOTTOM SHEET - MECHANIC INFO */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        backgroundColor: isDark ? '#141414' : '#FFF',
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                {/* Drag Handle */}
                <View style={[styles.dragHandle, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />

                {/* ETA CARD */}
                <View style={[styles.etaCard, { backgroundColor: isDark ? '#000' : '#F5F5F5', borderColor: isDark ? '#333' : '#EEE', borderWidth: 1 }]}>
                    <View>
                        <Text style={[styles.etaLabel, { color: colors.subText }]}>ESTIMATED ARRIVAL</Text>
                        <Text style={[styles.etaTime, { color: accent }]}>12 MIN</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3097/3097180.png' }} // Simple Car/Van Icon
                        style={{ width: 50, height: 30, opacity: 0.8, tintColor: colors.text }}
                    />
                </View>

                {/* MECHANIC DETAILS */}
                <View style={styles.mechRow}>
                    <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={[styles.mechName, { color: colors.text }]}>{mechanic.name}</Text>
                        <Text style={{ color: colors.subText }}> Toyota HiAce • CAB-1234</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color={accent} />
                            <Text style={[styles.ratingText, { color: colors.text }]}>{mechanic.rating}</Text>
                        </View>
                    </View>

                    {/* ACTION BUTTONS */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? '#333' : '#EEE' }]} onPress={handleChat}>
                            <Ionicons name="chatbubble" size={20} color={isDark ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#25D366' }]} onPress={handleCall}>
                            <Ionicons name="call" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#EEE' }]} />

                {/* CANCEL BUTTON */}
                <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                    <Text style={[styles.cancelText, { color: colors.subText }]}>Cancel Booking</Text>
                </TouchableOpacity>

                {/* TRACK BUTTON */}
                <TouchableOpacity
                    style={[styles.homeBtn, { backgroundColor: accent, marginBottom: 10, shadowColor: accent }]}
                    onPress={() => router.push({
                        pathname: '/Mechanic/mechanicTracking',
                        params: { mechanic: JSON.stringify(mechanic) }
                    })}
                >
                    <Text style={styles.homeText}>TRACK LIVE</Text>
                </TouchableOpacity>

                {/* HOME BUTTON */}
                <TouchableOpacity style={[styles.homeBtn, { backgroundColor: isDark ? '#333' : '#EEE' }]} onPress={() => router.push('/(tabs)/home')}>
                    <Text style={[styles.homeText, { color: colors.text }]}>RETURN HOME</Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },

    markerRing: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 2,
        alignItems: 'center', justifyContent: 'center'
    },
    markerDot: { width: 10, height: 10, borderRadius: 5 },

    successHeader: {
        position: 'absolute', top: 60, width: '100%', alignItems: 'center',
        zIndex: 10
    },
    successCircle: {
        width: 70, height: 70, borderRadius: 35,
        alignItems: 'center', justifyContent: 'center', marginBottom: 15,
        shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    },
    successTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 },
    successSub: { fontSize: 16, color: '#EEE', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 },

    bottomSheet: {
        position: 'absolute', bottom: 0, width: '100%',
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: 25, paddingBottom: 40,
        shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.2, shadowRadius: 15,
        elevation: 10
    },
    dragHandle: {
        width: 40, height: 5, borderRadius: 3,
        alignSelf: 'center', marginBottom: 20, opacity: 0.5
    },

    etaCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 15, borderRadius: 16, marginBottom: 20
    },
    etaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
    etaTime: { fontSize: 22, fontWeight: '800' },

    mechRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#333' },
    mechName: { fontSize: 16, fontWeight: '700' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    ratingText: { fontSize: 12, fontWeight: '600' },

    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center'
    },

    divider: { height: 1, marginVertical: 15 },

    cancelBtn: { alignItems: 'center', padding: 10, marginBottom: 10 },
    cancelText: { fontWeight: '600' },

    homeBtn: {
        height: 50, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
    },
    homeText: { fontSize: 16, fontWeight: '800', color: '#FFF' }
});
