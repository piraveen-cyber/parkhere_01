import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';

const MOCK_HISTORY = [
    {
        id: 'b1',
        mechanicName: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        serviceType: 'Roadside Assistance',
        date: '12 Dec, 2024 • 10:30 AM',
        status: 'Completed',
        price: 'LKR 4,500',
        rating: 5,
        location: 'Colombo 07'
    },
    {
        id: 'b2',
        mechanicName: 'Nimal Auto Fix',
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
        serviceType: 'Battery Replacement',
        date: '05 Nov, 2024 • 02:15 PM',
        status: 'Completed',
        price: 'LKR 12,000',
        rating: 4,
        location: 'Rajagiriya'
    },
    {
        id: 'b3',
        mechanicName: 'City Garage',
        photo: 'https://randomuser.me/api/portraits/men/22.jpg',
        serviceType: 'Engine Checkup',
        date: '20 Oct, 2024 • 09:00 AM',
        status: 'Cancelled',
        price: 'LKR 0',
        rating: 0,
        location: 'Nugegoda'
    }
];

export default function MyMechanicBookings() {
    const router = useRouter();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const handleRebook = (item: any) => {
        // Navigate to Mechanic Profile for Rebooking
        router.push({
            pathname: '/Mechanic/mechanicProfile',
            params: {
                mechanic: JSON.stringify({
                    name: item.mechanicName,
                    photo: item.photo,
                    rating: 4.8, // Fallback/Mock
                    id: 'm1' // Mock
                })
            }
        });
    };

    const handleInvoice = () => {
        Alert.alert("Download Invoice", "Invoice PDF has been saved to your downloads.");
    };

    const handleIssue = () => {
        Alert.alert("Report Issue", "Contact Support regarding this booking?", [
            { text: "Call Support", onPress: () => console.log("Call") },
            { text: "Chat", onPress: () => console.log("Chat") },
            { text: "Cancel", style: 'cancel' }
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF' }]}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Completed' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'Completed' ? '#00FF00' : '#FF0000' }
                    ]}>{item.status}</Text>
                </View>
                <Text style={{ color: colors.subText, fontSize: 12 }}>{item.date}</Text>
            </View>

            {/* Content */}
            <View style={styles.mainRow}>
                <Image source={{ uri: item.photo }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={[styles.mechName, { color: colors.text }]}>{item.mechanicName}</Text>
                    <Text style={{ color: colors.subText, fontSize: 13 }}>{item.serviceType}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="location-outline" size={12} color={colors.subText} />
                        <Text style={{ color: colors.subText, fontSize: 12, marginLeft: 2 }}>{item.location}</Text>
                    </View>
                </View>
                <Text style={[styles.price, { color: accent }]}>{item.price}</Text>
            </View>

            {/* Actions */}
            <View style={[styles.actionRow, { borderTopColor: isDark ? '#333' : '#EEE' }]}>
                {item.status === 'Completed' ? (
                    <>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleInvoice}>
                            <Ionicons name="document-text-outline" size={18} color={colors.text} />
                            <Text style={[styles.actionText, { color: colors.text }]}>Invoice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleRebook(item)}>
                            <Ionicons name="refresh" size={18} color={accent} />
                            <Text style={[styles.actionText, { color: accent }]}>Rebook</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={[styles.actionBtn, { width: '100%' }]} onPress={handleIssue}>
                        <Ionicons name="alert-circle-outline" size={18} color="#FF4444" />
                        <Text style={[styles.actionText, { color: "#FF4444" }]}>Report Issue</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

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
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
                    <Text style={[styles.subtitle, { color: colors.subText }]}>History & Invoices</Text>
                </View>
            </View>

            <FlatList
                contentContainerStyle={{ padding: 25, paddingBottom: 50 }}
                data={MOCK_HISTORY}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: '#666' }}>No booking history.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center'
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center', marginRight: 15
    },
    title: { fontSize: 24, fontWeight: '800' },
    subtitle: { fontSize: 14, marginTop: 4 },

    card: {
        borderRadius: 16, padding: 15, marginBottom: 15,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },

    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

    mainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333' },
    mechName: { fontSize: 16, fontWeight: '700' },
    price: { fontSize: 16, fontWeight: '700' },

    actionRow: {
        flexDirection: 'row', borderTopWidth: 1, paddingTop: 12, justifyContent: 'space-around'
    },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontWeight: '600', fontSize: 14 }
});
