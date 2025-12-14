import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createParkingSpot } from '../../../services/parkingService';

export default function AddLot() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        pricePerHour: '',
        latitude: '6.9271', // Default Colombo
        longitude: '79.8612', // Default Colombo
        description: '',
        type: 'indoor'
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.address || !formData.pricePerHour) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            await createParkingSpot({
                name: formData.name,
                address: formData.address,
                pricePerHour: parseFloat(formData.pricePerHour),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                description: formData.description,
                type: formData.type,
                isAvailable: true
            });
            Alert.alert("Success", "Parking lot added successfully!");
            router.back();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Failed to create parking lot");
        } finally {
            setLoading(false);
        }
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

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#101010']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add New Lot</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.formCard}>
                        <InputField
                            label="Lot Name"
                            value={formData.name}
                            onChangeText={(t: string) => setFormData({ ...formData, name: t })}
                            placeholder="e.g. City Center Parking"
                        />

                        <InputField
                            label="Address"
                            value={formData.address}
                            onChangeText={(t: string) => setFormData({ ...formData, address: t })}
                            placeholder="e.g. 123 Main St, Colombo"
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <InputField
                                    label="Price (LKR/hr)"
                                    value={formData.pricePerHour}
                                    onChangeText={(t: string) => setFormData({ ...formData, pricePerHour: t })}
                                    placeholder="e.g. 200"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Type</Text>
                                <View style={styles.typeSelector}>
                                    <TouchableOpacity
                                        onPress={() => setFormData({ ...formData, type: 'indoor' })}
                                        style={[styles.typeBtn, formData.type === 'indoor' && styles.typeBtnActive]}
                                    >
                                        <Ionicons name="business" size={16} color={formData.type === 'indoor' ? '#000' : '#FFF'} />
                                        <Text style={[styles.typeText, formData.type === 'indoor' && { color: '#000', fontWeight: 'bold' }]}>Indoor</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setFormData({ ...formData, type: 'outdoor' })}
                                        style={[styles.typeBtn, formData.type === 'outdoor' && styles.typeBtnActive]}
                                    >
                                        <Ionicons name="sunny" size={16} color={formData.type === 'outdoor' ? '#000' : '#FFF'} />
                                        <Text style={[styles.typeText, formData.type === 'outdoor' && { color: '#000', fontWeight: 'bold' }]}>Outdoor</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <InputField
                            label="Description"
                            value={formData.description}
                            onChangeText={(t: string) => setFormData({ ...formData, description: t })}
                            placeholder="Facilities, rules, etc."
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.locationBtn}
                            // Implement Map Picker in future
                            onPress={() => Alert.alert("Location", "Using default location (Colombo) for demo.")}
                        >
                            <Ionicons name="map" size={20} color="#FFD700" />
                            <Text style={styles.locationText}>Set Location on Map</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Create Parking Lot</Text>}
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },

    formCard: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20 },

    inputGroup: { marginBottom: 20 },
    label: { color: '#AAA', fontSize: 12, marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#141414', borderRadius: 12, padding: 15, color: '#FFF', borderWidth: 1, borderColor: '#333' },

    row: { flexDirection: 'row' },

    typeSelector: { flexDirection: 'row', backgroundColor: '#141414', borderRadius: 12, padding: 4, height: 50, borderWidth: 1, borderColor: '#333' },
    typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8, gap: 5 },
    typeBtnActive: { backgroundColor: '#FFD700' },
    typeText: { color: '#FFF', fontSize: 12 },

    locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderWidth: 1, borderColor: '#FFD700', borderRadius: 12, gap: 10, borderStyle: 'dashed' },
    locationText: { color: '#FFD700', fontWeight: '600' },

    footer: { padding: 20, backgroundColor: '#101010', borderTopWidth: 1, borderTopColor: '#333' },
    submitBtn: { backgroundColor: '#FFD700', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
