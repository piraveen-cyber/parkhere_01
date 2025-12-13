import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Platform
} from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

import { useTheme } from "../../context/themeContext";

// Time Picker Constants
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function SetTime() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Dynamic Time Init - Lock on mount
  const [checkIn] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const [duration, setDuration] = useState(6);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Constants
  const params = useLocalSearchParams();
  const selectedSlot = params.slot?.toString() || "B20";
  const parkingName = params.parkingName?.toString() || "Unknown Parking";
  const pricePerHour = params.price ? parseFloat(params.price.toString()) : 200;

  const servicesTotal = selectedServices.reduce((sum, serviceName) => {
    let fee = 0;
    if (serviceName === t('evCharging')) fee = 50;
    if (serviceName === t('carWash')) fee = 100;
    if (serviceName === t('mechanicCheck')) fee = 150;
    return sum + fee;
  }, 0);

  const calculatedPrice = ((duration * pricePerHour) + servicesTotal).toFixed(2);

  // Theme Colors
  const bgDark = colors.background;
  const cardBg = colors.card;
  const accent = colors.primary;
  const textWhite = colors.text;
  const textGray = colors.subText;

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

  const toggleService = (name: string) => {
    if (selectedServices.includes(name)) {
      setSelectedServices(selectedServices.filter(s => s !== name));
    } else {
      setSelectedServices([...selectedServices, name]);
    }
  };

  const ServiceCard = ({ name, price, icon, iconLib: IconLib }: any) => {
    const isSelected = selectedServices.includes(name);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleService(name)}
        style={[
          styles.serviceCard,
          { backgroundColor: isSelected ? "rgba(255, 212, 0, 0.15)" : cardBg, borderColor: isSelected ? accent : "transparent", borderWidth: 1 }
        ]}
      >
        <View style={[styles.serviceIcon, { backgroundColor: isSelected ? accent : "#2A3B55" }]}>
          <IconLib name={icon} size={24} color={isSelected ? "#000" : textGray} />
        </View>
        <Text style={[styles.serviceName, { color: isSelected ? accent : textWhite }]}>{name}</Text>
        <Text style={[styles.servicePrice, { color: textGray }]}>+ LKR {price}</Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={16} color={accent} />
          </View>
        )}
      </TouchableOpacity>
    )
  };

  // Generate hours 1-24
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);

  const renderTimeItem = ({ item, index }: { item: number; index: number }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 0.85, 1.2, 0.85, 0.7],
      extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 0.5, 1, 0.5, 0.3],
      extrapolate: 'clamp'
    });

    return (
      <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Text style={[styles.timePickerText, { color: accent, transform: [{ scale }], opacity }]}>
          {item}
          <Text style={{ fontSize: 14 }}> {t("hrs")}</Text>
        </Animated.Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgDark }]}>
      <StatusBar barStyle={bgDark === "#0D1B2A" ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={textWhite} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textWhite }]} numberOfLines={1} adjustsFontSizeToFit>{t('parkingDetails')}</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* PARKING INFO CARD */}
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.parkName, { color: textWhite }]} numberOfLines={1} adjustsFontSizeToFit>{parkingName}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={accent} />
                    <Text style={[styles.ratingText, { color: textGray }]}>4.8 (120 Reviews)</Text>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceText, { color: accent }]}>LKR {pricePerHour}</Text>
                  <Text style={[styles.perHour, { color: textGray }]}>{t("perHr")}</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: "#2A3B55" }]} />
              <View style={styles.featuresRow}>
                <View style={styles.featureItem}>
                  <Ionicons name="videocam" size={16} color={accent} />
                  <Text style={[styles.featureText, { color: textGray }]}>CCTV</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="security" size={16} color={accent} />
                  <Text style={[styles.featureText, { color: textGray }]}>Security</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="garage" size={16} color={accent} />
                  <Text style={[styles.featureText, { color: textGray }]}>Covered</Text>
                </View>
              </View>
            </View>

            {/* SLOT SELECTION BADGE */}
            <View style={styles.slotContainer}>
              <Text style={[styles.sectionLabel, { color: textGray }]} numberOfLines={1} adjustsFontSizeToFit>{t("selectedSlot")}</Text>
              <View style={[styles.slotBadge, { borderColor: accent }]}>
                <View style={styles.pulseDot} />
                <Text style={[styles.slotText, { color: textWhite }]}>{selectedSlot}</Text>
              </View>
            </View>

            {/* TIME & DURATION */}
            <View style={[styles.sectionContainer, { backgroundColor: cardBg }]}>
              <Text style={[styles.sectionHeader, { color: textWhite }]} numberOfLines={1} adjustsFontSizeToFit>{t('selectTime')}</Text>

              {/* Check In Time */}
              <View style={styles.timeRow}>
                <View style={styles.timeLabelRow}>
                  <Ionicons name="time-outline" size={20} color={accent} />
                  <Text style={[styles.timeLabel, { color: textGray }]} numberOfLines={1} adjustsFontSizeToFit>{t('checkInTime')}</Text>
                </View>
                <TouchableOpacity style={[styles.timePickerBtn, { borderColor: "#2A3B55" }]}>
                  <Text style={[styles.timeValue, { color: textWhite }]}>{checkIn}</Text>
                  <MaterialIcons name="edit" size={16} color={accent} />
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: "#2A3B55" }]} />

              {/* SCROLLING DURATION PICKER */}
              <View style={styles.durationPickerContainer}>
                <Text style={[styles.timeLabel, { color: textGray, alignSelf: 'flex-start', marginBottom: 10 }]} numberOfLines={1} adjustsFontSizeToFit>{t('estimateDuration')}</Text>

                <View style={{ height: PICKER_HEIGHT, width: '100%', alignItems: 'center' }}>
                  {/* Selection Highlight */}
                  <View
                    pointerEvents="none"
                    style={[
                      styles.pickerSelection,
                      { borderColor: accent, top: ITEM_HEIGHT, height: ITEM_HEIGHT }
                    ]}
                  />

                  <Animated.ScrollView
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingVertical: ITEM_HEIGHT // Center the first and last item
                    }}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                      { useNativeDriver: true }
                    )}
                    onMomentumScrollEnd={(event) => {
                      const offsetY = event.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / ITEM_HEIGHT);
                      const safeIndex = Math.max(0, Math.min(index, hours.length - 1));
                      setDuration(hours[safeIndex]);
                    }}
                    onScrollEndDrag={(event) => {
                      const offsetY = event.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / ITEM_HEIGHT);
                      const safeIndex = Math.max(0, Math.min(index, hours.length - 1));
                      setDuration(hours[safeIndex]);
                    }}
                    nestedScrollEnabled={true}
                  >
                    {hours.map((item, index) => (
                      <View key={item} onLayout={() => { }}>
                        {renderTimeItem({ item, index })}
                      </View>
                    ))}
                  </Animated.ScrollView>
                </View>
              </View>

              <View style={styles.totalRow}>
                <Text style={{ color: textGray }}>{t("estimatedCost")}</Text>
                <Text style={[styles.totalPrice, { color: accent }]}>LKR {calculatedPrice}</Text>
              </View>
            </View>

            {/* SERVICES */}
            <View style={styles.servicesSection}>
              <Text style={[styles.sectionHeader, { color: textWhite, marginBottom: 15 }]} numberOfLines={1} adjustsFontSizeToFit>{t('addServices')}</Text>
              <View style={styles.servicesGrid}>
                <ServiceCard
                  name={t('evCharging')}
                  price={50}
                  icon="flash"
                  iconLib={Ionicons}
                />
                <ServiceCard
                  name={t('carWash')}
                  price={100}
                  icon="water"
                  iconLib={Ionicons}
                />
                <ServiceCard
                  name={t('mechanicCheck')}
                  price={150}
                  icon="car-wrench"
                  iconLib={MaterialCommunityIcons}
                />
              </View>
            </View>

          </Animated.View>
        </ScrollView>

        {/* CONTINUE BUTTON */}
        <Animated.View style={[styles.footer, { backgroundColor: bgDark, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.continueBtn, { backgroundColor: accent }]}
            onPress={() => router.push({
              pathname: "../parking/paymentCard",
              params: {
                totalPrice: calculatedPrice,
                duration: duration,
                checkInTime: checkIn,
                slot: selectedSlot,
                parkingName: parkingName
              }
            })}
          >
            <Text style={styles.continueText} numberOfLines={1} adjustsFontSizeToFit>{t('continueToPayment')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#1B263B",
    alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  card: {
    marginHorizontal: 20, marginTop: 10, padding: 20, borderRadius: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  parkName: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: { fontSize: 13 },
  priceContainer: { alignItems: 'flex-end' },
  priceText: { fontSize: 20, fontWeight: "800" },
  perHour: { fontSize: 12 },

  divider: { height: 1, marginVertical: 15 },

  featuresRow: { flexDirection: 'row', justifyContent: 'space-between' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 10 },
  featureText: { fontSize: 12, fontWeight: "600" },

  slotContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20, marginVertical: 25
  },
  sectionLabel: { fontSize: 16, fontWeight: "600" },
  slotBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, borderWidth: 1,
    backgroundColor: "rgba(255, 212, 0, 0.1)",
    shadowColor: "#FFD400", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFD400" },
  slotText: { fontSize: 16, fontWeight: "800", letterSpacing: 1 },

  sectionContainer: { marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: "700", marginBottom: 15 },

  timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  timeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeLabel: { fontSize: 15, fontWeight: "600" },
  timePickerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, backgroundColor: "rgba(255,255,255,0.05)"
  },
  timeValue: { fontSize: 16, fontWeight: "700" },

  durationPickerContainer: { alignItems: 'center' },
  pickerSelection: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    backgroundColor: "rgba(255, 212, 0, 0.05)",
    zIndex: -1
  },
  timePickerText: {
    fontSize: 24, fontWeight: "700"
  },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  totalPrice: { fontSize: 20, fontWeight: "800" },

  servicesSection: { marginHorizontal: 20 },
  servicesGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  serviceCard: {
    flex: 1, padding: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    aspectRatio: 0.8
  },
  serviceIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  serviceName: { fontSize: 12, fontWeight: "700", textAlign: 'center', marginBottom: 4 },
  servicePrice: { fontSize: 10, fontWeight: "600" },
  checkIcon: { position: 'absolute', top: 8, right: 8 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20,
    borderTopLeftRadius: 30, borderTopRightRadius: 30
  },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 18, borderRadius: 30,
    shadowColor: "#FFD400", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10
  },
  continueText: { fontSize: 16, fontWeight: "800", color: "#000", letterSpacing: 1, textTransform: 'uppercase' }
});
