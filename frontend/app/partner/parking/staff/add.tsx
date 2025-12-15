import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Mock Parking Lots for Selection
const MY_LOTS = [
    { id: '1', name: 'Galle Road Lot', location: 'Colombo 03' },
    { id: '2', name: 'Kandy Center', location: 'Kandy City' },
    { id: '3', name: 'Liberty Plaza', location: 'Colombo 03' },
];

export default function AddSecurityGuard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

    const handleCreate = () => {
        if (!name || !mobile || !password || !selectedLotId) {
            Alert.alert("Error", "Please fill all fields and assign a parking lot.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Security Guard assigned successfully!");
            router.back();
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Security Guard</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.sectionHeader}>Guard Details</Text>

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Sunil Perera"
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="07XXXXXXXX"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        value={mobile}
                        onChangeText={setMobile}
                    />

                    <Text style={styles.label}>Create Login PIN</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••"
                        placeholderTextColor="#666"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={styles.divider} />

                    <Text style={styles.sectionHeader}>Assign to Parking Lot</Text>
                    <Text style={styles.subText}>Select the parking lot this guard will manage.</Text>

                    {MY_LOTS.map(lot => (
                        <TouchableOpacity
                            key={lot.id}
                            style={[styles.lotCard, selectedLotId === lot.id && styles.lotCardActive]}
                            onPress={() => setSelectedLotId(lot.id)}
                        >
                            <View>
                                <Text style={[styles.lotName, selectedLotId === lot.id && { color: '#000' }]}>{lot.name}</Text>
                                <Text style={[styles.lotLoc, selectedLotId === lot.id && { color: '#333' }]}>{lot.location}</Text>
                            </View>
                            {selectedLotId === lot.id ? (
                                <Ionicons name="checkmark-circle" size={24} color="#000" />
                            ) : (
                                <Ionicons name="ellipse-outline" size={24} color="#666" />
                            )}
                        </TouchableOpacity>
                    ))}

                    <View style={styles.infoBox}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#00C851" />
                        <Text style={styles.infoText}>This account will have restricted access only to the Security Scanner for the selected lot.</Text>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Assign Guard</Text>}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

    content: { padding: 25 },
    sectionHeader: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    subText: { color: '#888', fontSize: 14, marginBottom: 15 },

    label: { color: '#AAA', marginBottom: 10, fontSize: 14, fontWeight: '600' },
    input: { backgroundColor: '#1F1F1F', borderRadius: 12, padding: 15, color: '#FFF', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#333' },

    divider: { height: 1, backgroundColor: '#333', marginVertical: 20 },

    lotCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1F1F1F', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
    lotCardActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    lotName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    lotLoc: { color: '#888', fontSize: 12, marginTop: 2 },

    infoBox: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'rgba(0, 200, 81, 0.1)', borderRadius: 12, gap: 10, marginTop: 20 },
    infoText: { color: '#00C851', flex: 1, fontSize: 13 },

    footer: { padding: 25 },
    createBtn: { backgroundColor: '#FFD700', padding: 18, borderRadius: 16, alignItems: 'center' },
    btnText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
