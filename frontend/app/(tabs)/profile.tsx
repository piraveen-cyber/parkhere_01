import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, StatusBar, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "../../config/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../context/themeContext";

export default function ProfileTab() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, colors } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false); // Added state

  useEffect(() => {
    fetchProfile();
  }, []);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
    setLangModalVisible(false);
  };

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // ideally fetch more details from a profiles table if it exists
      }
    } catch (e) {
      console.log("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(t("logoutTitle"), t("logoutMsg"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logoutTitle"),
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/onboarding1");
        }
      }
    ]);
  };

  const MenuItem = ({ icon, title, isDestructive = false, showArrow = true, onPress, rightElement }: any) => (
    <TouchableOpacity activeOpacity={0.7} style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? "rgba(255, 68, 68, 0.1)" : "rgba(255, 212, 0, 0.1)" }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? colors.error : colors.primary} />
        </View>
        <Text style={[styles.menuText, { color: isDestructive ? colors.error : colors.text }]}>{title}</Text>
      </View>
      {rightElement ? rightElement : (showArrow && <Ionicons name="chevron-forward" size={18} color={colors.subText} />)}
    </TouchableOpacity>
  );

  const COLORS = colors; // Alias for compat

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>{t("myProfile")}</Text>
          <TouchableOpacity onPress={() => Alert.alert("Settings", "Coming soon!")}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* USER INFO CARD */}
          <View style={[styles.profileCard, { backgroundColor: COLORS.card }]}>
            <View style={[styles.avatarContainer, { borderColor: COLORS.primary }]}>
              <Ionicons name="person" size={40} color={COLORS.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: COLORS.text }]}>
                {user?.email?.split('@')[0] || "Guest User"}
              </Text>
              <Text style={[styles.userEmail, { color: COLORS.subText }]}>{user?.email || "No email"}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t("goldMember")}</Text>
              </View>
            </View>
          </View>

          {/* STATS ROW - Mock Data for now */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: COLORS.subText }]}>{t("bookings")}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: COLORS.subText }]}>{t("rating")}</Text>
            </View>
          </View>

          {/* MENUS */}
          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("account")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="person-outline" title={t("editProfile")} onPress={() => Alert.alert("Edit Profile", "Feature coming soon.")} />
            <MenuItem icon="card-outline" title={t("paymentMethods")} onPress={() => Alert.alert("Payment Methods", "Feature coming soon.")} />
            <MenuItem icon="notifications-outline" title={t("notifications")} onPress={() => Alert.alert("Notifications", "Feature coming soon.")} />
          </View>

          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("preferences")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="language-outline" title={t("language")} onPress={() => setLangModalVisible(true)} />

            {/* Dark Mode Toggle */}
            <MenuItem
              icon="moon-outline"
              title={t("darkMode")}
              showArrow={false}
              onPress={toggleTheme}
              rightElement={
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#333", true: COLORS.primary }}
                  thumbColor="#FFF"
                />
              }
            />
          </View>

          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("support")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="help-circle-outline" title={t("helpCenter")} onPress={() => Alert.alert("Help Center", "Contact support@parkhere.lk")} />
            <MenuItem icon="shield-checkmark-outline" title={t("privacyPolicy")} onPress={() => Alert.alert("Privacy Policy", "Policy content here.")} />
          </View>

          <View style={[styles.menuGroup, { backgroundColor: COLORS.card, marginTop: 20, marginBottom: 40 }]}>
            <MenuItem icon="log-out-outline" title={t("logOut")} isDestructive onPress={handleLogout} showArrow={false} />
          </View>

        </ScrollView>

        {/* LANGUAGE MODAL */}
        <Modal
          visible={langModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLangModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>{t("chooseLanguage")}</Text>

              <TouchableOpacity style={[styles.langOption, { borderColor: COLORS.border }]} onPress={() => changeLanguage('en')}>
                <Text style={{ fontSize: 30 }}>🇬🇧</Text>
                <Text style={[styles.langText, { color: COLORS.text }]}>English</Text>
                {i18n.language === 'en' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.langOption, { borderColor: COLORS.border }]} onPress={() => changeLanguage('ta')}>
                <Text style={{ fontSize: 30 }}>🇱🇰</Text>
                <Text style={[styles.langText, { color: COLORS.text }]}>தமிழ்</Text>
                {i18n.language === 'ta' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.langOption, { borderColor: COLORS.border }]} onPress={() => changeLanguage('si')}>
                <Text style={{ fontSize: 30 }}>🇱🇰</Text>
                <Text style={[styles.langText, { color: COLORS.text }]}>සිංහල</Text>
                {i18n.language === 'si' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.closeBtn, { backgroundColor: COLORS.border }]} onPress={() => setLangModalVisible(false)}>
                <Text style={[styles.closeBtnText, { color: COLORS.text }]}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)"
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  scrollContent: { padding: 20 },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, borderRadius: 20,
    marginBottom: 20
  },
  avatarContainer: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255, 212, 0, 0.1)",
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, marginRight: 15
  },
  profileInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  userEmail: { fontSize: 13, marginBottom: 8 },
  badge: {
    backgroundColor: "rgba(255, 212, 0, 0.15)",
    paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8, // Increased padding
    alignSelf: 'flex-start'
  },
  badgeText: { color: "#FFD400", fontSize: 10, fontWeight: "700" }, // Removed uppercase

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: {
    flex: 1, padding: 15, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center'
  },
  statValue: { fontSize: 24, fontWeight: "700", marginBottom: 2 },
  statLabel: { fontSize: 12 },

  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10, marginLeft: 10, lineHeight: 22 }, // Added lineHeight
  menuGroup: { borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)"
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 }, // Added flex: 1 to prevent cut off
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center'
  },
  menuText: { fontSize: 15, fontWeight: "600", lineHeight: 22, flexShrink: 1 }, // Added lineHeight, flexShrink

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: "80%", borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  langOption: {
    flexDirection: 'row', alignItems: 'center', gap: 15,
    padding: 15, width: "100%", borderRadius: 12, borderWidth: 1, marginBottom: 12
  },
  langText: { fontSize: 16, fontWeight: "600", flex: 1 },
  closeBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, marginTop: 10 },
  closeBtnText: { fontWeight: "600" }
});