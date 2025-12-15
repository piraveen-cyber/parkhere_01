import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MechanicDashboard() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);

    const toggleSwitch = () => setIsOnline(previousState => !previousState);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            {/* Background Pulse Effect when Online */}
            {isOnline && (
                <View style={styles.pulseContainer}>
                    <View style={styles.pulseCircle} />
                </View>
            )}

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, Mechanic</Text>
                        <Text style={styles.title}>Kamal Motors</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#00C851' : '#FF4444' }]} />
                        <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
                    </View>
                </View>

                <View style={styles.content}>

                    {/* ONLINE TOGGLE CARD */}
                    <View style={styles.toggleCard}>
                        <View>
                            <Text style={styles.toggleLabel}>Availability Status</Text>
                            <Text style={styles.toggleSub}>{isOnline ? 'You are receiving requests' : 'Go online to start working'}</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#333", true: "rgba(0, 200, 81, 0.5)" }}
                            thumbColor={isOnline ? "#00C851" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isOnline}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        />
                    </View>

                    {/* STATUS DISPLAY */}
                    <View style={styles.centerContainer}>
                        {isOnline ? (
                            <View style={styles.radarContainer}>
                                <LinearGradient colors={['#00C851', '#007E33']} style={styles.radarIcon}>
                                    <Ionicons name="radio" size={60} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.radarTitle}>Searching for jobs...</Text>
                                <Text style={styles.radarSub}>Stay alert! Requests will appear here.</Text>

                                <TouchableOpacity
                                    style={styles.simulateBtn}
                                    onPress={() => router.push('/partner/mechanic/requests' as any)}
                                >
                                    <Text style={styles.simulateText}>Simulate Request (Demo)</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.offlineContainer}>
                                <Ionicons name="moon" size={80} color="#333" />
                                <Text style={styles.offlineTitle}>You are Offline</Text>
                                <Text style={styles.radarSub}>toggle the switch above to start your shift.</Text>
                            </View>
                        )}
                    </View>

                    {/* DAILY STATS */}
                    <View style={styles.statsContainer}>
                        <Text style={styles.sectionTitle}>Today&apos;s Performance</Text>
                        <View style={styles.statsRow}>
                            <View style={[styles.statCard, { backgroundColor: '#1B263B' }]}>
                                <MaterialCommunityIcons name="cash-multiple" size={24} color="#FFD700" />
                                <Text style={styles.statValue}>LKR 0</Text>
                                <Text style={styles.statLabel}>Earnings</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: '#1B263B' }]}>
                                <MaterialCommunityIcons name="wrench-clock" size={24} color="#00C851" />
                                <Text style={styles.statValue}>0</Text>
                                <Text style={styles.statLabel}>Jobs Done</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    greeting: { fontSize: 14, color: '#AAA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },

    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },

    content: { flex: 1, padding: 25 },

    toggleCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20, marginBottom: 40 },
    toggleLabel: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    toggleSub: { color: '#888', fontSize: 12 },

    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    radarContainer: { alignItems: 'center' },
    radarIcon: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: "#00C851", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
    radarTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    radarSub: { color: '#666', textAlign: 'center', marginBottom: 30 },

    simulateBtn: { backgroundColor: 'rgba(255, 215, 0, 0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#FFD700' },
    simulateText: { color: '#FFD700', fontWeight: 'bold' },

    offlineContainer: { alignItems: 'center' },
    offlineTitle: { color: '#666', fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },

    statsContainer: { marginTop: 40 },
    sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    statsRow: { flexDirection: 'row', gap: 15 },
    statCard: { flex: 1, padding: 15, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
    statLabel: { color: '#AAA', fontSize: 12, marginTop: 4 },

    pulseContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    pulseCircle: { width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(0, 200, 81, 0.05)' }
});
