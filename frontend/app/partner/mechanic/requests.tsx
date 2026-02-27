import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function ServiceRequests() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        // Initial Haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.back(); // Auto reject
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAccept = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.replace('/partner/mechanic/job' as any);
    };

    const handleReject = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0D1B2A', '#000000']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 }}>

                <View style={styles.header}>
                    <Text style={styles.incomingTitle}>Incoming Request</Text>
                    <View style={styles.timerBadge}>
                        <Ionicons name="time" size={16} color="#000" />
                        <Text style={styles.timerText}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</Text>
                    </View>
                </View>

                {/* REQUEST CARD */}
                <View style={styles.card}>
                    <View style={styles.mapPlaceholder}>
                        {/* Mock Map View */}
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop' }}
                            style={styles.mapImage}
                        />
                        <View style={styles.distanceBadge}>
                            <Text style={styles.distanceText}>2.5 km away</Text>
                        </View>
                    </View>

                    <View style={styles.details}>
                        <View style={styles.row}>
                            <View style={styles.userIcon}>
                                <Ionicons name="person" size={24} color="#FFF" />
                            </View>
                            <View>
                                <Text style={styles.customerName}>Saman Kumara</Text>
                                <Text style={styles.rating}>⭐ 4.8 (120 reviews)</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.issueRow}>
                            <MaterialIcons name="car-repair" size={30} color="#FFD700" />
                            <View>
                                <Text style={styles.issueTitle}>Flat Tire (Heavy Vehicle)</Text>
                                <Text style={styles.vehicleInfo}>Toyota Land Cruiser • CAB-8888</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
                        <Ionicons name="close" size={40} color="#FFF" />
                        <Text style={styles.btnLabel}>DECLINE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                        <LinearGradient
                            colors={['#00C851', '#007E33']}
                            style={styles.acceptGradient}
                        >
                            <Ionicons name="checkmark" size={40} color="#FFF" />
                            <Text style={styles.btnLabel}>ACCEPT JOB</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { alignItems: 'center', width: '100%', marginBottom: 20 },
    incomingTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10, letterSpacing: 1 },
    timerBadge: { flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 5 },
    timerText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

    card: { width: '90%', backgroundColor: '#1F1F1F', borderRadius: 24, overflow: 'hidden', elevation: 10 },
    mapPlaceholder: { height: 200, position: 'relative' },
    mapImage: { width: '100%', height: '100%', opacity: 0.7 },
    distanceBadge: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    distanceText: { color: '#FFF', fontWeight: 'bold' },

    details: { padding: 25 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    userIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    customerName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    rating: { color: '#FFD700', fontSize: 14, marginTop: 4 },

    divider: { height: 1, backgroundColor: '#333', marginVertical: 20 },

    issueRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    issueTitle: { color: '#FF4444', fontSize: 18, fontWeight: 'bold' },
    vehicleInfo: { color: '#AAA', fontSize: 14, marginTop: 4 },

    actions: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginTop: 20 },
    rejectBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF4444', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    acceptBtn: { flex: 1, marginLeft: 20, height: 80, borderRadius: 40, elevation: 10, overflow: 'hidden' },
    acceptGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 },
    btnLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginTop: 5 }
});
