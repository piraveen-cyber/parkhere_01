import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabaseClient";
import { useTheme } from "../../context/themeContext";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";   // 👈 ADDED

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  /* THEME COLORS */
  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const cardBg = isDark ? "#1B263B" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#111";
  const descColor = isDark ? "#9FB5C2" : "#6F6F6F";
  const borderColor = isDark ? "#415A77" : "#EDEDED";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(t("error"), error.message);
  };

  const services = [
    { key: "parking", title: t("parking"), icon: require("../../assets/images/car.png") },
    { key: "mechanics", title: t("mechanics"), icon: require("../../assets/images/wrench.png") },
    { key: "washing", title: t("washing"), icon: require("../../assets/images/wash.png") },
    { key: "evCharging", title: t("evCharging"), icon: require("../../assets/images/ev.png") },
    { key: "towing", title: t("towing"), icon: require("../../assets/images/tow.png") },
    { key: "hiring", title: t("hiring"), icon: require("../../assets/images/check.png") },
  ];

  const handleServiceNavigation = (key: string) => {
    if (key === "parking") {
      router.push("/parking/selectVehicle");
    } else if (key === "mechanics") {
      router.push("/Mechanic/vehicleType");
    }
  };



  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
      >
        {/* HEADER */}
        <Text style={[styles.welcome, { color: textColor }]}>
          {t("welcomeUser")}
        </Text>

        <Text style={[styles.subtitle, { color: descColor }]}>
          {t("findEverything")}
        </Text>

        {/* SEARCH BAR */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: cardBg, borderColor: colors.primary, borderWidth: 1.5 },
          ]}
        >
          <Text style={[styles.searchIcon, { color: colors.primary }]}>🔍</Text>
          <TextInput
            placeholder={t("searchPlaceholder")}
            placeholderTextColor={descColor}
            style={[styles.searchInput, { color: textColor }]}
          />
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {services.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cardBg },
                pressed && {
                  borderColor: "#FFD400",
                  borderWidth: 2,
                  shadowColor: "#FFD400",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 20,
                  elevation: 10,
                },
              ]}
              onPress={() => handleServiceNavigation(item.key)}
            >
              <View style={styles.iconWrapper}>
                <Image source={item.icon} style={styles.iconImg} />
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* BIG CARD */}
        <View style={[styles.bigCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.bigCardTitle, { color: textColor }]}>
            {t("bookSpot")}
          </Text>
          <Text style={[styles.bigCardSubtitle, { color: descColor }]}>
            {t("secureEasy")}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.bookNowBtn,
              pressed && {
                backgroundColor: "#FFE04D", // Lighter gold
                shadowColor: "#FFD400",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 25,
                elevation: 15,
              },
            ]}
          >
            <Text style={styles.bookNowText}>{t("bookNow")}</Text>
          </Pressable>
        </View>

        {/* PROMOS */}
        <View style={styles.promoYellow}>
          <Text style={styles.promoTitle}>{t("promoWashing")}</Text>
          <Text style={styles.promoSubtitle}>{t("validUntil")}</Text>
        </View>

        <View
          style={[
            styles.promoWhite,
            { backgroundColor: cardBg, borderColor: "#FFD400" },
          ]}
        >
          <Text
            style={[
              styles.promoTitle,
              { color: isDark ? "#FFFFFF" : "#000" },
            ]}
          >
            {t("freeCharging")}
          </Text>
          <Text style={[styles.promoSubtitle, { color: descColor }]}>
            {t("first30Min")}
          </Text>
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && {
              backgroundColor: "#FF5E55", // Lighter red
              shadowColor: "#FF3B30",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 25,
              elevation: 15,
            },
          ]}
        >
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 15,
  },

  welcome: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
  },

  searchBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  searchIcon: { fontSize: 20, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },

  card: {
    width: "47%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  iconWrapper: {
    backgroundColor: "#FFD400",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  iconImg: { width: 35, height: 35, tintColor: "#000" },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  bigCard: {
    padding: 25,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#FFD400",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  bigCardTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  bigCardSubtitle: {
    marginTop: 4,
    marginBottom: 15,
  },

  bookNowBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookNowText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  promoYellow: {
    backgroundColor: "#FFD400",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  promoWhite: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  promoSubtitle: {
    marginTop: 5,
    color: "#666",
  },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#FF3B30",
    paddingVertical: 18,
    borderRadius: 30, // Pill shape
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
