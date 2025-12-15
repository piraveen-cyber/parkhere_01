import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const APPOINTMENTS = [
    { id: '1', vehicle: 'Toyota Axio', plate: 'CAB-1234', service: 'Full Service', time: '10:00 AM', status: 'Pending', color: '#FFBB33' },
    { id: '2', vehicle: 'Nissan Leaf', plate: 'BE-5921', service: 'Battery Check', time: '11:30 AM', status: 'Confirmed', color: '#2962FF' },
    { id: '3', vehicle: 'Honda Vezel', plate: 'CAT-9900', service: 'Car Wash', time: '01:00 PM', status: 'In Progress', color: '#00C851' },
    { id: '4', vehicle: 'Suzuki Alto', plate: 'BCH-5544', service: 'Oil Change', time: '02:30 PM', status: 'Completed', color: '#888' },
];

export default function GarageAppointments() {
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    const FilterTag = ({ label }: any) => (
        <TouchableOpacity
            style={[styles.filterTag, filter === label && styles.filterTagActive]}
            onPress={() => setFilter(label)}
        >
            <Text style={[styles.filterText, filter === label && styles.filterTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    const AppointmentCard = ({ item }: { item: typeof APPOINTMENTS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.vehicle}>{item.vehicle}</Text>
                    <Text style={styles.plate}>{item.plate}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
                <View style={styles.info}>
                    <Ionicons name="construct-outline" size={16} color="#888" />
                    <Text style={styles.infoText}>{item.service}</Text>
                </View>
                <View style={styles.info}>
                    <Ionicons name="time-outline" size={16} color="#888" />
                    <Text style={styles.infoText}>{item.time}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Update Status</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#0a0a1a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Appointments</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <FilterTag label="All" />
                        <FilterTag label="Pending" />
                        <FilterTag label="In Progress" />
                        <FilterTag label="Completed" />
                    </ScrollView>
                </View>

                <FlatList
                    data={APPOINTMENTS}
                    renderItem={AppointmentCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    filterRow: { paddingHorizontal: 20, marginBottom: 20, flexDirection: 'row' },
    filterTag: { marginRight: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1F1F1F', borderWidth: 1, borderColor: '#333' },
    filterTagActive: { backgroundColor: '#2962FF', borderColor: '#2962FF' },
    filterText: { color: '#888', fontWeight: '600' },
    filterTextActive: { color: '#FFF' },

    list: { padding: 20, paddingTop: 0 },
    card: { backgroundColor: '#101018', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#222' },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    vehicle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    plate: { color: '#666', fontSize: 12 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

    divider: { height: 1, backgroundColor: '#222', marginBottom: 15 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    info: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    infoText: { color: '#CCC', fontSize: 13 },

    actionBtn: { backgroundColor: 'rgba(41, 98, 255, 0.1)', padding: 12, borderRadius: 10, alignItems: 'center' },
    actionBtnText: { color: '#2962FF', fontWeight: 'bold', fontSize: 14 }
});
