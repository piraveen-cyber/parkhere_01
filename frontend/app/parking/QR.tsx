import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Animated,
  Easing,
  StatusBar,
  Dimensions
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

import { useTheme } from "../../context/themeContext";

import QRCode from 'react-native-qrcode-svg';

export default function QRScreen() {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  /* --- DYNAMIC DATA --- */
  const bookingId = params.bookingId?.toString() || "CPA-DEMO"; // Real ID or Demo
  const slot = params.slot?.toString() || "N/A";
  const checkIn = params.checkInTime?.toString() || "--:--";
  const duration = parseInt(params.duration?.toString() || "0");
  const parkingName = params.parkingName?.toString() || "Unknown Parking";
  const totalAmount = params.totalPrice ? `LKR ${params.totalPrice}` : t("paid");

  // ... (Keep existing setup)
  // Remove static uniqueId ref since we have real bookingId

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const accent = colors.primary;
  const bgDark = colors.background;
  const cardBg = colors.card;

  const checkOutDisplay = `${duration} ${t("hoursDuration")}`;

  const booking = {
    parkingName: parkingName,
    slot: slot,
    checkIn: checkIn,
    checkOut: checkOutDisplay,
    spec: t('standard'),
    amount: totalAmount
  };

  useEffect(() => {
    // 1. Enter Animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();

    // 2. Continuous Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const bookingRows = [
    { label: t('slot'), value: booking.slot, icon: "car-outline" },
    { label: t('checkInTime'), value: booking.checkIn, icon: "time-outline" },
    { label: t('checkOutTime'), value: booking.checkOut, icon: "timer-outline" },
    { label: t("totalAmount"), value: booking.amount, icon: "cash-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgDark }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={accent} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('bookingQr')}</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            <View style={[styles.parkingCard, { borderColor: accent, backgroundColor: cardBg }]}>
              <MaterialCommunityIcons name="parking" size={28} color={accent} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={[styles.parkingName, { color: colors.text }]}>{booking.parkingName}</Text>
                <Text style={[styles.addressText, { color: colors.subText }]}>{slot} • {t("level1")}</Text>
              </View>
            </View>

            {/* QR CODE SECTION */}
            <View style={styles.qrSection}>
              <Animated.View
                style={[
                  styles.qrContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                    shadowColor: accent,
                    shadowOpacity: 0.3,
                    shadowRadius: 20
                  }
                ]}
              >
                {/* DYNAMIC QR CODE */}
                <QRCode
                  value={bookingId}
                  size={180}
                  color="black"
                  backgroundColor="white"
                />

                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
              </Animated.View>

              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>{t('uniqueId')}</Text>
                <Text style={styles.uniqueId} numberOfLines={1}>{bookingId}</Text>
              </View>
            </View>

            {/* DETAILS CARD */}
            <View style={[styles.detailsCard, { backgroundColor: cardBg, borderColor: theme === 'dark' ? '#222' : 'rgba(0,0,0,0.1)' }]}>
              <Text style={[styles.cardHeader, { color: colors.text }]}>{t('bookingDetails')}</Text>
              <View style={styles.divider} />

              {bookingRows.map((item, index) => (
                <View key={index} style={styles.row}>
                  <View style={styles.labelRow}>
                    <Ionicons name={item.icon as any} size={18} color={colors.subText} />
                    <Text style={[styles.label, { color: colors.subText }]}>{item.label}</Text>
                  </View>
                  <Text style={[styles.value, { color: colors.text }]}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* ACTION BUTTONS */}
            <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
              <Pressable
                style={({ pressed }) => [
                  styles.btnPrimary,
                  { backgroundColor: accent, transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
                onPress={() => router.push("../parking/navigate")}
              >
                <Ionicons name="navigate-circle-outline" size={24} color="#000" />
                <Text style={styles.btnTextPrimary}>{t('navigateToLocation')}</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.btnSecondary,
                  { borderColor: theme === 'dark' ? "#333" : "#CCC", backgroundColor: theme === 'dark' ? "#000" : "#FFF", transform: [{ scale: pressed ? 0.98 : 1 }] }
                ]}
                onPress={() => router.push("../(tabs)/home")}
              >
                <Text style={[styles.btnTextSecondary, { color: colors.text }]}>{t('goHome')}</Text>
              </Pressable>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 15,
    marginBottom: 10
  },
  headerTitle: { fontSize: 24, fontWeight: "800", marginLeft: 15, color: "#FFF", letterSpacing: 0.5 },
  backBtn: {
    padding: 8, borderRadius: 12, backgroundColor: "#111", borderWidth: 1, borderColor: "#222"
  },

  parkingCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, padding: 20,
    backgroundColor: "#111", borderRadius: 20,
    borderWidth: 1, elevation: 5
  },
  parkingName: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  addressText: { color: "#888", fontSize: 13, marginTop: 4 },

  qrSection: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  qrContainer: {
    padding: 20, backgroundColor: "#FFF", borderRadius: 24, elevation: 15,
    position: 'relative', alignItems: 'center', justifyContent: 'center'
  },

  // Gold Corners
  cornerTL: { position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTopWidth: 4, borderLeftWidth: 4, borderColor: "#FFD400", borderTopLeftRadius: 10 },
  cornerTR: { position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTopWidth: 4, borderRightWidth: 4, borderColor: "#FFD400", borderTopRightRadius: 10 },
  cornerBL: { position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: "#FFD400", borderBottomLeftRadius: 10 },
  cornerBR: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottomWidth: 4, borderRightWidth: 4, borderColor: "#FFD400", borderBottomRightRadius: 10 },

  idContainer: { alignItems: 'center', marginTop: 25 },
  idLabel: { color: "#888", fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 },
  uniqueId: { color: "#FFD400", fontSize: 16, fontWeight: "800", letterSpacing: 1 },

  detailsCard: {
    marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 20,
    borderWidth: 1, borderColor: "#222"
  },
  cardHeader: { color: "#FFF", fontSize: 18, fontWeight: "700", textAlign: 'center' },
  divider: { height: 1, backgroundColor: "#222", marginVertical: 15 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: "#888", fontSize: 14, fontWeight: "500" },
  value: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  btnPrimary: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 18, borderRadius: 30,
    shadowColor: "#FFD400", shadowOpacity: 0.4, shadowRadius: 10, elevation: 10,
    marginBottom: 15
  },
  btnTextPrimary: { color: "#000", fontSize: 16, fontWeight: "800", textTransform: 'uppercase', letterSpacing: 1 },

  btnSecondary: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 18, borderRadius: 30,
    borderWidth: 1, backgroundColor: "#000"
  },
  btnTextSecondary: { color: "#FFF", fontSize: 16, fontWeight: "700" }
});
