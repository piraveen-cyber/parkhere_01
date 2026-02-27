import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import Header from "../../components/Header";

export default function AddParkingStep3() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    // Default location (e.g. Colombo)
    const [location, setLocation] = useState<any>({
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    const [address, setAddress] = useState("");

    useEffect(() => {
        getCurrentLocation();
        loadDraft();
    }, []);

    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
        } catch (e) { console.log('Location Error'); }
    };

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("parking_draft_step3");
        if (draft) {
            const data = JSON.parse(draft);
            if (data.latitude && data.longitude) {
                setLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
            if (data.address) setAddress(data.address);
        } else {
            // Try to pre-fill address from Step 1 if not set in Step 3 draft
            const step1 = await AsyncStorage.getItem("parking_draft_step1");
            if (step1) {
                setAddress(JSON.parse(step1).address || "");
            }
        }
    };

    const handleNext = async () => {
        if (!address) {
            Alert.alert(t('error'), t('address')); // Check if translations exist or fallback
            return;
        }

        await AsyncStorage.setItem("parking_draft_step3", JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            address
        }));
        router.push("../business-onboarding/parking-rules"); // Navigate to New Step 4
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('pinLocation')} (3/8)`} onBack={() => router.back()} />

            <View style={styles.content}>
                <Text style={[styles.label, { color: colors.text }]}>{t('address')}</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 15 }]}>
                    <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="123 Main St"
                        placeholderTextColor={colors.subText}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <Text style={{ color: colors.subText, marginBottom: 10 }}>{t('tapMapPin')}</Text>
                <View style={[styles.mapContainer, { borderColor: colors.border }]}>
                    <MapView
                        style={{ flex: 1 }}
                        provider={PROVIDER_GOOGLE}
                        region={location}
                        onPress={(e) => setLocation({ ...location, latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })}
                    >
                        <Marker coordinate={location} title="Parking Entrance" />
                    </MapView>
                </View>
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: address ? 1 : 0.5 }]}
                    onPress={handleNext}
                    disabled={!address}
                >
                    <Text style={styles.nextBtnText}>{t('nextRules')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    content: { flex: 1, padding: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15 },
    input: { flex: 1, fontSize: 16, height: '100%' },
    mapContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
