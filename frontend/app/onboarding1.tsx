import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/themeContext";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

export default function Onboarding1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme, colors } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  const bg = colors.background;
  const textColor = colors.text;
  const descColor = colors.subText;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.container}>

        {/* TOP BAR */}
        <View
          style={[
            styles.topRow,
            { marginTop: insets.top + 15 } // 👈 Added extra gap from top
          ]}
        >
          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.roundButton, styles.shadow]}
          >
            <Text style={styles.backIcon}>{"<"}</Text>
          </TouchableOpacity>

          {/* DARK / LIGHT TOGGLE */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.roundButton, styles.shadow]}
          >
            <Text style={styles.toggleIcon}>{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        {/* IMAGE */}
        <Image
          source={require("../assets/images/caronboard.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* TITLE */}
        <Text style={[styles.title, { color: textColor }]}>
          {t("bestParkingSpots")}
        </Text>

        {/* DESCRIPTION */}
        <Text style={[styles.desc, { color: descColor }]}>
          {t("loremIpsum")}
        </Text>

        {/* DOTS */}
        <View style={styles.dotsContainer}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* BOTTOM BUTTONS */}
        <View
          style={[
            styles.bottomRow,
            { marginBottom: insets.bottom + 15 } // 👈 Increased space above navigation bar
          ]}
        >
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <Text style={[styles.skip, { color: descColor }]}>{t("skip")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/onboarding2")}>
            <Text style={[styles.next, { color: textColor }]}>{t("next")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: "center",
  },

  /* --- TOP BAR --- */
  topRow: {
    width: "100%",
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 26, // bigger arrow
    fontWeight: "600",
    textAlign: "center",
  },

  toggleIcon: {
    fontSize: 24,
  },

  shadow: {
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  /* --- IMAGE --- */
  image: {
    width: width * 0.8,
    height: height * 0.35,
    marginTop: 30,
    marginBottom: 40,
  },

  /* --- TEXT --- */
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  desc: {
    fontSize: 15,
    width: "80%",
    textAlign: "center",
    marginBottom: 22,
  },

  /* --- DOTS --- */
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#888",
  },

  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#4F46E5",
  },

  /* --- BOTTOM BUTTONS --- */
  bottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 35,
    position: "absolute",
    bottom: 0,
  },

  skip: {
    fontSize: 16,
    fontWeight: "600",
  },

  next: {
    fontSize: 16,
    fontWeight: "800",
  },
});
