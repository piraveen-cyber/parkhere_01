import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, StatusBar, Animated, Easing, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themeContext";

const { width, height } = Dimensions.get("window");

// CINEMATIC DARK MAP STYLE
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0F172A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748B" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0F172A" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1E293B" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1E293B" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ visibility: "off" }] },
];

export default function ParkMapScanUpgraded() {
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // ANIMATIONS
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // PARTICLES
  // PARTICLES
  const particles = useRef(Array.from({ length: 6 }).map(() => ({
    anim: new Animated.Value(0),
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2000,
  }))).current;

  useEffect(() => {
    // 1. Radar Spin
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Pulse Impact
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();

    // 3. Progress Bar
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 3500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // width change
    }).start();

    // 4. Fade In UI
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 5. Particles
    particles.forEach(p => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.anim, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            delay: p.delay,
            useNativeDriver: true
          }),
          Animated.timing(p.anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ).start();
    });

    // Navigate
    const timer = setTimeout(() => {
      router.replace("/parking/selectParking");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const pulseScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5]
  });

  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0]
  });

  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. DARK MAP LAYER */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 6.9271, longitude: 79.8612,
          latitudeDelta: 0.015, longitudeDelta: 0.015,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {/* User Location */}
        <Marker coordinate={{ latitude: 6.9271, longitude: 79.8612 }}>
          <View style={styles.userMarker}>
            <View style={styles.userDot} />
          </View>
        </Marker>
      </MapView>

      {/* 2. GRADIENT OVERLAY (Cinematic Feel) */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.9)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* 3. SCANNER VISUALS */}
      <View style={styles.centerContainer} pointerEvents="none">

        {/* Particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: p.size, height: p.size, borderRadius: p.size / 2,
                top: '50%', left: '50%', // center origin
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.5, 0] }) }
                ],
                opacity: p.anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.8, 0] })
              }
            ]}
          />
        ))}

        {/* Pulse Wave */}
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />

        {/* Radar Sweep */}
        <Animated.View style={[styles.radarContainer, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={['rgba(255, 212, 0, 0.4)', 'transparent']}
            start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
            style={styles.radarSweep}
          />
        </Animated.View>

        {/* Center Target */}
        <View style={styles.targetReticle}>
          <Ionicons name="scan-outline" size={40} color="#FFD400" />
        </View>
      </View>

      {/* 4. TEXT UI */}
      <Animated.View style={[styles.bottomUI, { opacity: fadeAnim }]}>
        <Text style={styles.label}>AI SCANNING</Text>
        <Text style={styles.subLabel}>Finding the safest spots for you...</Text>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        {/* Decorative Tech Text */}
        <View style={styles.techRow}>
          <Text style={styles.techText}>GPS: LOCKED</Text>
          <Text style={styles.techText}>ZONES: 12</Text>
          <Text style={styles.techText}>CONN: SECURE</Text>
        </View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },

  userMarker: {
    width: 20, height: 20,
    backgroundColor: 'rgba(255, 212, 0, 0.3)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center'
  },
  userDot: {
    width: 8, height: 8, backgroundColor: '#FFD400', borderRadius: 4
  },

  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center'
  },

  pulseRing: {
    position: 'absolute',
    width: 100, height: 100,
    borderRadius: 50,
    borderWidth: 1, borderColor: '#FFD400',
  },

  radarContainer: {
    position: 'absolute',
    width: 300, height: 300,
    justifyContent: 'center', alignItems: 'center'
  },
  radarSweep: {
    width: 150, height: 150, // Quarter circle feeling
    position: 'absolute',
    top: 0, left: 150, // Top Right Quadrant origin
    borderBottomLeftRadius: 0,
    opacity: 0.3
  },

  targetReticle: {
    width: 80, height: 80,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255, 212, 0, 0.5)',
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },

  particle: {
    position: 'absolute', backgroundColor: '#FFD400'
  },

  bottomUI: {
    position: 'absolute', bottom: 60, width: '100%',
    alignItems: 'center', paddingHorizontal: 40
  },
  label: {
    color: '#FFD400', fontSize: 18, fontWeight: '800',
    letterSpacing: 4, marginBottom: 5
  },
  subLabel: {
    color: '#94A3B8', fontSize: 14, marginBottom: 25,
    fontWeight: '500'
  },

  progressTrack: {
    width: '100%', height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2, marginBottom: 20,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%', backgroundColor: '#FFD400'
  },

  techRow: {
    flexDirection: 'row', gap: 20, opacity: 0.5
  },
  techText: {
    color: '#FFF', fontSize: 10, fontFamily: 'monospace'
  }
});
