import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../context/themeContext";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

export default function Onboarding3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  // Theme colors
  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const textColor = isDark ? "#FFFFFF" : "#222";
  const descColor = isDark ? "#C7D1D9" : "#555";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* --- TOP BAR --- */}
      <View
        style={[
          styles.topRow,
          { marginTop: insets.top + 15 }, // extra spacing
        ]}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.roundButton, styles.shadow]}
        >
          <Text style={styles.backIcon}>{"<"}</Text>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.roundButton, styles.shadow]}
        >
          <Text style={styles.toggleIcon}>{isDark ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENT --- */}
      <View style={styles.centerContent}>
        <Image
          source={require("../assets/images/payment.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: textColor }]}>{t("easyPayment")}</Text>

        <Text style={[styles.subtitle, { color: descColor }]}>
          {t("loremIpsum")}
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/phoneAuth")}
        >
          <Text style={styles.buttonText}>{t("getStarted")}</Text>
        </TouchableOpacity>
      </View>

      {/* Keep spacing above bottom nav bar */}
      <View style={{ height: insets.bottom + 15 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  /* --- TOP BAR --- */
  topRow: {
    width: "100%",
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roundButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 26,
    fontWeight: "600",
  },

  toggleIcon: {
    fontSize: 24,
  },

  shadow: {
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  /* --- CONTENT --- */
  centerContent: {
    flex: 1,
    marginTop: 25,
    paddingHorizontal: 30,
    alignItems: "center",
  },

  image: {
    width: width * 0.8,
    height: height * 0.35,
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    width: "85%",
  },

  button: {
    width: "100%",
    backgroundColor: "#FFD11A",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "black",
  },
});
