import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { supabase } from '../../config/supabaseClient';
import api from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookingSummary() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    // Parse Data
    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {};
    const issues = params.issues ? JSON.parse(params.issues as string) : [];
    const basePrice = params.price ? Number(params.price) : 1500;
    const bookingType = params.bookingType || 'Roadside';

    // State
    const [mode, setMode] = useState<'instant' | 'scheduled'>('instant');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fees
    const visitFee = 500; // Fixed visit fee
    const tax = (basePrice + visitFee) * 0.1; // 10% tax
    const total = basePrice + visitFee + tax;

    const handleConfirm = () => {
        // Route to Payment Screen
        router.push({
            pathname: '/Mechanic/mechanicPayment',
            params: {
                ...params,
                mechanic: JSON.stringify(mechanic),
                bookingType: mode === 'instant' ? 'Instant' : 'Scheduled',
                scheduleTime: mode === 'scheduled' ? date.toISOString() : null,
                notes: `Issues: ${issues.join(', ')}`,
                price: total // Pass the calculated total
            }
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={isDark ? ['#0D1B2A', '#1B263B', '#000'] : ['#FFF', '#F0F2F5']}
                style={StyleSheet.absoluteFill}
            />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={isDark ? "#FFF" : "#000"} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Booking Summary</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 120 }}>

                {/* MECHANIC CARD */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>MECHANIC</Text>
                    <View style={styles.mechanicRow}>
                        <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={[styles.mechName, { color: colors.text }]}>{mechanic.name}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#FFD400" />
                                <Text style={[styles.ratingText, { color: colors.text }]}>{mechanic.rating}</Text>
                            </View>
                        </View>
                        {mode === 'instant' && (
                            <View style={styles.etaBadge}>
                                <Text style={styles.etaText}>~25 min ETA</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* BOOKING OPTION TOGGLE */}
                <View style={[styles.toggleContainer, { backgroundColor: isDark ? '#1F2937' : '#E5E7EB' }]}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, mode === 'instant' && { backgroundColor: accent }]}
                        onPress={() => setMode('instant')}
                    >
                        <Text style={[styles.toggleText, { color: mode === 'instant' ? '#000' : colors.text }]}>Instant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, mode === 'scheduled' && { backgroundColor: accent }]}
                        onPress={() => setMode('scheduled')}
                    >
                        <Text style={[styles.toggleText, { color: mode === 'scheduled' ? '#000' : colors.text }]}>Scheduled</Text>
                    </TouchableOpacity>
                </View>

                {/* SCHEDULE PICKER */}
                {mode === 'scheduled' && (
                    <TouchableOpacity
                        style={[styles.datePickerBtn, { borderColor: accent }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={accent} />
                        <Text style={[styles.dateText, { color: colors.text }]}>
                            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                )}

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}

                {/* DETAILS CARD */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF', marginTop: 20 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>DETAILS</Text>

                    <View style={styles.row}>
                        <Text style={{ color: colors.subText }}>Location</Text>
                        <Text style={[styles.val, { color: colors.text }]} numberOfLines={1}>{params.location}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={{ color: colors.subText }}>Problem(s)</Text>
                        <Text style={[styles.val, { color: colors.text }]}>{issues.join(', ') || 'General'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={{ color: colors.subText }}>Service Type</Text>
                        <Text style={[styles.val, { color: colors.text }]}>{bookingType}</Text>
                    </View>
                </View>

                {/* PRICE BREAKDOWN */}
                <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF', marginTop: 20 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.subText }]}>ESTIMATION</Text>

                    <View style={styles.priceRow}>
                        <Text style={{ color: colors.text }}>Service Fee</Text>
                        <Text style={{ color: colors.text }}>LKR {basePrice}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={{ color: colors.text }}>Visit Fee</Text>
                        <Text style={{ color: colors.text }}>LKR {visitFee}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={{ color: colors.text }}>Tax (10%)</Text>
                        <Text style={{ color: colors.text }}>LKR {tax}</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: '#444' }]} />

                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: accent }]}>Total Estimate</Text>
                        <Text style={[styles.totalVal, { color: accent }]}>LKR {total}</Text>
                    </View>

                    <View style={styles.noteBox}>
                        <Ionicons name="information-circle-outline" size={14} color="#888" />
                        <Text style={styles.noteText}>Parts cost is NOT included and will be added after diagnosis.</Text>
                    </View>
                </View>

            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#000' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: accent, opacity: submitting ? 0.7 : 1 }]}
                    onPress={handleConfirm}
                    disabled={submitting}
                >
                    <Text style={styles.confirmText}>PROCEED TO PAYMENT</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center', gap: 15
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center'
    },
    title: { fontSize: 20, fontWeight: '700' },

    card: { borderRadius: 16, padding: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 15, letterSpacing: 1 },

    mechanicRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333' },
    mechName: { fontSize: 16, fontWeight: '700' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 12 },
    etaBadge: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    etaText: { fontSize: 10, fontWeight: '700', color: '#FFF' },

    toggleContainer: {
        flexDirection: 'row', borderRadius: 12, padding: 4, marginTop: 20
    },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    toggleText: { fontWeight: '700', fontSize: 14 },

    datePickerBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        marginTop: 15, padding: 12, borderWidth: 1, borderRadius: 12, borderStyle: 'dashed'
    },
    dateText: { fontSize: 16, fontWeight: '600' },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    val: { fontWeight: '600', maxWidth: '60%' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },

    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    totalLabel: { fontSize: 16, fontWeight: '700' },
    totalVal: { fontSize: 20, fontWeight: '800' },

    noteBox: {
        flexDirection: 'row', gap: 6, marginTop: 15,
        padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8
    },
    noteText: { fontSize: 11, color: '#888', flex: 1 },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40, borderTopWidth: 1
    },
    confirmBtn: {
        height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowColor: '#FFD400', shadowOpacity: 0.3, shadowRadius: 10
    },
    confirmText: { fontSize: 18, fontWeight: '800', color: '#000', letterSpacing: 0.5 }
});
