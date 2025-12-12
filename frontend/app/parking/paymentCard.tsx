import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

import { useTheme } from "../../context/themeContext";
import * as bookingService from "../../services/bookingService";
import { supabase } from "../../config/supabaseClient";

export default function PaymentCard() {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const totalPrice = params.totalPrice ? params.totalPrice.toString() : "0.00";
  const duration = params.duration ? params.duration.toString() : "0";
  const checkInTime = params.checkInTime ? params.checkInTime.toString() : "--:--";
  const slot = params.slot ? params.slot.toString() : "N/A";
  const parkingName = params.parkingName ? params.parkingName.toString() : "Unknown Parking";

  const [method, setMethod] = useState("card"); // card | cash | upi
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Animation Values
  // ... (Keep existing animations)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Theme Colors
  const bgDark = colors.background;
  const cardBg = colors.card;
  const accent = colors.primary;
  const textWhite = colors.text;
  const textGray = colors.subText;
  const inputBg = theme === 'dark' ? "#1A1A1A" : "#E5E5EA";

  // ... (Keep useEffect)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validation Utils
  const validateCardNumber = (num: string) => /^\d{16,19}$/.test(num.replace(/\s/g, ''));
  const validateExpiry = (date: string) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date);
  const validateCVV = (code: string) => /^\d{3,4}$/.test(code);

  const handlePayment = () => {
    const bookingParams = {
      totalPrice,
      duration,
      checkInTime,
      slot,
      parkingName
    };

    if (method === "card") {
      // 1. Basic Empty Check
      if (!cardNumber || !expiry || !cvv) {
        Alert.alert(t('error', 'Error'), t('fillAllFields', 'Please fill in all card details.'));
        return;
      }

      // 2. Format Validation
      if (!validateCardNumber(cardNumber)) {
        Alert.alert(t('invalidCard', 'Invalid Card'), t('checkCardNumber', 'Please start with a valid card number.'));
        return;
      }
      if (!validateExpiry(expiry)) {
        Alert.alert(t('invalidDate', 'Invalid Date'), t('checkExpiry', 'Expiry must be in MM/YY format.'));
        return;
      }
      if (!validateCVV(cvv)) {
        Alert.alert(t('invalidCVV', 'Invalid CVV'), t('checkCVV', 'CVV must be 3 or 4 digits.'));
        return;
      }

      // CORRECT FLOW: Card -> OTP Verification
      router.push({
        pathname: "../parking/paymentOTP",
        params: bookingParams
      });
    } else {
      // CORRECT FLOW: Cash/Other -> Create Booking -> Booking Success Popup
      const createAndNav = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000));

            await bookingService.createBooking({
              userId: session.user.id,
              parkingSpotId: slot,
              startTime: startTime,
              endTime: endTime,
              totalPrice: parseFloat(totalPrice),
              status: 'pending'
            } as any);
          }
        } catch (e) {
          console.log("Booking creation failed (might be guest)", e);
        }

        router.push({
          pathname: "../parking/successBook",
          params: bookingParams
        });
      };
      createAndNav();
    }
  };

  const PaymentMethod = ({ id, iconLib: IconLib, icon, title, sub }: any) => {
    const isSelected = method === id;
    const scaleVal = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scaleVal, { toValue: 0.98, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scaleVal, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <Pressable onPress={() => setMethod(id)} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={[
          styles.methodBox,
          {
            backgroundColor: cardBg,
            borderColor: isSelected ? accent : "#333",
            transform: [{ scale: scaleVal }],
            shadowColor: isSelected ? accent : "#000",
            elevation: isSelected ? 10 : 2
          }
        ]}>
          <View style={[styles.iconBox, { backgroundColor: isSelected ? accent : "#222" }]}>
            <IconLib name={icon} size={24} color={isSelected ? "#000" : "#AAA"} />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={[styles.methodTitle, { color: isSelected ? accent : textWhite }]}>{title}</Text>
            {sub && <Text style={[styles.methodSub, { color: textGray }]}>{sub}</Text>}

            {/* ID Specific Content */}
            {id === 'card' && (
              <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
                <Fontisto name="visa" size={14} color={textGray} />
                <Fontisto name="mastercard" size={14} color={textGray} />
              </View>
            )}
          </View>
          {isSelected && <Ionicons name="checkmark-circle" size={24} color={accent} />}
        </Animated.View>
      </Pressable>
    )
  };

  return (
    <View style={[styles.container, { backgroundColor: bgDark }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={accent} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textWhite }]}>Payment</Text>
        </Animated.View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* SUMMARY CARD */}
            <View style={[styles.summaryCard, { backgroundColor: "rgba(255, 212, 0, 0.05)", borderColor: accent }]}>
              <View>
                <Text style={[styles.summaryTitle, { color: textWhite }]}>{parkingName}</Text>
                <Text style={[styles.summarySub, { color: textGray }]}>{t('today')}, {checkInTime} • {duration} hr</Text>
              </View>
              <View style={styles.priceTag}>
                <Text style={[styles.priceText, { color: accent }]}>LKR {totalPrice}</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: textWhite }]}>{t('selectPaymentMethod')}</Text>

            {/* PAYMENT METHODS */}
            <PaymentMethod
              id="card" iconLib={MaterialIcons} icon="credit-card"
              title={t('creditDebitCard')}
            />
            <PaymentMethod
              id="cash" iconLib={MaterialIcons} icon="payments"
              title={t('cashAtLocation')} sub={t('payOnArrival')}
            />
            <PaymentMethod
              id="upi" iconLib={Ionicons} icon="wallet"
              title={t('upiWallet')} sub={t('upiDesc')}
            />

            {/* CREDIT CARD INPUTS */}
            {method === "card" && (
              <View style={styles.cardForm}>
                <Text style={[styles.inputLabel, { color: textGray }]}>{t('cardNumber')}</Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor: "#333" }]}>
                  <Ionicons name="card-outline" size={20} color={accent} style={{ marginRight: 10 }} />
                  <TextInput
                    style={[styles.input, { color: textWhite }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    maxLength={19}
                  />
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.inputLabel, { color: textGray }]}>{t('expiry')}</Text>
                    <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor: "#333" }]}>
                      <TextInput
                        style={[styles.input, { color: textWhite }]}
                        placeholder="MM/YY"
                        placeholderTextColor="#555"
                        value={expiry}
                        onChangeText={setExpiry}
                        maxLength={5}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.inputLabel, { color: textGray }]}>{t('cvv')}</Text>
                    <View style={[styles.inputContainer, { backgroundColor: inputBg, borderColor: "#333" }]}>
                      <TextInput
                        style={[styles.input, { color: textWhite }]}
                        placeholder="123"
                        placeholderTextColor="#555"
                        keyboardType="numeric"
                        value={cvv}
                        onChangeText={setCvv}
                        maxLength={3}
                        secureTextEntry
                      />
                      <MaterialIcons name="lock-outline" size={18} color="#555" style={{ marginLeft: "auto" }} />
                    </View>
                  </View>
                </View>

                <View style={styles.secureBadge}>
                  <MaterialIcons name="verified-user" size={14} color={accent} />
                  <Text style={{ color: textGray, fontSize: 12 }}>Payments are secure and encrypted</Text>
                </View>
              </View>
            )}

          </Animated.View>
        </ScrollView>

        {/* FOOTER ACTIONS */}
        <View style={[styles.footer, { backgroundColor: bgDark }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.payBtn, { backgroundColor: accent }]}
            onPress={handlePayment}
          >
            <Text style={styles.payText}>{t('payReserve')}</Text>
            <View style={styles.shine} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>{t('cancelBooking')}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 15,
    marginBottom: 10
  },
  headerTitle: { fontSize: 28, fontWeight: "800", marginLeft: 15, letterSpacing: 0.5 },
  backBtn: {
    padding: 8, borderRadius: 12, backgroundColor: "#111", borderWidth: 1, borderColor: "#222"
  },

  summaryCard: {
    marginHorizontal: 20, padding: 25, borderRadius: 24,
    flexDirection: "row", justifyContent: "space-between", alignItems: 'center',
    borderWidth: 1,
    marginBottom: 30
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  summarySub: { fontSize: 14, fontWeight: "500" },
  priceTag: { padding: 10, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.3)" },
  priceText: { fontSize: 18, fontWeight: "800" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginLeft: 20, marginBottom: 15 },

  methodBox: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 20, marginBottom: 15,
    padding: 18, borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  iconBox: {
    width: 45, height: 45, borderRadius: 14, justifyContent: 'center', alignItems: 'center'
  },
  methodTitle: { fontSize: 16, fontWeight: "700" },
  methodSub: { fontSize: 12, marginTop: 2 },

  cardForm: { marginHorizontal: 20, marginTop: 10 },
  inputLabel: { fontSize: 14, marginBottom: 8, fontWeight: "600" },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1, marginBottom: 20
  },
  input: { flex: 1, fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row" },

  secureBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 10, marginBottom: 20, opacity: 0.7
  },

  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  payBtn: {
    height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#FFD400", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 15,
    elevation: 10,
    marginBottom: 15,
    overflow: 'hidden'
  },
  payText: { fontSize: 18, fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: 1 },
  // Simple Shine Effect (Static for now)
  shine: {
    position: 'absolute', top: -30, right: -20, width: 60, height: 100, backgroundColor: 'rgba(255,255,255,0.2)', transform: [{ rotate: '25deg' }]
  },

  cancelBtn: { alignItems: 'center', padding: 10 },
  cancelText: { color: "#666", fontWeight: "600", fontSize: 16 }
});
