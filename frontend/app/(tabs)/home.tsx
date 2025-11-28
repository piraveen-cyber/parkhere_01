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
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../config/supabaseClient"; // <-- Add this import

export default function HomeScreen() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text style={styles.welcome}>Welcome back, Suko 👋</Text>
        <Text style={styles.subtitle}>
          Find everything your vehicle needs — fast and easy.
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search services or parking..."
            style={styles.searchInput}
          />
        </View>

        {/* Services Grid */}
        <View style={styles.grid}>
          {services.map((item) => (
            <TouchableOpacity key={item.title} style={styles.card}>
              <View style={styles.iconWrapper}>
                <Image source={item.icon} style={styles.iconImg} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Now Card */}
        <View style={styles.bigCard}>
          <Text style={styles.bigCardTitle}>Book Your Spot in Seconds</Text>
          <Text style={styles.bigCardSubtitle}>
            Secure, easy, and instant confirmation
          </Text>

          <TouchableOpacity style={styles.bookNowBtn}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Promo Cards */}
        <View style={styles.promoYellow}>
          <Text style={styles.promoTitle}>20% Off Washing</Text>
          <Text style={styles.promoSubtitle}>Valid until end of month</Text>
        </View>

        <View style={styles.promoWhite}>
          <Text style={styles.promoTitle}>Free EV Charging</Text>
          <Text style={styles.promoSubtitle}>First 30 minutes free</Text>
        </View>

        {/* 🔥 LOGOUT BUTTON AT THE BOTTOM */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 140, // extra padding for logout button
  },

  welcome: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },
  subtitle: {
    color: "#6F6F6F",
    marginTop: 5,
    fontSize: 15,
  },

  searchBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDEDED",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  iconWrapper: {
    backgroundColor: "#FFD400",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  iconImg: {
    width: 35,
    height: 35,
    tintColor: "#000",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  bigCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 18,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  bigCardTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  bigCardSubtitle: {
    color: "#777",
    marginTop: 4,
    marginBottom: 15,
  },
  bookNowBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
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
    backgroundColor: "#fff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFD400",
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

  /* 🔥 Logout Button */
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
