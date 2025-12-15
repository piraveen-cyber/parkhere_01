import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Data - Security Only
const MOCK_GUARDS = [
    { id: '1', name: 'Kamal Perera', mobile: '0771234567', active: true, site: 'Galle Road Lot' },
    { id: '2', name: 'Nimal Silva', mobile: '0719876543', active: true, site: 'Kandy Center' },
    { id: '3', name: 'Sunil Cooray', mobile: '0755555555', active: false, site: 'Liberty Plaza' },
];

export default function SecurityManagement() {
    const router = useRouter();
    const [guards, setGuards] = useState(MOCK_GUARDS);

    const toggleStatus = (id: string) => {
        setGuards(guards.map(g => g.id === id ? { ...g, active: !g.active } : g));
    };

    const deleteGuard = (id: string, name: string) => {
        Alert.alert(
            "Remove Guard",
            `Are you sure you want to remove ${name} from the security team?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => setGuards(guards.filter(g => g.id !== id)) }
            ]
        );
    };

    const GuardCard = ({ item }: { item: typeof MOCK_GUARDS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: item.active ? 'rgba(0, 200, 81, 0.2)' : 'rgba(255, 68, 68, 0.2)' }]}>
                        <Ionicons name="shield" size={24} color={item.active ? '#00C851' : '#FF4444'} />
                    </View>
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.role}>Assigned to: <Text style={{ color: '#FFD700' }}>{item.site}</Text></Text>
                    </View>
                </View>
                <Switch
                    trackColor={{ false: "#333", true: "#00C851" }}
                    thumbColor={item.active ? "#FFF" : "#f4f3f4"}
                    onValueChange={() => toggleStatus(item.id)}
                    value={item.active}
                />
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={16} color="#888" />
                    <Text style={styles.detailText}>{item.mobile}</Text>
                </View>
                <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: item.active ? '#00C851' : '#FF4444' }]} />
                    <Text style={[styles.statusText, { color: item.active ? '#00C851' : '#FF4444' }]}>
                        {item.active ? 'Active' : 'Suspended'}
                    </Text>
                </View>
            </View>

            <View style={styles.actionFooter}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>Edit Assignment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: 'rgba(255, 68, 68, 0.1)' }]}
                    onPress={() => deleteGuard(item.id, item.name)}
                >
                    <Text style={[styles.actionBtnText, { color: '#FF4444' }]}>Remove</Text>
                </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>Security Team</Text>
                    <TouchableOpacity
                        style={[styles.iconBtn, { backgroundColor: '#FFD700' }]}
                        onPress={() => router.push('/partner/parking/staff/add' as any)}
                    >
                        <Ionicons name="add" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={guards}
                    renderItem={GuardCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialIcons name="security" size={60} color="#333" />
                            <Text style={styles.emptyTitle}>No Guards Assigned</Text>
                            <Text style={styles.emptySub}>Add security personnel to your parking lots.</Text>
                        </View>
                    }
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
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    role: { color: '#888', fontSize: 14 },

    detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { color: '#CCC', fontSize: 13 },

    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    actionFooter: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#333', alignItems: 'center' },
    actionBtnText: { color: '#FFF', fontWeight: '600', fontSize: 13 },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    emptySub: { color: '#666', marginTop: 5 }
});
