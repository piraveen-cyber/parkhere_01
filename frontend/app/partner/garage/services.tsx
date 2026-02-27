import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SERVICES = [
    { id: '1', name: 'Full Service (Gold)', duration: '4 Hours', price: '12,500', active: true },
    { id: '2', name: 'Standard Oil Change', duration: '45 Mins', price: '3,500', active: true },
    { id: '3', name: 'Battery Inspection', duration: '30 Mins', price: '1,500', active: true },
    { id: '4', name: 'Premium Car Wash', duration: '1.5 Hours', price: '2,500', active: false },
    { id: '5', name: 'Brake Pad Replacement', duration: '2 Hours', price: '4,500', active: true },
];

export default function GarageServices() {
    const router = useRouter();

    const ServiceCard = ({ item }: { item: typeof SERVICES[0] }) => (
        <View style={[styles.card, !item.active && { opacity: 0.6 }]}>
            <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.metaRow}>
                    <View style={styles.meta}>
                        <Ionicons name="time-outline" size={14} color="#888" />
                        <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                    <Text style={styles.price}>LKR {item.price}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <Switch
                    value={item.active}
                    trackColor={{ false: "#444", true: "#2962FF" }}
                    thumbColor={item.active ? "#FFF" : "#f4f3f4"}
                />
                <TouchableOpacity style={styles.iconBtnSmall}>
                    <Ionicons name="pencil" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
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
                    <Text style={styles.headerTitle}>Service Menu</Text>
                    <TouchableOpacity style={styles.addBtn}>
                        <Ionicons name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={SERVICES}
                    renderItem={ServiceCard}
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
    addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2962FF', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    list: { padding: 20 },
    card: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#101018', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
    cardInfo: { flex: 1, marginRight: 10 },

    name: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    metaText: { color: '#888', fontSize: 12 },
    price: { color: '#2962FF', fontWeight: 'bold', fontSize: 14 },

    actions: { alignItems: 'center', gap: 10 },
    iconBtnSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }
});
