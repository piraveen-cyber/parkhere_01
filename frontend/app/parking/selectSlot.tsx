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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  parkingCard: {
    backgroundColor: "#fff",
    elevation: 5,
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  parkingCardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
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
    marginTop: 10,
    gap: 10,
  },

  slotBox: {
    width: 55,
    height: 55,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  unavailableSlot: {
    backgroundColor: "#999",
  },

  selectedSlot: {
    backgroundColor: "#FFD400",
  },

  slotText: {
    fontWeight: "700",
    color: "#000",
  },

  continueBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    marginTop: 30,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  continueText: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
});
