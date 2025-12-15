import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PartnerHub() {
    const router = useRouter();
    const [activeRoles, setActiveRoles] = useState<string[]>([]);
    const [username, setUsername] = useState('Partner');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const roles = await AsyncStorage.getItem('PARTNER_ROLES');
        const user = await AsyncStorage.getItem('PARTNER_USERNAME');

        if (roles) setActiveRoles(JSON.parse(roles));
        if (user) setUsername(user);

        // Fallback for demo if no registration flow was used
        if (!roles) setActiveRoles(['parking', 'mechanic', 'garage']);
    };

    const BusinessCard = ({ role, title, icon, color, route }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(route)}
        >
            <LinearGradient colors={['#1F1F1F', '#111']} style={styles.cardGradient}>
                <View style={[styles.iconBox, { backgroundColor: color }]}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardStatus}>Active • Online</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcome}>Welcome back,</Text>
                        <Text style={styles.username}>{username}</Text>
                    </View>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>Your Businesses</Text>

                    {activeRoles.includes('parking') && (
                        <BusinessCard
                            role="parking"
                            title="Parking Management"
                            icon={<Ionicons name="car" size={24} color="#FFF" />}
                            color="#FFD700"
                            route="/partner/parking"
                        />
                    )}

                    {activeRoles.includes('mechanic') && (
                        <BusinessCard
                            role="mechanic"
                            title="Mechanic Services"
                            icon={<Ionicons name="build" size={24} color="#FFF" />}
                            color="#00C851"
                            route="/partner/mechanic"
                        />
                    )}

                    {activeRoles.includes('garage') && (
                        <BusinessCard
                            role="garage"
                            title="Service Center"
                            icon={<Ionicons name="business" size={24} color="#FFF" />}
                            color="#33B5E5"
                            route="/partner/garage"
                        />
                    )}

                    <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/partner/register' as any)}>
                        <Ionicons name="add-circle-outline" size={24} color="#888" />
                        <Text style={styles.addText}>Register New Business</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25 },
    welcome: { color: '#AAA', fontSize: 14 },
    username: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700' },
    avatarText: { color: '#FFD700', fontSize: 20, fontWeight: 'bold' },

    content: { padding: 25 },
    sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },

    card: { marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
    cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 15 },
    iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    cardStatus: { color: '#00C851', fontSize: 12, marginTop: 4 },

    addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderWidth: 1, borderColor: '#333', borderRadius: 16, borderStyle: 'dashed', marginTop: 10, gap: 10 },
    addText: { color: '#888', fontWeight: 'bold' }
});
