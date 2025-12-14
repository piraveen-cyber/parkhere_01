import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getParkingSpots, ParkingSpot } from '../../../services/parkingService';

export default function MyLots() {
    const router = useRouter();
    const [lots, setLots] = useState<ParkingSpot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLots();
    }, []);

    const fetchLots = async () => {
        try {
            // Fetching all spots for now. In a real app, you'd filter by owner ID.
            const data = await getParkingSpots();
            setLots(data);
        } catch (e) {
            console.log("Error fetching lots", e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ParkingSpot }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            // onPress={() => router.push(`/partner/parking/editLot?id=${item._id}` as any)}
            style={styles.cardContainer}
        >
            <LinearGradient
                colors={['#1F1F1F', '#141414']}
                style={styles.card}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1573348722427-f1d6d19baa03?q=80&w=2560&auto=format&fit=crop' }}
                    style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: item.isAvailable ? 'rgba(0, 200, 81, 0.2)' : 'rgba(255, 68, 68, 0.2)' }]}>
                            <Text style={[styles.statusText, { color: item.isAvailable ? '#00C851' : '#FF4444' }]}>
                                {item.isAvailable ? 'OPEN' : 'FULL'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.address} numberOfLines={1}>{item.address || "No address provided"}</Text>

                    <View style={styles.cardFooter}>
                        <Text style={styles.price}>LKR {item.pricePerHour}<Text style={styles.perHour}>/hr</Text></Text>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => router.push(`/partner/parking/editLot?id=${item._id}` as any)}
                        >
                            <Ionicons name="create-outline" size={18} color="#FFD700" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Lots</Text>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => router.push('/partner/parking/addLot' as any)}
                    >
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#FFD700" />
                    </View>
                ) : (
                    <FlatList
                        data={lots}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons name="car-sport-outline" size={60} color="#333" />
                                <Text style={styles.emptyText}>No parking lots found</Text>
                                <Text style={styles.emptySub}>Tap the + button to add your first lot.</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#FFD700' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 20 },

    cardContainer: { marginBottom: 20, borderRadius: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
    card: { borderRadius: 16, overflow: 'hidden' },
    cardImage: { width: '100%', height: 150 },
    cardContent: { padding: 15 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    address: { color: '#AAA', fontSize: 12, marginBottom: 15 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 20, fontWeight: 'bold', color: '#FFD700' },
    perHour: { fontSize: 12, color: '#AAA', fontWeight: 'normal' },
    editBtn: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255, 215, 0, 0.1)' },

    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
    emptySub: { color: '#666', marginTop: 10 }
});
