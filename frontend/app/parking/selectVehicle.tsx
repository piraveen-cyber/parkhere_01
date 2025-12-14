import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/themeContext";

const { width, height } = Dimensions.get("window");

// PREMIUM DARK MAP STYLE
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] }, // Darker, cleaner
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
];

export default function SelectVehicle() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const params = useLocalSearchParams();

  // State
  const [selectedType, setSelectedType] = useState("car");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation for Sheet
  const sheetAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(sheetAnim, {
      toValue: 0,
      damping: 25,
      stiffness: 90,
      useNativeDriver: true
    }).start();
  }, []);

  const vehicles = [
    { id: "car", label: "Luxury Car", icon: require("../../assets/images/carpark.png") },
    { id: "bike", label: "Motorbike", icon: require("../../assets/images/bikepark.png") },
    { id: "tuk", label: "TukTuk", icon: require("../../assets/images/tukpark.png") },
    { id: "van", label: "Van / SUV", icon: require("../../assets/images/vanpark.png") },
    { id: "bus", label: "Bus", icon: require("../../assets/images/buspark.png") },
    { id: "truck", label: "Heavy Truck", icon: require("../../assets/images/buspark.png") },
  ];

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      const routeParams = { ...params, vehicleType: selectedType };
      if (params.nextRoute) {
        router.push({ pathname: params.nextRoute as any, params: routeParams });
      } else {
        router.push("../parking/parkMap");
      }
    } catch (e) {
      console.error("Error", e);
      router.push("../parking/parkMap");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND MAP */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 6.9271, longitude: 79.8612,
          latitudeDelta: 0.012, longitudeDelta: 0.012,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: 6.9271, longitude: 79.8612 }}>
          <View style={{
            backgroundColor: '#D4AF37', // Gold
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#FFF',
            elevation: 5
          }}>
            <Ionicons name="car" size={16} color="#000" />
          </View>
        </Marker>
      </MapView>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.shade}
      />

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* CLASSIC SHEET */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetAnim }] }]}>

          {/* Glass effect background */}
          <LinearGradient
            colors={isDark ? ['#1c1c1c', '#000000'] : ['#FFFFFF', '#F0F0F0']}
            style={styles.sheetGradient}
          >
            <View style={styles.handle} />

            <Text style={[styles.classicTitle, { color: isDark ? '#D4AF37' : '#B8860B' }]}>
              SELECT VEHICLE
            </Text>
            <Text style={[styles.classicSub, { color: colors.subText }]}>
              Choose your mode of transport
            </Text>

            <View style={{ height: 160, marginVertical: 10 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollList}
                snapToInterval={115} // Snap effect
                decelerationRate="fast"
              >
                {vehicles.map((v) => {
                  const isSel = selectedType === v.id;
                  const goldColor = '#D4AF37';

                  return (
                    <TouchableOpacity
                      key={v.id}
                      activeOpacity={0.9}
                      style={[
                        styles.card,
                        isSel ?
                          {
                            backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : '#FFF8E1',
                            borderColor: goldColor,
                            borderWidth: 2
                          }
                          :
                          {
                            backgroundColor: isDark ? '#252525' : '#FAFAFA',
                            borderColor: isDark ? '#333' : '#E0E0E0',
                            borderWidth: 1
                          }
                      ]}
                      onPress={() => setSelectedType(v.id)}
                    >
                      <View style={styles.iconBox}>
                        <Image source={v.icon} style={[styles.typeIcon, { opacity: isSel ? 1 : 0.7 }]} resizeMode="contain" />
                      </View>
                      <Text style={[styles.typeLabel, { color: isSel ? (isDark ? '#FFF' : '#333') : colors.subText }]}>
                        {v.label}
                      </Text>

                      {isSel && (
                        <View style={styles.goldBadge}>
                          <Ionicons name="checkmark" size={10} color="#000" />
                        </View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>

            {/* CONTINUE BUTTON */}
            <View style={[styles.footer, { borderTopColor: isDark ? '#333' : '#EEE' }]}>
              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: '#D4AF37', shadowColor: '#D4AF37' }]} // Classic Gold
                onPress={handleContinue}
                activeOpacity={0.9}
              >
                <Text style={styles.btnText}>{t("continue")}</Text>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height: height, position: 'absolute' },
  shade: { ...StyleSheet.absoluteFillObject },

  backBtn: {
    position: 'absolute', top: 50, left: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)"
  },

  sheetContainer: {
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    overflow: 'hidden',
    width: '100%',
    elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.5, shadowRadius: 20
  },
  sheetGradient: {
    paddingTop: 15,
    paddingBottom: 20
  },

  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#555', alignSelf: 'center', marginBottom: 20, opacity: 0.5 },

  classicTitle: {
    fontSize: 20, fontWeight: "800", marginLeft: 25,
    letterSpacing: 2, // Classic spacing
    textTransform: 'uppercase'
  },
  classicSub: {
    fontSize: 13, marginLeft: 25, marginBottom: 20,
    fontStyle: 'italic', opacity: 0.7
  },

  scrollList: {
    paddingHorizontal: 25, alignItems: 'center', gap: 15
  },
  card: {
    width: 100, height: 130,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    padding: 5,
  },

  iconBox: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  typeIcon: { width: 55, height: 40 },
  typeLabel: { fontSize: 11, marginBottom: 8, fontWeight: "600", textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' },

  goldBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center'
  },

  footer: {
    width: '100%',
    padding: 25, paddingBottom: 20, borderTopWidth: 1,
    marginTop: 10
  },
  mainBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    padding: 16, borderRadius: 12,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8
  },
  btnText: { fontSize: 16, fontWeight: "700", color: "#000", textTransform: 'uppercase', letterSpacing: 1.5 }
});
