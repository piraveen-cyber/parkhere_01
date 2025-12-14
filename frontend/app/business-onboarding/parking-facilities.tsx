import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../../components/Header";

export default function AddParkingStep6() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    const [facilities, setFacilities] = useState({
        cctv: false,
        covered: false,
        guard: false,
        ev: false,
        fire: false,
        water: false,
        light: false,
        gate: false
    });

    useEffect(() => {
        loadDraft();
    }, []);

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("parking_draft_step6");
        if (draft) setFacilities(JSON.parse(draft));
    };

    const toggleFacility = (key: string) => {
        setFacilities(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleNext = async () => {
        await AsyncStorage.setItem("parking_draft_step6", JSON.stringify(facilities));
        router.push("../business-onboarding/verification-docs");
    };

    const FacilityItem = ({ id, label, icon }: any) => {
        const active = facilities[id as keyof typeof facilities];
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    {
                        backgroundColor: active ? colors.primary + '20' : colors.card,
                        borderColor: active ? colors.primary : colors.border
                    }
                ]}
                onPress={() => toggleFacility(id)}
            >
                <Ionicons name={icon} size={32} color={active ? colors.primary : colors.subText} />
                <Text style={[styles.itemText, { color: active ? colors.primary : colors.subText }]}>{label}</Text>
                {active && <View style={styles.checkIcon}><Ionicons name="checkmark-circle" size={20} color={colors.primary} /></View>}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('facilities')} (6/8)`} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('securityFeatures')}</Text>
                <View style={styles.grid}>
                    <FacilityItem id="cctv" label={t('cctv')} icon="videocam-outline" />
                    <FacilityItem id="guard" label={t('securityGuard')} icon="shield-checkmark-outline" />
                    <FacilityItem id="gate" label="Gated" icon="lock-closed-outline" />
                    <FacilityItem id="fire" label="Fire Ext." icon="flame-outline" />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 30 }]}>{t('amenities')}</Text>
                <View style={styles.grid}>
                    <FacilityItem id="covered" label={t('covered')} icon="umbrella-outline" />
                    <FacilityItem id="ev" label={t('evCharging')} icon="flash-outline" />
                    <FacilityItem id="light" label="Lighting" icon="bulb-outline" />
                    <FacilityItem id="water" label="Car Wash" icon="water-outline" />
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{t('nextVerification')}</Text>
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
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    item: { width: '48%', aspectRatio: 1.2, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 10, position: 'relative' },
    itemText: { fontSize: 15, fontWeight: '600', marginTop: 10, textAlign: 'center' },
    checkIcon: { position: 'absolute', top: 10, right: 10 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
