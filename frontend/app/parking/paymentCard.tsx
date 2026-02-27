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
  LayoutChangeEvent,
  Keyboard
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

import { useTheme } from "../../context/themeContext";
import * as bookingService from "../../services/bookingService";
import { supabase } from "../../config/supabaseClient";

// --- CUSTOM TOAST COMPONENT ---
const Toast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 20, friction: 6, useNativeDriver: true })
      ]).start();

      const timer = setTimeout(() => {
        hide();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true })
    ]).start(() => {
      if (visible) onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.toastContent}>
        <Ionicons name="warning" size={20} color="#FF4444" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

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
  const [loading, setLoading] = useState(false);

  // Validation & Error State
  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldY = useRef<{ [key: string]: number }>({});
  const formY = useRef(0);

  const expiryInputRef = useRef<TextInput>(null);
  const cvvInputRef = useRef<TextInput>(null);

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const btnOpacity = useRef(new Animated.Value(0.4)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Theme Colors
  const bgDark = colors.background;
  const cardBg = colors.card;
  const accent = colors.primary;
  const textWhite = colors.text;
  const textGray = colors.subText;
  const inputBg = theme === 'dark' ? "#1A1A1A" : "#E5E5EA";

  // Check Card Validity for Button Animation
  const isCardValid = method === "card"
    ? (cardNumber.replace(/\s/g, '').length >= 16 && expiry.length === 5 && cvv.length >= 3)
    : true; // Always valid for cash/upi for now

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
  }, []);

  // Button Glow Effect
  useEffect(() => {
    if (isCardValid) {
      Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ])
      ).start();
    } else {
      Animated.timing(btnOpacity, { toValue: 0.4, duration: 300, useNativeDriver: true }).start();
      glowAnim.setValue(0);
    }
  }, [isCardValid]);

  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const glowShadow = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  // Helpers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const validateForm = () => {
    if (method !== "card") return true;

    let isValid = true;
    let newErrors = { cardNumber: "", expiry: "", cvv: "" };
    let firstErrorField = null;

    // Card Number
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (!cleanNum) {
      newErrors.cardNumber = t('fillField', 'Card number is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = "cardNumber";
    } else if (!/^\d{16,19}$/.test(cleanNum)) {
      newErrors.cardNumber = t('invalidCard', 'Invalid card number');
      isValid = false;
      if (!firstErrorField) firstErrorField = "cardNumber";
    }

    // Expiry
    if (!expiry) {
      newErrors.expiry = t('fillField', 'Expiry is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = "expiry";
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      newErrors.expiry = t('invalidDate', 'Format: MM/YY');
      isValid = false;
      if (!firstErrorField) firstErrorField = "expiry";
    }

    // CVV
    if (!cvv) {
      newErrors.cvv = t('fillField', 'CVV is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = "cvv";
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = t('invalidCVV', '3 or 4 digits');
      isValid = false;
      if (!firstErrorField) firstErrorField = "cvv";
    }

    setErrors(newErrors);

    // Auto-Scroll
    if (firstErrorField && scrollViewRef.current) {
      const fieldPosition = fieldY.current[firstErrorField] || 0;
      // We need to account for the cardForm offset if formY is tracked there
      // Assuming formY is the top of the cardForm
      const totalY = formY.current + fieldPosition;
      scrollViewRef.current.scrollTo({ y: totalY - 20, animated: true });
    }

    return isValid;
  };

  const handlePayment = () => {
    if (!validateForm()) return;

    setLoading(true);
    const bookingParams = {
      totalPrice,
      duration,
      checkInTime,
      slot,
      parkingName
    };

    if (method === "card") {
      // Simulate API call then nav
      setTimeout(() => {
        setLoading(false);
        router.push({
          pathname: "../parking/paymentOTP",
          params: bookingParams
        });
      }, 500);
    } else {
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
          console.log("Booking creation failed", e);
        }

        router.push({
          pathname: "../parking/successBook",
          params: bookingParams
        });
      };
      createAndNav();
    }
  };

  // Input Updaters with Validation
  const updateCardNumber = (text: string) => {
    // Only numbers
    if (/[^0-9\s]/.test(text)) {
      showToast("Only numbers allowed!");
      return;
    }
    // Auto format 0000 0000 0000 0000
    let formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (formatted.length > 19) formatted = formatted.substring(0, 19); // Max 16 digits + 3 spaces

    setCardNumber(formatted);
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: "" });
  }

  const updateExpiry = (text: string) => {
    if (/[^0-9\/]/.test(text)) {
      showToast("Only numbers allowed!");
      return;
    }
    // Simple logic for MM/YY slash insertion
    let formatted = text;
    if (text.length === 2 && !text.includes('/')) {
      formatted = text + '/';
    } else if (text.length === 2 && text.includes('/')) {
      // Backspacing
      formatted = text.substring(0, 1);
    }
    setExpiry(formatted);
    if (errors.expiry) setErrors({ ...errors, expiry: "" });
  }

  const updateCvv = (text: string) => {
    if (/[^0-9]/.test(text)) {
      showToast("Only numbers allowed!");
      return;
    }
    setCvv(text);
    if (errors.cvv) setErrors({ ...errors, cvv: "" });
  }

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

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
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
              <View
                style={styles.cardForm}
                onLayout={(e) => formY.current = e.nativeEvent.layout.y}
              >
                {/* 1. Card Number */}
                <View onLayout={(e: LayoutChangeEvent) => fieldY.current["cardNumber"] = e.nativeEvent.layout.y}>
                  <Text style={[styles.inputLabel, { color: textGray }]}>{t('cardNumber')}</Text>
                  <View style={[
                    styles.inputContainer,
                    { backgroundColor: inputBg, borderColor: errors.cardNumber ? "#FF4444" : "#333" }
                  ]}>
                    <Ionicons name="card-outline" size={20} color={errors.cardNumber ? "#FF4444" : accent} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: textWhite }]}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor="#555"
                      keyboardType="numeric"
                      value={cardNumber}
                      onChangeText={updateCardNumber}
                      maxLength={19}
                      returnKeyType="next"
                      onSubmitEditing={() => expiryInputRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                  {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}
                </View>

                <View style={styles.row}>
                  {/* 2. Expiry */}
                  <View style={{ flex: 1, marginRight: 10 }} onLayout={(e: LayoutChangeEvent) => fieldY.current["expiry"] = e.nativeEvent.layout.y}>
                    <Text style={[styles.inputLabel, { color: textGray }]}>{t('expiry')}</Text>
                    <View style={[
                      styles.inputContainer,
                      { backgroundColor: inputBg, borderColor: errors.expiry ? "#FF4444" : "#333" }
                    ]}>
                      <TextInput
                        ref={expiryInputRef}
                        style={[styles.input, { color: textWhite }]}
                        placeholder="MM/YY"
                        placeholderTextColor="#555"
                        value={expiry}
                        onChangeText={updateExpiry}
                        maxLength={5}
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => cvvInputRef.current?.focus()}
                        blurOnSubmit={false}
                      />
                    </View>
                    {errors.expiry ? <Text style={styles.errorText}>{errors.expiry}</Text> : null}
                  </View>

                  {/* 3. CVV */}
                  <View style={{ flex: 1, marginLeft: 10 }} onLayout={(e: LayoutChangeEvent) => fieldY.current["cvv"] = e.nativeEvent.layout.y}>
                    <Text style={[styles.inputLabel, { color: textGray }]}>{t('cvv')}</Text>
                    <View style={[
                      styles.inputContainer,
                      { backgroundColor: inputBg, borderColor: errors.cvv ? "#FF4444" : "#333" }
                    ]}>
                      <TextInput
                        ref={cvvInputRef}
                        style={[styles.input, { color: textWhite }]}
                        placeholder="123"
                        placeholderTextColor="#555"
                        keyboardType="numeric"
                        value={cvv}
                        onChangeText={updateCvv}
                        maxLength={4}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                      <MaterialIcons name="lock-outline" size={18} color="#555" style={{ marginLeft: "auto" }} />
                    </View>
                    {errors.cvv ? <Text style={styles.errorText}>{errors.cvv}</Text> : null}
                  </View>
                </View>

                <View style={styles.secureBadge}>
                  <MaterialIcons name="verified-user" size={14} color={accent} />
                  <Text style={{ color: textGray, fontSize: 12 }}>{t("securePaymentMsg")}</Text>
                </View>
              </View>
            )}

          </Animated.View>
        </ScrollView>

        {/* CUSTOM TOAST */}
        <Toast
          message={toastMessage}
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />

        {/* FOOTER ACTIONS */}
        <View style={[styles.footer, { backgroundColor: bgDark }]}>
          <Animated.View style={{
            width: '100%',
            opacity: btnOpacity,
            transform: [{ scale: glowScale }],
            shadowColor: "#FFD400",
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 10,
            shadowOpacity: glowShadow,
          }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.payBtn, { backgroundColor: accent }]}
              onPress={handlePayment}
              disabled={method === "card" && !isCardValid}
            >
              <Text style={styles.payText}>{loading ? "Processing..." : t('payReserve')}</Text>
              <View style={styles.shine} />
            </TouchableOpacity>
          </Animated.View>

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
    borderWidth: 1, marginBottom: 5
  },
  input: { flex: 1, fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", marginBottom: 15 },
  errorText: { color: "#FF4444", fontSize: 12, marginBottom: 10, marginTop: -2, marginLeft: 4 },

  secureBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 10, marginBottom: 20, opacity: 0.7
  },

  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  payBtn: {
    height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
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
  cancelText: { color: "#666", fontWeight: "600", fontSize: 16 },

  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  }
});
