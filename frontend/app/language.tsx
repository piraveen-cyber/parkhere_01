import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import "../i18n/i18n"; // Ensure init

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const goNext = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
    } catch (e) {
      console.log("Error changing language", e);
    }
    router.push("/onboarding1");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Yellow Section */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/iconblack.png")}
          style={styles.logo}
        />
      </View>

      {/* Bottom White Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>{t("chooseLanguage")}</Text>

        <TouchableOpacity style={styles.langButton} onPress={() => goNext('en')}>
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={() => goNext('ta')}>
          <Text style={styles.langText}>தமிழ்</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={() => goNext('si')}>
          <Text style={styles.langText}>සිංහල</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdcf00f5" },

  topSection: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: "cover",
    borderRadius: 110, // Perfect circle
    // borderWidth: 5,
    // borderColor: "#050700ff",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10, // Android shadow
  },

  bottomSection: {
    backgroundColor: "#ffffffff",
    borderTopLeftRadius: 50,
    borderColor: "#f2eedaff",
    borderWidth: 5,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 40,
    letterSpacing: 0.5,
    color: "#333",
  },

  langButton: {
    width: "95%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000000ff", // Gold Theme
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },

  langText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});


