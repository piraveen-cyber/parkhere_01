import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
            const data = await getParkingSpots();
            setLots(data);
        } catch (e) {
            console.log("Error fetching lots", e);
        } finally {
            setLoading(false);
        }
    };

    const LotCard = ({ item }: { item: ParkingSpot }) => (
        <TouchableOpacity
            activeOpacity={0.95}
            // title="Edit Lot Details"
            onPress={() => router.push(`/partner/parking/editLot?id=${item._id}` as any)}
            style={styles.cardContainer}
        >
            <View style={styles.cardInner}>
                {/* IMAGE & OVERLAY */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1590674899505-1c5c4195e94b?q=80&w=2670&auto=format&fit=crop' }}
                        style={styles.image}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.priceTag}>
                        <Text style={styles.priceText}>LKR {item.pricePerHour}<Text style={{ fontSize: 10 }}>/hr</Text></Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.isAvailable ? '#00C851' : '#FF4444' }]}>
                        <Text style={styles.statusText}>{item.isAvailable ? 'OPEN' : 'FULL'}</Text>
                    </View>
                </View>

                {/* DETAILS */}
                <View style={styles.cardDetails}>
                    <View style={styles.row}>
                        <Text style={styles.lotName}>{item.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={14} color="#AAA" />
                        <Text style={styles.address} numberOfLines={1}>{item.address || "No Address"}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="car-sport" size={14} color="#FFD700" />
                            <Text style={styles.statLabel}>20 Spots</Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="eye" size={14} color="#AAA" />
                            <Text style={styles.statLabel}>125 Views</Text>
                        </View>
                        <TouchableOpacity style={styles.manageBtn}>
                            <Text style={styles.manageText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Properties</Text>
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: '#FFD700' }]}
                        onPress={() => router.push('/partner/parking/addLot' as any)}
                    >
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#FFD700" />
                        <Text style={{ color: '#666', marginTop: 20 }}>Loading Properties...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={lots}
                        renderItem={LotCard}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <MaterialIcons name="add-business" size={60} color="#333" />
                                <Text style={styles.emptyTitle}>No Parking Lots</Text>
                                <Text style={styles.emptySub}>Start earning by listing your first parking space.</Text>
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
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 20, paddingBottom: 50 },

    cardContainer: { marginBottom: 25 },
    cardInner: { backgroundColor: '#1F1F1F', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },

    imageContainer: { height: 160, position: 'relative' },
    image: { width: '100%', height: '100%' },

    priceTag: { position: 'absolute', bottom: 15, left: 15, backgroundColor: 'rgba(0,0,0,0.8)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' },
    priceText: { color: '#FFD700', fontWeight: 'bold', fontSize: 16 },

    statusBadge: { position: 'absolute', top: 15, right: 15, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    statusText: { color: '#000', fontSize: 10, fontWeight: 'bold' },

    cardDetails: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    lotName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 },
    address: { color: '#AAA', fontSize: 13 },

    divider: { height: 1, backgroundColor: '#333', marginBottom: 15 },

    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statLabel: { color: '#CCC', fontSize: 12, fontWeight: '500' },

    manageBtn: { backgroundColor: '#333', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20 },
    manageText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    emptySub: { color: '#666', marginTop: 5 }
});
