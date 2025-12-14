import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';

export default function GaragePayment() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            router.push({
                pathname: '/Mechanic/garageSuccess',
                params: { ...params, paymentMethod }
            });
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Payment</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>

                <TouchableOpacity
                    style={[
                        styles.methodCard,
                        {
                            backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9',
                            borderColor: paymentMethod === 'card' ? accent : (isDark ? '#333' : '#EEE')
                        }
                    ]}
                    onPress={() => setPaymentMethod('card')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <FontAwesome5 name="credit-card" size={24} color={colors.text} />
                        <Text style={[styles.methodText, { color: colors.text }]}>Credit / Debit Card</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: paymentMethod === 'card' ? accent : '#666' }]}>
                        {paymentMethod === 'card' && <View style={[styles.radioDot, { backgroundColor: accent }]} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.methodCard,
                        {
                            backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9',
                            borderColor: paymentMethod === 'cash' ? accent : (isDark ? '#333' : '#EEE')
                        }
                    ]}
                    onPress={() => setPaymentMethod('cash')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <FontAwesome5 name="money-bill-wave" size={20} color={colors.text} />
                        <Text style={[styles.methodText, { color: colors.text }]}>Pay at Garage</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: paymentMethod === 'cash' ? accent : '#666' }]}>
                        {paymentMethod === 'cash' && <View style={[styles.radioDot, { backgroundColor: accent }]} />}
                    </View>
                </TouchableOpacity>

                <View style={[styles.summary, { backgroundColor: isDark ? 'rgba(57, 255, 20, 0.05)' : '#F0FFF4' }]}>
                    <Text style={[styles.summaryLabel, { color: colors.subText }]}>Amount to be Paid</Text>
                    <Text style={[styles.amount, { color: accent }]}>$15.00</Text>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, { backgroundColor: accent, opacity: processing ? 0.7 : 1 }]}
                    onPress={handlePay}
                    disabled={processing}
                >
                    <Text style={[styles.payText, { color: isDark ? '#FFF' : '#000' }]}>
                        {processing ? "PROCESSING..." : `PAY $15.00`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: '700' },

    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },

    methodCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 20, borderRadius: 16, borderWidth: 2, marginBottom: 15
    },
    methodText: { fontSize: 16, fontWeight: '600' },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioDot: { width: 12, height: 12, borderRadius: 6 },

    summary: { padding: 20, borderRadius: 16, alignItems: 'center', marginTop: 20 },
    summaryLabel: { fontSize: 14, marginBottom: 5 },
    amount: { fontSize: 32, fontWeight: '800' },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 25, paddingBottom: 40 },
    payBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    payText: { fontSize: 18, fontWeight: '800', letterSpacing: 1 }
});
