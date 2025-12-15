import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ParkingReports() {
    const router = useRouter();

    const StatCard = ({ label, value, color }: any) => (
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={[styles.statValue, { color: color }]}>{value}</Text>
        </View>
    );

    const Bar = ({ day, height, active }: any) => (
        <View style={{ alignItems: 'center', gap: 5 }}>
            <View style={{ height: 100, width: 30, justifyContent: 'flex-end', backgroundColor: '#222', borderRadius: 15 }}>
                <View style={{ width: '100%', height: (height + '%') as any, backgroundColor: active ? '#FFD700' : '#444', borderRadius: 15 }} />
            </View>
            <Text style={{ color: active ? '#FFF' : '#666', fontSize: 12, fontWeight: 'bold' }}>{day}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#0a0a0a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Revenue & Reports</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* SUMMARY */}
                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Revenue (Weekly)</Text>
                        <Text style={styles.totalValue}>LKR 125,400</Text>
                        <View style={styles.growTag}>
                            <Ionicons name="trending-up" size={16} color="#000" />
                            <Text style={styles.growText}>+15.3% vs last week</Text>
                        </View>
                    </View>

                    {/* GRAPH */}
                    <View style={styles.chartContainer}>
                        <Bar day="M" height={30} />
                        <Bar day="T" height={50} />
                        <Bar day="W" height={45} />
                        <Bar day="T" height={80} active />
                        <Bar day="F" height={70} />
                        <Bar day="S" height={90} />
                        <Bar day="S" height={85} />
                    </View>

                    {/* STATS GRID */}
                    <Text style={styles.sectionTitle}>Key Metrics</Text>
                    <View style={styles.grid}>
                        <StatCard label="Total Parked" value="128" color="#FFF" />
                        <StatCard label="Avg Duration" value="3.5 hrs" color="#00C851" />
                        <StatCard label="Occupancy" value="85%" color="#FFD700" />
                        <StatCard label="Turnover" value="45 cars" color="#4facfe" />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    content: { padding: 20 },

    totalCard: { alignItems: 'center', marginBottom: 40 },
    totalLabel: { color: '#888', fontSize: 14, marginBottom: 5 },
    totalValue: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 10 },
    growTag: { flexDirection: 'row', backgroundColor: '#00C851', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 6 },
    growText: { color: '#000', fontSize: 12, fontWeight: 'bold' },

    chartContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, height: 150, paddingHorizontal: 10 },

    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    statCard: { width: (width - 55) / 2, backgroundColor: '#111', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#222' },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
    statValue: { fontSize: 20, fontWeight: 'bold' }
});
