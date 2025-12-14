import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

export default function JobCompletion() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    // Simulated Final Bill Data
    const initialTotal = params.price ? Number(params.price) : 2500;
    const partsCost = 4500; // Example additional cost
    const finalTotal = initialTotal + partsCost;

    const handleFinish = () => {
        // Navigate to Rate Mechanic Screen
        router.push({
            pathname: '/Mechanic/rateMechanic',
            params: { mechanic: JSON.stringify(mechanic) }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={isDark ? ['#0D1B2A', '#1B263B', '#000'] : ['#FFF', '#F0F2F5']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 100 }}>

                {/* SUCCESS HEADER */}
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark-done" size={40} color="#FFF" />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Job Completed!</Text>
                    <Text style={{ color: colors.subText }}>Service successfully finished.</Text>
                </View>

                {/* MECHANIC INFO */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
                    <View style={styles.mechRow}>
                        <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={[styles.mechName, { color: colors.text }]}>Service by {mechanic.name}</Text>
                            <Text style={{ color: colors.subText, fontSize: 12 }}>{new Date().toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* BILL BREAKDOWN */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF', marginTop: 15 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>FINAL BILL</Text>

                    <View style={styles.row}>
                        <Text style={{ color: colors.text }}>Service Fee</Text>
                        <Text style={{ color: colors.text }}>LKR {initialTotal}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ color: colors.text }}>Parts (Oil Filter, Coolant)</Text>
                        <Text style={{ color: colors.text }}>LKR {partsCost}</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#EEE' }]} />

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: accent }]}>Paid Total</Text>
                        <Text style={[styles.totalVal, { color: accent }]}>LKR {finalTotal}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,255,0,0.1)' }]}>
                        <Text style={styles.statusText}>PAYMENT COMPLETED</Text>
                    </View>
                </View>

            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#000' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.doneBtn, { backgroundColor: accent }]}
                    onPress={handleFinish}
                >
                    <Text style={styles.doneText}>CONTINUE</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
    iconCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginBottom: 15,
        shadowColor: "#4CAF50", shadowOpacity: 0.4, shadowRadius: 10
    },
    title: { fontSize: 24, fontWeight: '800', marginBottom: 5 },

    card: { borderRadius: 16, padding: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 15, letterSpacing: 1 },

    mechRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333' },
    mechName: { fontSize: 16, fontWeight: '700' },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    divider: { height: 1, marginVertical: 10 },

    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    totalLabel: { fontSize: 16, fontWeight: '700' },
    totalVal: { fontSize: 20, fontWeight: '800' },

    statusBadge: {
        alignSelf: 'flex-start', marginTop: 10,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6
    },
    statusText: { color: '#00FF00', fontSize: 10, fontWeight: '700' },

    starRow: { flexDirection: 'row', marginBottom: 20 },
    input: {
        width: '100%', height: 80, borderRadius: 12, borderWidth: 1,
        padding: 15, textAlignVertical: 'top'
    },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40, borderTopWidth: 1
    },
    doneBtn: {
        height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowColor: '#FFD400', shadowOpacity: 0.3, shadowRadius: 10
    },
    doneText: { fontSize: 18, fontWeight: '800', color: '#000', letterSpacing: 0.5 }
});
