import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";

export default function AddParkingStep1() {
    const { colors, theme } = useTheme();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        loadDraft();
    }, []);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const loadDraft = async () => {
        const draft = await AsyncStorage.getItem("parking_draft_step1");
        if (draft) {
            const data = JSON.parse(draft);
            setName(data.name || "");
            setPhone(data.phone || "");
            setIsVerified(data.isVerified || false);
        }
    };

    const sendOtp = () => {
        if (phone.length < 9) return Alert.alert(t('error'), t('enterValidPhone'));
        const code = "123456"; // Mock OTP
        setGeneratedOtp(code);
        setTimer(30);
        Alert.alert(t('codeSent'), `${t('codeSent')} : ${code}`);
    };

    const verifyOtp = () => {
        if (otp === generatedOtp) {
            setIsVerified(true);
            Alert.alert(t('success'), t('phoneVerified'));
        } else {
            Alert.alert(t('error'), t('invalidOtpMsg'));
        }
    };

    const handleNext = async () => {
        if (!name || !phone) return Alert.alert(t('error'), t('fillBasicInfo'));
        if (!isVerified) return Alert.alert(t('error'), t('verifyIdentity'));

        const draft = { name, phone, isVerified };
        await AsyncStorage.setItem("parking_draft_step1", JSON.stringify(draft));
        router.push("../business-onboarding/parking-location");
    };

    const demoFill = () => {
        setName("John Doe");
        setPhone("0771234567");
        setIsVerified(true);
        Alert.alert("Demo Mode", "Form filled and verified for demo purposes.");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20 }}>
                <Header title={`${t('basicInfo')} (1/8)`} onBack={() => router.back()} />
                <TouchableOpacity onPress={demoFill} style={{ padding: 8, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 12 }}>{t('demoFill')}</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>{t('name')}</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder={t('enterName')}
                            placeholderTextColor={colors.subText}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>{t('phoneNumber')}</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                style={[styles.input, { flex: 1, backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="07XXXXXXXX"
                                placeholderTextColor={colors.subText}
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={(t) => { setPhone(t); setIsVerified(false); }}
                            />
                            <TouchableOpacity
                                style={[styles.verifyBtn, { backgroundColor: isVerified ? colors.success : colors.primary, opacity: timer > 0 ? 0.5 : 1 }]}
                                onPress={sendOtp}
                                disabled={isVerified || timer > 0}
                            >
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>
                                    {isVerified ? t('verified') : timer > 0 ? `${timer}s` : t('sendOtp')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!isVerified && generatedOtp !== "" && (
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>OTP</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TextInput
                                    style={[styles.input, { flex: 1, backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                    placeholder="XXXXXX"
                                    placeholderTextColor={colors.subText}
                                    keyboardType="number-pad"
                                    value={otp}
                                    onChangeText={setOtp}
                                />
                                <TouchableOpacity
                                    style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
                                    onPress={verifyOtp}
                                >
                                    <Text style={{ color: '#000', fontWeight: 'bold' }}>{t('verifyOtp')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: colors.primary, opacity: (name && isVerified) ? 1 : 0.5 }]}
                    onPress={handleNext}
                    disabled={!name || !isVerified}
                >
                    <Text style={styles.nextBtnText}>{t('nextDetails')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    input: { height: 56, borderRadius: 16, paddingHorizontal: 20, borderWidth: 1 },
    inputGroup: { marginBottom: 15 },
    verifyBtn: { height: 56, paddingHorizontal: 20, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    footer: { padding: 20, borderTopWidth: 1 },
    nextBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    nextBtnText: { fontSize: 18, fontWeight: '700', color: '#000' }
});
