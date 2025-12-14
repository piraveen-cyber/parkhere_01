import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function LoadingPopup() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  // Animation Values
  // ... (Keep existing animations)
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Theme Colors
  const accent = "#FFD400"; // Gold

  useEffect(() => {
    // 1. Enter Animation (Scale + Fade)
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // SAVE LOCAL for Demo Consistency
    const saveLocal = async () => {
      try {
        const newBooking = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'parking',
          title: params.parkingName || 'Parking Session',
          subtitle: `Slot ${params.slot} • ${params.duration} hr`,
          date: new Date().toISOString(),
          startTime: new Date().toISOString(),
          time: params.checkInTime || 'Now',
          price: params.totalPrice,
          status: 'Confirmed',
          parkingSpotId: params.slot
        };
        const existing = await AsyncStorage.getItem('LOCAL_BOOKINGS');
        const bookings = existing ? JSON.parse(existing) : [];
        bookings.push(newBooking);
        await AsyncStorage.setItem('LOCAL_BOOKINGS', JSON.stringify(bookings));
        console.log("Parking Saved Locally:", newBooking);
      } catch (e) {
        console.log("Failed to save local parking", e);
      }
    };
    saveLocal();

    // 2. Continuous Pulse Animation for Icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Navigation Logic (Preserved but fixed destination)
    const timer = setTimeout(() => {
      // Fade out before navigating
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        // CORRECT FLOW: Success -> QR Ticket (Pass Params)
        router.push({
          pathname: "../parking/QR",
          params: params // Forward all incoming booking params
        });
      });
    }, 2000); // 2s Timer + fade time slightly optimized visually

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Dark Overlay with Blur Effect Simulation */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />

      {/* Success Card */}
      <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>

        {/* Gold Glow Behind Icon */}
        <View style={styles.glowContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              { transform: [{ scale: pulseAnim }], opacity: 0.2 }
            ]}
          />
          <Ionicons name="checkmark-circle" size={80} color={accent} />
        </View>

        <Text style={styles.title}>{t('spaceBooked')}</Text>
        <Text style={styles.subtitle}>{t('notifyingGuards')}</Text>

        {/* Premium Divider */}
        <View style={styles.divider} />

        {/* Custom Loader or Text */}
        <View style={styles.loaderRow}>
          <ActivityIndicator size="small" color={accent} />
          <Text style={styles.redirectText}>{t("redirecting")}</Text>
        </View>

      </Animated.View>
    </View>
  );
}

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // Handled by overlay absolute
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)", // Deep dark dimmed bg
  },
  popup: {
    backgroundColor: "#111", // Dark Card
    width: width * 0.85,
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD400", // Gold Border

    // Glow Shadow
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },

  glowContainer: {
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20
  },
  pulseCircle: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#FFD400",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 0.5
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22
  },

  divider: {
    width: '40%', height: 1, backgroundColor: "#333",
    marginVertical: 20
  },

  loaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10
  },
  redirectText: { color: "#FFD400", fontSize: 12, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 1 }
});
