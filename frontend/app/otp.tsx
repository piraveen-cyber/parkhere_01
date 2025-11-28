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
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";

export default function Otp() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone as string,
        token: otpCode,
        type: "sms",
      });

      console.log("Verify OTP:", { data, error });

      if (error) {
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.auth.refreshSession();
        Alert.alert("Success", "OTP Verified!");
        router.push("/(tabs)/home");
      }
    } catch (err) {
      Alert.alert("Error", "Verification failed. Try again.");
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
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      Alert.alert("Success", "OTP resent!");

      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setTimer(30);
    } catch {
      Alert.alert("Error", "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/phoneAuth")}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to</Text>

      <Text style={styles.phone}>{phone}</Text>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el: TextInput | null) => {
              inputs.current[index] = el;
            }}
            style={[styles.otpBox, digit !== "" && styles.activeBox]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onPressIn={() => focusInput(index)}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={styles.timer}>00:{timer < 10 ? `0${timer}` : timer}</Text>

      <TouchableOpacity disabled={timer !== 0} onPress={resendOtp}>
        <Text style={[styles.resend, timer !== 0 && styles.resendDisabled]}>
          Resend OTP
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
        <Text style={styles.verifyText}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- STYLES (with backBtn added) ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#fff",
  },

  /* 🔙 Back Button */
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A7A7A",
    marginTop: 6,
  },
  phone: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 50,
  },
  otpBox: {
    width: 52,
    height: 58,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  activeBox: {
    borderColor: "#E5C100",
    borderWidth: 2,
  },
  timer: {
    marginTop: 20,
    fontSize: 16,
    color: "#7A7A7A",
  },
  resend: {
    marginTop: 6,
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#000",
  },
  resendDisabled: {
    color: "#CBCBCB",
  },
  verifyBtn: {
    width: "90%",
    backgroundColor: "#FFD400",
    padding: 18,
    borderRadius: 14,
    position: "absolute",
    bottom: 50,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },
});
