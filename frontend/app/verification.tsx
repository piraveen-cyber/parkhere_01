import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/themeContext';
// import * as DocumentPicker from 'expo-document-picker'; // Uncomment when installed
import axios from 'axios';

export default function VerificationScreen() {
    const { t } = useTranslation();
    const { colors, accessibility } = useTheme();
    const [documentName, setDocumentName] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Placeholder for actual document picker
    const pickDocument = async () => {
        // const result = await DocumentPicker.getDocumentAsync({});
        // if (result.type === 'success') { setDocumentName(result.name); }
        setDocumentName("disability_certificate_sample.pdf"); // Simulating selection
    };

    const submitVerification = async () => {
        if (!documentName) {
            Alert.alert("Error", "Please upload a document.");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Verification Requested! Our admin will review it shortly.");
            router.back();
        }, 1500);
    };

    const styles = getStyles(colors, accessibility.largeText);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Disability Verification</Text>
            </View>

            <View style={styles.content}>
                <Ionicons name="shield-checkmark" size={60} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 20 }} />

                <Text style={styles.description}>
                    Parking in designated accessible spots requires a verified disability certificate.
                    Please upload your official ID or medical certificate below.
                </Text>

                <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
                    <Ionicons name="cloud-upload-outline" size={40} color={colors.subText} />
                    <Text style={styles.uploadText}>
                        {documentName || "Tap to Upload Document"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Additional details..."
                        placeholderTextColor={colors.subText}
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={submitVerification}
                    disabled={loading}
                >
                    <Text style={styles.submitText}>
                        {loading ? "Submitting..." : "Request Verification"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any, isLargeText: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: isLargeText ? 26 : 22,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 10,
    },
    content: {
        marginTop: 10,
    },
    description: {
        fontSize: isLargeText ? 18 : 15,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    uploadBox: {
        height: 150,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.card,
        marginBottom: 20,
    },
    uploadText: {
        color: colors.primary,
        marginTop: 10,
        fontSize: isLargeText ? 18 : 16,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        color: colors.text,
        marginBottom: 10,
        fontSize: isLargeText ? 18 : 16,
    },
    input: {
        backgroundColor: colors.inputBg,
        color: colors.text,
        padding: 15,
        borderRadius: 10,
        fontSize: isLargeText ? 18 : 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    submitText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: isLargeText ? 20 : 18,
    }
});
