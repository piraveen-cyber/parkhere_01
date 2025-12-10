import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function Navigate() {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const userLocation = { latitude: 6.9271, longitude: 79.8612 };
  const destination = { latitude: 6.9331, longitude: 79.8671 };

  const routePoints = [
    userLocation,
    { latitude: 6.9295, longitude: 79.8633 },
    { latitude: 6.9318, longitude: 79.8651 },
    destination,
  ];

  // Fit route to screen
  useEffect(() => {
    mapRef.current?.fitToCoordinates(routePoints, {
      edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* MAP */}
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
        customMapStyle={darkMapStyle}
      >
        {/* Route Yellow Line */}
        <Polyline
          coordinates={routePoints}
          strokeColor="#FFD400"
          strokeWidth={8}
        />

        {/* Navigation arrow with Yellow Glow */}
        <Marker coordinate={userLocation}>
          <View style={styles.glowCircle}>
            <View style={styles.navArrow} />
          </View>
        </Marker>
      </MapView>

      {/* BOTTOM NAV CARD */}
      <View style={styles.bottomCard}>
        <Text style={styles.timeText}>15 {t('min')}</Text>
        <Text style={styles.distanceText}>6.7 km – 1:42 PM</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.smallText}>600 {t('meters')}</Text>

          {/* Graph icon */}
          <View style={styles.graphBtn}>
            <Ionicons name="git-branch" size={20} color="#FFD400" />
          </View>

          {/* EXIT BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.exitBtn,
              pressed && {
                backgroundColor: "#FF5E55",
                shadowColor: "#FF3B30",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 20,
                elevation: 10,
              },
            ]}
            onPress={() => router.push("../(tabs)/home")}
          >
            <Text style={styles.exitText}>{t('exit')}</Text>
          </Pressable>
        </View>

        {/* Bottom drag indicator */}
        <View style={styles.handle} />
      </View>
    </View>
  );
}

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  glowCircle: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 212, 0, 0.2)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 212, 0, 0.1)",
  },

  navArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFD400", // Gold Arrow
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "rgba(20, 20, 20, 0.95)", // Glassy Dark
    padding: 25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  timeText: {
    color: "#FFD400",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  distanceText: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "500",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  smallText: {
    color: "#fff",
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },

  graphBtn: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 14,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#444",
  },

  exitBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  exitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#555",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 5,
  },
});

/* ======================= DARK MAP STYLE ======================= */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#121212" }] }, // Deepest Black/Grey
  { elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }], // Goldish Town Names
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f7276" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c2c2c" }], // Dark Roads
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c1c1c" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }], // Slightly lighter highways
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#252525" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }], // Pure Black Water
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];
