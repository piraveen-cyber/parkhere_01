import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/themeContext";
import { useTranslation } from "react-i18next";

export default function Otp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams();
  const { t } = useTranslation();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const textColor = isDark ? "#FFFFFF" : "#222";
  const descColor = isDark ? "#9FB5C2" : "#7A7A7A";
  const inputBg = isDark ? "#1B263B" : "#FFFFFF";
  const borderColor = isDark ? "#415A77" : "#E0E0E0";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  /* Timer */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const focusInput = (index: number) => {
    inputs.current[index]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) inputs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert(t("invalidOtpTitle"), t("invalidOtpMsg"));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone as string,
        token: otpCode,
        type: "sms",
      });

      if (error) {
        Alert.alert(t("error"), error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.auth.refreshSession();
        Alert.alert(t("success"), t("otpVerified"));
        router.push("/(tabs)/home");
      }
    } catch {
      Alert.alert(t("error"), t("verificationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer !== 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone as string,
        options: { channel: "sms" },
      });

      if (error) {
        Alert.alert(t("error"), error.message);
        setLoading(false);
        return;
      }

      Alert.alert(t("success"), t("otpResent"));
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setTimer(30);
    } catch {
      Alert.alert(t("error"), t("failedResend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 10 }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.backArrow, { color: textColor }]}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: textColor }]}>{t("verifyOtp")}</Text>
      <Text style={[styles.subtitle, { color: descColor }]}>
        {t("otpSentTo")}
      </Text>

      <Text style={[styles.phone, { color: textColor }]}>{phone}</Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el: TextInput | null) => {
              inputs.current[index] = el;
            }}
            style={[
              styles.otpBox,
              {
                backgroundColor: inputBg,
                borderColor: borderColor,
                color: textColor,
              },
              digit !== "" && { borderColor: "#E5C100", borderWidth: 2 },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onPressIn={() => focusInput(index)}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={[styles.timer, { color: descColor }]}>
        00:{timer < 10 ? `0${timer}` : timer}
      </Text>

      <TouchableOpacity disabled={timer !== 0} onPress={resendOtp}>
        <Text
          style={[styles.resend, { color: timer === 0 ? textColor : "#999" }]}
        >
          {t("resendOtp")}
        </Text>
      </TouchableOpacity>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyBtn, { bottom: insets.bottom + 20 }]}
        onPress={verifyOtp}
      >
        <Text style={styles.verifyText}>
          {loading ? "Verifying..." : t("verifyContinue")}
        </Text>
      </TouchableOpacity>

      {/* DEV BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/detail")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "red", fontWeight: "700" }}>
          DEV: Go to DETAIL →
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "center",
  },

  /* Back button */
  backBtn: {
    position: "absolute",
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 80,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
  },
  phone: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },

  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  timer: {
    marginTop: 20,
    fontSize: 16,
  },

  resend: {
    marginTop: 8,
    fontSize: 16,
    textDecorationLine: "underline",
  },

  verifyBtn: {
    width: "90%",
    backgroundColor: "#FFD400",
    padding: 18,
    borderRadius: 14,
    marginTop: 100, //
  },
  verifyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
