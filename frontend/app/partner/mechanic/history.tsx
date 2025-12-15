import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HISTORY_DATA = [
    { id: '1', customer: 'Amara Weerasinghe', model: 'Toyota Vitz', issue: 'Engine Overheating', date: 'Today, 10:30 AM', price: '4,500', status: 'Completed', icon: 'car-crash' },
    { id: '2', customer: 'John Doe', model: 'Honda Fit', issue: 'Battery Jumpstart', date: 'Yesterday, 04:15 PM', price: '1,500', status: 'Completed', icon: 'car-battery' },
    { id: '3', customer: 'Siva Kumar', model: 'Suzuki Alto', issue: 'Flat Tyre Change', date: '12 Dec, 02:00 PM', price: '2,000', status: 'Completed', icon: 'car-repair' },
    { id: '4', customer: 'Nimal Perera', model: 'Nissan Leaf', issue: 'Cancelled by User', date: '10 Dec, 09:00 AM', price: '0', status: 'Cancelled', icon: 'close-circle' },
];

export default function JobHistory() {
    const router = useRouter();

    const JobCard = ({ item }: { item: typeof HISTORY_DATA[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconBox, { backgroundColor: item.status === 'Cancelled' ? 'rgba(255,68,68,0.1)' : 'rgba(0,200,81,0.1)' }]}>
                        {item.status === 'Cancelled' ? (
                            <Ionicons name="close" size={20} color="#FF4444" />
                        ) : (
                            <MaterialCommunityIcons name={item.icon as any} size={20} color="#00C851" />
                        )}
                    </View>
                    <View>
                        <Text style={styles.customer}>{item.customer}</Text>
                        <Text style={styles.model}>{item.model}</Text>
                    </View>
                </View>
                <Text style={[styles.price, { color: item.status === 'Cancelled' ? '#666' : '#FFD700' }]}>
                    {item.status === 'Cancelled' ? 'LKR 0' : `LKR ${item.price}`}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Text style={styles.issue}>{item.issue}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
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
                    <Text style={styles.headerTitle}>Job History</Text>
                    <View style={{ width: 44 }} />
                </View>

                <FlatList
                    data={HISTORY_DATA}
                    renderItem={JobCard}
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

    list: { padding: 20 },
    card: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    customer: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    model: { color: '#888', fontSize: 12 },

    price: { fontSize: 16, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: '#333', marginBottom: 15 },

    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    issue: { color: '#CCC', fontSize: 13, fontWeight: '500' },
    date: { color: '#666', fontSize: 12 }
});
