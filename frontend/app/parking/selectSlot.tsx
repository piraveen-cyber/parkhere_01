import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function SelectSlot() {
  const { t } = useTranslation();
  const [disabledParking, setDisabledParking] = useState(false);
  const [reserveLater, setReserveLater] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState("B20");

  // Example unavailable slots
  const unavailableSlots = ["B6", "B12", "B29"];

  // Generate slot list
  const slots = [
    "B1", "B2", "B3", "B4", "B5", "B6",
    "B7", "B8", "B9", "B10", "B11", "B12",
    "B13", "B14", "B15", "B16", "B17", "B18",
    "B19", "B20", "B21", "B22", "B23", "B24",
    "B25", "B26", "B27", "B28", "B29", "B30",
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('pickParkingSlot')}</Text>
      </View>

      {/* Parking name + price card */}
      <View style={styles.parkingCard}>
        <Text style={styles.parkingCardText}>
          Lekki Gardens Car Park A <Text style={styles.price}>RS.200</Text>{t('perHour')}
        </Text>
      </View>

      {/* Specifications */}
      <Text style={styles.sectionTitle}>{t('specifications')}</Text>

      <View style={styles.row}>
        <Ionicons name="accessibility" size={22} />
        <Text style={styles.label}>{t('disabledParking')}</Text>
        <Switch
          value={disabledParking}
          onValueChange={setDisabledParking}
          style={{ marginLeft: "auto" }}
        />
      </View>

      <Text style={styles.subTitle}>{t('selectPreferredSpace')}</Text>

      <Text style={styles.parkingSlotTitle}>{t('parkingSlot')}</Text>

      {/* Slots Grid */}
      <View style={styles.slotsGrid}>
        {slots.map((slot) => {
          const isUnavailable = unavailableSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <TouchableOpacity
              key={slot}
              disabled={isUnavailable}
              onPress={() => setSelectedSlot(slot)}
              style={[
                styles.slotBox,
                isUnavailable && styles.unavailableSlot,
                isSelected && styles.selectedSlot,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  isUnavailable && { color: "#555" },
                  isSelected && { color: "#000" },
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Reserve time switch */}
      <View style={[styles.row, { marginTop: 20 }]}>
        <Text style={styles.label}>{t('reserveSpotLater')}</Text>
        <Switch
          value={reserveLater}
          onValueChange={setReserveLater}
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.push("../parking/setTime")} // ✔ NAVIGATE TO SET TIME PAGE
      >
        <Text style={styles.continueText}>{t('continue')}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#534f4f1e",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 15,
    letterSpacing: 0.5,
    color: "#333",
  },

  parkingCard: {
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 20,
    borderRadius: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  parkingCardText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#444",
  },
  price: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFD400",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  label: {
    marginLeft: 10,
    fontSize: 15,
  },

  subTitle: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },

  parkingSlotTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFD400",
    marginTop: 10,
  },

  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 12,
    justifyContent: "center",
  },

  slotBox: {
    width: 50,
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  unavailableSlot: {
    backgroundColor: "#E0E0E0",
    opacity: 0.5,
  },

  selectedSlot: {
    backgroundColor: "#FFD400",
    borderColor: "#FFD400",
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },

  slotText: {
    fontWeight: "700",
    color: "#333",
    fontSize: 13,
  },

  continueBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 18,
    marginTop: 40,
    borderRadius: 30, // Gold Pill
    marginBottom: 30,
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  continueText: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    color: "#000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
