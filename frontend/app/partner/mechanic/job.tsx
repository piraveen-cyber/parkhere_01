import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActiveJob() {
    const router = useRouter();
    const [status, setStatus] = useState<'en_route' | 'arrived' | 'working'>('en_route');

    const handleAction = () => {
        if (status === 'en_route') setStatus('arrived');
        else if (status === 'arrived') setStatus('working');
        else {
            Alert.alert("Complete Job", "Has the payment been collected?", [
                { text: "Confirm Completion", onPress: () => router.replace('/partner/mechanic' as any) }
            ]);
        }
    };

    const getActionLabel = () => {
        switch (status) {
            case 'en_route': return "I HAVE ARRIVED";
            case 'arrived': return "START REPAIR";
            case 'working': return "COMPLETE JOB";
        }
    };

    const handleCall = () => {
        Linking.openURL('tel:+94771234567');
    };

    const handleNavigate = () => {
        const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
        // Mock coordinates
        const latLng = '6.9271,79.8612';
        const label = 'Custom Location';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url!);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Job #8821</Text>
                    <View style={styles.statusTag}>
                        <Text style={styles.statusText}>{status.replace('_', ' ').toUpperCase()}</Text>
                    </View>
                </View>

                {/* CUSTOMER CARD */}
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>SK</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>Saman Kumara</Text>
                            <Text style={styles.text}>Toyota Land Cruiser (CAB-8888)</Text>
                        </View>
                        <TouchableOpacity onPress={handleCall} style={styles.callBtn}>
                            <Ionicons name="call" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>ISSUE REPORTED</Text>
                    <Text style={styles.issue}>Flat Tire (Rear Left)</Text>
                </View>

                {/* NAVIGATION */}
                <View style={styles.navContainer}>
                    <View style={styles.routeLine} />
                    <View style={styles.mapPreview}>
                        <Ionicons name="map" size={50} color="#666" />
                        <Text style={styles.mapText}>Navigation Preview</Text>
                    </View>
                    <TouchableOpacity style={styles.navBtn} onPress={handleNavigate}>
                        <FontAwesome5 name="location-arrow" size={20} color="#000" />
                        <Text style={styles.navText}>NAVIGATE</Text>
                    </TouchableOpacity>
                </View>

                {/* SLIDER ACTION */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.mainBtn, status === 'working' && styles.finishBtn]}
                        onPress={handleAction}
                    >
                        <Text style={styles.mainBtnText}>{getActionLabel()}</Text>
                        <Ionicons name="arrow-forward" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {status === 'working' && (
                        <Text style={styles.hint}>Please ensure safety protocols before starting.</Text>
                    )}
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    statusTag: { backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    card: { backgroundColor: '#1F1F1F', margin: 20, padding: 20, borderRadius: 16 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    text: { color: '#AAA', fontSize: 13 },
    callBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#00C851', justifyContent: 'center', alignItems: 'center' },

    divider: { height: 1, backgroundColor: '#333', marginVertical: 15 },
    label: { color: '#666', fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
    issue: { color: '#FFF', fontSize: 16 },

    navContainer: { flex: 1, margin: 20, backgroundColor: '#111', borderRadius: 16, overflow: 'hidden', position: 'relative' },
    mapPreview: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapText: { color: '#666', marginTop: 10 },
    navBtn: { position: 'absolute', bottom: 20, right: 20, flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, alignItems: 'center', gap: 10 },
    navText: { fontWeight: 'bold' },
    routeLine: { position: 'absolute', top: 0, bottom: 0, left: 30, width: 2, backgroundColor: '#333' }, // Decorative

    footer: { padding: 20, paddingBottom: 40 },
    mainBtn: { backgroundColor: '#33B5E5', height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    finishBtn: { backgroundColor: '#00C851' },
    mainBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    hint: { color: '#666', textAlign: 'center', marginTop: 15, fontSize: 12 }
});
