import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  StatusBar
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { processPayment } from "../../services/paymentService";
import { supabase } from "../../config/supabaseClient";
import CustomButton from "../../components/CustomButton";

import { useTheme } from "../../context/themeContext";
import * as bookingService from "../../services/bookingService";

export default function OtpPage() {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const amount = params.totalPrice ? parseFloat(params.totalPrice.toString()) : 500;

  // Capture all booking params
  const bookingParams = {
    totalPrice: params.totalPrice,
    duration: params.duration,
    checkInTime: params.checkInTime,
    slot: params.slot,
    parkingName: params.parkingName
  };

  const [otp] = useState(["1", "9", "8", "3"]);
  const [loading, setLoading] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Theme Colors
  const accent = colors.primary;
  const bgDark = colors.background;

  useEffect(() => {
    // ... (animations)
    // 1. Entry Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Pulse Animation for Loader
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePayment = async () => {
    console.log("Button Pressed!");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      await processPayment({
        userId: session?.user?.id || "guest",
        amount: amount,
        method: "card",
      });

      // CREATE BOOKING (Backend)
      if (session?.user?.id) {
        // Construct Start/End times
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + (parseFloat(params.duration?.toString() || "1") * 60 * 60 * 1000));

        await bookingService.createBooking({
          userId: session.user.id,
          parkingSpotId: params.slot?.toString() || "A1",
          startTime: startTime,
          endTime: endTime,
          totalPrice: amount,
          status: 'pending'
        } as any);
      }

      // CORRECT FLOW: Verification Done -> Show Success Popup
      router.push({
        pathname: "../parking/successBook",
        params: bookingParams
      });
    } catch (error: any) {
      Alert.alert(t('error', 'Error'), t('paymentFailed', 'Payment failed') + ": " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgDark }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />

      {/* BACKGROUND PARTICLES (Static for now, simulates stars) */}
      <View style={styles.particleBg}>
        <View style={[styles.particle, { top: '10%', left: '10%', opacity: 0.3 }]} />
        <View style={[styles.particle, { top: '30%', right: '20%', opacity: 0.5 }]} />
        <View style={[styles.particle, { bottom: '20%', left: '15%', opacity: 0.2 }]} />
      </View>

      <Animated.View style={{ flex: 1, alignItems: 'center', opacity: fadeAnim }}>

        {/* HEADER ICON */}
        <View style={styles.iconHeader}>
          <Ionicons name="shield-checkmark-outline" size={40} color={accent} />
        </View>

        <Text style={styles.title}>{t('waitingOtp')}</Text>
        <Text style={styles.subtitle}>{t('otpSubtitle')}</Text>

        {/* OTP DIGITS */}
        <View style={styles.otpRow}>
          {otp.map((n, index) => (
            <Animated.View
              key={index}
              style={[
                styles.otpBox,
                {
                  shadowColor: accent,
                  shadowOpacity: 0.5,
                  shadowRadius: 10
                }
              ]}
            >
              <Text style={styles.otpText}>{n}</Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.smallInfo}>{t('autoOtp')}</Text>

        {/* CIRCULAR PULSING LOADER */}
        <View style={styles.loaderContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                borderColor: accent,
                opacity: 0.3
              }
            ]}
          />
          <View style={[styles.centerCircle, { borderColor: accent }]}>
            <Ionicons name="hourglass-outline" size={30} color={accent} />
            <Text style={styles.centerCircleText}>{t('waitingOtp')}</Text>
          </View>
        </View>

        {/* RESEND LINK */}
        <View style={styles.row}>
          <Text style={styles.muted}>{t('didntReceiveOtp')}</Text>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.resend}>{t('resend')}</Text>
          </TouchableOpacity>
        </View>

        {/* COMPLETE BUTTON */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={t('completePayment')}
            onPress={handlePayment}
            loading={loading}
            style={styles.customBtn}
            textStyle={{ color: "#000", fontWeight: '800', letterSpacing: 1 }}
          />
        </View>

      </Animated.View>
    </View>
  );
}

/* ------- STYLES ------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  particleBg: { ...StyleSheet.absoluteFillObject },
  particle: { width: 4, height: 4, backgroundColor: "#FFF", position: 'absolute', borderRadius: 2 },

  iconHeader: {
    marginBottom: 20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(255, 212, 0, 0.1)",
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: "#FFD400"
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#FFF",
    letterSpacing: 1,
    marginBottom: 10
  },
  subtitle: {
    color: "#BBB",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 40,
    lineHeight: 22
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20
  },
  otpBox: {
    width: 65,
    height: 70,
    borderRadius: 18,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#FFD400",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
  },
  otpText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF"
  },

  smallInfo: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
    fontSize: 13
  },

  loaderContainer: {
    marginTop: 50,
    justifyContent: 'center', alignItems: 'center',
    height: 180
  },
  pulseCircle: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2,
    backgroundColor: "rgba(255, 212, 0, 0.05)"
  },
  centerCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#000",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2,
    elevation: 10, shadowColor: "#FFD400", shadowOpacity: 0.2, shadowRadius: 10
  },
  centerCircleText: {
    textAlign: "center",
    color: "#FFD400",
    marginTop: 5,
    fontSize: 12, fontWeight: "600"
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    gap: 8,
  },
  muted: { color: "#888" },
  resend: {
    color: "#FFD400",
    fontWeight: "700",
    textDecorationLine: 'underline'
  },

  buttonContainer: {
    width: '100%',
    marginTop: 40,
    marginBottom: 30
  },
  customBtn: {
    backgroundColor: "#FFD400",
    height: 60, borderRadius: 30,
    shadowColor: "#FFD400", shadowOpacity: 0.4, shadowRadius: 15, elevation: 10
  }
});
