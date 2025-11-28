import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../config/supabaseClient";
import { useTheme } from "../../context/themeContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* THEME COLORS */
  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const cardBg = isDark ? "#1B263B" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#111";
  const descColor = isDark ? "#9FB5C2" : "#6F6F6F";
  const borderColor = isDark ? "#415A77" : "#EDEDED";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", error.message);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 140 },
        ]}
      >
        {/* HEADER */}
        <Text style={[styles.welcome, { color: textColor }]}>
          Welcome back, Suko 👋
        </Text>

        <Text style={[styles.subtitle, { color: descColor }]}>
          Find everything your vehicle needs — fast and easy.
        </Text>

        {/* SEARCH BAR */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: cardBg, borderColor: borderColor },
          ]}
        >
          <Text style={[styles.searchIcon, { color: descColor }]}>🔍</Text>
          <TextInput
            placeholder="Search services or parking..."
            placeholderTextColor={descColor}
            style={[styles.searchInput, { color: textColor }]}
          />
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {services.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.card, { backgroundColor: cardBg }]}
            >
              <View style={styles.iconWrapper}>
                <Image source={item.icon} style={styles.iconImg} />
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BIG CARD */}
        <View style={[styles.bigCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.bigCardTitle, { color: textColor }]}>
            Book Your Spot in Seconds
          </Text>
          <Text style={[styles.bigCardSubtitle, { color: descColor }]}>
            Secure, easy, and instant confirmation
          </Text>

          <TouchableOpacity style={styles.bookNowBtn}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* PROMOS */}
        <View style={styles.promoYellow}>
          <Text style={styles.promoTitle}>20% Off Washing</Text>
          <Text style={styles.promoSubtitle}>Valid until end of month</Text>
        </View>

        <View
          style={[
            styles.promoWhite,
            { backgroundColor: cardBg, borderColor: "#FFD400" },
          ]}
        >
          <Text
            style={[
              styles.promoTitle,
              { color: isDark ? "#FFFFFF" : "#000" },
            ]}
          >
            Free EV Charging
          </Text>
          <Text style={[styles.promoSubtitle, { color: descColor }]}>
            First 30 minutes free
          </Text>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const services = [
  { title: "Parking", icon: require("../../assets/images/car.png") },
  { title: "Mechanics", icon: require("../../assets/images/wrench.png") },
  { title: "Washing", icon: require("../../assets/images/wash.png") },
  { title: "EV Charging", icon: require("../../assets/images/ev.png") },
  { title: "Towing", icon: require("../../assets/images/tow.png") },
  { title: "Hiring", icon: require("../../assets/images/check.png") },
];

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 15,
  },

  welcome: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
  },

  searchBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  searchIcon: { fontSize: 20, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },

  card: {
    width: "47%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
  },

  iconWrapper: {
    backgroundColor: "#FFD400",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  iconImg: { width: 35, height: 35, tintColor: "#000" },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  bigCard: {
    padding: 25,
    borderRadius: 18,
    marginTop: 10,
  },

  bigCardTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  bigCardSubtitle: {
    marginTop: 4,
    marginBottom: 15,
  },

  bookNowBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookNowText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  promoYellow: {
    backgroundColor: "#FFD400",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },

  promoWhite: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 20,
  },

  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  promoSubtitle: {
    marginTop: 5,
    color: "#666",
  },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#FF3B30",
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
