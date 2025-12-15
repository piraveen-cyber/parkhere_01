import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const REVIEWS = [
    { id: '1', user: 'Shehan P.', rating: 5, comment: 'Secure and clean parking spot. Security guard was helpful.', date: '2 days ago' },
    { id: '2', user: 'Amali K.', rating: 4, comment: 'Good location, but pricing is a bit high.', date: '1 week ago' },
    { id: '3', user: 'Rohan D.', rating: 5, comment: 'Very convenient! Easy QR access.', date: '3 weeks ago' },
    { id: '4', user: 'Sanjay M.', rating: 3, comment: 'Entrance was blocked by another car.', date: '1 month ago' },
];

export default function ParkingReviews() {
    const router = useRouter();

    const RatingBar = ({ stars, percent }: any) => (
        <View style={styles.ratingRow}>
            <Text style={styles.starLabel}>{stars} ★</Text>
            <View style={styles.barBg}>
                <View style={[styles.barFill, { width: (percent + '%') as any }]} />
            </View>
        </View>
    );

    const ReviewCard = ({ item }: { item: typeof REVIEWS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>{item.user.charAt(0)}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{item.user}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {[...Array(5)].map((_, i) => (
                                <Ionicons key={i} name="star" size={12} color={i < item.rating ? '#FFD700' : '#444'} />
                            ))}
                        </View>
                    </View>
                </View>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
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
                    <Text style={styles.headerTitle}>User Reviews</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.ratingOverview}>
                    <View style={styles.scoreContainer}>
                        <Text style={styles.score}>4.5</Text>
                        <Text style={styles.totalReviews}>85 Reviews</Text>
                    </View>
                    <View style={styles.barsContainer}>
                        <RatingBar stars={5} percent={60} />
                        <RatingBar stars={4} percent={25} />
                        <RatingBar stars={3} percent={10} />
                        <RatingBar stars={2} percent={5} />
                        <RatingBar stars={1} percent={0} />
                    </View>
                </View>

                <FlatList
                    data={REVIEWS}
                    renderItem={ReviewCard}
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

    ratingOverview: { flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111', margin: 20, borderRadius: 16, borderWidth: 1, borderColor: '#222' },
    scoreContainer: { alignItems: 'center', paddingRight: 20, borderRightWidth: 1, borderRightColor: '#222' },
    score: { fontSize: 40, fontWeight: 'bold', color: '#FFD700' },
    totalReviews: { color: '#888', fontSize: 12 },

    barsContainer: { flex: 1, paddingLeft: 20 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    starLabel: { color: '#AAA', fontSize: 10, width: 25 },
    barBg: { flex: 1, height: 4, backgroundColor: '#333', borderRadius: 2 },
    barFill: { height: 100, backgroundColor: '#FFD700', borderRadius: 2 },

    list: { padding: 20, paddingTop: 0 },
    card: { backgroundColor: '#111', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#222' },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },
    userName: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
    date: { color: '#666', fontSize: 12 },
    comment: { color: '#CCC', fontSize: 13, lineHeight: 20 }
});
