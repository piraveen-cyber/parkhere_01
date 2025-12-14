import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParkingDashboard() {
    const router = useRouter();

    const ActionButton = ({ icon, label, color, gradient, onPress }: any) => (
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={onPress}>
            <LinearGradient
                colors={gradient}
                style={styles.actionIcon}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <Ionicons name={icon} size={28} color="#FFF" />
            </LinearGradient>
            <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#000000', '#101010']}
                style={StyleSheet.absoluteFill}
            />

            {/* DECORATIVE BLOB for background ambient light */}
            <View style={styles.ambientLight} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Afternoon,</Text>
                        <Text style={styles.title}>Admin Parking</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => router.push('/partner/parking/profile' as any)}
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.profileBorder}
                        >
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                style={styles.avatar}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* EARNINGS CARD */}
                    <LinearGradient
                        colors={['#1F1F1F', '#141414']}
                        style={styles.heroCard}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="finance" size={24} color="#FFD700" />
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.viewDetailsText}>View Report ›</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.heroLabel}>Total Revenue (Nov)</Text>
                        <Text style={styles.heroValue}>LKR 45,200<Text style={styles.currency}>.00</Text></Text>

                        <View style={styles.heroFooter}>
                            <View style={styles.trendBadge}>
                                <Ionicons name="arrow-up" size={12} color="#000" />
                                <Text style={styles.trendText}>12% vs last week</Text>
                            </View>
                            <Text style={styles.subStat}>8 Active Bookings</Text>
                        </View>
                    </LinearGradient>

                    {/* QUICK ACTIONS */}
                    <Text style={styles.sectionTitle}>Manage Business</Text>
                    <View style={styles.actionsGrid}>
                        <ActionButton
                            icon="add"
                            label="Add Lot"
                            gradient={['#FFD700', '#FFA500']}
                            onPress={() => router.push('/partner/parking/addLot' as any)}
                        />
                        <ActionButton
                            icon="qr-code"
                            label="Scanner"
                            gradient={['#00F260', '#0575E6']}
                            onPress={() => router.push('/partner/parking/scanner' as any)}
                        />
                        <ActionButton
                            icon="car-sport"
                            label="My Lots"
                            gradient={['#4facfe', '#00f2fe']}
                            onPress={() => router.push('/partner/parking/lots' as any)}
                        />
                        <ActionButton
                            icon="receipt"
                            label="Bookings"
                            gradient={['#FF416C', '#FF4B2B']}
                            onPress={() => router.push('/partner/parking/bookings' as any)}
                        />
                    </View>

                    {/* RECENT ACTIVITY */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Check-ins</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                    </View>

                    <View style={styles.activityList}>
                        {[
                            { id: 1, car: 'Toyota Prius (CAB-1234)', time: '10:30 AM', slot: 'A-12', price: '450', status: 'active' },
                            { id: 2, car: 'Honda Civic (CAL-5555)', time: '09:15 AM', slot: 'B-05', price: '800', status: 'completed' },
                            { id: 3, car: 'Nissan Leaf (BGA-8821)', time: 'Yesterday', slot: 'A-01', price: '1200', status: 'completed' }
                        ].map((item, index) => (
                            <LinearGradient
                                key={item.id}
                                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                                style={styles.activityItem}
                            >
                                <View style={[styles.statusIndicator, { backgroundColor: item.status === 'active' ? '#00F260' : '#666' }]} />

                                <View style={styles.activityIconBox}>
                                    <Ionicons name="car" size={20} color="#FFF" />
                                </View>

                                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                                    <Text style={styles.carName}>{item.car}</Text>
                                    <Text style={styles.slotInfo}>Slot {item.slot} • {item.time}</Text>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.priceText}>+{item.price}</Text>
                                    <Text style={[styles.statusText, { color: item.status === 'active' ? '#00F260' : '#AAA' }]}>
                                        {item.status === 'active' ? 'Parked' : 'Paid'}
                                    </Text>
                                </View>
                            </LinearGradient>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    ambientLight: {
        position: 'absolute', top: -50, right: -50, width: 200, height: 200,
        backgroundColor: 'rgba(255, 215, 0, 0.1)', borderRadius: 100,
        shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 50, elevation: 10
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 10 },
    greeting: { fontSize: 14, color: '#888', marginBottom: 4, letterSpacing: 0.5 },
    title: { fontSize: 26, fontWeight: '800', color: '#FFF' },

    profileBtn: {
        shadowColor: "#FFD700", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    },
    profileBorder: { width: 50, height: 50, borderRadius: 25, padding: 2, justifyContent: 'center', alignItems: 'center' },
    avatar: { width: '100%', height: '100%', borderRadius: 25, backgroundColor: '#000' },

    content: { padding: 25, paddingTop: 10, paddingBottom: 100 },

    // HERO CARD
    heroCard: {
        padding: 25, borderRadius: 24, marginBottom: 35,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 215, 0, 0.15)', justifyContent: 'center', alignItems: 'center' },
    viewDetailsText: { color: '#888', fontSize: 12, fontWeight: '600' },

    heroLabel: { fontSize: 14, color: '#BBB', marginBottom: 8 },
    heroValue: { fontSize: 36, fontWeight: '800', color: '#FFF' },
    currency: { fontSize: 20, color: '#888', fontWeight: '600' },

    heroFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 25, justifyContent: 'space-between' },
    trendBadge: { flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 4 },
    trendText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
    subStat: { color: '#888', fontSize: 12, fontWeight: '600' },

    // ACTIONS
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 20 },
    actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    actionBtn: { alignItems: 'center', width: 70 },
    actionIcon: {
        width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10,
        shadowColor: "#FFF", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5
    },
    actionText: { color: '#888', fontSize: 12, fontWeight: '600' },

    // ACTIVITY
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    seeAll: { color: '#FFD700', fontSize: 14, fontWeight: '600' },

    activityList: { gap: 15 },
    activityItem: {
        flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
    },
    statusIndicator: { width: 4, height: 25, borderRadius: 2, marginRight: 15 },
    activityIconBox: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center'
    },
    carName: { color: '#FFF', fontSize: 15, fontWeight: '600', marginBottom: 2 },
    slotInfo: { color: '#666', fontSize: 12 },
    priceText: { color: '#FFD700', fontSize: 16, fontWeight: '700', marginBottom: 2 },
    statusText: { fontSize: 10, fontWeight: '600' }
});
