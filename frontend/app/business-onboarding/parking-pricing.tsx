import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../../components/Header";

export default function AddParkingStep5() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    // Pricing state per vehicle type
    const [vehicles, setVehicles] = useState({
        car: { enabled: true, hourly: "2.00", daily: "15.00" },
        bike: { enabled: false, hourly: "1.00", daily: "8.00" },
        heavy: { enabled: false, hourly: "5.00", daily: "40.00" }
    });

    useEffect(() => {
        loadDraft();
    }, []);

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("parking_draft_step5");
        if (draft) {
            setVehicles(JSON.parse(draft));
        }
    };

    const toggleVehicle = (type: 'car' | 'bike' | 'heavy') => {
        setVehicles(prev => ({
            ...prev,
            [type]: { ...prev[type], enabled: !prev[type].enabled }
        }));
    };

    const updatePrice = (type: 'car' | 'bike' | 'heavy', field: 'hourly' | 'daily', value: string) => {
        setVehicles(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    const handleNext = async () => {
        // Validate at least one vehicle enabled
        if (!vehicles.car.enabled && !vehicles.bike.enabled && !vehicles.heavy.enabled) {
            Alert.alert(t('error'), t('selectVehicleTypes'));
            return;
        }

        await AsyncStorage.setItem("parking_draft_step5", JSON.stringify(vehicles));
        router.push("../business-onboarding/parking-facilities");
    };

    const VehiclePriceCard = ({ type, label, icon, data }: any) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: data.enabled ? colors.primary : colors.border, opacity: data.enabled ? 1 : 0.7 }]}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => toggleVehicle(type)}>
                <View style={[styles.checkbox, { borderColor: data.enabled ? colors.primary : colors.subText, backgroundColor: data.enabled ? colors.primary : 'transparent' }]}>
                    {data.enabled && <Ionicons name="checkmark" size={16} color="#000" />}
                </View>
                <Ionicons name={icon} size={24} color={colors.text} style={{ marginLeft: 10, marginRight: 10 }} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>{label}</Text>
            </TouchableOpacity>

            {data.enabled && (
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.subText, marginBottom: 5 }}>{t('hourlyRate')} ($)</Text>
                        <View style={[styles.inputBox, { borderColor: colors.border }]}>
                            <TextInput
                                style={{ color: colors.text, fontSize: 16 }}
                                keyboardType="decimal-pad"
                                value={data.hourly}
                                onChangeText={(v) => updatePrice(type, 'hourly', v)}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.subText, marginBottom: 5 }}>{t('dailyRate')} ($)</Text>
                        <View style={[styles.inputBox, { borderColor: colors.border }]}>
                            <TextInput
                                style={{ color: colors.text, fontSize: 16 }}
                                keyboardType="decimal-pad"
                                value={data.daily}
                                onChangeText={(v) => updatePrice(type, 'daily', v)}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('pricing')} (5/8)`} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('selectVehicleTypes')}</Text>
                <Text style={{ color: colors.subText, marginBottom: 20 }}>{t('rateTip')}</Text>

                <VehiclePriceCard type="car" label={t('car')} icon="car-sport-outline" data={vehicles.car} />
                <VehiclePriceCard type="bike" label={t('bike')} icon="bicycle-outline" data={vehicles.bike} />
                <VehiclePriceCard type="heavy" label={t('heavyVehicle')} icon="bus-outline" data={vehicles.heavy} />

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{t('nextFacilities')}</Text>
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
    content: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 5 },
    card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 15 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    inputBox: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, justifyContent: 'center' },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
