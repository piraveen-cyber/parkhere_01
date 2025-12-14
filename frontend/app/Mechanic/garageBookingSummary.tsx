import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';

export default function GarageBookingSummary() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const garage = params.garage ? JSON.parse(params.garage as string) : {};
    const timeSlot = params.timeSlot || '09:00 AM';

    const handleConfirm = () => {
        router.push({
            pathname: '/Mechanic/garagePayment',
            params: { ...params }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Booking Summary</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Garage Card */}
                <View style={[styles.card, { backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9', borderColor: isDark ? '#333' : '#EEE' }]}>
                    <Image source={{ uri: garage.image }} style={styles.garageImg} />
                    <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={[styles.name, { color: colors.text }]}>{garage.name}</Text>
                        <Text style={[styles.address, { color: colors.subText }]}>{garage.address}</Text>
                    </View>
                </View>

                {/* Details */}
                <View style={[styles.detailsContainer, { backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9' }]}>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.subText }]}>Service Type</Text>
                        <Text style={[styles.value, { color: colors.text }]}>Garage Visit</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#EEE' }]} />
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.subText }]}>Time Slot</Text>
                        <Text style={[styles.value, { color: accent, fontWeight: '800' }]}>{timeSlot}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#EEE' }]} />
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.subText }]}>Date</Text>
                        <Text style={[styles.value, { color: colors.text }]}>Today</Text>
                    </View>
                </View>

                {/* Cost */}
                <View style={[styles.costContainer, { borderColor: accent }]}>
                    <Text style={[styles.costLabel, { color: colors.text }]}>Total to Pay</Text>
                    <Text style={[styles.totalPrice, { color: accent }]}>$15.00</Text>
                </View>

            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={[styles.payBtn, { backgroundColor: accent }]} onPress={handleConfirm}>
                    <Text style={[styles.payText, { color: isDark ? '#FFF' : '#000' }]}>PROCEED TO PAYMENT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20
    },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: '700' },

    content: { padding: 25 },

    card: {
        flexDirection: 'row', alignItems: 'center', padding: 15,
        borderRadius: 16, borderWidth: 1, marginBottom: 25
    },
    garageImg: { width: 60, height: 60, borderRadius: 10 },
    name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    address: { fontSize: 12 },

    detailsContainer: { borderRadius: 16, padding: 20, marginBottom: 25 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    divider: { height: 1, marginVertical: 10 },
    label: { fontSize: 14 },
    value: { fontSize: 15, fontWeight: '600' },

    costContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed'
    },
    costLabel: { fontSize: 16, fontWeight: '700' },
    totalPrice: { fontSize: 24, fontWeight: '800' },

    footer: { padding: 25, paddingBottom: 40 },
    payBtn: {
        height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 4 }
    },
    payText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 }
});
