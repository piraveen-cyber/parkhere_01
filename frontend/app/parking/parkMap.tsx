// ParkMapScanUpgraded.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { router } from "expo-router";
import { useTheme } from "../../context/themeContext";

const { width } = Dimensions.get("window");

// dark cinematic map style (shortened, you can replace with your preferred)
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0b1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9fb5c2" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

export default function ParkMapScanUpgraded() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: 8 }).map(() => ({
      anim: new Animated.Value(0),
      x: Math.random() * (width * 0.6) - width * 0.3,
      yOffset: Math.random() * 30 + 10,
      delay: Math.random() * 2000,
    }))
  ).current;
  const progress = useRef(new Animated.Value(0)).current;

  const accent = colors.primary;
  const overlayBg = isDark ? "rgba(6,10,18,0.66)" : "rgba(255,255,255,0.66)";

  useEffect(() => {
    // Pulsing rings (multi-layer, staggered)
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse1, {
            toValue: 1,
            duration: 1600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse2, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse3, {
            toValue: 1,
            duration: 2400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulse1, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(pulse2, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(pulse3, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Rotating sweep line
    Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Text fade in
    Animated.timing(fadeText, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Particles animation
    particles.forEach(({ anim, delay }) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1600 + Math.random() * 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // progress bar (scaleX)
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Auto navigate after 3s
    const t = setTimeout(() => {
      // replace to next page
      router.replace("../parking/selectParking");
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  // Derived transforms & opacities
  const ringStyle = (anim: Animated.Value, startScale: number) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [startScale, startScale * 4.2],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0.85, 0.25, 0],
    }),
  });

  const sweepRotate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0001, 1], // avoid 0
  });

  // center coords (user)
  const center = { latitude: 6.9271, longitude: 79.8612 };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={isDark ? darkMapStyle : []}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
      >
        <Marker coordinate={center}>
          <View style={[styles.userDot, { backgroundColor: accent }]} />
        </Marker>
      </MapView>

      {/* cinematic overlay */}
      <View style={[styles.overlay, { backgroundColor: overlayBg }]}>
        {/* floating particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={`part-${i}`}
            style={[
              styles.particle,
              {
                left: width / 2 + p.x - 8,
                transform: [
                  {
                    translateY: p.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -p.yOffset],
                    }),
                  },
                  {
                    scale: p.anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.6, 1.05, 0.6],
                    }),
                  },
                ],
                opacity: p.anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.9, 0] }),
                backgroundColor: "rgba(255, 212, 0, 0.08)",
              },
            ]}
          />
        ))}

        {/* radar/center */}
        <View style={styles.centerWrap}>
          {/* multi-layer pulse rings */}
          <Animated.View style={[styles.pulseRingBase, ringStyle(pulse3, 0.8), { borderColor: accent }]} />
          <Animated.View style={[styles.pulseRingBase, ringStyle(pulse2, 0.9), { borderColor: accent }]} />
          <Animated.View style={[styles.pulseRingBase, ringStyle(pulse1, 1.0), { borderColor: accent }]} />

          {/* rotating sweep (semi-transparent wedge) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.sweep,
              {
                transform: [{ rotate: sweepRotate }],
              },
            ]}
          >
            <View style={[styles.sweepInner, { backgroundColor: "rgba(255,212,0,0.08)" }]} />
          </Animated.View>

          {/* center dot with glow */}
          <View style={[styles.centerDot, { backgroundColor: accent }]} />
        </View>

        {/* text */}
        <Animated.View style={[styles.textBox, { opacity: fadeText }]}>
          <Text style={[styles.title, { color: accent }]}>Scanning Nearby Parking...</Text>
          <Text style={styles.subtitle}>Finding safest & closest locations for you</Text>
        </Animated.View>

        {/* progress / loader - using scaleX (native driver friendly) */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  transform: [{ scaleX: progressScale }],
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },

  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#FFD400",
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  centerWrap: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  pulseRingBase: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#FFD400",
  },

  sweep: {
    position: "absolute",
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sweepInner: {
    position: "absolute",
    top: 0,
    width: 220,
    height: 60,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    opacity: 0.8,
    transform: [{ translateY: -10 }],
  },

  centerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 10,
    shadowColor: "#FFD400",
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },

  textBox: {
    alignItems: "center",
    marginTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  subtitle: {
    // color will be overridden or we can use dynamic text color here if we move style to inline or useTheme hook fully. 
    // Since this is inside a component, we can assume text color handling inline or keep neutral.
    // However, the original code had hardcoded color. Let's make it more flexible or keep as is if it looks good on both.
    // Ideally we should use colors.subText but styles are static. 
    // We will leave it for now and override in the component where possible or use a 'smart' gray.
    color: "#8D99AE",
    fontSize: 14,
    fontWeight: "600",
  },

  progressWrap: {
    position: "absolute",
    bottom: 90,
    width: width * 0.72,
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    transformOrigin: "left",
    // scaleX will be used
  },

  // floating particles
  particle: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,212,0,0.08)",
    elevation: 2,
  },
});
