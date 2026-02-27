import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { updateParkingSpot, getParkingSpots, deleteParkingSpot, ParkingSpot } from '../../../services/parkingService';

export default function EditLot() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<any>({
        name: '',
        address: '',
        pricePerHour: '',
        description: '',
        type: 'indoor'
    });

    useEffect(() => {
        if (id) fetchLotDetails();
    }, [id]);

    const fetchLotDetails = async () => {
        try {
            // In real app, fetch single by ID. For now finding in list.
            const allSpots = await getParkingSpots();
            const spot = allSpots.find(s => s._id === id);
            if (spot) {
                setFormData({
                    name: spot.name,
                    address: spot.address || '',
                    pricePerHour: spot.pricePerHour.toString(),
                    description: spot.description || '',
                    type: spot.type
                });
            }
        } catch (e) {
            Alert.alert("Error", "Failed to load lot details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await updateParkingSpot(id as string, {
                name: formData.name,
                address: formData.address,
                pricePerHour: parseFloat(formData.pricePerHour),
                description: formData.description,
                type: formData.type
            });
            Alert.alert("Success", "Parking lot updated!");
            router.back();
        } catch (e) {
            Alert.alert("Error", "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Parking Lot",
            "Are you sure you want to delete this lot? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setSaving(true);
                        try {
                            await deleteParkingSpot(id as string);
                            router.back();
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete");
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: any) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#666"
                keyboardType={keyboardType}
                multiline={multiline}
            />
        </View>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator color="#FFD700" /></View>;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Lot</Text>
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={24} color="#FF4444" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formCard}>
                        <InputField
                            label="Lot Name"
                            value={formData.name}
                            onChangeText={(t: string) => setFormData({ ...formData, name: t })}
                        />
                        <InputField
                            label="Address"
                            value={formData.address}
                            onChangeText={(t: string) => setFormData({ ...formData, address: t })}
                        />
                        <InputField
                            label="Price (LKR/hr)"
                            value={formData.pricePerHour}
                            onChangeText={(t: string) => setFormData({ ...formData, pricePerHour: t })}
                            keyboardType="numeric"
                        />
                        <InputField
                            label="Description"
                            value={formData.description}
                            onChangeText={(t: string) => setFormData({ ...formData, description: t })}
                            multiline
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate} disabled={saving}>
                        {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Save Changes</Text>}
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    deleteBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255, 68, 68, 0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },
    formCard: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { color: '#AAA', fontSize: 12, marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#141414', borderRadius: 12, padding: 15, color: '#FFF', borderWidth: 1, borderColor: '#333' },
    footer: { padding: 20, backgroundColor: '#101010', borderTopWidth: 1, borderTopColor: '#333' },
    submitBtn: { backgroundColor: '#FFD700', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
