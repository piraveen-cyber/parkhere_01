import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function MechanicDashboard() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);
    const [stats, setStats] = useState({
        earnings: 15400,
        jobs: 4,
        rating: 4.8
    });

    const toggleOnline = () => setIsOnline(!isOnline);

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
            <LinearGradient colors={['#000000', '#111111']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.profileHeader}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Hello,</Text>
                            <Text style={styles.name}>Kamal Perera</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => router.push('/partner/mechanic/profile' as any)}
                    >
                        <Ionicons name="settings-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* STATUS CARD */}
                    <LinearGradient
                        colors={isOnline ? ['#00C851', '#007E33'] : ['#222', '#111']}
                        style={styles.statusCard}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.statusRow}>
                            <View>
                                <Text style={[styles.statusLabel, { color: isOnline ? '#FFF' : '#888' }]}>CURRENT STATUS</Text>
                                <Text style={[styles.statusValue, { color: isOnline ? '#FFF' : '#FFF' }]}>
                                    {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#444", true: "rgba(255,255,255,0.3)" }}
                                thumbColor={isOnline ? "#FFF" : "#f4f3f4"}
                                onValueChange={toggleOnline}
                                value={isOnline}
                                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                            />
                        </View>
                        {isOnline ? (
                            <Text style={styles.statusSub}>Searching for nearby breakdowns...</Text>
                        ) : (
                            <Text style={styles.statusSubOffline}>Go online to start receiving job requests.</Text>
                        )}
                    </LinearGradient>

                    {/* STATS ROW */}
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Today's Earnings</Text>
                            <Text style={styles.statValue}>LKR {stats.earnings.toLocaleString()}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Jobs Done</Text>
                            <Text style={styles.statValue}>{stats.jobs}</Text>
                        </View>
                    </View>

                    {/* SIMULATE REQUEST BTN (DEMO ONLY) */}
                    {isOnline && (
                        <TouchableOpacity style={styles.demoBtn} onPress={() => router.push('/partner/mechanic/requests' as any)}>
                            <Text style={styles.demoBtnText}>Simulate Incoming Job</Text>
                        </TouchableOpacity>
                    )}

                    {/* QUICK ACTIONS */}
                    <Text style={styles.sectionTitle}>Manage Operations</Text>
                    <View style={styles.actionsGrid}>
                        <QuickAction icon="time-outline" label="History" color="#FFD700" route="/partner/mechanic/history" />
                        <QuickAction icon="stats-chart-outline" label="Reports" color="#00F260" route="/partner/mechanic/reports" />
                        <QuickAction icon="star-outline" label="Reviews" color="#FF4444" route="/partner/mechanic/reviews" />
                        <QuickAction icon="wallet-outline" label="Wallet" color="#4facfe" route="/partner/mechanic/wallet" />
                    </View>

                    {/* RECENT ACTIVITY */}
                    <Text style={styles.sectionTitle}>Recent Jobs</Text>

                    <View style={styles.jobItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                            <FontAwesome5 name="car-crash" size={16} color="#AAA" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.jobTitle}>Engine Overheating - Toyota Vitz</Text>
                            <Text style={styles.jobTime}>Today, 10:30 AM</Text>
                        </View>
                        <Text style={styles.jobPrice}>+ LKR 4,500</Text>
                    </View>

                    <View style={styles.jobItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#333' }]}>
                            <MaterialCommunityIcons name="car-battery" size={18} color="#AAA" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.jobTitle}>Battery Jumpstart - Honda Fit</Text>
                            <Text style={styles.jobTime}>Yesterday, 04:15 PM</Text>
                        </View>
                        <Text style={styles.jobPrice}>+ LKR 1,500</Text>
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
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFD700' },
    greeting: { color: '#888', fontSize: 12, textTransform: 'uppercase' },
    name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    profileIcon: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

    content: { padding: 20 },

    statusCard: { borderRadius: 20, padding: 25, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    statusLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    statusValue: { fontSize: 22, fontWeight: '900' },
    statusSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
    statusSubOffline: { color: '#666', fontSize: 14 },

    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    statCard: { flex: 1, backgroundColor: '#161616', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
    statValue: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },

    demoBtn: { backgroundColor: '#333', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 30, borderStyle: 'dashed', borderWidth: 1, borderColor: '#666' },
    demoBtnText: { color: '#AAA', fontWeight: 'bold' },

    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 30 },
    actionBtn: { width: (width - 55) / 2, backgroundColor: '#161616', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    actionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

    jobItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', padding: 15, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    jobTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
    jobTime: { color: '#666', fontSize: 12 },
    jobPrice: { color: '#00C851', fontWeight: 'bold', fontSize: 14 }
});
