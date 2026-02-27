import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps"; // Ensure react-native-maps is installed
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";

export default function AddParkingStep2() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    // Default to a central location (e.g., Colombo) until user location loads
    const [region, setRegion] = useState({
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const [selectedCoord, setSelectedCoord] = useState<any>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            // Auto-select current location initially
            setSelectedCoord({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        })();
    }, []);

    const handleNext = async () => {
        if (!selectedCoord) return alert(t('selectLocationAlert'));

        // Merge with draft
        const existing = await AsyncStorage.getItem("new_spot_draft");
        const draft = existing ? JSON.parse(existing) : {};
        draft.location = selectedCoord;
        await AsyncStorage.setItem("new_spot_draft", JSON.stringify(draft));

        router.push("../business-onboarding/parking-address");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('pinLocation')} (2/8)`} onBack={() => router.back()} />

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    onPress={(e) => setSelectedCoord(e.nativeEvent.coordinate)}
                    userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
                >
                    {selectedCoord && (
                        <Marker coordinate={selectedCoord} pinColor="#FFD400" title={t('parkingEntrance')} />
                    )}
                </MapView>

                <View style={styles.hintBox}>
                    <Text style={{ color: '#000', fontWeight: '600' }}>{t('tapMapHint')}</Text>
                </View>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{t('nextDetails')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mapContainer: { flex: 1, position: 'relative' },
    map: { width: '100%', height: '100%' },
    hintBox: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
