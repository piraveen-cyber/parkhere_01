import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Otp() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { t } = useTranslation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#0D1B2A', '#1B263B', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[styles.headerWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("verifyOtp")}</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.topSection}>
            <Text style={styles.title}>{t("verificationCode")}</Text>
            <Text style={styles.subtitle}>
              {t("otpSentTo")}
            </Text>
            <Text style={styles.phoneText}>{phone}</Text>

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
                    digit !== "" && styles.otpBoxActive
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onPressIn={() => focusInput(index)}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectionColor="#FFD400"
                />
              ))}
            </View>

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {timer < 10 ? `00:0${timer}` : `00:${timer}`}
              </Text>
            </View>

            <TouchableOpacity
              disabled={timer !== 0}
              onPress={resendOtp}
              style={styles.resendBtn}
            >
              <Text style={[
                styles.resendText,
                timer !== 0 ? { color: '#666' } : { color: '#FFD400' }
              ]}>
                {t("resendOtp")}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={[
                styles.mainButton,
                (otp.join("").length !== 6 || loading) && styles.disabledButton
              ]}
              activeOpacity={0.8}
              onPress={verifyOtp}
              disabled={otp.join("").length !== 6 || loading}
            >
              <LinearGradient
                colors={otp.join("").length === 6 && !loading ? ['#FFD400', '#FFEA00'] : ['#333', '#333']}
                style={styles.mainButtonGradient}
              >
                <Text style={[
                  styles.mainButtonText,
                  (otp.join("").length !== 6 || loading) && { color: '#666' }
                ]}>
                  {loading ? "Verifying..." : t("verifyContinue")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.devButton}
              onPress={() => router.push("/detail")}
            >
              <Text style={styles.devText}>DEV: Skip to Detail</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  safeArea: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 20,
    zIndex: 999,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFD400",
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 4,
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFF",
  },
  otpBoxActive: {
    borderColor: '#FFD400',
    backgroundColor: 'rgba(255, 212, 0, 0.05)',
  },
  timerContainer: {
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  resendBtn: {
    padding: 10,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  mainButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  mainButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  mainButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  devButton: {
    alignSelf: 'center',
    padding: 10,
  },
  devText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    fontWeight: '600',
  },
});
