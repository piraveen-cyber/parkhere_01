import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "../../config/supabaseClient";

export default function ProfileTab() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);

  // Theme Colors
  const COLORS = {
    bg: "#0D1B2A",
    card: "#1B263B",
    accent: "#FFD400",
    text: "#FFFFFF",
    subText: "#9FB5C2",
    danger: "#FF4444"
  };

  const handleLogout = async () => {
    Alert.alert(t("logoutTitle"), t("logoutMsg"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logoutTitle"),
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/onboarding1"); // Reset to onboarding/login
        }
      }
    ]);
  };

  const MenuItem = ({ icon, title, isDestructive = false, showArrow = true, onPress }: any) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? "rgba(255, 68, 68, 0.1)" : "rgba(255, 212, 0, 0.1)" }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? COLORS.danger : COLORS.accent} />
        </View>
        <Text style={[styles.menuText, { color: isDestructive ? COLORS.danger : COLORS.text }]}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={18} color={COLORS.subText} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>{t("myProfile")}</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* USER INFO CARD */}
          <View style={[styles.profileCard, { backgroundColor: COLORS.card }]}>
            <View style={[styles.avatarContainer, { borderColor: COLORS.accent }]}>
              <Ionicons name="person" size={40} color={COLORS.accent} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: COLORS.text }]}>John Doe</Text>
              <Text style={[styles.userEmail, { color: COLORS.subText }]}>john.doe@example.com</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t("goldMember")}</Text>
              </View>
            </View>
          </View>

          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>12</Text>
              <Text style={[styles.statLabel, { color: COLORS.subText }]}>{t("bookings")}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: COLORS.subText }]}>{t("rating")}</Text>
            </View>
          </View>

          {/* MENUS */}
          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("account")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="person-outline" title={t("editProfile")} />
            <MenuItem icon="card-outline" title={t("paymentMethods")} />
            <MenuItem icon="notifications-outline" title={t("notifications")} />
          </View>



          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("preferences")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="language-outline" title={t("language")} />
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(255, 212, 0, 0.1)" }]}>
                  <Ionicons name="moon-outline" size={20} color={COLORS.accent} />
                </View>
                <Text style={[styles.menuText, { color: COLORS.text }]}>{t("darkMode")}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={setIsDark}
                trackColor={{ false: "#333", true: COLORS.accent }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("support")}</Text>
          <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
            <MenuItem icon="help-circle-outline" title={t("helpCenter")} />
            <MenuItem icon="shield-checkmark-outline" title={t("privacyPolicy")} />
          </View>

          <View style={[styles.menuGroup, { backgroundColor: COLORS.card, marginTop: 20, marginBottom: 40 }]}>
            <MenuItem icon="log-out-outline" title={t("logOut")} isDestructive onPress={handleLogout} showArrow={false} />
          </View>

        </ScrollView>
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
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    alignSelf: 'flex-start'
  },
  badgeText: { color: "#FFD400", fontSize: 10, fontWeight: "700", textTransform: 'uppercase' },

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: {
    flex: 1, padding: 15, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center'
  },
  statValue: { fontSize: 24, fontWeight: "700", marginBottom: 2 },
  statLabel: { fontSize: 12 },

  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10, marginLeft: 10, textTransform: 'uppercase', letterSpacing: 1 },
  menuGroup: { borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)"
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center'
  },
  menuText: { fontSize: 15, fontWeight: "600" }
});