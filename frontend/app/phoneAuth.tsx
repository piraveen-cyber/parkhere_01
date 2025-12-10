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
import CustomButton from "../components/CustomButton";

export default function PhoneAuth() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme(); // 👈 use new colors
  const { t } = useTranslation();

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.headerWrapper, { marginTop: insets.top + 5 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backArrow, { color: colors.text }]}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={[styles.header, { color: colors.text }]}>{t("login")}</Text>
      </View>

      <Text style={[styles.title, { color: colors.primary }]}>
        {t("enterMobile")}
      </Text>

      <Text style={[styles.subtitle, { color: colors.subText }]}>
        {t("otpMessage")}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>{t("phoneNumber")}</Text>

      {/* Phone Input */}
      <View
        style={[
          styles.phoneContainer,
          { backgroundColor: colors.inputBg, borderColor: colors.border },
        ]}
      >
        <View style={[styles.countryBox, { borderRightColor: colors.border }]}>
          <Image
            source={require("../assets/images/srilanka_flag.png")}
            style={styles.flag}
          />
          <Text style={[styles.countryCode, { color: colors.text }]}>+94 ▼</Text>
        </View>

        <TextInput
          style={[styles.phoneInput, { color: colors.text }]}
          placeholder="7XXXXXXXX"
          placeholderTextColor={colors.subText}
          value={phoneNumber}
          keyboardType="numeric"
          onChangeText={setPhoneNumber}
          editable={!loading}
        />
      </View>



      {/* Send OTP Button */}
      <CustomButton
        title={t("sendOtp")}
        onPress={handleSendOTP}
        loading={loading}
        disabled={!isValid || loading}
        style={{ marginTop: 50 }}
      />

      {/* Terms */}
      <Text style={[styles.terms, { color: colors.subText }]}>
        {t("termsAgree")} <Text style={[styles.link, { color: colors.primary }]}>{t("terms")}</Text> &{" "}
        <Text style={[styles.link, { color: colors.primary }]}>{t("privacyPolicy")}</Text>
      </Text>

      {/* === DEV ONLY BUTTON === */}
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() =>
          router.push({ pathname: "/otp", params: { phone: "+94700000000" } })
        }
      >
        <Text style={{ color: colors.error, fontWeight: "700" }}>
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

  buttonText: { textAlign: "center", fontSize: 17, fontWeight: "600" },

  terms: { marginTop: 25, textAlign: "center" },

  link: { fontWeight: "600" },
});
