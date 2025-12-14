import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';

import Header from "../../components/Header";

export default function AddParkingStep4() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    const [open247, setOpen247] = useState(true);
    const [openTime, setOpenTime] = useState(new Date().setHours(8, 0, 0, 0));
    const [closeTime, setCloseTime] = useState(new Date().setHours(20, 0, 0, 0));
    const [holidays, setHolidays] = useState<string[]>([]);

    // Time Picker State
    const [showOpenPicker, setShowOpenPicker] = useState(false);
    const [showClosePicker, setShowClosePicker] = useState(false);

    const DAYS = [
        { id: 'Mon', label: t('mon') }, { id: 'Tue', label: t('tue') }, { id: 'Wed', label: t('wed') },
        { id: 'Thu', label: t('thu') }, { id: 'Fri', label: t('fri') }, { id: 'Sat', label: t('sat') }, { id: 'Sun', label: t('sun') }
    ];

    useEffect(() => {
        loadDraft();
    }, []);

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("parking_draft_step4");
        if (draft) {
            const data = JSON.parse(draft);
            setOpen247(data.open247);
            if (data.openTime) setOpenTime(data.openTime);
            if (data.closeTime) setCloseTime(data.closeTime);
            setHolidays(data.holidays || []);
        }
    };

    const toggleHoliday = (day: string) => {
        if (holidays.includes(day)) {
            setHolidays(holidays.filter(d => d !== day));
        } else {
            setHolidays([...holidays, day]);
        }
    };

    const handleNext = async () => {
        await AsyncStorage.setItem("parking_draft_step4", JSON.stringify({
            open247, openTime, closeTime, holidays
        }));
        router.push("../business-onboarding/parking-pricing");
    };

    const formatTime = (timestamp: any) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('operatingRules')} (4/8)`} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>

                {/* 24/7 Toggle */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="time-outline" size={24} color={colors.primary} />
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('open247')}</Text>
                        </View>
                        <Switch
                            value={open247}
                            onValueChange={setOpen247}
                            trackColor={{ false: "#333", true: colors.primary }}
                        />
                    </View>
                </View>

                {/* Custom Hours */}
                {!open247 && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={[styles.label, { color: colors.text }]}>{t('openingTime')}</Text>
                        <TouchableOpacity
                            style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setShowOpenPicker(true)}
                        >
                            <Text style={{ color: colors.text, fontSize: 16 }}>{formatTime(openTime)}</Text>
                            <Ionicons name="chevron-down" size={20} color={colors.subText} />
                        </TouchableOpacity>

                        <Text style={[styles.label, { color: colors.text, marginTop: 15 }]}>{t('closingTime')}</Text>
                        <TouchableOpacity
                            style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setShowClosePicker(true)}
                        >
                            <Text style={{ color: colors.text, fontSize: 16 }}>{formatTime(closeTime)}</Text>
                            <Ionicons name="chevron-down" size={20} color={colors.subText} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Holidays */}
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 30 }]}>{t('holidays')}</Text>
                <Text style={{ color: colors.subText, marginBottom: 15 }}>{t('selectHolidays')}</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {DAYS.map((day) => (
                        <TouchableOpacity
                            key={day.id}
                            style={[
                                styles.dayPill,
                                {
                                    backgroundColor: holidays.includes(day.id) ? colors.error : colors.card,
                                    borderColor: holidays.includes(day.id) ? colors.error : colors.border
                                }
                            ]}
                            onPress={() => toggleHoliday(day.id)}
                        >
                            <Text style={{
                                color: holidays.includes(day.id) ? '#FFF' : colors.text,
                                fontWeight: '600'
                            }}>{day.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Time Pickers (Hidden by default) */}
                {showOpenPicker && (
                    <DateTimePicker
                        value={new Date(openTime)}
                        mode="time"
                        onChange={(e, date) => { setShowOpenPicker(false); if (date) setOpenTime(date.getTime()); }}
                    />
                )}
                {showClosePicker && (
                    <DateTimePicker
                        value={new Date(closeTime)}
                        mode="time"
                        onChange={(e, date) => { setShowClosePicker(false); if (date) setCloseTime(date.getTime()); }}
                    />
                )}

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{t('nextPricing')}</Text>
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
    card: { padding: 20, borderRadius: 16, borderWidth: 1 },
    cardTitle: { fontSize: 18, fontWeight: '600' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 15 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 5 },
    dayPill: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
