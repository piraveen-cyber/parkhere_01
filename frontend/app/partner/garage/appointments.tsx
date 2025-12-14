import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GarageAppointments() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

    const appointments = [
        { id: '1', client: 'John Doe', car: 'Toyota Prius', service: 'Full Service', time: '10:00 AM', status: 'In Progress', date: 'Today' },
        { id: '2', client: 'Sarah Smith', car: 'Suzuki Alto', service: 'Oil Change', time: '11:30 AM', status: 'Pending', date: 'Today' },
        { id: '3', client: 'Mike Ross', car: 'BMW 520d', service: 'Brake Inspection', time: '02:00 PM', status: 'Pending', date: 'Today' },
    ];

    const history = [
        { id: '4', client: 'Harvey Specter', car: 'Tesla Model S', service: 'Wheel Alignment', time: '09:00 AM', status: 'Completed', date: 'Yesterday' },
    ];

    const data = activeTab === 'upcoming' ? appointments : history;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1c']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Appointments</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* TABS */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                        onPress={() => setActiveTab('completed')}
                    >
                        <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>History</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.time}>{item.time}</Text>
                                <View style={[styles.statusBadge,
                                {
                                    backgroundColor: item.status === 'In Progress' ? 'rgba(0, 200, 81, 0.1)' :
                                        item.status === 'Completed' ? 'rgba(51, 181, 229, 0.1)' : 'rgba(255, 215, 0, 0.1)'
                                }
                                ]}>
                                    <Text style={[styles.statusText,
                                    {
                                        color: item.status === 'In Progress' ? '#00C851' :
                                            item.status === 'Completed' ? '#33B5E5' : '#FFD700'
                                    }
                                    ]}>{item.status}</Text>
                                </View>
                            </View>

                            <Text style={styles.client}>{item.client}</Text>
                            <Text style={styles.details}>{item.car} • {item.service}</Text>

                            {/* Action Buttons for Pending/In Progress */}
                            {activeTab === 'upcoming' && (
                                <View style={styles.actions}>
                                    {item.status === 'Pending' ? (
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <Text style={styles.btnLabel}>Start Job</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00C851' }]}>
                                            <Text style={[styles.btnLabel, { color: '#FFF' }]}>Mark Complete</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No appointments found.</Text>
                        </View>
                    }
                />

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { padding: 5 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
    tab: { marginRight: 20, paddingBottom: 10 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFD700' },
    tabText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
    activeTabText: { color: '#FFF' },

    card: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20, marginBottom: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    time: { color: '#FFD700', fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    client: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    details: { color: '#AAA', fontSize: 14 },

    actions: { marginTop: 15, flexDirection: 'row', justifyContent: 'flex-end' },
    actionBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    btnLabel: { color: '#FFF', fontWeight: 'bold' },

    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: '#666' }
});
