import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../context/themeContext";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  const { colors, theme } = useTheme();

  // Animation Values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Theme
  const bgDark = colors.background;
  const accent = colors.primary;
  const successColor = theme === 'dark' ? "#2ecc71" : "#34C759";

  // Let's use Gold for consistency, or Green for "Success" meaning? 
  // User asked for "Luxurious Golden-Black". Gold Checkmark looks better on Black.
  const iconColor = accent;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bgDark }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.content}>

        {/* Success Icon */}
        <Animated.View style={[styles.circleWrapper, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <View style={[styles.glowCircle, { borderColor: iconColor, shadowColor: iconColor }]}>
            <Ionicons name="checkmark" size={80} color={iconColor} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
          <Text style={[styles.title, { color: colors.text }]}>{t('paymentSuccessful')}</Text>
          <Text style={[styles.subText, { color: colors.subText }]}>
            {t('paymentSuccessMsg')}
          </Text>
        </Animated.View>

        {/* Next Button */}
        <Animated.View style={{ width: '100%', opacity: fadeAnim, marginTop: 50 }}>
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: accent, shadowColor: accent }]}
            onPress={() => router.push("../parking/QR")}
            activeOpacity={0.8}
          >
            <Text style={styles.nextText}>{t('next')}</Text>
            <Ionicons name="arrow-forward" size={24} color="#000" />
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: 'center', paddingHorizontal: 30 },

  circleWrapper: { marginTop: -50, marginBottom: 40 },
  glowCircle: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 4,
    justifyContent: "center", alignItems: "center",
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 20
  },

  title: { fontSize: 32, fontWeight: "800", textAlign: "center", marginBottom: 15, letterSpacing: 1 },
  subText: { textAlign: "center", fontSize: 16, lineHeight: 24, paddingHorizontal: 10 },

  nextBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 18, borderRadius: 30,
    width: "100%", elevation: 10,
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 10
  },
  nextText: { fontSize: 18, fontWeight: "900", color: "#000", textTransform: 'uppercase', letterSpacing: 1 },
});
