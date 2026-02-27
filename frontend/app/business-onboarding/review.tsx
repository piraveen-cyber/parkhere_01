import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../../components/Header";

export default function AddParkingStep8() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const [agreed, setAgreed] = useState(false);

    // Summary State
    const [summary, setSummary] = useState<any>({});

    useEffect(() => {
        loadAllDrafts();
    }, []);

    const loadAllDrafts = async () => {
        const keys = [
            "parking_draft_step1", "parking_draft_step2", "parking_draft_step3",
            "parking_draft_step4", "parking_draft_step5", "parking_draft_step6"
        ];
        const result = await AsyncStorage.multiGet(keys);
        const data: any = {};
        result.forEach(([key, value]) => {
            if (value) data[key] = JSON.parse(value);
        });
        setSummary(data);
    };

    const handleSubmit = async () => {
        if (!agreed) {
            Alert.alert(t('error'), t('agreeTerms'));
            return;
        }

        setSubmitting(true);
        // Simulate API Call
        setTimeout(async () => {
            setSubmitting(false);
            Alert.alert(t('applicationSubmitted'), t('underReviewMsg'), [
                {
                    text: t('goToDashboard'),
                    onPress: async () => {
                        // Clear drafts
                        const keys = [
                            "parking_draft_step1", "parking_draft_step2", "parking_draft_step3",
                            "parking_draft_step4", "parking_draft_step5", "parking_draft_step6"
                        ];
                        await AsyncStorage.multiRemove(keys);
                        router.replace("/(owner)/dashboard");
                    }
                }
            ]);
        }, 2000);
    };

    const InfoRow = ({ label, value }: any) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: colors.subText }}>{label}</Text>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{value || '-'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('reviewSubmission')} (8/8)`} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Identity */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('personalDetails')}</Text>
                    <InfoRow label={t('name')} value={summary.parking_draft_step1?.name} />
                    <InfoRow label={t('phoneNumber')} value={summary.parking_draft_step1?.phone} />
                </View>

                {/* Parking Info */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('parkingDetails')}</Text>
                    <InfoRow label="Type" value={summary.parking_draft_step2?.businessType} />
                    <InfoRow label={t('parkingName')} value={summary.parking_draft_step2?.parkingName} />
                    <InfoRow label={t('address')} value={summary.parking_draft_step3?.address} />
                </View>

                {/* Pricing */}
                <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('pricing')}</Text>
                    {summary.parking_draft_step5?.car?.enabled && (
                        <InfoRow label="Car Rate" value={`$${summary.parking_draft_step5.car.hourly}/hr`} />
                    )}
                    {summary.parking_draft_step5?.bike?.enabled && (
                        <InfoRow label="Bike Rate" value={`$${summary.parking_draft_step5.bike.hourly}/hr`} />
                    )}
                </View>

                {/* Terms */}
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
                    onPress={() => setAgreed(!agreed)}
                >
                    <View style={[styles.checkbox, { borderColor: agreed ? colors.primary : colors.subText, backgroundColor: agreed ? colors.primary : 'transparent' }]}>
                        {agreed && <Ionicons name="checkmark" size={16} color="#000" />}
                    </View>
                    <Text style={{ marginLeft: 10, color: colors.text, fontSize: 16 }}>{t('agreeTerms')}</Text>
                </TouchableOpacity>

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: agreed ? 1 : 0.5 }]}
                    onPress={handleSubmit}
                    disabled={!agreed || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.submitBtnText}>{t('submitApplication')}</Text>
                    )}
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
    section: { padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    footer: { padding: 20, borderTopWidth: 1 },
    submitBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    submitBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
