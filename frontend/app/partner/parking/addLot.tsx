import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createParkingSpot } from '../../../services/parkingService';

export default function AddLot() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        pricePerHour: '',
        latitude: '6.9271',
        longitude: '79.8612',
        description: '',
        type: 'indoor'
    });

    const [capacities, setCapacities] = useState({
        car: 10,
        bike: 5,
        ev: 2,
        heavy: 0
    });

    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const FEATURES = [
        { id: 'cctv', label: 'CCTV', icon: 'videocam-outline' },
        { id: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
        { id: 'covered', label: 'Covered', icon: 'home-outline' },
        { id: '247', label: '24/7 Access', icon: 'time-outline' },
        { id: 'ev', label: 'EV Charging', icon: 'flash-outline' },
        { id: 'wash', label: 'Car Wash', icon: 'water-outline' },
        { id: 'valet', label: 'Valet', icon: 'key-outline' },
        { id: 'disabled', label: 'Disabled Slot', icon: 'accessibility-outline' }
    ];

    const toggleFeature = (id: string) => {
        if (selectedFeatures.includes(id)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== id));
        } else {
            setSelectedFeatures([...selectedFeatures, id]);
        }
    };

    const updateCapacity = (type: keyof typeof capacities, increment: boolean) => {
        setCapacities(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
        }));
    };

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
                isAvailable: true,
                features: selectedFeatures,
                capacity: capacities
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

    const CapacityCounter = ({ label, type, icon }: { label: string, type: keyof typeof capacities, icon: any }) => (
        <View style={styles.counterRow}>
            <View style={styles.counterLabel}>
                <Ionicons name={icon} size={20} color="#FFD700" />
                <Text style={styles.counterText}>{label}</Text>
            </View>
            <View style={styles.counterControls}>
                <TouchableOpacity onPress={() => updateCapacity(type, false)} style={styles.controlBtn}>
                    <Ionicons name="remove" size={18} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.countValue}>{capacities[type]}</Text>
                <TouchableOpacity onPress={() => updateCapacity(type, true)} style={styles.controlBtn}>
                    <Ionicons name="add" size={18} color="#000" style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>
            </View>
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

                        {/* BASIC DETAILS */}
                        <Text style={styles.sectionTitle}>Basic Details</Text>
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

                        {/* PRICE & TYPE */}
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

                        {/* CAPACITY SECTION */}
                        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Capacity & Slots</Text>
                        <View style={styles.capacityContainer}>
                            <CapacityCounter label="Car Slots" type="car" icon="car-outline" />
                            <CapacityCounter label="Bike Slots" type="bike" icon="bicycle-outline" />
                            <CapacityCounter label="EV Slots" type="ev" icon="flash-outline" />
                            <CapacityCounter label="Heavy Slots" type="heavy" icon="bus-outline" />
                        </View>

                        {/* FEATURES SECTION */}
                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Lot Features</Text>
                        <View style={styles.featuresGrid}>
                            {FEATURES.map((feature) => (
                                <TouchableOpacity
                                    key={feature.id}
                                    style={[styles.featureChip, selectedFeatures.includes(feature.id) && styles.featureChipActive]}
                                    onPress={() => toggleFeature(feature.id)}
                                >
                                    <Ionicons
                                        name={feature.icon as any}
                                        size={18}
                                        color={selectedFeatures.includes(feature.id) ? '#000' : '#AAA'}
                                    />
                                    <Text style={[styles.featureText, selectedFeatures.includes(feature.id) && styles.featureTextActive]}>
                                        {feature.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ height: 20 }} />

                        <InputField
                            label="Description"
                            value={formData.description}
                            onChangeText={(t: string) => setFormData({ ...formData, description: t })}
                            placeholder="Facilities, rules, etc."
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.locationBtn}
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
    sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },

    inputGroup: { marginBottom: 20 },
    label: { color: '#AAA', fontSize: 12, marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#141414', borderRadius: 12, padding: 15, color: '#FFF', borderWidth: 1, borderColor: '#333' },

    row: { flexDirection: 'row' },

    typeSelector: { flexDirection: 'row', backgroundColor: '#141414', borderRadius: 12, padding: 4, height: 50, borderWidth: 1, borderColor: '#333' },
    typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8, gap: 5 },
    typeBtnActive: { backgroundColor: '#FFD700' },
    typeText: { color: '#FFF', fontSize: 12 },

    // CAPACITY
    capacityContainer: { backgroundColor: '#141414', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#333' },
    counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    counterLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    counterText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    counterControls: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    controlBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    countValue: { color: '#FFF', fontSize: 16, fontWeight: 'bold', width: 20, textAlign: 'center' },

    // FEATURES
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    featureChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#141414', borderWidth: 1, borderColor: '#333' },
    featureChipActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    featureText: { color: '#AAA', fontSize: 12, fontWeight: '600' },
    featureTextActive: { color: '#000' },

    locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderWidth: 1, borderColor: '#FFD700', borderRadius: 12, gap: 10, borderStyle: 'dashed' },
    locationText: { color: '#FFD700', fontWeight: '600' },

    footer: { padding: 20, backgroundColor: '#101010', borderTopWidth: 1, borderTopColor: '#333' },
    submitBtn: { backgroundColor: '#FFD700', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
