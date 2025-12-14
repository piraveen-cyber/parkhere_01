import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import * as ImagePicker from 'expo-image-picker';

import Header from "../../components/Header";

export default function AddParkingStep7() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();

    const [docs, setDocs] = useState<{ idFront: string | null, ownership: string | null, gate: string | null }>({
        idFront: null,
        ownership: null,
        gate: null
    });

    const pickImage = async (key: 'idFront' | 'ownership' | 'gate') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDocs(prev => ({ ...prev, [key]: result.assets[0].uri }));
        }
    };

    const handleNext = () => {
        if (!docs.idFront || !docs.ownership || !docs.gate) {
            Alert.alert(t('error'), t('missingDocs'));
            return;
        }
        router.push("../add-parking/step8");
    };

    const UploadCard = ({ id, label, image }: any) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <TouchableOpacity
                style={[styles.uploadBox, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => pickImage(id)}
            >
                {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
                        <Text style={{ color: colors.subText, marginTop: 10 }}>{t('tapToUpload')}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={`${t('verificationDocs')} (7/8)`} onBack={() => router.back()} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.description, { color: colors.subText }]}>{t('securityNote')}</Text>

                <UploadCard id="idFront" label={t('uploadId')} image={docs.idFront} />
                <UploadCard id="ownership" label={t('uploadOwnership')} image={docs.ownership} />
                <UploadCard id="gate" label={t('uploadEntryGate')} image={docs.gate} />

            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: (docs.idFront && docs.ownership && docs.gate) ? 1 : 0.5 }]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextBtnText}>{t('nextReview')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    content: { padding: 20 },
    description: { marginBottom: 20, fontSize: 14, lineHeight: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    uploadBox: { height: 180, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
