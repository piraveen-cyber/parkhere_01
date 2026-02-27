import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function OwnerDashboard() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    // Mock Data
    const stats = [
        { label: t('todaysEarnings'), value: "$42.50", icon: "cash-outline", color: "#4CAF50" },
        { label: t('activeBookings'), value: "3", icon: "people-outline", color: "#2196F3" },
        { label: t('occupancy'), value: "85%", icon: "pie-chart-outline", color: "#FF9800" },
    ];

    const recentActivity = [
        { id: 1, user: "John Doe", action: t('checkedIn'), time: "10:00 AM", spot: "A1" },
        { id: 2, user: "Jane Smith", action: t('booked'), time: "09:30 AM", spot: "B3" },
        { id: 3, user: "Mike Ross", action: t('checkedOut'), time: "08:45 AM", spot: "A1" },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.subText }]}>{t('goodMorning')},</Text>
                        <Text style={[styles.name, { color: colors.text }]}>{t('hostPartner')}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        onPress={() => router.push("../business-onboarding/service-selection")}
                    >
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
                            <View style={[styles.iconBox, { backgroundColor: `${stat.color}20` }]}>
                                <Ionicons name={stat.icon as any} size={22} color={stat.color} />
                            </View>
                            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.subText }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Chart Placeholder */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('earningsOverview')}</Text>
                    <View style={{ height: 150, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: colors.subText }}>{t('chartPlaceholder')}</Text>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recentActivity')}</Text>
                    <TouchableOpacity><Text style={{ color: colors.primary }}>{t('seeAll')}</Text></TouchableOpacity>
                </View>

                {recentActivity.map((item) => (
                    <View key={item.id} style={[styles.activityItem, { backgroundColor: colors.card }]}>
                        <View style={styles.activityLeft}>
                            <View style={[styles.avatar, { backgroundColor: colors.border }]}>
                                <Ionicons name="person" size={16} color={colors.subText} />
                            </View>
                            <View>
                                <Text style={[styles.activityUser, { color: colors.text }]}>{item.user}</Text>
                                <Text style={[styles.activityAction, { color: colors.subText }]}>{item.action} • {item.spot}</Text>
                            </View>
                        </View>
                        <Text style={[styles.activityTime, { color: colors.subText }]}>{item.time}</Text>
                    </View>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    greeting: { fontSize: 14 },
    name: { fontSize: 24, fontWeight: "700" },
    addBtn: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, paddingHorizontal: 20, marginBottom: 25 },
    statCard: { width: (width - 55) / 2, padding: 15, borderRadius: 20, gap: 10 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
    statValue: { fontSize: 22, fontWeight: "700" },
    statLabel: { fontSize: 12 },

    section: { marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "700" },

    activityItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 16 },
    activityLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    activityUser: { fontSize: 16, fontWeight: "600" },
    activityAction: { fontSize: 12 },
    activityTime: { fontSize: 12 },
});
