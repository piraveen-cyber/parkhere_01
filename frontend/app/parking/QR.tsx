import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function QRScreen() {
  const { t } = useTranslation();
  const booking = {
    parkingName: "Lekki Gardens Car Park A",
    slot: "B20",
    checkIn: "11:00 am",
    checkOut: "05:00 pm",
    spec: t('none'),
    uniqueId: "CPA-0129",
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('bookingQr')}</Text>
      </View>

      {/* PARKING NAME */}
      <View style={styles.parkingNameCard}>
        <Text style={styles.parkingName}>
          {booking.parkingName} <Text style={styles.spaceText}>{t('space')} 4c</Text>
        </Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrWrapper}>
        <View style={styles.qrBorder}>
          <Image
            source={require("../../assets/images/QR.png")} // 🔥 Put your QR image here
            style={styles.qrImage}
          />
        </View>
        <Text style={styles.uniqueId}>{t('uniqueId')}: <Text style={{ color: "#FFD400" }}>{booking.uniqueId}</Text></Text>
      </View>

      {/* Booking Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>{t('bookingDetails')}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t('slot')} :</Text>
          <Text style={styles.value}>{booking.slot}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('checkInTime')}:</Text>
          <Text style={styles.value}>{booking.checkIn}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('checkOutTime')}:</Text>
          <Text style={styles.value}>{booking.checkOut}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('specifications')}:</Text>
          <Text style={styles.value}>{booking.spec}</Text>
        </View>
      </View>

      {/* Buttons */}
      <Pressable
        style={({ pressed }) => [
          styles.btnYellow,
          pressed && {
            backgroundColor: "#FFE04D",
            shadowColor: "#FFD400",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
            elevation: 15,
          },
        ]}
        onPress={() => router.push("../(tabs)/home")}
      >
        <Text style={styles.btnText}>{t('goHome')}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.btnYellow,
          pressed && {
            backgroundColor: "#FFE04D",
            shadowColor: "#FFD400",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
            elevation: 15,
          },
        ]}
        onPress={() => router.push("../parking/navigate")}
      >
        <Text style={styles.btnText}>{t('navigateToLocation')}</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginLeft: 15, color: "#333", letterSpacing: 0.5 },

  parkingNameCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  parkingName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  spaceText: {
    color: "#FFD400",
    fontWeight: "900",
    fontSize: 20,
  },

  qrWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  qrBorder: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  uniqueId: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    letterSpacing: 1,
  },

  detailsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
    color: "#333",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },

  label: { color: "#777", fontSize: 15, fontWeight: "500" },
  value: { fontSize: 16, fontWeight: "700", color: "#000" },

  btnYellow: {
    backgroundColor: "#FFD400",
    paddingVertical: 18,
    borderRadius: 30, // Gold Pill
    marginTop: 20,
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 18,
    color: "#000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
