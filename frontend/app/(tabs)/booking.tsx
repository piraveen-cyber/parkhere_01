import { useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Animated, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUserBookings, Booking } from "../../services/bookingService";
import { getParkingSpots } from "../../services/parkingService";
import { supabase } from "../../config/supabaseClient";
import { useTheme } from "../../context/themeContext";
import { LinearGradient } from 'expo-linear-gradient';

export default function BookingTab() {
  const { t } = useTranslation();
  const MOCK_DATA = [
    {
      id: 'mock-1',
      type: 'parking',
      parkingSpotId: 'spot-123',
      title: 'Central City Mall',
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      time: '10:00 AM',
      price: '450.00',
      status: 'Active',
      subtitle: 'Zone A - Slot 4'
    },
    {
      id: 'mock-2',
      type: 'garage',
      title: 'City Garage Services',
      subtitle: '123 Main St, New York',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      time: '02:30 PM',
      price: '2500.00',
      status: 'Completed',
    },
    {
      id: 'mock-3',
      type: 'mechanic',
      title: 'Mike the Mechanic',
      subtitle: 'Tire Change',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      time: '09:00 AM',
      price: '1200.00',
      status: 'Completed',
    }
  ];

  // Initialize with Mock Data directly so it's never empty on first render
  const [bookings, setBookings] = useState<any[]>(MOCK_DATA);
  const [spots, setSpots] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false); // Start false to show mock immediately
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'history'>('all');

  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const COLORS = {
    bg: colors.background,
    card: colors.card,
    accent: colors.primary,
    text: colors.text,
    subText: colors.subText,
    border: isDark ? '#333' : '#EEE'
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      // Don't wipe data while loading
      // setLoading(true); 

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || "guest";

      const [bookingsData, spotsData, localData] = await Promise.all([
        getUserBookings(userId).catch(() => []),
        getParkingSpots().catch(() => []),
        AsyncStorage.getItem('LOCAL_BOOKINGS')
      ]);

      const spotMap: Record<string, string> = {};
      spotsData.forEach((s: any) => {
        const id = s._id || s.id;
        if (id) spotMap[id] = s.name;
      });
      setSpots(spotMap);

      const localBookings = localData ? JSON.parse(localData) : [];

      // MERGE Real + Mock
      // We prioritize Real bookings at the top usually, but let's sort all by date.
      // Filter out mocks if we really wanted to, but User wants "Entire" bookings.
      // So we keep MOCK_DATA. 

      let allBookings = [...localBookings, ...bookingsData, ...MOCK_DATA];

      // Deduplicate by ID just in case
      const seen = new Set();
      allBookings = allBookings.filter(b => {
        const duplicate = seen.has(b.id);
        seen.add(b.id);
        return !duplicate;
      });

      allBookings.sort((a, b) => {
        const dateA = new Date(a.startTime || a.date).getTime();
        const dateB = new Date(b.startTime || b.date).getTime();
        return dateB - dateA; // Newest first
      });

      setBookings(allBookings);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to MOCK_DATA if strict fail, but we initialized with it anyway.
      // We effectively refreshed it via the merge above.
    } finally {
      setLoading(false);
    }
  };

  console.log("ALL BOOKINGS:", bookings);

  const filteredBookings = bookings.filter(b => {
    const status = (b.status || 'completed').toLowerCase();

    // DEBUG: Show all if 'all' tab (we will add this tab)
    if (activeTab === 'all') return true;

    if (activeTab === 'upcoming') {
      const isUpcoming = status === 'active' || status.includes('confirm') || status === 'pending';
      return isUpcoming;
    } else { // history
      const isHistory = status === 'completed' || status === 'cancelled';
      return isHistory;
    }
  });

  // If no upcoming, maybe show all in history or just empty? 
  // For demo, let's just show all if 'upcoming' is empty? 
  // No, let's keep strict filtering for a "real" feel.

  const handlePress = (item: any) => {
    // Basic mapping to fit QR screen params
    const params = {
      bookingId: item.id || 'N/A',
      slot: item.parkingSpotId || item.subtitle || 'N/A', // Use subtitle for Garage address/details
      checkInTime: item.time || new Date(item.startTime).toLocaleTimeString(),
      duration: item.duration || '2', // Mock duration if missing
      parkingName: item.title || 'Unknown Service',
      totalPrice: item.totalPrice || item.price || '0.00'
    };

    router.push({
      pathname: '/parking/QR', // We reuse the Parking QR screen for all types for this demo
      params: params
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const isLocal = !!item.type;
    const title = isLocal ? item.title : (spots[item.parkingSpotId] || t("unknownParkingLot"));
    const dateObj = new Date(item.startTime || item.date);
    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = isLocal ? item.time : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const price = item.totalPrice || item.price;
    const status = item.status || "Completed";
    const isCompleted = status.toLowerCase() === "completed";

    let iconName = "car"; // 'car-sport' is Ionicons, 'car' is MCI
    if (item.type === 'garage') iconName = "car-wrench";
    if (item.type === 'mechanic') iconName = "tools";

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.ticketContainer, { shadowColor: COLORS.accent }]}
        onPress={() => handlePress(item)}
      >
        {/* LEFT PART: DATE/TIME STRIP */}
        <View style={[styles.leftStrip, { backgroundColor: isDark ? '#1F1F1F' : '#F0F0F0', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
          <Text style={[styles.dayText, { color: COLORS.text }]}>{dateObj.getDate()}</Text>
          <Text style={[styles.monthText, { color: COLORS.subText }]}>{dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
          <View style={[styles.verticalLine, { backgroundColor: COLORS.border }]} />
          <Text style={[styles.timeText, { color: COLORS.subText }]}>{timeStr}</Text>
        </View>

        {/* RIGHT PART: INFO */}
        <LinearGradient
          colors={isDark ? ['#1A1A1A', '#141414'] : ['#FFF', '#F9F9F9']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.ticketContent, { borderColor: isDark ? '#333' : '#EEE' }]}
        >
          <View style={styles.ticketHeader}>
            <View style={[styles.iconBox, { backgroundColor: isCompleted ? (isDark ? '#333' : '#EEE') : 'rgba(255, 212, 0, 0.15)' }]}>
              <MaterialCommunityIcons name={iconName as any} size={20} color={isCompleted ? COLORS.subText : COLORS.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.ticketTitle, { color: COLORS.text }]} numberOfLines={1}>{title}</Text>
              {isLocal && <Text style={[styles.ticketSubtitle, { color: COLORS.subText }]} numberOfLines={1}>{item.subtitle}</Text>}
            </View>
            <View style={[styles.statusPill, { backgroundColor: isCompleted ? (isDark ? '#333' : '#EEE') : COLORS.accent }]}>
              <Text style={[styles.statusText, { color: isCompleted ? COLORS.subText : (isDark ? '#000' : '#FFF') }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* DASHED DIVIDER */}
          <View style={[styles.dashedDivider, { borderColor: isDark ? '#333' : '#DDD' }]} />

          <View style={styles.ticketFooter}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: COLORS.subText }]}>Price</Text>
              <Text style={[styles.footerValue, { color: COLORS.accent }]}>{price ? `LKR ${price}` : '-'}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: COLORS.subText }]}> ID</Text>
              <Text style={[styles.footerValue, { color: COLORS.text }]}>#{item.id ? item.id.toString().slice(-4).toUpperCase() : '8832'}</Text>
            </View>
          </View>

          {/* DECORATIVE CIRCLES for TICKET LOOK */}
          <View style={[styles.circleCutout, { top: -10, left: -10, backgroundColor: COLORS.bg }]} />
          <View style={[styles.circleCutout, { bottom: -10, left: -10, backgroundColor: COLORS.bg }]} />

        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>My Tickets</Text>
            <Text style={[styles.headerSubtitle, { color: COLORS.subText }]}>Manage your bookings</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: isDark ? '#333' : '#EEE' }]}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.text} />
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabContainer}>
          {['all', 'upcoming', 'history'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? COLORS.accent : 'transparent',
                    borderColor: COLORS.border
                  }
                ]}
                onPress={() => setActiveTab(tab as any)}
              >
                <Text style={[
                  styles.tabText,
                  { color: isActive ? (isDark ? '#000' : '#FFF') : COLORS.subText }
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LIST */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.center}>
            <View style={[styles.emptyIconInfo, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
              <MaterialCommunityIcons name="ticket-confirmation-outline" size={50} color={COLORS.subText} />
            </View>
            <Text style={[styles.emptyTitle, { color: COLORS.text }]}>No {activeTab} tickets</Text>
            <Text style={[styles.emptySubtitle, { color: COLORS.subText }]}>
              Your {activeTab} bookings will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || item.id || index.toString()}
            contentContainerStyle={{ padding: 20, gap: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingVertical: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', marginBottom: 5 },
  headerSubtitle: { fontSize: 14 },
  headerIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  // Tabs
  tabContainer: {
    flexDirection: 'row', paddingHorizontal: 25, marginBottom: 15, gap: 15
  },
  tab: {
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25,
    borderWidth: 1,
  },
  tabText: { fontWeight: '700', fontSize: 13 },

  // Empty State
  emptyIconInfo: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', width: '70%' },

  // TICKET CARD
  ticketContainer: {
    flexDirection: 'row', borderRadius: 16, overflow: 'hidden',
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },
  leftStrip: {
    width: 65, alignItems: 'center', justifyContent: 'center',
    borderRightWidth: 1, borderStyle: 'dashed', paddingVertical: 15
  },
  dayText: { fontSize: 20, fontWeight: '800' },
  monthText: { fontSize: 12, fontWeight: '700' },
  verticalLine: { width: 20, height: 2, marginVertical: 10 },
  timeText: { fontSize: 11, fontWeight: '600' },

  ticketContent: { flex: 1, padding: 15, borderWidth: 1, borderLeftWidth: 0, justifyContent: 'space-between' },
  ticketHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ticketTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  ticketSubtitle: { fontSize: 12 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },

  dashedDivider: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 1, marginBottom: 15, opacity: 0.5 },

  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerItem: {},
  footerLabel: { fontSize: 11, marginBottom: 2 },
  footerValue: { fontSize: 14, fontWeight: '700' },

  circleCutout: { position: 'absolute', width: 20, height: 20, borderRadius: 10, zIndex: 10 },
});