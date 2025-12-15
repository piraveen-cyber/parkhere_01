import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function MechanicReports() {
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
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Earnings Report</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* SUMMARY */}
                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Revenue (This Week)</Text>
                        <Text style={styles.totalValue}>LKR 45,250</Text>
                        <View style={styles.growTag}>
                            <Ionicons name="arrow-up" size={12} color="#000" />
                            <Text style={styles.growText}>+12.5%</Text>
                        </View>
                    </View>

                    {/* GRAPH */}
                    <View style={styles.chartContainer}>
                        <Bar day="M" height={40} />
                        <Bar day="T" height={60} />
                        <Bar day="W" height={30} />
                        <Bar day="T" height={80} active />
                        <Bar day="F" height={50} />
                        <Bar day="S" height={90} />
                        <Bar day="S" height={70} />
                    </View>

                    {/* STATS GRID */}
                    <Text style={styles.sectionTitle}>Performance</Text>
                    <View style={styles.grid}>
                        <StatCard label="Jobs Done" value="18" color="#FFF" />
                        <StatCard label="Avg. Response" value="15 min" color="#00C851" />
                        <StatCard label="Hours Online" value="32 hrs" color="#FFD700" />
                        <StatCard label="Cancelled" value="2" color="#FF4444" />
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
    growTag: { flexDirection: 'row', backgroundColor: '#00C851', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignItems: 'center', gap: 4 },
    growText: { color: '#000', fontSize: 12, fontWeight: 'bold' },

    chartContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, height: 150, paddingHorizontal: 10 },

    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    statCard: { width: (width - 55) / 2, backgroundColor: '#161616', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
    statLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
    statValue: { fontSize: 20, fontWeight: 'bold' }
});
