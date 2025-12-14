import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Bookings() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active');

    // Mock Data
    const bookings = [
        { id: '1', user: 'Kasun P.', vehicle: 'Toyota Axio (CAX-1234)', time: '10:00 AM - 12:00 PM', price: '400', status: 'active' },
        { id: '2', user: 'Amal S.', vehicle: 'Honda Vezel (CBE-5555)', time: '11:30 AM - 01:30 PM', price: '400', status: 'active' },
        { id: '3', user: 'Nimal R.', vehicle: 'Nissan Leaf (BGA-1111)', time: '09:00 AM - 10:00 AM', price: '200', status: 'completed' },
    ];

    const filteredBookings = bookings.filter(b => b.status === activeTab);

    const renderItem = ({ item }: any) => (
        <View style={styles.cardContainer}>
            <LinearGradient colors={['#1F1F1F', '#141414']} style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Ionicons name="car-sport" size={24} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.vehicle}</Text>
                        <Text style={styles.subtitle}>{item.user}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.price}>LKR {item.price}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                </View>

                {activeTab === 'active' && (
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionText}>Complete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bookings</Text>
                    <TouchableOpacity style={styles.scanBtn}>
                        <Ionicons name="qr-code" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* SEARCH & TABS */}
                <View style={styles.controls}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" />
                        <TextInput
                            placeholder="Search vehicle or ID..."
                            placeholderTextColor="#666"
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.tabs}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('active')}
                            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab('completed')}
                            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={filteredBookings}
                    renderItem={renderItem}
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
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    scanBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#FFD700' },

    controls: { paddingHorizontal: 20, marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15 },
    searchInput: { flex: 1, marginLeft: 10, color: '#FFF' },

    tabs: { flexDirection: 'row', backgroundColor: '#1F1F1F', borderRadius: 12, padding: 4 },
    tab: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    tabActive: { backgroundColor: '#333' },
    tabText: { color: '#666', fontWeight: '600' },
    tabTextActive: { color: '#FFF' },

    list: { padding: 20, paddingTop: 0 },
    cardContainer: { marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
    card: { padding: 15 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconBox: { width: 50, height: 50, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    subtitle: { color: '#AAA', fontSize: 14 },
    price: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
    time: { color: '#666', fontSize: 10 },

    actions: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' },
    actionBtn: { backgroundColor: '#00C851', padding: 10, borderRadius: 8, alignItems: 'center' },
    actionText: { color: '#FFF', fontWeight: 'bold' }
});
