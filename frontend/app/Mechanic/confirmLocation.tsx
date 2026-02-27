import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, StatusBar, Animated, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { supabase } from '../../config/supabaseClient';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

// DARK MAP STYLE - Netflix Theme
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#f7af05" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

export default function ConfirmLocation() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [location, setLocation] = useState<Region | null>(null);
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [accuracyWarning, setAccuracyWarning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const sheetAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Allow map to access to your location.');
                // Fallback to Colombo
                setLocation({
                    latitude: 6.9271, longitude: 79.8612,
                    latitudeDelta: 0.01, longitudeDelta: 0.01
                });
                Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true }).start();
                return;
            }

            setPermissionGranted(true);
            try {
                let locationResult = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

                if (locationResult.coords.accuracy && locationResult.coords.accuracy > 50) {
                    setAccuracyWarning(true);
                }

                setLocation({
                    latitude: locationResult.coords.latitude,
                    longitude: locationResult.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            } catch (e) {
                console.log("GPS Error", e);
                // Fallback
                setLocation({
                    latitude: 6.9271, longitude: 79.8612,
                    latitudeDelta: 0.01, longitudeDelta: 0.01
                });
            } finally {
                Animated.spring(sheetAnim, { toValue: 0, useNativeDriver: true }).start();
            }
        })();
    }, []);

    const handleRegionChangeComplete = (region: Region) => {
        setLocation(region);
        // Optional: Geo-coding here to update 'address' field automatically
    };

    const handleConfirm = async () => {
        if (!location) return;
        if (!address.trim()) {
            Alert.alert("Location Required", "Please enter your address or area.");
            return;
        }

        setSubmitting(true);
        try {
            // DEMO MODE: Bypass Auth
            // const { data: { session } } = await supabase.auth.getSession();
            // const userId = session?.user?.id;

            // if (!userId) {
            //     Alert.alert("Login Required", "Please login to continue.");
            //     return;
            // }
            const userId = "demo_user_123";

            // Construct Issues List from previous screen
            const issues = params.issues ? JSON.parse(params.issues as string) : [];
            const issueText = issues.length > 0 ? issues.join(', ') : 'General Assistance';

            // Navigate to Nearby Mechanics List (Flow Step 5)
            // Pass Location & Details to the list for final booking
            router.push({
                pathname: '/Mechanic/nearbyMechanics',
                params: {
                    userId,
                    serviceType: params.serviceType,
                    serviceName: params.serviceName,
                    issues: JSON.stringify(issues),
                    bookingType: params.bookingType,
                    location: address,
                    gps_coordinates: JSON.stringify(location),
                    price: params.price
                }
            });

        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to process location.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* MAP */}
            {location ? (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={StyleSheet.absoluteFill}
                    customMapStyle={isDark ? darkMapStyle : []}
                    region={location}
                    onRegionChangeComplete={handleRegionChangeComplete}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, styles.loadingScreen]}>
                    <ActivityIndicator size="large" color={accent} />
                    <Text style={styles.loadingText}>Locating you...</Text>
                </View>
            )}

            {/* CENTER PIN */}
            {location && (
                <View style={styles.centerMarker} pointerEvents="none">
                    <Ionicons name="location" size={44} color={accent} style={{ marginBottom: 44 }} />
                </View>
            )}

            {/* BACK BUTTON */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* WARNING BADGE */}
            {accuracyWarning && (
                <View style={[styles.warningBox, { backgroundColor: accent }]}>
                    <Ionicons name="warning-outline" size={16} color={isDark ? "#FFF" : "#000"} />
                    <Text style={[styles.warningText, { color: isDark ? '#FFF' : '#000' }]}>Weak GPS. Adjust pin manually.</Text>
                </View>
            )}

            {/* BOTTOM SHEET FORM */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ position: 'absolute', bottom: 0, width: '100%' }}
            >
                <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
                    <LinearGradient
                        colors={isDark ? ['#141414', '#000000'] : ['#FFFFFF', '#F5F5F5']}
                        style={styles.sheetContent}
                    >
                        <View style={[styles.handle, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
                        <Text style={[styles.title, { color: colors.text }]}>Confirm Location</Text>

                        {/* INPUTS */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Where are you?</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F9F9F9',
                                    color: colors.text,
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0'
                                }]}
                                placeholder="Address, Road, or Area"
                                placeholderTextColor={colors.subText}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nearby Landmark (Optional)</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F9F9F9',
                                    color: colors.text,
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0'
                                }]}
                                placeholder="e.g. Next to Bank, Red Building"
                                placeholderTextColor={colors.subText}
                                value={landmark}
                                onChangeText={setLandmark}
                            />
                        </View>

                        {/* ACTION */}
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: accent, shadowColor: accent, opacity: submitting ? 0.7 : 1 }]}
                            onPress={handleConfirm}
                            disabled={submitting}
                        >
                            <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#000' }]}>{submitting ? "LOCATING..." : "FIND MECHANICS"}</Text>
                            {!submitting && <Ionicons name="arrow-forward" size={20} color={isDark ? "#FFF" : "#000"} />}
                        </TouchableOpacity>

                    </LinearGradient>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loadingScreen: { backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#FFF', marginTop: 10 },

    centerMarker: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center', alignItems: 'center',
    },
    backBtn: {
        position: 'absolute', top: 50, left: 20, zIndex: 10,
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#333'
    },

    warningBox: {
        position: 'absolute', top: 110, alignSelf: 'center',
        paddingHorizontal: 15, paddingVertical: 8,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5,
        elevation: 5
    },
    warningText: { fontSize: 12, fontWeight: '700' },

    sheet: { width: '100%' },
    sheetContent: {
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: 25, paddingBottom: 40,
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)'
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        alignSelf: 'center', marginBottom: 20
    },
    title: {
        fontSize: 22, fontWeight: '800',
        marginBottom: 20
    },

    inputGroup: { marginBottom: 15 },
    label: { color: '#94A3B8', fontSize: 12, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
    input: {
        borderRadius: 12, height: 50, paddingHorizontal: 15,
        fontSize: 16, borderWidth: 1
    },

    btn: {
        marginTop: 10,
        height: 56, borderRadius: 16,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
        shadowOpacity: 0.3, shadowRadius: 10
    },
    btnText: {
        fontSize: 16, fontWeight: '800', letterSpacing: 0.5
    }
});
