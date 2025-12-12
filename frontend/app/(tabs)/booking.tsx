import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserBookings, Booking } from "../../services/bookingService";
import { getParkingSpots } from "../../services/parkingService";
import { supabase } from "../../config/supabaseClient";
import { useTheme } from "../../context/themeContext";

export default function BookingTab() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [spots, setSpots] = useState<Record<string, string>>({}); // Map: ID -> Name
  const [loading, setLoading] = useState(true);

  // Theme Colors
  const { colors } = useTheme();

  const COLORS = {
    bg: colors.background,
    card: colors.card,
    accent: colors.primary,
    text: colors.text,
    subText: colors.subText
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Get User Session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "guest";

      // 2. Fetch Bookings & Spots in Parallel
      const [bookingsData, spotsData] = await Promise.all([
        getUserBookings(userId).catch(() => []),
        getParkingSpots().catch(() => [])
      ]);

      // 3. Create Spot Map for Name Lookup
      const spotMap: Record<string, string> = {};
      spotsData.forEach((s: any) => {
        const id = s._id || s.id;
        if (id) spotMap[id] = s.name;
      });
      setSpots(spotMap);

      setBookings(bookingsData.reverse()); // Newest first
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const spotName = spots[item.parkingSpotId] || "Unknown Parking Lot";
    const startDate = new Date(item.startTime).toLocaleDateString();
    const startTime = new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const status = item.status || "Completed";
    const isCompleted = status === "Completed";

    return (
      <TouchableOpacity activeOpacity={0.8} style={[styles.card, { backgroundColor: COLORS.card, borderColor: isCompleted ? "#333" : COLORS.accent }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.parkName, { color: COLORS.text }]}>{spotName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isCompleted ? "#333" : "rgba(255, 212, 0, 0.15)" }]}>
            <Text style={{ color: isCompleted ? COLORS.subText : COLORS.accent, fontWeight: "700", fontSize: 12 }}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View>
            <Text style={[styles.label, { color: COLORS.subText }]}>Date</Text>
            <Text style={[styles.value, { color: COLORS.text }]}>{startDate}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: COLORS.subText }]}>Time</Text>
            <Text style={[styles.value, { color: COLORS.text }]}>{startTime}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: COLORS.subText }]}>Price</Text>
            <Text style={[styles.value, { color: COLORS.accent }]}>LKR {item.totalPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>My Tickets</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="ticket-outline" size={60} color="#333" />
            <Text style={{ color: COLORS.subText, marginTop: 20 }}>No bookings yet.</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)"
  },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 15
  },
  parkName: { fontSize: 16, fontWeight: "700" },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8
  },

  divider: { height: 1, backgroundColor: "#333", marginBottom: 15 },

  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 12, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "600" }
});