import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function OtpPage() {
  const [otp, setOtp] = useState(["1", "9", "8", "3"]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Waiting for the OTP</Text>

      <Text style={styles.subtitle}>
        Interactively expedite revolutionary ROI after bricks-and-clicks alignments.
      </Text>

      <View style={styles.otpRow}>
        {otp.map((n, index) => (
          <View key={index} style={styles.otpBox}>
            <Text style={styles.otpText}>{n}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.smallInfo}>Automatically displayed OTP</Text>

      {/* Circular loader area */}
      <View style={styles.centerCircle}>
        <Text style={styles.centerCircleText}>Waiting for the OTP</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.muted}>Didn’t receive OTP?</Text>
        <TouchableOpacity>
          <Text style={styles.resend}>Resend</Text>
        </TouchableOpacity>
      </View>

      {/* Complete Payment Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../parking/paymentSuccess")} // ✔ navigate to successBook page
      >
        <Text style={styles.buttonText}>Complete Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ------- STYLES ------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#777",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
  },
  smallInfo: {
    textAlign: "center",
    marginTop: 10,
    color: "#999",
  },
  centerCircle: {
    marginTop: 35,
    alignSelf: "center",
    width: 160,
    height: 160,
    backgroundColor: "rgba(200,200,255,0.2)",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  centerCircleText: {
    textAlign: "center",
    width: 120,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  muted: {
    color: "#777",
  },
  resend: {
    color: "purple",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#FFD400",
    padding: 16,
    borderRadius: 12,
    marginTop: 40,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
