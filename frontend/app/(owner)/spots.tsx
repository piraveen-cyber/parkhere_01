import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function MySpots() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const mySpots = [
        { id: '1', name: "Downtown Garage", status: "Active", earnings: "$120.50", image: null },
        { id: '2', name: "Suburban Driveway", status: "Pending", earnings: "$0.00", image: null },
    ];

    const renderSpot = ({ item }: any) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}>
                <Ionicons name="image-outline" size={30} color={colors.subText} />
            </View>
            <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#4CAF5020' : '#FF980020' }]}>
                        <Text style={{ color: item.status === 'Active' ? '#4CAF50' : '#FF9800', fontSize: 10, fontWeight: '700' }}>{t(item.status.toLowerCase()).toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={{ color: colors.subText, fontSize: 12, marginTop: 4 }}>{t('earnings')}: {item.earnings}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('myParkingSpots')}</Text>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => router.push("/add-parking/step1")}>
                    <Ionicons name="add" size={28} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={mySpots}
                renderItem={renderSpot}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20 }}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: colors.subText }}>{t('noSpots')}</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: "700" },
    card: { flexDirection: 'row', borderRadius: 16, marginBottom: 15, overflow: 'hidden', padding: 10 },
    imagePlaceholder: { width: 80, height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardContent: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
    cardTitle: { fontSize: 16, fontWeight: "700" },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
