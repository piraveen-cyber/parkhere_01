import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/themeContext";
import ParkingSlot from "../../components/ParkingSlot";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectSlot() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const bg = colors.background;
  const cardBg = colors.card;
  const primary = colors.primary;
  const textMain = colors.text;
  const textSub = colors.subText;
  const border = colors.border;

  // Constants
  const params = useLocalSearchParams();
  const parkingName = params.parkingName ? params.parkingName.toString() : "Unknown Parking";
  const price = params.price ? params.price.toString() : "0";

  const [disabledParking, setDisabledParking] = useState(false);
  const [reserveLater, setReserveLater] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Mock Data
  const unavailableSlots = ["B6", "B12", "B29"];
  const reservedSlots = ["B3", "B15"];
  const accessibleSlots = ["B1", "B2", "B10", "B11"];
  const evSlots = ["B13", "B14", "B20"];

  const handleSlotPress = (slot: string, isAccessible: boolean) => {
    setSelectedSlot(slot);
  };

  const slots = [
    "B1", "B2", "B3", "B4", "B5", "B6",
    "B7", "B8", "B9", "B10", "B11", "B12",
    "B13", "B14", "B15", "B16", "B17", "B18",
    "B19", "B20", "B21", "B22", "B23", "B24",
    "B25", "B26", "B27", "B28", "B29", "B30",
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        {/* ... (Keep Header) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={textMain} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textMain }]}>Pick Your Parking Slot</Text>
        </View>

        {/* PARKING INFO CARD */}
        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
          <View style={styles.infoIcon}>
            <Ionicons name="location" size={24} color={primary} />
          </View>
          <View>
            <Text style={[styles.infoTitle, { color: textMain }]}>{parkingName}</Text>
            <Text style={[styles.infoPrice, { color: textSub }]}>
              <Text style={{ color: primary, fontWeight: '800' }}>LKR {price}</Text> / per hour
            </Text>
          </View>
        </View>

        {/* FILTERS */}
        <View style={styles.filtersContainer}>
          {/* Disabled Toggle */}
          <View style={[styles.filterRow, { borderBottomColor: border, borderBottomWidth: 1 }]}>
            <View style={styles.filterLabelContainer}>
              <Ionicons name="accessibility" size={20} color={textMain} />
              <Text style={[styles.filterLabel, { color: textMain }]}>Disabled Parking Only</Text>
            </View>
            <Switch
              value={disabledParking}
              onValueChange={setDisabledParking}
              trackColor={{ false: "#333", true: primary }}
              thumbColor={disabledParking ? "#FFF" : "#f4f3f4"}
            />
          </View>

          {/* Reserve Later Toggle */}
          <View style={styles.filterRow}>
            <View style={styles.filterLabelContainer}>
              <Ionicons name="time" size={20} color={textMain} />
              <Text style={[styles.filterLabel, { color: textMain }]}>Reserve Spot Later</Text>
            </View>
            <Switch
              value={reserveLater}
              onValueChange={setReserveLater}
              trackColor={{ false: "#333", true: primary }}
              thumbColor={reserveLater ? "#FFF" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* SLOTS GRID */}
        <Text style={[styles.sectionHeader, { color: textMain }]}>Zone B Level 1</Text>
        <View style={styles.grid}>
          {slots.map((slot) => {
            const isAccessible = accessibleSlots.includes(slot);

            // FILTER LOGIC
            if (disabledParking && !isAccessible) return null;

            let status: 'available' | 'occupied' | 'reserved' = 'available';
            if (unavailableSlots.includes(slot)) status = 'occupied';
            else if (reservedSlots.includes(slot)) status = 'reserved';

            let type: 'standard' | 'disabled' | 'ev' = 'standard';
            if (isAccessible) type = 'disabled';
            else if (evSlots.includes(slot)) type = 'ev';

            const isSelected = selectedSlot === slot;

            return (
              <View key={slot} style={styles.slotWrapper}>
                <ParkingSlot
                  label={slot}
                  status={status}
                  type={type}
                  isSelected={isSelected}
                  onPress={() => status === 'available' && handleSlotPress(slot, isAccessible)}
                  style={{ width: 80, height: 120 }} // Ensure dimensions matches standard
                />
              </View>
            )
          })}
        </View>

      </ScrollView>

      {/* FOOTER CTA */}
      <View style={[styles.footer, { backgroundColor: cardBg }]}>
        <View>
          <Text style={{ color: textSub, fontSize: 12 }}>Selected Slot</Text>
          <Text style={{ color: primary, fontSize: 20, fontWeight: '800' }}>{selectedSlot || "None"}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: selectedSlot ? primary : "#333" }]}
          disabled={!selectedSlot}
          onPress={() => {
            if (selectedSlot) {
              router.push({
                pathname: "/parking/setTime",
                params: {
                  slot: selectedSlot,
                  parkingName: parkingName,
                  price: price
                }
              });
            }
          }}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: '700' },

  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 10, marginBottom: 25,
    padding: 20, borderRadius: 20,
    elevation: 5, shadowColor: "#000", shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.3
  },
  infoIcon: {
    width: 45, height: 45, borderRadius: 22.5, backgroundColor: "rgba(255, 212, 0, 0.1)",
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoPrice: { fontSize: 13, fontWeight: '500' },

  filtersContainer: { marginBottom: 30, paddingHorizontal: 20 },
  filterRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12
  },
  filterLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filterLabel: { fontSize: 15, fontWeight: '600' },

  sectionHeader: {
    fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 15
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingHorizontal: 10
  },
  slotWrapper: {
    margin: 4
  },

  footer: {
    position: 'absolute', bottom: 0, width: '100%',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingBottom: 30,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    elevation: 20, shadowColor: "#000", shadowOffset: { height: -5, width: 0 }, shadowOpacity: 0.3
  },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 30, borderRadius: 25,
    gap: 10
  },
  continueText: { color: "#000", fontWeight: '800', fontSize: 14, letterSpacing: 1 }
});
