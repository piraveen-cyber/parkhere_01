import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParkingProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'verified' | 'pending' | 'unverified'>('unverified');

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const savedStatus = await AsyncStorage.getItem('PARKING_PARTNER_STATUS');
            if (savedStatus) {
                setStatus(savedStatus as any);
            }
        } catch (e) {
            console.log("Error loading status", e);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = () => {
        let color = '#FF4444';
        let text = 'Unverified';
        let icon = 'alert-circle';

        if (status === 'verified') {
            color = '#00C851';
            text = 'Verified';
            icon = 'checkmark-circle';
        } else if (status === 'pending') {
            color = '#FFBB33';
            text = 'Pending Review';
            icon = 'time';
        }

        return (
            <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
                <Ionicons name={icon as any} size={16} color={color} />
                <Text style={[styles.badgeText, { color: color }]}>{text.toUpperCase()}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FFD400" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIcon}>
                            <Ionicons name="pencil" size={14} color="#FFF" />
                        </View>
                    </View>
                    <Text style={styles.name}>Admin Parking</Text>
                    <Text style={styles.role}>Parking Partner</Text>
                    <StatusBadge />
                </View>

                {/* VERIFICATION CTA */}
                {status === 'unverified' && (
                    <TouchableOpacity
                        style={styles.verifyCta}
                        onPress={() => router.push('/partner/parking/verification' as any)}
                    >
                        <LinearGradient
                            colors={['#FFD400', '#FFAA00']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.gradient}
                        >
                            <View>
                                <Text style={styles.verifyTitle}>Verify Your Identity</Text>
                                <Text style={styles.verifySub}>Submit documents to start accepting bookings.</Text>
                            </View>
                            <Ionicons name="arrow-forward-circle" size={32} color="#000" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* INFORMATION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}><Ionicons name="person-outline" size={20} color="#AAA" /></View>
                        <View>
                            <Text style={styles.infoLabel}>Full Name</Text>
                            <Text style={styles.infoValue}>Admin Parking User</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}><Ionicons name="call-outline" size={20} color="#AAA" /></View>
                        <View>
                            <Text style={styles.infoLabel}>Phone Number</Text>
                            <Text style={styles.infoValue}>+94 77 123 4567</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}><Ionicons name="mail-outline" size={20} color="#AAA" /></View>
                        <View>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>admin@parkhere.lk</Text>
                        </View>
                    </View>
                </View>

                {/* SETTINGS */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/phoneAuth')}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1B2A' },
    center: { flex: 1, backgroundColor: '#0D1B2A', justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    scrollContent: { padding: 20 },

    profileCard: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { width: 100, height: 100, marginBottom: 15, position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FFD400' },
    editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFD400', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
    role: { fontSize: 14, color: '#AAA', marginBottom: 15 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },

    verifyCta: { marginBottom: 30, borderRadius: 16, overflow: 'hidden' },
    gradient: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    verifyTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 4 },
    verifySub: { fontSize: 12, color: '#333', maxWidth: 200 },

    section: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    infoLabel: { fontSize: 12, color: '#AAA', marginBottom: 2 },
    infoValue: { fontSize: 16, color: '#FFF', fontWeight: '500' },

    logoutBtn: { backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    logoutText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 }
});
