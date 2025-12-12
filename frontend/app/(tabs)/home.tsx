import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  StatusBar
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabaseClient";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ParkingSlot from "../../components/ParkingSlot";
import { useTheme } from "../../context/themeContext";
import * as bookingService from "../../services/bookingService";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // GLOBAL THEME CONTEXT
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const THEME = colors;

  // ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // LIVE BOOKING LOGIC
  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    // Mount Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();

    // Poll for active booking
    fetchActiveBooking();
    const interval = setInterval(fetchActiveBooking, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveBooking = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const booking = await bookingService.getActiveBooking(session.user.id);
        setActiveBooking(booking);
      }
    } catch (e) {
      console.log("Error fetching active booking", e);
    }
  };

  const handleScan = async () => {
    if (!activeBooking) return;
    try {
      Alert.alert(
        "Simulate QR Scan",
        "Scanning QR Code...",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Scan Success",
            onPress: async () => {
              const res = await bookingService.scanBooking(activeBooking._id);
              Alert.alert("Success", res.message);
              fetchActiveBooking();
            }
          }
        ]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Scan failed");
    }
  };

  const handleExtend = async () => {
    if (!activeBooking) return;
    Alert.alert(
      "Extend Parking",
      "Add 1 hour for LKR 200?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await bookingService.extendBooking(activeBooking._id, 1);
              Alert.alert("Success", "Time extended by 1 hour!");
              fetchActiveBooking();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Extension failed");
            }
          }
        }
      ]
    );
  };

  // Timer Component
  const LiveTimer = ({ endTime }: { endTime: string }) => {
    const [left, setLeft] = useState(0);

    useEffect(() => {
      const tick = () => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((end - now) / 1000);
        setLeft(diff > 0 ? diff : 0);
      };
      tick();
      const tmr = setInterval(tick, 1000);
      return () => clearInterval(tmr);
    }, [endTime]);

    const hrs = Math.floor(left / 3600);
    const mins = Math.floor((left % 3600) / 60);
    const secs = left % 60;

    return (
      <Text style={[styles.timerValue, { color: colors.primary }]}>
        {`${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
      </Text>
    );
  };

  const handleServiceNavigation = (key: string) => {
    if (key === "parking") router.push("/parking/selectVehicle");
  };

  const services = [
    { key: "parking", title: "Find Parking", icon: "car-sport", lib: Ionicons },
    { key: "mechanics", title: "Mechanic", icon: "wrench", lib: MaterialCommunityIcons },
    { key: "washing", title: "Car Wash", icon: "water", lib: Ionicons },
    { key: "evCharging", title: "EV Charge", icon: "ev-station", lib: MaterialCommunityIcons },
    { key: "towing", title: "Towing", icon: "tow-truck", lib: MaterialCommunityIcons },
    { key: "hiring", title: "Rent / Hire", icon: "key", lib: Ionicons },
  ];

  const parkingSlotsMock = [
    { id: "A1", status: "occupied", type: "standard" },
    { id: "A2", status: "available", type: "standard" },
    { id: "A3", status: "occupied", type: "ev" },
    { id: "A4", status: "available", type: "disabled" },
    { id: "A5", status: "available", type: "standard" },
  ];

  const recentActivity = [
    { id: 1, title: "Parking - Zone A", date: "2 hrs ago", amount: "-$5.00", icon: "car-sport" },
    { id: 2, title: "Top-up", date: "Yesterday", amount: "+$50.00", icon: "wallet" },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: THEME.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100, opacity: fadeAnim }
        ]}
      >

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: THEME.subText }]}>{t("goodMorning") || "Hello,"}</Text>
            <Text style={[styles.userName, { color: THEME.text }]}>Alex Doe</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: THEME.headerIconBg }]}
              onPress={toggleTheme}
            >
              <Feather name={isDark ? "sun" : "moon"} size={20} color={THEME.text} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: THEME.headerIconBg }]}>
              <Ionicons name="notifications-outline" size={20} color={THEME.text} />
              <View style={[styles.badge, { backgroundColor: THEME.error }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* LIVE STATUS BAR */}
        {activeBooking && (
          <Animated.View style={{ opacity: fadeAnim, marginBottom: 20 }}>
            <View style={[styles.liveStatusCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>

              <View style={styles.liveHeader}>
                <View style={[styles.liveBadge, { backgroundColor: "rgba(255, 212, 0, 0.15)" }]}>
                  <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.liveText, { color: colors.primary }]}>
                    {activeBooking.status === 'pending' ? "ARRIVING SOON" : "LIVE PARKING"}
                  </Text>
                </View>
                <Text style={{ color: colors.subText, fontSize: 12, fontWeight: "600" }}>
                  {activeBooking.status === 'active' ? `Slot ${activeBooking.parkingSpotId?.name || "Unknown"}` : "Navigating..."}
                </Text>
              </View>

              <View style={styles.timerRow}>
                {activeBooking.status === 'active' ? (
                  <View>
                    <Text style={[styles.timerValue, { color: colors.text }]}>
                      <LiveTimer endTime={activeBooking.endTime} />
                    </Text>
                    <Text style={{ color: colors.subText, fontSize: 12 }}>Time Remaining</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
                      {new Date(activeBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={{ color: colors.subText, fontSize: 12 }}>Expected Arrival</Text>
                  </View>
                )}

                {/* ACTION BUTTONS */}
                {activeBooking.status === 'active' ? (
                  <View style={{ gap: 10 }}>
                    <TouchableOpacity onPress={handleExtend} style={[styles.actionBtnSmall, { backgroundColor: colors.background, borderColor: colors.primary }]}>
                      <Feather name="plus-circle" size={16} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>EXTEND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleScan} style={[styles.actionBtnSmall, { backgroundColor: colors.primary }]}>
                      <Ionicons name="exit-outline" size={16} color="#000" />
                      <Text style={{ color: "#000", fontWeight: "700", fontSize: 12 }}>CHECK OUT</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleScan} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                    <Ionicons name="qr-code-outline" size={20} color="#000" />
                    <Text style={{ color: "#000", fontWeight: "700" }}>CHECK IN</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </Animated.View>
        )}

        {/* SERVICES GRID */}
        <Text style={[styles.sectionTitle, { color: THEME.text, marginTop: 10 }]}>Services</Text>
        <View style={styles.gridContainer}>
          {services.map((service) => {
            const IconLib = service.lib;
            return (
              <TouchableOpacity
                key={service.key}
                style={[styles.gridItem, { backgroundColor: THEME.card, borderColor: THEME.border }]}
                onPress={() => handleServiceNavigation(service.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.gridIcon, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F2F2F7" }]}>
                  <IconLib name={service.icon as any} size={24} color={THEME.primary} />
                </View>
                <View>
                  <Text style={[styles.gridTitle, { color: THEME.text }]}>{service.title}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* LIVE ZONE STRIP */}
        <View style={[styles.liveZoneStrip, { backgroundColor: isDark ? "#111" : "#EEEEEE", borderColor: THEME.border }]}>
          <View style={{ paddingHorizontal: 15, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: THEME.subText, fontSize: 12, fontWeight: "600" }}>NEARBY ZONE STATUS</Text>
            <TouchableOpacity><Text style={{ color: THEME.primary, fontSize: 12 }}>View Map</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 12 }}>
            {parkingSlotsMock.map((slot, index) => (
              <ParkingSlot
                key={index}
                label={slot.id}
                status={slot.status as any}
                type={slot.type as any}
                style={{ marginRight: 10, transform: [{ scale: 0.9 }] }}
              />
            ))}
          </ScrollView>
        </View>

        {/* RECENT ACTIVITY */}
        <Text style={[styles.sectionTitle, { color: THEME.text, marginTop: 15 }]}>Recent</Text>
        <View style={styles.activityList}>
          {recentActivity.map((item) => (
            <View key={item.id} style={[styles.activityRow, { backgroundColor: THEME.card }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Ionicons name={item.icon as any} size={18} color={THEME.subText} />
                <View>
                  <Text style={{ color: THEME.text, fontWeight: "600", fontSize: 13 }}>{item.title}</Text>
                  <Text style={{ color: THEME.subText, fontSize: 11 }}>{item.date}</Text>
                </View>
              </View>
              <Text style={{ color: item.amount.startsWith('+') ? THEME.success : THEME.text, fontWeight: "700" }}>{item.amount}</Text>
            </View>
          ))}
        </View>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: 20 },

  // TEXT
  greeting: { fontSize: 12, fontWeight: "500", textTransform: 'uppercase', letterSpacing: 1 },
  userName: { fontSize: 22, fontWeight: "700" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },

  // HEADER
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  iconBtn: { padding: 8, borderRadius: 10 },
  badge: { position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: 3 },

  // LIVE STATUS BAR
  liveStatusCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  liveHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  timerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timerValue: { fontSize: 32, fontWeight: "700" },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6 },
  actionBtnSmall: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 4, borderWidth: 1, borderColor: "transparent" },

  // LIVE ZONE STRIP
  liveZoneStrip: { borderRadius: 12, borderWidth: 1, marginBottom: 25, overflow: 'hidden' },

  // GRID
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12, marginBottom: 15 },
  gridItem: {
    width: "48%", padding: 15, borderRadius: 14, borderWidth: 1,
    flexDirection: "row", alignItems: "center", gap: 12
  },
  gridIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  gridTitle: { fontSize: 13, fontWeight: "600" },

  // RECENT
  activityList: { gap: 10 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10 },
});
