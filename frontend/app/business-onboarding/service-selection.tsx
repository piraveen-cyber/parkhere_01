import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

export default function ServiceSelectionStep() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    useEffect(() => {
        loadDraft();
    }, []);

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("onboarding_services");
        if (draft) {
            setSelectedServices(JSON.parse(draft));
        }
    };

    const toggleService = (id: string) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(selectedServices.filter(s => s !== id));
        } else {
            setSelectedServices([...selectedServices, id]);
        }
    };

    const handleNext = async () => {
        if (selectedServices.length === 0) {
            Alert.alert(t('error'), t('selectAtLeastOne'));
            return;
        }
        await AsyncStorage.setItem("onboarding_services", JSON.stringify(selectedServices));

        // Always go to Personal Details next (Old Step 1)
        router.push("../business-onboarding/personal-details");
    };

    const ServiceCard = ({ id, label, icon, color }: any) => {
        const isSelected = selectedServices.includes(id);
        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: isSelected ? color + '20' : colors.card,
                        borderColor: isSelected ? color : colors.border
                    }
                ]}
                onPress={() => toggleService(id)}
            >
                <View style={[styles.iconBox, { backgroundColor: isSelected ? color : colors.background }]}>
                    <Ionicons name={icon} size={28} color={isSelected ? '#FFF' : colors.subText} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{label}</Text>
                    <Text style={{ fontSize: 12, color: colors.subText }}>{isSelected ? t('selected') : t('tapToSelect')}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={color} />}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={t('serviceSelection')} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={{ color: colors.subText, marginBottom: 20 }}>{t('selectServiceHint')}</Text>

                <ServiceCard id="parking" label={t('parking')} icon="car-sport" color="#4F46E5" />
                <ServiceCard id="mechanic" label={t('mechanic')} icon="construct" color="#E11D48" />
                <ServiceCard id="wash" label={t('vehicleWash')} icon="water" color="#0EA5E9" />
                <ServiceCard id="towing" label={t('towing')} icon="build" color="#D97706" />
                <ServiceCard id="rental" label={t('rental')} icon="key" color="#10B981" />
                <ServiceCard id="ev" label={t('evCharging')} icon="flash" color="#F59E0B" />

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: selectedServices.length > 0 ? 1 : 0.5 }]}
                    onPress={handleNext}
                    disabled={selectedServices.length === 0}
                >
                    <Text style={styles.nextBtnText}>{t('nextPersonal')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 15, gap: 15 },
    iconBox: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
