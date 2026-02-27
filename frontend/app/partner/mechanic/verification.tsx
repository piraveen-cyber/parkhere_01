import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function MechanicVerification() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [idImage, setIdImage] = useState<boolean>(false);
    const [certImage, setCertImage] = useState<boolean>(false);

    // Mock document picker
    const pickDocument = (type: 'id' | 'cert') => {
        Alert.alert(
            "Select Document",
            "This is a demo. Simulating file selection...",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Select Mock File", onPress: () => type === 'id' ? setIdImage(true) : setCertImage(true) }
            ]
        );
    };

    const handleSubmit = async () => {
        if (!idImage || !certImage) {
            Alert.alert("Missing Documents", "Please upload both your ID and Mechanic Certificate.");
            return;
        }

        setSubmitting(true);

        // Simulate API call
        setTimeout(async () => {
            try {
                await AsyncStorage.setItem('MECHANIC_PARTNER_STATUS', 'pending');
                Alert.alert("Success", "Documents submitted! Your mechanic profile is under review.");
                router.replace('/partner/mechanic' as any);
            } catch (e) {
                Alert.alert("Error", "Failed to submit documents.");
            } finally {
                setSubmitting(false);
            }
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1c']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mechanic Verification</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Verify Your Skills</Text>
                    <Text style={styles.subtitle}>Upload your credentials to start accepting service requests.</Text>

                    {/* ID CARD UPLOAD */}
                    <View style={styles.uploadCard}>
                        <View style={styles.uploadHeader}>
                            <Ionicons name="id-card-outline" size={24} color="#FFD700" />
                            <Text style={styles.uploadTitle}>National ID / Driving License</Text>
                        </View>
                        <Text style={styles.uploadDesc}>Government issued identification.</Text>

                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument('id')}>
                            {idImage ? (
                                <View style={styles.fileSelected}>
                                    <Ionicons name="document-text" size={30} color="#00C851" />
                                    <Text style={styles.fileName}>id_scan.jpg</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#00C851" style={{ marginLeft: 'auto' }} />
                                </View>
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={32} color="#666" />
                                    <Text style={styles.uploadPlaceholder}>Tap to Upload</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* CERTIFICATE UPLOAD */}
                    <View style={styles.uploadCard}>
                        <View style={styles.uploadHeader}>
                            <Ionicons name="ribbon-outline" size={24} color="#FFD700" />
                            <Text style={styles.uploadTitle}>Mechanic Certificate</Text>
                        </View>
                        <Text style={styles.uploadDesc}>NVQ Certificate or Workshop License.</Text>

                        <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument('cert')}>
                            {certImage ? (
                                <View style={styles.fileSelected}>
                                    <Ionicons name="document-text" size={30} color="#00C851" />
                                    <Text style={styles.fileName}>certificate.pdf</Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#00C851" style={{ marginLeft: 'auto' }} />
                                </View>
                            ) : (
                                <>
                                    <Ionicons name="cloud-upload-outline" size={32} color="#666" />
                                    <Text style={styles.uploadPlaceholder}>Tap to Upload</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, (!idImage || !certImage) && styles.disabledBtn]}
                        onPress={handleSubmit}
                        disabled={submitting || !idImage || !certImage}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.submitText}>Submit Verification</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    scrollContent: { padding: 20 },

    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#AAA', marginBottom: 30, lineHeight: 20 },

    uploadCard: { backgroundColor: '#1F1F1F', borderRadius: 16, padding: 20, marginBottom: 20 },
    uploadHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    uploadDesc: { fontSize: 13, color: '#AAA', marginBottom: 15 },

    uploadBox: { height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#333', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
    uploadPlaceholder: { color: '#666', marginTop: 5, fontWeight: '600' },

    fileSelected: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20, gap: 10 },
    fileName: { color: '#FFF', fontWeight: '500' },

    submitBtn: { backgroundColor: '#FFD700', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    disabledBtn: { backgroundColor: '#333', opacity: 0.7 },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
