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
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";

export default function PhoneAuth() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean the number
  const cleanNumber = phoneNumber.replace(/\s+/g, "");

  // Sri Lanka valid mobile format: 7XXXXXXXX
  const isValid = /^7\d{8}$/.test(cleanNumber);

  const handleSendOTP = async () => {
    if (!isValid) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Sri Lankan number (07XXXXXXXX)."
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
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      Alert.alert("Success", "OTP has been sent to your phone number.");
      router.push({
        pathname: "/otp",
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Login</Text>
      </View>

      <Text style={styles.title}>Enter your mobile number</Text>
      <Text style={styles.subtitle}>
        We will send you a 6-digit OTP for verification.
      </Text>

      <Text style={styles.label}>Phone Number</Text>

      {/* Phone Input */}
      <View style={styles.phoneContainer}>
        <View style={styles.countryBox}>
          <Image
            source={require("../assets/images/srilanka_flag.png")}
            style={styles.flag}
          />
          <Text style={styles.countryCode}>+94 ▼</Text>
        </View>

        <TextInput
          style={styles.phoneInput}
          placeholder="7XXXXXXXX"
          value={phoneNumber}
          keyboardType="numeric"
          onChangeText={setPhoneNumber}
          editable={!loading}
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isValid && !loading ? styles.buttonActive : styles.buttonDisabled,
        ]}
        disabled={!isValid || loading}
        onPress={handleSendOTP}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text
            style={[
              styles.buttonText,
              (!isValid || loading) && styles.buttonTextDisabled,
            ]}
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.terms}>
        By continuing, you agree to our <Text style={styles.link}>Terms</Text> &{" "}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 20,
  },

  /* Header Fix */
  headerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 10,
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 10,
  },
  backArrow: {
    fontSize: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
  },

  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6F6F6F",
    fontSize: 15,
    marginTop: 6,
  },

  label: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: "500",
  },

  /* Phone Input */
  phoneContainer: {
    flexDirection: "row",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
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
    borderRightColor: "#E2E2E2",
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    letterSpacing: 1.2,
  },

  /* Button */
  button: {
    marginTop: 50,
    paddingVertical: 18,
    borderRadius: 14,
  },
  buttonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  buttonActive: {
    backgroundColor: "#FFD400",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#B5B5B5",
  },

  terms: {
    marginTop: 25,
    textAlign: "center",
    color: "#6F6F6F",
  },
  link: {
    color: "#D4A000",
    fontWeight: "600",
  },
});
