import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GarageDashboard() {
    const router = useRouter();

    const QuickAction = ({ icon, label, onPress, color }: any) => (
        <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                {icon}
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1c']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.garageName}>AutoFix Garage</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/partner/garage/profile' as any)}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2670&auto=format&fit=crop' }}
                            style={styles.profilePic}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* STATS ROW */}
                    <View style={styles.statsRow}>
                        <LinearGradient colors={['#1a1a1a', '#000']} style={styles.statCard}>
                            <Text style={styles.statLabel}>Today's Revenue</Text>
                            <Text style={styles.statValue}>$450</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#1a1a1a', '#000']} style={styles.statCard}>
                            <Text style={styles.statLabel}>Appointments</Text>
                            <Text style={styles.statValue}>8 <Text style={styles.subStat}>/ 12</Text></Text>
                        </LinearGradient>
                    </View>

                    {/* UPCOMING SCHEDULE */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Up Next</Text>
                            <TouchableOpacity onPress={() => router.push('/partner/garage/appointments' as any)}>
                                <Text style={styles.seeAll}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Appointment Card 1 */}
                        <View style={styles.apptCard}>
                            <View style={styles.timeTag}>
                                <Text style={styles.timeText}>10:00 AM</Text>
                            </View>
                            <View style={styles.apptDetails}>
                                <Text style={styles.clientName}>John Doe</Text>
                                <Text style={styles.carModel}>Toyota Prius • Full Service</Text>
                            </View>
                            <TouchableOpacity style={styles.statusBtn}>
                                <Text style={styles.statusText}>START</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Appointment Card 2 */}
                        <View style={styles.apptCard}>
                            <View style={[styles.timeTag, { backgroundColor: '#333' }]}>
                                <Text style={[styles.timeText, { color: '#888' }]}>11:30 AM</Text>
                            </View>
                            <View style={styles.apptDetails}>
                                <Text style={styles.clientName}>Sarah Smith</Text>
                                <Text style={styles.carModel}>Suzuki Alto • Oil Change</Text>
                            </View>
                            <View style={styles.pendingTag}>
                                <Text style={styles.pendingText}>PENDING</Text>
                            </View>
                        </View>
                    </View>

                    {/* MENU GRID */}
                    <Text style={styles.menuTitle}>Management</Text>
                    <View style={styles.grid}>
                        <QuickAction
                            label="Appointments"
                            icon={<Ionicons name="calendar" size={24} color="#FFD700" />}
                            onPress={() => router.push('/partner/garage/appointments' as any)}
                        />
                        <QuickAction
                            label="Services"
                            icon={<MaterialCommunityIcons name="tools" size={24} color="#00C851" />}
                            onPress={() => router.push('/partner/garage/services' as any)}
                        />
                        <QuickAction
                            label="Reviews"
                            icon={<Ionicons name="star" size={24} color="#FF4444" />}
                            onPress={() => { }}
                        />
                        <QuickAction
                            label="Settings"
                            icon={<Ionicons name="settings-sharp" size={24} color="#AAA" />}
                            onPress={() => { }}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    greeting: { fontSize: 14, color: '#AAA' },
    garageName: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    profilePic: { width: 45, height: 45, borderRadius: 25, borderWidth: 2, borderColor: '#FFD700' },

    scrollContent: { paddingHorizontal: 25, paddingBottom: 50 },

    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    statCard: { flex: 1, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
    statValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
    subStat: { fontSize: 14, color: '#666' },

    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    seeAll: { color: '#FFD700', fontSize: 14 },

    apptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', padding: 15, borderRadius: 16, marginBottom: 10 },
    timeTag: { backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 15 },
    timeText: { fontWeight: 'bold', fontSize: 12, color: '#000' },
    apptDetails: { flex: 1 },
    clientName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    carModel: { color: '#AAA', fontSize: 12 },
    statusBtn: { backgroundColor: '#00C851', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusText: { color: '#FFF', fontWeight: 'bold', fontSize: 10 },
    pendingTag: { borderWidth: 1, borderColor: '#666', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    pendingText: { color: '#666', fontWeight: 'bold', fontSize: 10 },

    menuTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    actionBtn: { width: '47%', backgroundColor: '#1F1F1F', padding: 20, borderRadius: 16, alignItems: 'center' },
    iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionLabel: { color: '#FFF', fontWeight: 'bold' }
});
