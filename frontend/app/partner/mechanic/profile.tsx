import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Switch, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function MechanicProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [myRoles, setMyRoles] = useState<string[]>([]);

    // Profile State
    const [name, setName] = useState('Kamal Perera');
    const [phone, setPhone] = useState('+94 71 987 6543');
    const [specialty, setSpecialty] = useState('Light Vehicles, Hybrid Engines');

    // Theme Colors
    const theme = isDarkMode ? {
        bg: '#000000',
        text: '#FFF',
        card: '#1F1F1F',
        subText: '#888',
        border: '#333',
        inputBg: '#2A2A2A',
        sectionBg: 'rgba(255,255,255,0.05)',
        highlight: '#FFD700'
    } : {
        bg: '#F5F5F5',
        text: '#000',
        card: '#FFFFFF',
        subText: '#666',
        border: '#E0E0E0',
        inputBg: '#F0F0F0',
        sectionBg: '#FFF',
        highlight: '#FFD700'
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedRoles = await AsyncStorage.getItem('PARTNER_ROLES');
            if (savedRoles) {
                setMyRoles(JSON.parse(savedRoles));
            } else {
                setMyRoles(['parking', 'mechanic', 'garage']); // Demo fallback
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const switchBusiness = (role: string) => {
        if (role === 'mechanic') return;
        if (role === 'parking') router.replace('/partner/parking');
        else if (role === 'garage') router.replace('/partner/garage');
    };

    if (loading) return <View style={[styles.center, { backgroundColor: theme.bg }]}><ActivityIndicator color="#FFD700" /></View>;

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Mechanic Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* PROFILE HEADER */}
                    <View style={styles.profileCard}>
                        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
                        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
                        <Text style={[styles.role, { color: theme.subText }]}>{specialty}</Text>
                        <View style={styles.badge}>
                            <Ionicons name="checkmark-circle" size={14} color="#00C851" />
                            <Text style={styles.badgeText}>Verified Expert</Text>
                        </View>
                    </View>

                    {/* SWITCH BUSINESS SECTION */}
                    {myRoles.length > 1 && (
                        <View style={[styles.section, { backgroundColor: theme.sectionBg, borderColor: theme.border, borderWidth: 1 }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Switch Business</Text>
                            <View style={styles.businessGrid}>
                                {myRoles.map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.businessCard,
                                            { backgroundColor: role === 'mechanic' ? theme.highlight : theme.inputBg }
                                        ]}
                                        onPress={() => switchBusiness(role)}
                                        disabled={role === 'mechanic'}
                                    >
                                        {role === 'parking' && <FontAwesome5 name="parking" size={20} color={theme.subText} />}
                                        {role === 'mechanic' && <FontAwesome5 name="wrench" size={20} color="#000" />}
                                        {role === 'garage' && <MaterialCommunityIcons name="garage" size={24} color={theme.subText} />}

                                        <Text style={[
                                            styles.businessText,
                                            { color: role === 'mechanic' ? '#000' : theme.subText }
                                        ]}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Text>

                                        {role === 'mechanic' && <View style={styles.activeDot} />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* DETAILS */}
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Service Details</Text>

                        <View style={styles.row}>
                            <Text style={[styles.label, { color: theme.subText }]}>Mobile</Text>
                            <Text style={[styles.value, { color: theme.text }]}>{phone}</Text>
                        </View>
                        <View style={[styles.row, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.label, { color: theme.subText }]}>Base Fee</Text>
                            <Text style={[styles.value, { color: theme.highlight }]}>LKR 1,500</Text>
                        </View>
                    </View>

                    {/* SETTINGS */}
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <View style={styles.settingRow}>
                            <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
                            <Switch
                                value={isDarkMode}
                                onValueChange={setIsDarkMode}
                                trackColor={{ false: "#767577", true: "#FFD700" }}
                                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/phoneAuth')}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    backBtn: { padding: 5 },

    profileCard: { alignItems: 'center', marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FFD700', marginBottom: 15 },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    role: { fontSize: 14, marginBottom: 10 },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,200,81,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    badgeText: { color: '#00C851', fontSize: 12, fontWeight: 'bold' },

    section: { borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },

    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    label: { fontSize: 14 },
    value: { fontSize: 14, fontWeight: 'bold' },

    businessGrid: { flexDirection: 'row', gap: 10 },
    businessCard: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    businessText: { fontSize: 12, fontWeight: 'bold', marginTop: 8 },
    activeDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#000' },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingText: { fontSize: 16, fontWeight: '500' },

    logoutBtn: { backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    logoutText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 }
});
