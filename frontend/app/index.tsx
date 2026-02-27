import { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../config/supabaseClient";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel Animation: Fade In + Scale Up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const redirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setTimeout(() => {
        if (session) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/language");
        }
      }, 2500);
    };

    redirect();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/splash-icon.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.brandText, { opacity: textAnim }]}>

      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818", // Dark Theme
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFD400",
    letterSpacing: 4,
    marginTop: 10,
  },
});
