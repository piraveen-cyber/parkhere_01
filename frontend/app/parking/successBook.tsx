import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function LoadingPopup() {
  const { t } = useTranslation();

  useEffect(() => {
    // After 2 seconds → move to Payment OTP page
    const timer = setTimeout(() => {
      router.push("../parking/paymentOTP");   // ✅ UPDATED ROUTE
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        <Ionicons name="checkmark-circle" size={70} color="#2ecc71" />
        <Text style={styles.title}>{t('spaceBooked')}</Text>

        <Text style={styles.subtitle}>{t('notifyingGuards')}</Text>

        <ActivityIndicator size="large" color="#555" style={{ marginTop: 15 }} />
      </View>
    </View>
  );
}

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: "#777",
  },
});
