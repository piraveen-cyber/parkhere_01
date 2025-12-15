import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParkingProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [myRoles, setMyRoles] = useState<string[]>([]);

    // Profile State
    const [name, setName] = useState('Admin Parking User');
    const [phone, setPhone] = useState('+94 77 123 4567');
    const [email, setEmail] = useState('admin@parkhere.lk');

    // Settings State
    const [notifications, setNotifications] = useState(true);
    const [status, setStatus] = useState<'verified' | 'pending' | 'unverified'>('unverified');

    // Theme Colors
    const theme = isDarkMode ? {
        bg: '#000000',
        card: '#1F1F1F',
        text: '#FFF',
        subText: '#888',
        border: '#333',
        inputBg: '#2A2A2A',
        sectionBg: 'rgba(255,255,255,0.05)',
        highlight: '#FFD700'
    } : {
        bg: '#F5F5F5',
        card: '#FFFFFF',
        text: '#000',
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
            const savedStatus = await AsyncStorage.getItem('PARKING_PARTNER_STATUS');
            const savedRoles = await AsyncStorage.getItem('PARTNER_ROLES');

            if (savedStatus) setStatus(savedStatus as any);
            
            if (savedRoles) {
                setMyRoles(JSON.parse(savedRoles));
            } else {
                // FALLBACK FOR DEMO: If no roles found, show all so user can see the UI
                setMyRoles(['parking', 'mechanic', 'garage']);
            }

        } catch (e) {
            console.log("Error loading data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const switchBusiness = (role: string) => {
        if (role === 'parking') return; // Already here

        if (role === 'mechanic') router.replace('/partner/mechanic');
        else if (role === 'garage') router.replace('/partner/garage');
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
            <View style={[styles.center, { backgroundColor: theme.bg }]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile</Text>
                    <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                        <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* PROFILE CARD */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                                style={styles.avatar}
                            />
                            {isEditing && (
                                <View style={styles.editIcon}>
                                    <Ionicons name="camera" size={14} color="#000" />
                                </View>
                            )}
                        </View>
                        {!isEditing ? (
                            <>
                                <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
                                <Text style={[styles.role, { color: theme.subText }]}>Parking Partner</Text>
                            </>
                        ) : (
                            <Text style={[styles.role, { color: theme.subText, marginBottom: 10 }]}>Editing Profile...</Text>
                        )}
                        <StatusBadge />
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
                                            { backgroundColor: role === 'parking' ? theme.highlight : theme.inputBg }
                                        ]}
                                        onPress={() => switchBusiness(role)}
                                        disabled={role === 'parking'}
                                    >
                                        {role === 'parking' && <FontAwesome5 name="parking" size={20} color="#000" />}
                                        {role === 'mechanic' && <FontAwesome5 name="wrench" size={20} color={theme.subText} />}
                                        {role === 'garage' && <MaterialCommunityIcons name="garage" size={24} color={theme.subText} />}

                                        <Text style={[
                                            styles.businessText,
                                            { color: role === 'parking' ? '#000' : theme.subText }
                                        ]}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Text>

                                        {role === 'parking' && (
                                            <View style={styles.activeDot} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* PERSONAL INFORMATION */}
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Information</Text>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}><Ionicons name="person-outline" size={20} color={theme.subText} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.infoLabel, { color: theme.subText }]}>Full Name</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                ) : (
                                    <Text style={[styles.infoValue, { color: theme.text }]}>{name}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}><Ionicons name="call-outline" size={20} color={theme.subText} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.infoLabel, { color: theme.subText }]}>Phone Number</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text style={[styles.infoValue, { color: theme.text }]}>{phone}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}><Ionicons name="mail-outline" size={20} color={theme.subText} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.infoLabel, { color: theme.subText }]}>Email</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                    />
                                ) : (
                                    <Text style={[styles.infoValue, { color: theme.text }]}>{email}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* SETTINGS */}
                    <View style={[styles.section, { backgroundColor: theme.sectionBg }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>

                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="moon-outline" size={20} color={theme.text} style={{ marginRight: 10 }} />
                                <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#767577", true: "#FFD700" }}
                                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: theme.border }]} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <Ionicons name="notifications-outline" size={20} color={theme.text} style={{ marginRight: 10 }} />
                                <Text style={[styles.settingText, { color: theme.text }]}>Notifications</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                                trackColor={{ false: "#767577", true: "#00C851" }}
                                thumbColor={notifications ? "#fff" : "#f4f3f4"}
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    editBtnText: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },

    scrollContent: { padding: 20 },

    profileCard: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { width: 100, height: 100, marginBottom: 15, position: 'relative' },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FFD700' },
    editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFD700', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    role: { fontSize: 14, marginBottom: 15 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
    badgeText: { fontSize: 12, fontWeight: 'bold' },

    section: { borderRadius: 16, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },

    // BUSINESS SWITCHER
    businessGrid: { flexDirection: 'row', gap: 10 },
    businessCard: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    businessText: { fontSize: 12, fontWeight: 'bold', marginTop: 8 },
    activeDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#000' },

    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    infoIcon: { width: 40, alignItems: 'center' },
    infoLabel: { fontSize: 12, marginBottom: 4 },
    infoValue: { fontSize: 16, fontWeight: '500' },

    input: { padding: 10, borderRadius: 8, borderWidth: 1, fontSize: 16 },

    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
    settingLeft: { flexDirection: 'row', alignItems: 'center' },
    settingText: { fontSize: 16, fontWeight: '500' },
    divider: { height: 1, marginVertical: 15 },

    logoutBtn: { backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    logoutText: { color: '#FF4444', fontWeight: 'bold', fontSize: 16 }
});
