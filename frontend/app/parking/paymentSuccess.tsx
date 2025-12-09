import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PaymentSuccess() {
  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Payment Succesful!</Text>

      {/* Sub description */}
      <Text style={styles.subText}>
        Your payment transaction has been successful. You’ll an email confirmation
        containing your invoice.
      </Text>

      {/* Green Check Circle */}
      <View style={styles.circleWrapper}>
        <View style={styles.greenCircle}>
          <Ionicons name="checkmark" size={55} color="#2ecc71" />
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("../parking/QR")}   // ✅ Navigate to QR Page
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ------------ STYLES ------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 90,
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subText: {
    textAlign: "center",
    marginTop: 10,
    color: "#777",
    fontSize: 14,
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  circleWrapper: {
    marginTop: 30,
    marginBottom: 40,
  },

  greenCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },

  nextBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
    elevation: 5,
  },

  nextText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
