import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function OwnerOnboardingStep1() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [selected, setSelected] = useState<string | null>(null);

    const BUSINESS_TYPES = [
        { id: 'individual', title: t('individualHost'), desc: t('individualDesc'), icon: 'person' },
        { id: 'business', title: t('parkingBusiness'), desc: t('businessDesc'), icon: 'business' },
        { id: 'mechanic', title: t('serviceCenter'), desc: t('serviceDesc'), icon: 'construct' },
    ];

    const handleNext = () => {
        if (!selected) return;
        router.push("/owner-onboarding/step2");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: 8, backgroundColor: colors.card, borderRadius: 12, marginBottom: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 10 }}>{t('selectBusinessType')}</Text>
                <Text style={{ fontSize: 16, color: colors.subText }}>{t('howPlanUse')}</Text>
            </View>

            <View style={{ flex: 1, padding: 20 }}>
                {BUSINESS_TYPES.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.card,
                                borderColor: selected === item.id ? colors.primary : 'transparent',
                                borderWidth: 2
                            }
                        ]}
                        onPress={() => setSelected(item.id)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBox, { backgroundColor: selected === item.id ? colors.primary : 'rgba(255,255,255,0.05)' }]}>
                            <Ionicons name={item.icon as any} size={28} color={selected === item.id ? '#000' : colors.text} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                            <Text style={[styles.cardDesc, { color: colors.subText }]}>{item.desc}</Text>
                        </View>
                        {selected === item.id && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: selected ? colors.primary : colors.card, opacity: selected ? 1 : 0.5 }]}
                    onPress={handleNext}
                    disabled={!selected}
                >
                    <Text style={[styles.nextBtnText, { color: selected ? '#000' : colors.subText }]}>{t('continue')}</Text>
                    <Ionicons name="arrow-forward" size={20} color={selected ? '#000' : colors.subText} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 15, gap: 15 },
    iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    cardDesc: { fontSize: 13 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700' }
});
