import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";

export default function SetTime() {
  const [checkIn, setCheckIn] = useState("11:00 am");
  const [duration, setDuration] = useState(6);

  const selectedSlot = "B20";

  const pricePerHour = 200;
  const calculatedPrice = duration * pricePerHour;

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parking Details</Text>
      </View>

      {/* Parking Card */}
      <View style={styles.parkingCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.parkingTitle}>Parking A</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>RS. {pricePerHour}</Text>
            <Text style={styles.perHour}>/h</Text>
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="#FFD400" />
          <Text style={styles.rating}>4.7 (120 reviews)</Text>
        </View>

        <Text style={styles.subText}>600m from your location</Text>

        {/* Icons row */}
        <View style={styles.detailsRow}>
          <View style={styles.iconPair}>
            <Ionicons name="camera" size={18} color="#555" />
            <Text style={styles.iconText}>CCTV</Text>
          </View>
          <View style={styles.iconPair}>
            <Ionicons name="shield-checkmark" size={18} color="#555" />
            <Text style={styles.iconText}>Security</Text>
          </View>
          <View style={styles.iconPair}>
            <MaterialIcons name="warning" size={18} color="#555" />
            <Text style={styles.iconText}>Covered</Text>
          </View>
        </View>
      </View>

      {/* Slot */}
      <Text style={styles.slotText}>Slot: {selectedSlot}</Text>

      {/* Time section */}
      <Text style={styles.sectionTitle}>Select time</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Check-in Time:</Text>

        {/* Time editing */}
        <TouchableOpacity style={styles.timeBox}>
          <MaterialIcons name="edit" size={18} color="#444" />
          <Text style={styles.timeValue}>{checkIn}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Estimate Duration</Text>

        <View style={styles.durationBox}>
          <Text style={styles.durationText}>
            {duration} hours - RS.{calculatedPrice}
          </Text>
        </View>
      </View>

      <Slider
        style={{ width: "100%", marginTop: 5 }}
        minimumValue={1}
        maximumValue={12}
        step={1}
        value={6}
        onValueChange={(val) => setDuration(val)}
        minimumTrackTintColor="#FFD400"
        thumbTintColor="#fff"
      />

      {/* Add services */}
      <Text style={styles.sectionTitle}>Add services (optional)</Text>

      <View style={styles.servicesRow}>
        {[
          { name: "EV Charging", price: 50 },
          { name: "Car Wash", price: 100 },
          { name: "Mechanic Check", price: 150 },
        ].map((service, i) => (
          <TouchableOpacity key={i} style={styles.serviceBox}>
            <Text style={styles.serviceMain}>{service.name}</Text>
            <Text style={styles.servicePrice}>LKR {service.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("../parking/paymentCard")} // ✔ ROUTER TO PAYMENT
      >
        <Text style={styles.buttonText}>Continue to Payment</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 10 },

  parkingCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 6,
    marginBottom: 15,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  parkingTitle: { fontSize: 22, fontWeight: "700" },

  priceTag: {
    backgroundColor: "#FFD400",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: { fontSize: 16, fontWeight: "700" },
  perHour: { fontSize: 12, marginLeft: 2 },

  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  rating: { marginLeft: 5, fontSize: 14, color: "#555" },

  subText: { color: "#777", marginTop: 5 },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  iconPair: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  iconText: { marginLeft: 5, color: "#555" },

  slotText: {
    marginVertical: 10,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },

  sectionTitle: { marginTop: 20, fontSize: 18, fontWeight: "700" },

  label: { fontSize: 15, color: "#777" },

  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  timeValue: { marginLeft: 6, fontSize: 15 },

  durationBox: {
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    width: 200,
  },
  durationText: { fontWeight: "700", fontSize: 15 },

  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  serviceBox: {
    backgroundColor: "#f6f6f6",
    padding: 18,
    borderRadius: 16,
    width: "30%",
    alignItems: "center",
  },
  serviceMain: { fontWeight: "600" },
  servicePrice: { color: "#777", marginTop: 5 },

  button: {
    backgroundColor: "#FFD400",
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },
});
