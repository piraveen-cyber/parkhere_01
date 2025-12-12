import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from 'expo-linear-gradient'; // Optional, using View fallback if missing

import { useTheme } from "../../context/themeContext";

const { width, height } = Dimensions.get("window");

// PREMIUM DARK MAP STYLE
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];

export default function SelectVehicle() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const [selected, setSelected] = useState("car");

  // Animation for Floating Button
  const scaleValue = useRef(new Animated.Value(1)).current;

  const vehicles = [
    { id: "car", label: "Car", icon: require("../../assets/images/carpark.png") },
    { id: "bike", label: "Bike", icon: require("../../assets/images/bikepark.png") },
    { id: "bus", label: "Bus", icon: require("../../assets/images/buspark.png") },
    { id: "van", label: "Van", icon: require("../../assets/images/vanpark.png") },
    { id: "three", label: "Tuk", icon: require("../../assets/images/tukpark.png") },
  ];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    animateButton();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* FULL SCREEN MAP */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        toolbarEnabled={false}
        showsUserLocation={true}
      >
        {/* Simulated Nearby Parking Spots */}
        <Marker coordinate={{ latitude: 6.9271, longitude: 79.8612 }} >
          <View style={[styles.marker, { backgroundColor: "#39FF14" }]}>
            <Ionicons name="car-sport" size={14} color="#000" />
          </View>
        </Marker>
        <Marker coordinate={{ latitude: 6.9300, longitude: 79.8640 }} >
          <View style={[styles.marker, { backgroundColor: "#FF3B30" }]}>
            <Ionicons name="close" size={14} color="#FFF" />
          </View>
        </Marker>
        <Marker coordinate={{ latitude: 6.9250, longitude: 79.8580 }} >
          <View style={[styles.marker, { backgroundColor: "#FFD400" }]}>
            <Ionicons name="star" size={14} color="#000" />
          </View>
        </Marker>
      </MapView>

      {/* OVERLAY: VEHICLE SELECTOR */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
        <Text style={[styles.sheetTitle, { color: colors.text }]}>Select your vehicle</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {vehicles.map((item) => {
            const isSelected = selected === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected
                ]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, isSelected && { backgroundColor: "rgba(0,0,0,0.1)" }]}>
                  <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                </View>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>{item.label}</Text>

                {/* Selection Indicator Dot */}
                {isSelected && <View style={styles.selectedDot} />}
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* FLOATING ACTION BUTTON (INSIDE SHEET FOR LAYOUT) */}
        <Animated.View style={[styles.fabContainer, { transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => router.push("../parking/parkMap")}
          >
            <Text style={[styles.fabText, { color: colors.background === '#0D1B2A' ? '#000' : '#FFF' }]}>CONTINUE</Text>
            <Ionicons name="arrow-forward" size={24} color={colors.background === '#0D1B2A' ? '#000' : '#FFF'} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* TOP OVERLAY GRADIENT (Using View trick for shadow) */}
      <View style={styles.topOverlay} pointerEvents="none" />

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height: height + 50 }, // Oversize slightly to cover

  topOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(0,0,0,0.4)' // Simple darken
  },

  backBtn: {
    position: 'absolute', top: 50, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
  },

  bottomSheet: {
    position: 'absolute', bottom: 0, width: '100%',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingTop: 25, paddingBottom: 40,
    elevation: 20, shadowColor: "#000", shadowOffset: { height: -5, width: 0 }, shadowOpacity: 0.3, shadowRadius: 10
  },
  sheetTitle: {
    fontSize: 18, fontWeight: "700", marginLeft: 25, marginBottom: 15
  },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 20 },

  card: {
    width: 90, height: 110,
    backgroundColor: "#2A3B55",
    borderRadius: 18,
    marginRight: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: "transparent"
  },
  cardSelected: {
    backgroundColor: "#FFD400",
    borderColor: "#FFD400",
    elevation: 10, shadowColor: "#FFD400", shadowOpacity: 0.5, shadowRadius: 8
  },

  iconContainer: {
    width: 50, height: 50, marginBottom: 8, justifyContent: 'center', alignItems: 'center'
  },
  icon: { width: 45, height: 45 },

  label: { color: "#9FB5C2", fontSize: 13, fontWeight: "600" },
  labelSelected: { color: "#000", fontWeight: "800" },

  selectedDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#000"
  },

  marker: {
    width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: "#FFF"
  },

  fabContainer: { alignSelf: 'center', marginTop: 10 },
  fab: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: "#FFD400", paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 10, shadowColor: "#FFD400", shadowOpacity: 0.4, shadowRadius: 10
  },
  fabText: { fontWeight: "800", fontSize: 16, marginRight: 8, color: "#000", letterSpacing: 1 }
});
