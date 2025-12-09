import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
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
        <Image
          source={require("../../assets/images/QR.png")} // 🔥 Put your QR image here
          style={styles.qrImage}
        />
        <Text style={styles.uniqueId}>{t('uniqueId')}: {booking.uniqueId}</Text>
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
      <TouchableOpacity
        style={styles.btnYellow}
        onPress={() => router.push("../(tabs)/home")} // ✔ Go Home
      >
        <Text style={styles.btnText}>{t('goHome')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnYellow}
        onPress={() => router.push("../parking/navigate")} // ✔ Navigate page
      >
        <Text style={styles.btnText}>{t('navigateToLocation')}</Text>
      </TouchableOpacity>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "700",
  },

  parkingNameCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 5,
  },
  parkingName: {
    fontSize: 18,
    fontWeight: "700",
  },
  spaceText: {
    color: "#FFD400",
    fontWeight: "800",
  },

  qrWrapper: {
    marginTop: 25,
    alignItems: "center",
  },
  qrImage: {
    width: 170,
    height: 170,
  },
  uniqueId: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },

  detailsCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    elevation: 4,
    marginTop: 30,
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  label: { color: "#777", fontSize: 15 },
  value: { fontSize: 15, fontWeight: "600", color: "#000" },

  btnYellow: {
    backgroundColor: "#FFD400",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
