import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import "../i18n/i18n"; // Ensure init
import { useTheme } from "../context/themeContext";

const { width } = Dimensions.get("window");

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goNext = (lang: string) => {
    i18n.changeLanguage(lang).catch(err => console.log("Lang change error:", err));
    AsyncStorage.setItem('user-language', lang).catch(err => console.log("Storage error:", err));
    router.push("/onboarding");
  };

  const LanguageButton = ({ lang, label, subLabel, delay }: any) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.langButton, { borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)' }]}
        activeOpacity={0.8}
        onPress={() => goNext(lang)}
      >
        <LinearGradient
          colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['#FFF', '#F9F9F9']}
          style={styles.langGradient}
        >
          <View style={[styles.langIcon, {
            backgroundColor: colors.primary + '1A',
            borderColor: colors.primary + '33'
          }]}>
            <Text style={[styles.langIconText, { color: colors.primary }]}>{label.charAt(0)}</Text>
          </View>
          <View style={styles.langInfo}>
            <Text style={[styles.langLabel, { color: colors.text }]}>{label}</Text>
            {subLabel && <Text style={[styles.langSub, { color: colors.subText }]}>{subLabel}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Background Gradient */}
      {isDark && (
        <LinearGradient
          colors={['#000000', '#141414', '#000000']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Decorative Circles */}
      <View style={[styles.circle, { top: -100, right: -100, backgroundColor: colors.primary + '15' }]} />
      <View style={[styles.circle, { bottom: -50, left: -50, backgroundColor: colors.primary + '0D', width: 200, height: 200 }]} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* Logo Section */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/iconblack.png")}
                style={styles.logo}
              />
              {/* Ring around logo */}
              <View style={[styles.logoRing, { borderColor: colors.primary }]} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{t("chooseLanguage")}</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>Select your preferred language to continue</Text>
          </Animated.View>

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            <LanguageButton lang="en" label="English" subLabel="Default" />
            <View style={{ height: 16 }} />
            <LanguageButton lang="ta" label="தமிழ்" subLabel="Tamil" />
            <View style={{ height: 16 }} />
            <LanguageButton lang="si" label="සිංහල" subLabel="Sinhala" />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  circle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
    zIndex: 2,
  },
  logoRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 2,
    opacity: 0.5,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: '80%',
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  langButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  langGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  langIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  langIconText: {
    fontSize: 20,
    fontWeight: "700",
  },
  langInfo: {
    flex: 1,
  },
  langLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  langSub: {
    fontSize: 12,
  },
});


