import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GarageDashboard() {
    const router = useRouter();
    const [stats] = useState({
        revenue: 45200,
        appointments: 8,
        rating: 4.7
    });

    const QuickAction = ({ icon, label, color, route }: any) => (
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(route)}>
            <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.actionText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#000000', '#0a0a1a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.profileHeader}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1487754180477-db33d3808b14?w=400&auto=format&fit=crop&q=60' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Welcome,</Text>
                            <Text style={styles.name}>AutoFix Center</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => router.push('/partner/garage/profile' as any)}
                    >
                        <Ionicons name="settings-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* STATUS CARD */}
                    <LinearGradient
                        colors={['#2962FF', '#0039Cb']}
                        style={styles.statusCard}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.statusRow}>
                            <View>
                                <Text style={styles.statusLabel}>TODAY'S OVERVIEW</Text>
                                <Text style={styles.statusValue}>{stats.appointments} Appointments</Text>
                            </View>
                            <View style={styles.iconOpac}>
                                <MaterialCommunityIcons name="calendar-clock" size={40} color="#FFF" />
                            </View>
                        </View>
                        <Text style={styles.statusSub}>3 In Progress • 2 Completed • 3 Pending</Text>
                    </LinearGradient>

                    {/* STATS ROW */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Revenue</Text>
                            <Text style={styles.statValue}>LKR {stats.revenue.toLocaleString()}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Rating</Text>
                            <Text style={styles.statValue}>{stats.rating} ★</Text>
                        </View>
                    </View>

                    {/* QUICK ACTIONS */}
                    <Text style={styles.sectionTitle}>Manage Workshop</Text>
                    <View style={styles.actionsGrid}>
                        <QuickAction icon="calendar-outline" label="Appointments" color="#2962FF" route="/partner/garage/appointments" />
                        <QuickAction icon="list-outline" label="Services" color="#00E5FF" route="/partner/garage/services" />
                        <QuickAction icon="stats-chart-outline" label="Reports" color="#FFD700" route="/partner/garage/reports" />
                        <QuickAction icon="star-outline" label="Reviews" color="#FF4444" route="/partner/garage/reviews" />
                    </View>

                    {/* UPCOMING APPOINTMENT */}
                    <Text style={styles.sectionTitle}>Next Up</Text>

                    <View style={styles.jobItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                            <Ionicons name="car-sport" size={20} color="#AAA" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.jobTitle}>Toyota Axio (CAB-1234)</Text>
                            <Text style={styles.jobSub}>Full Service + Oil Change</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.jobTime}>10:00 AM</Text>
                            <Text style={styles.statusTag}>Pending</Text>
                        </View>
                    </View>

                    <View style={styles.jobItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                            <Ionicons name="car-sport" size={20} color="#AAA" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.jobTitle}>Nissan Leaf (BE-5921)</Text>
                            <Text style={styles.jobSub}>Battery Inspection</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.jobTime}>11:30 AM</Text>
                            <Text style={styles.statusTag}>Confirmed</Text>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#2962FF' },
    greeting: { color: '#888', fontSize: 12, textTransform: 'uppercase' },
    name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    profileIcon: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

    content: { padding: 20 },

    statusCard: { borderRadius: 20, padding: 25, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    statusLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, color: 'rgba(255,255,255,0.8)' },
    statusValue: { fontSize: 24, fontWeight: '900', color: '#FFF' },
    statusSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
    iconOpac: { opacity: 0.8 },

    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    statCard: { flex: 1, backgroundColor: '#101018', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#222' },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
    statValue: { color: '#2962FF', fontSize: 20, fontWeight: 'bold' },

    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 30 },
    actionBtn: { width: (width - 55) / 2, backgroundColor: '#101018', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    actionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

    jobItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101018', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    jobTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
    jobSub: { color: '#666', fontSize: 12 },
    jobTime: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
    statusTag: { color: '#2962FF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }
});
