import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Animated, Easing, StatusBar } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

import { useTheme } from "../../context/themeContext";

export default function Navigate() {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);

  // Animation Values
  const slideAnim = useRef(new Animated.Value(300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Theme Colors
  const accent = colors.primary;

  const userLocation = { latitude: 6.9271, longitude: 79.8612 };
  const destination = { latitude: 6.9331, longitude: 79.8671 };

  const routePoints = [
    userLocation,
    { latitude: 6.9295, longitude: 79.8633 },
    { latitude: 6.9318, longitude: 79.8651 },
    destination,
  ];

  useEffect(() => {
    // 1. Initial Fit
    mapRef.current?.fitToCoordinates(routePoints, {
      edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
      animated: true,
    });

    // 2. Slide Up Bottom Card
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true
    }).start();

    // 3. Pulse User Marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();

  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* MAP VIEW */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={isDark ? darkMapStyle : []}
      >
        {/* Route Line (Glow Backing) */}
        <Polyline
          coordinates={routePoints}
          strokeColor="rgba(255, 212, 0, 0.3)"
          strokeWidth={12}
        />
        {/* Route Line (Main) */}
        <Polyline
          coordinates={routePoints}
          strokeColor={accent}
          strokeWidth={6}
        />

        {/* User Marker (Animated) */}
        <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseAnim }] }
              ]}
            />
            <View style={styles.userDot}>
              <Ionicons name="navigate" size={16} color="#000" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
          </View>
        </Marker>

        {/* Destination Marker */}
        <Marker coordinate={destination}>
          <View style={styles.destMarker}>
            <MaterialCommunityIcons name="flag-checkered" size={20} color="#000" />
          </View>
        </Marker>
      </MapView>

      {/* HEADER OVERLAY */}
      <View style={styles.headerOverlay}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <View style={styles.directionBox}>
          <FontAwesome5 name="arrow-up" size={20} color={accent} />
          <Text style={styles.directionText}>Turn right in 200m</Text>
        </View>
      </View>

      {/* BOTTOM NAV CARD */}
      <Animated.View
        style={[
          styles.bottomCard,
          { transform: [{ translateY: slideAnim }], backgroundColor: colors.card }
        ]}
      >
        <View style={styles.dragHandle} />

        <View style={styles.infoRow}>
          <View>
            <Text style={styles.timeValue}>15 {t('min')}</Text>
            <Text style={styles.distanceValue}>6.7 km • 1:42 PM arrival</Text>
          </View>
          <View style={styles.btnRow}>
            {/* Expand / Graph Button */}
            <Pressable style={styles.iconBtn}>
              <Ionicons name="layers-outline" size={24} color={accent} />
            </Pressable>

            {/* Exit Button */}
            <Pressable
              style={({ pressed }) => [
                styles.exitBtn,
                pressed && { transform: [{ scale: 0.95 }] }
              ]}
              onPress={() => router.push("../(tabs)/home")}
            >
              <Ionicons name="close-circle" size={20} color="#FFF" />
              <Text style={styles.exitText}>{t('exit')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>

      </Animated.View>
    </View >
  );
}

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  markerContainer: { alignItems: 'center', justifyContent: 'center', width: 80, height: 80 },
  pulseRing: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "rgba(255, 212, 0, 0.3)",
    borderWidth: 1, borderColor: "rgba(255, 212, 0, 0.5)"
  },
  userDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#FFD400",
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#FFD400", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 10
  },

  destMarker: {
    backgroundColor: "#FFD400", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "#FFF"
  },

  headerOverlay: {
    position: 'absolute', top: 50, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 15
  },
  backBtn: {
    width: 45, height: 45, borderRadius: 25, backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: 'center', alignItems: 'center'
  },
  directionBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 15,
    backgroundColor: "#111", padding: 15, borderRadius: 15,
    borderWidth: 1, borderColor: "rgba(255, 212, 0, 0.5)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5
  },
  directionText: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  bottomCard: {
    position: "absolute", bottom: 0, width: width,
    // backgroundColor: "#111", // Deep Dark (handled dynamically or via inline style if needed, checking below)
    padding: 25,
    borderTopLeftRadius: 35, borderTopRightRadius: 35,
    shadowColor: "#000", shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 20,
    borderTopWidth: 1, borderTopColor: "rgba(255, 212, 0, 0.3)"
  },

  dragHandle: {
    width: 50, height: 5, borderRadius: 3, backgroundColor: "#333", alignSelf: 'center', marginBottom: 20
  },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  timeValue: { color: "#FFD400", fontSize: 28, fontWeight: "800", letterSpacing: 0.5 },
  distanceValue: { color: "#AAA", fontSize: 14, fontWeight: "600", marginTop: 4 },

  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: "#222",
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: "#333"
  },

  exitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: "#FF3B30", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25,
    shadowColor: "#FF3B30", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8
  },
  exitText: { color: "#FFF", fontSize: 16, fontWeight: "700", textTransform: 'uppercase' },

  progressBarBg: { height: 6, backgroundColor: "#333", borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', width: '30%', backgroundColor: "#FFD400" }
});

/* ======================= DARK MAP STYLE ======================= */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#000000" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#777777" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFD400" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#555555" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#111111" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1A1A1A" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1A1A1A" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#222222" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#050505" }],
  }
];
