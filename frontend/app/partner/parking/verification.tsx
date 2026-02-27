import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ParkingVerification() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [idImage, setIdImage] = useState<boolean>(false);
    const [regImage, setRegImage] = useState<boolean>(false);

    // Mock document picker
    const pickDocument = (type: 'id' | 'reg') => {
        Alert.alert(
            "Select Document",
            "This is a demo. Simulating file selection...",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Select Mock File", onPress: () => type === 'id' ? setIdImage(true) : setRegImage(true) }
            ]
        );
    };

    const handleSubmit = async () => {
        if (!idImage || !regImage) {
            Alert.alert("Missing Documents", "Please upload both your ID and Business Registration.");
            return;
        }

        setSubmitting(true);

        // Simulate API call
        setTimeout(async () => {
            try {
                await AsyncStorage.setItem('PARKING_PARTNER_STATUS', 'pending');
                Alert.alert("Success", "Documents submitted for review! We will notify you shortly.");
                router.back();
            } catch (e) {
                Alert.alert("Error", "Failed to submit documents.");
            } finally {
                setSubmitting(false);
            }
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Submit Documents</Text>
                <Text style={styles.subtitle}>To verify your account, please upload clear photos of the following documents.</Text>

                {/* ID CARD UPLOAD */}
                <View style={styles.uploadCard}>
                    <View style={styles.uploadHeader}>
                        <Ionicons name="id-card-outline" size={24} color="#FFD400" />
                        <Text style={styles.uploadTitle}>National ID / Passport</Text>
                    </View>
                    <Text style={styles.uploadDesc}>Upload the front side of your government-issued ID.</Text>

                    <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument('id')}>
                        {idImage ? (
                            <View style={styles.fileSelected}>
                                <Ionicons name="document-text" size={30} color="#00C851" />
                                <Text style={styles.fileName}>id_card_scan.jpg</Text>
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

                {/* BUSINESS REG UPLOAD */}
                <View style={styles.uploadCard}>
                    <View style={styles.uploadHeader}>
                        <Ionicons name="business-outline" size={24} color="#FFD400" />
                        <Text style={styles.uploadTitle}>Business Registration</Text>
                    </View>
                    <Text style={styles.uploadDesc}>Proof of business address or registration certificate.</Text>

                    <TouchableOpacity style={styles.uploadBox} onPress={() => pickDocument('reg')}>
                        {regImage ? (
                            <View style={styles.fileSelected}>
                                <Ionicons name="document-text" size={30} color="#00C851" />
                                <Text style={styles.fileName}>business_reg.pdf</Text>
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
                    style={[styles.submitBtn, (!idImage || !regImage) && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={submitting || !idImage || !regImage}
                >
                    {submitting ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.submitText}>Submit for Review</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1B2A' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    scrollContent: { padding: 20 },

    title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#AAA', marginBottom: 30, lineHeight: 20 },

    uploadCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 20 },
    uploadHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    uploadDesc: { fontSize: 13, color: '#AAA', marginBottom: 15 },

    uploadBox: { height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#333', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
    uploadPlaceholder: { color: '#666', marginTop: 5, fontWeight: '600' },

    fileSelected: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20, gap: 10 },
    fileName: { color: '#FFF', fontWeight: '500' },

    submitBtn: { backgroundColor: '#FFD400', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    disabledBtn: { backgroundColor: '#333', opacity: 0.7 },
    submitText: { color: '#000', fontWeight: 'bold', fontSize: 18 }
});
