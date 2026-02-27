import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from "react-i18next";

export default function OwnerOnboardingStep2() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [uploads, setUploads] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);

    const DOC_TYPES = [
        { id: 'id_front', label: t('idFront'), icon: 'id-card-outline' },
        { id: 'id_back', label: t('idBack'), icon: 'id-card-outline' },
        { id: 'ownership', label: t('proofOwnership'), icon: 'document-text-outline' },
    ];

    const pickImage = async (id: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setUploads({ ...uploads, [id]: result.assets[0].uri });
        }
    };

    const handleSubmit = () => {
        if (Object.keys(uploads).length < 2) return Alert.alert(t('missingDocs'), t('uploadIdWarning'));

        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert(t('verificationSubmitted'), t('reviewingMsg'), [
                { text: t('goToDashboard'), onPress: () => router.replace("../add-parking/step1") }
            ]);
        }, 2000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: 8, backgroundColor: colors.card, borderRadius: 12, marginBottom: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 10 }}>{t('verifyIdentity')}</Text>
                <Text style={{ fontSize: 16, color: colors.subText }}>{t('verifyDesc')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, gap: 15 }}>
                {DOC_TYPES.map((doc) => {
                    const isUploaded = !!uploads[doc.id];
                    return (
                        <TouchableOpacity
                            key={doc.id}
                            style={[styles.uploadCard, { backgroundColor: colors.card, borderColor: isUploaded ? colors.primary : 'transparent', borderWidth: 1 }]}
                            onPress={() => pickImage(doc.id)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: isUploaded ? 'rgba(255,212,0,0.2)' : 'rgba(255,255,255,0.05)' }]}>
                                <Ionicons name={isUploaded ? "checkmark" : doc.icon as any} size={24} color={isUploaded ? colors.primary : colors.text} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.docLabel, { color: colors.text }]}>{doc.label}</Text>
                                <Text style={[styles.docStatus, { color: isUploaded ? colors.primary : colors.subText }]}>{isUploaded ? t('uploaded') : t('tapToUpload')}</Text>
                            </View>
                            <Ionicons name="cloud-upload-outline" size={20} color={colors.subText} />
                        </TouchableOpacity>
                    )
                })}

                <View style={[styles.securityNote, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                    <Ionicons name="lock-closed" size={16} color="#4CAF50" />
                    <Text style={{ color: '#4CAF50', fontSize: 12, flex: 1 }}>{t('securityNote')}</Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#000" /> : <Text style={styles.nextBtnText}>{t('submitContinue')}</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    uploadCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, gap: 15 },
    iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    docLabel: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    docStatus: { fontSize: 12 },
    securityNote: { flexDirection: 'row', padding: 15, borderRadius: 12, gap: 10, alignItems: 'center', marginTop: 10 },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
