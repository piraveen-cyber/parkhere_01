import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/themeContext"; // 🔥 GLOBAL THEME
import { useTranslation } from "react-i18next";

export default function PhoneAuth() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme(); // 👈 global theme
  const { t } = useTranslation();

  const isDark = theme === "dark";

  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const textColor = isDark ? "#FFFFFF" : "#222";
  const descColor = isDark ? "#C7D1D9" : "#6F6F6F";
  const inputBg = isDark ? "#1B263B" : "#FFFFFF";
  const borderColor = isDark ? "#415A77" : "#E2E2E2";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean number
  const cleanNumber = phoneNumber.replace(/\s+/g, "");
  const isValid = /^7\d{8}$/.test(cleanNumber);

  const handleSendOTP = async () => {
    if (!isValid) {
      Alert.alert(
        t("invalidPhoneTitle"),
        t("invalidPhoneMsg")
      );
      return;
    }

    setLoading(true);

    const fullPhoneNumber = `+94${cleanNumber}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: { channel: "sms" },
      });

      if (error) {
        Alert.alert(t("error"), error.message);
        setLoading(false);
        return;
      }

      Alert.alert(t("success"), t("otpSent"));
      router.push({ pathname: "/otp", params: { phone: fullPhoneNumber } });
    } catch (error) {
      Alert.alert(t("error"), t("otpError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.headerWrapper, { marginTop: insets.top + 5 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backArrow, { color: textColor }]}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={[styles.header, { color: textColor }]}>{t("login")}</Text>
      </View>

      <Text style={[styles.title, { color: textColor }]}>
        {t("enterMobile")}
      </Text>

      <Text style={[styles.subtitle, { color: descColor }]}>
        {t("otpMessage")}
      </Text>

      <Text style={[styles.label, { color: textColor }]}>{t("phoneNumber")}</Text>

      {/* Phone Input */}
      <View
        style={[
          styles.phoneContainer,
          { backgroundColor: inputBg, borderColor: borderColor },
        ]}
      >
        <View style={[styles.countryBox, { borderRightColor: borderColor }]}>
          <Image
            source={require("../assets/images/srilanka_flag.png")}
            style={styles.flag}
          />
          <Text style={[styles.countryCode, { color: textColor }]}>+94 ▼</Text>
        </View>

        <TextInput
          style={[styles.phoneInput, { color: textColor }]}
          placeholder="7XXXXXXXX"
          placeholderTextColor={isDark ? "#8FA3B0" : "#999"}
          value={phoneNumber}
          keyboardType="numeric"
          onChangeText={setPhoneNumber}
          editable={!loading}
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isValid && !loading ? styles.buttonActive : styles.buttonDisabled,
        ]}
        disabled={!isValid || loading}
        onPress={handleSendOTP}
      >
        {loading ? (
          <ActivityIndicator size="small" color={isDark ? "#000" : "#000"} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              (!isValid || loading) && styles.buttonTextDisabled,
            ]}
          >
            {t("sendOtp")}
          </Text>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <Text style={[styles.terms, { color: descColor }]}>
        {t("termsAgree")} <Text style={styles.link}>{t("terms")}</Text> &{" "}
        <Text style={styles.link}>{t("privacyPolicy")}</Text>
      </Text>

      {/* === DEV ONLY BUTTON === */}
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() =>
          router.push({ pathname: "/otp", params: { phone: "+94700000000" } })
        }
      >
        <Text style={{ color: "red", fontWeight: "700" }}>
          DEV: Go to OTP →
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },

  headerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  backButton: { position: "absolute", left: 0, padding: 10 },

  backArrow: { fontSize: 32 },

  header: { fontSize: 22, fontWeight: "600" },

  title: { marginTop: 20, fontSize: 26, fontWeight: "700" },

  subtitle: { fontSize: 15, marginTop: 6 },

  label: { marginTop: 40, fontSize: 16, fontWeight: "500" },

  phoneContainer: {
    flexDirection: "row",
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    borderRightWidth: 1,
  },

  flag: { width: 24, height: 18, marginRight: 6 },

  countryCode: { fontSize: 16, fontWeight: "600" },

  phoneInput: { flex: 1, marginLeft: 15, fontSize: 18, letterSpacing: 1.2 },

  button: { marginTop: 50, paddingVertical: 18, borderRadius: 14 },

  buttonDisabled: { backgroundColor: "#EFEFEF" },

  buttonActive: { backgroundColor: "#FFD400" },

  buttonText: { textAlign: "center", fontSize: 17, fontWeight: "600" },

  buttonTextDisabled: { color: "#B5B5B5" },

  terms: { marginTop: 25, textAlign: "center" },

  link: { color: "#D4A000", fontWeight: "600" },
});
