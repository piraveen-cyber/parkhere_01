import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ParkingDashboard() {
    const router = useRouter();

    const ActionButton = ({ icon, label, color, gradient, onPress }: any) => (
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={onPress}>
            <LinearGradient
                colors={gradient}
                style={styles.actionIcon}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <Ionicons name={icon} size={24} color="#FFF" />
            </LinearGradient>
            <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
    );

    const RevenueBar = ({ day, height, active }: any) => (
        <View style={styles.barContainer}>
            <View style={[styles.bar, { height: height, backgroundColor: active ? '#FFD700' : '#333' }]} />
            <Text style={[styles.barLabel, active && { color: '#FFF' }]}>{day}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#000000', '#0a0a0a']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.title}>ParkHere Admin</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => router.push('/partner/parking/profile' as any)}
                    >
                        <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.avatarBorder}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                style={styles.avatar}
                            />
                        </LinearGradient>
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* ANALYTICS CARD (HERO) */}
                    <LinearGradient
                        colors={['#1F1F1F', '#111']}
                        style={styles.heroCard}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.cardTop}>
                            <View>
                                <Text style={styles.heroLabel}>Weekly Revenue</Text>
                                <Text style={styles.heroValue}>LKR 45,200<Text style={styles.currency}>.00</Text></Text>
                            </View>
                            <TouchableOpacity style={styles.reportBtn} onPress={() => router.push('/partner/parking/reports' as any)}>
                                <Text style={styles.reportText}>Report ›</Text>
                            </TouchableOpacity>
                        </View>

                        {/* GRAPH */}
                        <View style={styles.graphContainer}>
                            <RevenueBar day="M" height={20} />
                            <RevenueBar day="T" height={35} />
                            <RevenueBar day="W" height={25} />
                            <RevenueBar day="T" height={50} active />
                            <RevenueBar day="F" height={40} />
                            <RevenueBar day="S" height={60} />
                            <RevenueBar day="S" height={55} />
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons name="car" size={16} color="#FFD700" />
                                <Text style={styles.statText}>128 Parked</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="time" size={16} color="#00C851" />
                                <Text style={styles.statText}>Avg 3.2 hrs</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* LIVE STATUS */}
                    <Text style={styles.sectionTitle}>Live Status</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveScroll}>

                        <TouchableOpacity style={styles.liveCard}>
                            <View style={styles.liveHeader}>
                                <Text style={styles.lotName}>Galle Road Lot</Text>
                                <View style={[styles.badge, { backgroundColor: 'rgba(0, 200, 81, 0.2)' }]}>
                                    <View style={[styles.dot, { backgroundColor: '#00C851' }]} />
                                    <Text style={[styles.badgeText, { color: '#00C851' }]}>OPEN</Text>
                                </View>
                            </View>
                            <Text style={styles.occupancy}>12<Text style={styles.capacity}>/20</Text></Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '60%', backgroundColor: '#00C851' }]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.liveCard}>
                            <View style={styles.liveHeader}>
                                <Text style={styles.lotName}>Kandy Center</Text>
                                <View style={[styles.badge, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                                    <View style={[styles.dot, { backgroundColor: '#FF4444' }]} />
                                    <Text style={[styles.badgeText, { color: '#FF4444' }]}>FULL</Text>
                                </View>
                            </View>
                            <Text style={styles.occupancy}>50<Text style={styles.capacity}>/50</Text></Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '100%', backgroundColor: '#FF4444' }]} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.liveCard, { borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' }]}
                            onPress={() => router.push('/partner/parking/addLot' as any)}
                        >
                            <Ionicons name="add" size={30} color="#666" />
                            <Text style={{ color: '#666', fontWeight: 'bold', marginTop: 5 }}>Add Lot</Text>
                        </TouchableOpacity>

                    </ScrollView>

                    {/* QUICK ACTIONS */}
                    <Text style={styles.sectionTitle}>Quick Management</Text>
                    <View style={styles.actionsGrid}>
                        <ActionButton
                            icon="qr-code-outline" label="Scanner"
                            gradient={['#00F260', '#0575E6']}
                            onPress={() => router.push('/partner/parking/scanner' as any)}
                        />
                        <ActionButton
                            icon="people-outline" label="Staff"
                            gradient={['#FFD700', '#FFA500']}
                            onPress={() => router.push('/partner/parking/staff' as any)}
                        />
                        <ActionButton
                            icon="list-outline" label="My Lots"
                            gradient={['#4facfe', '#00f2fe']}
                            onPress={() => router.push('/partner/parking/lots' as any)}
                        />
                    </View>
                    <View style={styles.actionsGrid}>
                        <ActionButton
                            icon="calendar-outline" label="Bookings"
                            gradient={['#FF416C', '#FF4B2B']}
                            onPress={() => router.push('/partner/parking/bookings' as any)}
                        />
                        <ActionButton
                            icon="stats-chart-outline" label="Reports"
                            gradient={['#8E2DE2', '#4A00E0']}
                            onPress={() => router.push('/partner/parking/reports' as any)}
                        />
                        <ActionButton
                            icon="star-outline" label="Reviews"
                            gradient={['#f12711', '#f5af19']}
                            onPress={() => router.push('/partner/parking/reviews' as any)}
                        />
                    </View>

                    {/* RECENT ACTIVITY */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
                    </View>

                    <LinearGradient colors={['rgba(255,255,255,0.05)', 'transparent']} style={styles.activityItem}>
                        <View style={styles.activityIcon}>
                            <Ionicons name="car" size={20} color="#FFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.activityTitle}>Check-in: Toyota Prius</Text>
                            <Text style={styles.activitySub}>10:30 AM • Galle Road Lot</Text>
                        </View>
                        <Text style={styles.activityValue}>+450</Text>
                    </LinearGradient>

                    <LinearGradient colors={['rgba(255,255,255,0.05)', 'transparent']} style={styles.activityItem}>
                        <View style={[styles.activityIcon, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                            <Ionicons name="exit" size={20} color="#FF4444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.activityTitle}>Check-out: Honda Civic</Text>
                            <Text style={styles.activitySub}>09:15 AM • Kandy Center</Text>
                        </View>
                        <Text style={styles.activityValue}>+800</Text>
                    </LinearGradient>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    greeting: { color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
    title: { color: '#FFF', fontSize: 24, fontWeight: '800' },
    profileBtn: { position: 'relative' },
    avatarBorder: { width: 44, height: 44, borderRadius: 22, padding: 2, alignItems: 'center', justifyContent: 'center' },
    avatar: { width: '100%', height: '100%', borderRadius: 22, backgroundColor: '#222' },
    notificationDot: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF4444', borderWidth: 2, borderColor: '#000' },

    content: { padding: 25, paddingTop: 10, paddingBottom: 100 },

    // HERO CARD
    heroCard: { borderRadius: 24, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 30 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    heroLabel: { color: '#AAA', fontSize: 13, marginBottom: 5 },
    heroValue: { color: '#FFF', fontSize: 32, fontWeight: '800' },
    currency: { fontSize: 18, color: '#888', fontWeight: 'bold' },
    reportBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    reportText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

    graphContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, marginVertical: 20 },
    barContainer: { alignItems: 'center', gap: 8 },
    bar: { width: 8, borderRadius: 4 },
    barLabel: { color: '#666', fontSize: 10, fontWeight: 'bold' },

    statsRow: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { color: '#CCC', fontSize: 12, fontWeight: '600' },

    // SECTIONS
    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    seeAll: { color: '#FFD700', fontSize: 13, fontWeight: '600' },

    // LIVE STATUS
    liveScroll: { marginBottom: 35, paddingRight: 25 },
    liveCard: { width: 160, backgroundColor: '#161616', borderRadius: 20, padding: 15, marginRight: 15, borderWidth: 1, borderColor: '#333' },
    liveHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    lotName: { color: '#FFF', fontSize: 12, fontWeight: 'bold', width: '60%' },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, gap: 4 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    badgeText: { fontSize: 8, fontWeight: 'bold' },
    occupancy: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    capacity: { color: '#666', fontSize: 14 },
    progressBar: { height: 4, backgroundColor: '#333', borderRadius: 2, marginTop: 10, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 },

    // ACTIONS
    actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    actionBtn: { alignItems: 'center', width: 70 },
    actionIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#FFD700', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 5 },
    actionText: { color: '#888', fontSize: 11, fontWeight: '600' },

    // ACTIVITY
    activityItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    activityIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    activityTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
    activitySub: { color: '#666', fontSize: 11 },
    activityValue: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 }
});
