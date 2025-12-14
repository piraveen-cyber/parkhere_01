import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../config/supabaseClient";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OwnerProfile() {
    const { colors, theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [langModalVisible, setLangModalVisible] = useState(false);

    const handleSwitchToTravel = () => {
        // Navigate back to Customer Tabs
        router.replace("/(tabs)/home");
    };

    const logout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };

    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem('user-language', lang);
        setLangModalVisible(false);
    };

    const MenuItem = ({ icon, title, isDestructive = false, onPress, rightElement }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={onPress}
        >
            <View style={styles.menuLeft}>
                <Ionicons name={icon} size={22} color={isDestructive ? colors.error : colors.text} />
                <Text style={[styles.menuText, { color: isDestructive ? colors.error : colors.text }]}>{title}</Text>
            </View>
            {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color={colors.subText} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('hostProfile')}</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>

                {/* Switch Mode Card */}
                <TouchableOpacity
                    style={[styles.switchCard, { backgroundColor: colors.secondary + '20', borderColor: colors.secondary }]}
                    onPress={handleSwitchToTravel}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                        <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                            <Ionicons name="car-sport" size={24} color="#000" />
                        </View>
                        <View>
                            <Text style={[styles.switchTitle, { color: colors.text }]}>{t('switchToTravel')}</Text>
                            <Text style={{ color: colors.subText, fontSize: 12 }}>{t('bookSpotsVehicle')}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, { color: colors.subText }]}>{t('account')}</Text>
                <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
                    <MenuItem icon="person-outline" title={t('editProfile')} onPress={() => { }} />
                    <MenuItem icon="card-outline" title={t('payoutMethods')} onPress={() => { }} />
                    <MenuItem icon="document-text-outline" title={t('taxInfo')} onPress={() => { }} />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.subText }]}>{t('preferences')}</Text>
                <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
                    <MenuItem icon="language-outline" title={t('language') || "Language"} onPress={() => setLangModalVisible(true)} />
                    <MenuItem
                        icon="moon-outline"
                        title={t('darkMode')}
                        rightElement={<Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: "#333", true: colors.primary }} />}
                    />
                </View>

                <View style={[styles.menuGroup, { backgroundColor: colors.card, marginTop: 20 }]}>
                    <MenuItem
                        icon="log-out-outline"
                        title={t('logOut')}
                        isDestructive
                        onPress={() => Alert.alert(t('logoutTitle'), t('logoutMsg'), [{ text: t('cancel') }, { text: t('logoutTitle'), style: 'destructive', onPress: logout }])}
                    />
                </View>

            </ScrollView>

            {/* Language Modal */}
            <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t("chooseLanguage") || "Choose Language"}</Text>
                        {['en', 'ta', 'si'].map(lang => (
                            <TouchableOpacity key={lang} style={[styles.langOption, { borderColor: colors.border }]} onPress={() => changeLanguage(lang)}>
                                <Text style={[styles.langText, { color: colors.text }]}>{lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'සිංහල'}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.border }]} onPress={() => setLangModalVisible(false)}>
                            <Text style={[styles.closeBtnText, { color: colors.text }]}>{t("cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 24, fontWeight: "700" },

    switchCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 30 },
    iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    switchTitle: { fontSize: 16, fontWeight: "700" },

    sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10, marginLeft: 5 },
    menuGroup: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    menuText: { fontSize: 16, fontWeight: "500" },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: "80%", borderRadius: 20, padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
    langOption: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, width: "100%", borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    langText: { fontSize: 16, fontWeight: "600", flex: 1 },
    closeBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, marginTop: 10 },
    closeBtnText: { fontWeight: "600" },
});
