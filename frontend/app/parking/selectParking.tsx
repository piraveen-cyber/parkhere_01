import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/themeContext";

/* ----------------------------- CONFIG ----------------------------- */
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// REMOVED static THEME, moved to dynamic inside component

const CARD_WIDTH = Math.round(SCREEN_W * 0.85);
const CARD_SPACING = 18;

// Cinematic Dark Map Style
const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

/* --------------------------- DUMMY GENERATOR ----------------------- */
const genDummyParkings = () => {
  // realistic-ish Colombo area coords near 6.927
  const baseLat = 6.9271;
  const baseLng = 79.8612;
  const names = [
    "Golden Bay Parking",
    "Lotus Mega Park",
    "Luxury City Parking",
    "Liberty Plaza Basement",
    "Ocean View Park",
    "Harbor Plaza Lot",
    "Galle Road Deck",
    "Uptown Secure Park",
    "Seaside MultiStorey",
    "Metro Central Park",
    "Vista Park Garage",
    "Riverside Parking"
  ];

  return names.map((n, i) => {
    const randSlots = Math.floor(Math.random() * 40); // 0-39
    const randPrice = 80 + Math.floor(Math.random() * 300);
    const randDist = (0.4 + Math.random() * 3).toFixed(1) + " km";
    return {
      id: `p${i + 1}`,
      name: `${n}`,
      price: randPrice,
      slots: randSlots,
      distance: randDist,
      rating: (4 + Math.random() * 1).toFixed(1),
      latitude: baseLat + (Math.random() - 0.5) * 0.01,
      longitude: baseLng + (Math.random() - 0.5) * 0.01,
    };
  });
};

/* --------------------------- COMPONENT ----------------------------- */
export default function ParkingMapScreenUpgraded() {
  const mapRef = useRef<MapView>(null);
  const flatRef = useRef<FlatList>(null);

  const { t } = useTranslation();
  const { colors, theme } = useTheme();

  // Construct dynamic THEME object
  const THEME = useMemo(() => ({
    bg: colors.background,
    card: colors.card,
    cardSoft: theme === 'dark' ? "#1B263B" : "#F2F2F7", // specific tweak if needed, or just colors.card
    accent: colors.primary,
    text: colors.text,
    sub: colors.subText,
    danger: colors.error,
    success: colors.success
  }), [colors, theme]);

  // Create dynamic styles
  const styles = useMemo(() => createStyles(THEME), [THEME]);

  const [spots, setSpots] = useState<any[]>(() => genDummyParkings());
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [pendingFullIndex, setPendingFullIndex] = useState<number>(-1);

  // Animated values
  const scrollX = useRef(new Animated.Value(0)).current;
  const markerScaleMap = useRef<any>({}).current; // store Animated.Value per marker
  const markerGlowMap = useRef<any>({}).current;

  useEffect(() => {
    // ... (keep existing)
    spots.forEach(s => {
      if (!markerScaleMap[s.id]) markerScaleMap[s.id] = new Animated.Value(1);
      if (!markerGlowMap[s.id]) markerGlowMap[s.id] = new Animated.Value(0);
    });
  }, [spots]);

  // ... (keep existing)

  // Find next available spot logic
  const handleFindNext = () => {
    setWarningModalVisible(false);
    if (pendingFullIndex === -1) return;

    let nextIndex = -1;

    // Search forward
    for (let i = pendingFullIndex + 1; i < spots.length; i++) {
      if (spots[i].slots > 0) {
        nextIndex = i;
        break;
      }
    }

    // If not found forward, search from beginning
    if (nextIndex === -1) {
      for (let i = 0; i < pendingFullIndex; i++) {
        if (spots[i].slots > 0) {
          nextIndex = i;
          break;
        }
      }
    }

    if (nextIndex !== -1) {
      focusToIndex(nextIndex);
    } else {
      Alert.alert(t("sorry"), t("noParkingAvailable"));
    }
  };

  // Helper: animate marker (scale + glow) on selection
  const animateMarker = (id: string) => {
    // shrink others to 1
    Object.keys(markerScaleMap).forEach(key => {
      Animated.timing(markerScaleMap[key], {
        toValue: key === id ? 1.25 : 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
    // glow pulse for selected
    Object.keys(markerGlowMap).forEach(key => {
      Animated.timing(markerGlowMap[key], {
        toValue: key === id ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  // Called when card pressed or marker pressed
  const focusToIndex = async (index: number) => {
    if (index < 0 || index >= spots.length) return;
    setSelectedIndex(index);
    const spot = spots[index];
    // animate map to spot
    mapRef.current?.animateToRegion({
      latitude: spot.latitude,
      longitude: spot.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }, 600);
    // scroll flatlist
    flatRef.current?.scrollToOffset({ offset: index * (CARD_WIDTH + CARD_SPACING), animated: true });
    // animate marker highlight
    animateMarker(spot.id);
  };

  // on scroll sync
  const onMomentumScrollEnd = (ev: any) => {
    const x = ev.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    if (index !== selectedIndex) {
      focusToIndex(index);
    }
  };

  // marker press handles
  const onMarkerPress = (itemIndex: number) => {
    focusToIndex(itemIndex);
  };

  // card render with parallax
  const renderCard = ({ item, index }: any) => {
    // ... (keep animations)
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_SPACING),
      index * (CARD_WIDTH + CARD_SPACING),
      (index + 1) * (CARD_WIDTH + CARD_SPACING),
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.97],
      extrapolate: "clamp"
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [6, 0, 6],
      extrapolate: "clamp"
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp"
    });

    // slot color
    let slotColor = THEME.success;
    if (item.slots === 0) slotColor = THEME.danger;
    else if (item.slots <= 10) slotColor = "#FFA500";

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }, { translateY }],
            opacity,
            width: CARD_WIDTH
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2} adjustsFontSizeToFit>{item.name}</Text>
          <View style={styles.priceBox}>
            <Text style={styles.priceText}>LKR {item.price}</Text>
            <Text style={styles.priceSub}>/hr</Text>
          </View>
        </View>

        <View style={styles.cardStats}>
          <View style={[styles.stat, { borderColor: "rgba(255,255,255,0.04)" }]}>
            <Ionicons name="car-sport" size={16} color={slotColor} />
            <Text style={[styles.statText, { color: slotColor }]} numberOfLines={1} adjustsFontSizeToFit>{item.slots > 0 ? `${item.slots} ${t("slots")}` : t("full")}</Text>
          </View>

          <View style={[styles.stat, { borderColor: "rgba(255,255,255,0.04)" }]}>
            <Ionicons name="navigate" size={16} color={THEME.accent} />
            <Text style={styles.statText}>{item.distance}</Text>
          </View>

          <View style={[styles.stat, { borderColor: "rgba(255,255,255,0.04)" }]}>
            <Ionicons name="star" size={16} color={THEME.accent} />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.selectBtn}
          activeOpacity={0.85}
          onPress={() => {
            if (item.slots === 0) {
              setPendingFullIndex(index);
              setWarningModalVisible(true);
              return;
            }
            router.push({
              pathname: "/parking/selectSlot",
              params: { parkingName: item.name, price: item.price }
            });
          }}
        >
          <Text style={styles.selectBtnText} numberOfLines={1} adjustsFontSizeToFit>{t("selectParkingBtn")}</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ... (keep useEffect for first marker)

  // ... (keep loading check)

  return (
    <View style={styles.container}>
      {/* ... (Keep MapView and other UI) */}
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={theme === 'dark' ? DARK_MAP_STYLE : []}
        initialRegion={{
          latitude: spots[0].latitude,
          longitude: spots[0].longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        <Marker coordinate={{ latitude: spots[0].latitude, longitude: spots[0].longitude }}>
          <View style={[styles.userMarker, { backgroundColor: THEME.accent }]} />
        </Marker>

        {spots.map((s, i) => {
          const scaleVal = markerScaleMap[s.id] || new Animated.Value(1);
          const glowVal = markerGlowMap[s.id] || new Animated.Value(0);

          return (
            <Marker
              key={s.id}
              coordinate={{ latitude: s.latitude, longitude: s.longitude }}
              onPress={() => onMarkerPress(i)}
              tracksViewChanges={false}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.markerGlow,
                    {
                      borderColor: THEME.accent,
                      opacity: glowVal.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }),
                      transform: [{ scale: glowVal.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.6] }) }]
                    }
                  ]}
                />
                <Animated.View
                  style={[
                    styles.markerWrap,
                    {
                      transform: [{ scale: scaleVal }],
                      backgroundColor: selectedIndex === i ? THEME.accent : "#FFF",
                      borderColor: selectedIndex === i ? "#FFF" : "#222"
                    }
                  ]}
                >
                  <Ionicons name="car-sport" size={18} color={selectedIndex === i ? "#000" : THEME.accent} />
                </Animated.View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.pickerRoot} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setPickerOpen(p => !p)}
          activeOpacity={0.85}
        >
          <Ionicons name="list" size={20} color="#000" />
          <Text style={styles.pickerBtnText} numberOfLines={1} adjustsFontSizeToFit>{t("parkingsPicker")}</Text>
        </TouchableOpacity>

        {pickerOpen && (
          <Animated.View style={styles.pickerDropdown}>
            {spots.map((s, i) => (
              <TouchableOpacity
                key={s.id}
                style={styles.pickerItem}
                onPress={() => {
                  setPickerOpen(false);
                  focusToIndex(i);
                }}
              >
                <Text style={styles.pickerItemText}>{s.name}</Text>
                {selectedIndex === i && <Ionicons name="checkmark-circle" size={16} color={THEME.accent} />}
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>

      <View style={styles.carouselRoot} pointerEvents="box-none">
        {Platform.OS !== "web" ? (
          <BlurView intensity={50} tint="dark" style={styles.frostedBg} />
        ) : (
          <View style={[styles.frostedBg, { backgroundColor: "rgba(10,14,20,0.6)" }]} />
        )}

        <Animated.FlatList
          ref={flatRef}
          data={spots}
          keyExtractor={(i) => String(i.id)}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ paddingHorizontal: (SCREEN_W - CARD_WIDTH) / 2, paddingVertical: 10 }}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          renderItem={renderCard}
        />
      </View>

      <Modal
        visible={warningModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWarningModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: THEME.card, borderColor: THEME.accent }]}>
            <View style={[styles.warningIconBox, { backgroundColor: "rgba(255, 212, 0, 0.1)" }]}>
              <Ionicons name="information-circle" size={40} color={THEME.accent} />
            </View>
            <Text style={[styles.modalTitle, { color: THEME.text }]}>{t("parkingFullTitle")}</Text>
            <Text style={[styles.modalDesc, { color: THEME.sub }]}>{t("parkingFullMsg")}</Text>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: THEME.accent }]}
              onPress={handleFindNext}
            >
              <Text style={[styles.modalBtnText, { color: "#000" }]}>{t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

/* --------------------------- STYLES ------------------------------- */
/* --------------------------- STYLES ------------------------------- */
const createStyles = (THEME: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },

  // map markers
  userMarker: {
    width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "#fff",
    shadowColor: THEME.accent, shadowOpacity: 0.9, shadowRadius: 8, elevation: 6
  },
  markerGlow: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    backgroundColor: "transparent"
  },
  markerWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, elevation: 8,
    shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 8
  },

  // back button
  backBtn: {
    position: "absolute", left: 18, top: Platform.OS === "android" ? 40 : 50,
    width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 30
  },

  // picker
  pickerRoot: { position: "absolute", right: 18, top: Platform.OS === "android" ? 40 : 50, zIndex: 40, alignItems: "flex-end" },
  pickerBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: THEME.accent, gap: 8 },
  pickerBtnText: { fontWeight: "800", color: "#000", marginLeft: 6 },
  pickerDropdown: { marginTop: 10, backgroundColor: THEME.cardSoft, padding: 8, borderRadius: 12, minWidth: 220, elevation: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  pickerItem: { padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.03)" },
  pickerItemText: { color: "#fff", fontWeight: "600" },

  // carousel
  carouselRoot: {
    position: "absolute", bottom: 26, width: "100%", zIndex: 50, alignItems: "center", justifyContent: "center"
  },
  frostedBg: {
    position: "absolute", bottom: 0, width: SCREEN_W, height: 230, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden"
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    marginHorizontal: CARD_SPACING / 2,
    padding: 16,
    justifyContent: "space-between",
    elevation: 12, shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)"
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { color: THEME.text, fontWeight: "800", fontSize: 16, flex: 1, marginRight: 8, lineHeight: 22 }, // Added lineHeight
  priceBox: { alignItems: "flex-end" },
  priceText: { color: THEME.accent, fontWeight: "900", fontSize: 18, lineHeight: 24 },
  priceSub: { color: THEME.sub, fontSize: 12 },

  cardStats: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  stat: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 8, paddingVertical: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.02)" }, // Increased paddingVert
  statText: { color: THEME.text, fontWeight: "700", fontSize: 13, lineHeight: 18 }, // Added lineHeight

  selectBtn: { marginTop: 12, backgroundColor: THEME.accent, paddingVertical: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  selectBtnText: { color: "#000", fontWeight: "700" },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: "80%", borderRadius: 24, padding: 30, alignItems: 'center',
    borderWidth: 1, elevation: 20, shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 20
  },
  warningIconBox: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 10, textAlign: 'center' },
  modalDesc: { fontSize: 14, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14, width: "100%", alignItems: 'center' },
  modalBtnText: { color: "#FFF", fontWeight: "800", fontSize: 16 }
});
