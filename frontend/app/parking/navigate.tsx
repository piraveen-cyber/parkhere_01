import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function Navigate() {
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
        <Text style={styles.timeText}>15 min</Text>
        <Text style={styles.distanceText}>6.7 km – 1:42 PM</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.smallText}>600 meters</Text>

          {/* Graph icon */}
          <View style={styles.graphBtn}>
            <Ionicons name="git-branch" size={20} color="#FFD400" />
          </View>

          {/* EXIT BUTTON */}
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => router.push("../(tabs)/home")} // ✔ Go Home
          >
            <Text style={styles.exitText}>Exit</Text>
          </TouchableOpacity>
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
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 212, 0, 0.3)",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  navArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  timeText: {
    color: "#FFD400",
    fontSize: 22,
    fontWeight: "700",
  },

  distanceText: {
    color: "#69a0ff",
    marginTop: 4,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  smallText: {
    color: "#ddd",
    flex: 1,
    fontSize: 15,
  },

  graphBtn: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },

  exitBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },

  exitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  handle: {
    width: 90,
    height: 5,
    backgroundColor: "#444",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 18,
  },
});

/* ======================= DARK MAP STYLE ======================= */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "road",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "water",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "landscape",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi",
    stylers: [{ color: "#282828" }],
  },
];
