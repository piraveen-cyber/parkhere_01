import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabaseClient";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

export default function PhoneAuth() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Partner Login State
  const [showPartnerLogin, setShowPartnerLogin] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState("");
  const [partnerPassword, setPartnerPassword] = useState("");
  const [partnerLoading, setPartnerLoading] = useState(false);

  // Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'parking' | 'mechanic' | 'garage'>('parking');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  // Clean number
  const cleanNumber = phoneNumber.replace(/\s+/g, "");
  const isValid = /^7\d{8}$/.test(cleanNumber);

  const handleSendOTP = async () => {
    if (!isValid) {
      Alert.alert(t("invalidPhoneTitle"), t("invalidPhoneMsg"));
      return;
    }

    setLoading(true);
    const fullPhoneNumber = `+94${cleanNumber}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: { channel: "sms" },
      });

      if (error) {
        Alert.alert(t("error"), error.message);
        setLoading(false);
        return;
      }

      Alert.alert(t("success"), t("otpSent"));
      router.push({ pathname: "/otp", params: { phone: fullPhoneNumber } });
    } catch (error) {
      Alert.alert(t("error"), t("otpError"));
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerLogin = () => {
    if (!partnerUsername || !partnerPassword) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setPartnerLoading(true);
    // MOCK CREDENTIAL CHECK / REGISTRATION
    setTimeout(() => {
      setPartnerLoading(false);

      // LOGIN - All roles go to Hub now
      if (partnerPassword === 'pass') {
        // Simulate loading user profile (mock)
        AsyncStorage.setItem('PARTNER_USERNAME', partnerUsername);
        // If admin_parking, set roles to parking
        let roles = ['parking', 'mechanic', 'garage']; // Default superuser for demo

        if (partnerUsername.includes('parking')) roles = ['parking'];
        if (partnerUsername.includes('mechanic')) roles = ['mechanic'];
        if (partnerUsername.includes('garage')) roles = ['garage'];

        AsyncStorage.setItem('PARTNER_ROLES', JSON.stringify(roles));

        setShowPartnerLogin(false);
        router.replace('/partner/hub' as any);
      } else {
        Alert.alert("Error", "Invalid Password");
      }
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {isDark && (
        <LinearGradient
          colors={['#000000', '#141414', '#000000']}
          style={StyleSheet.absoluteFill}
        />
      )}

      <Modal
        visible={showPartnerLogin}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPartnerLogin(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F1F1F' : '#FFF', borderColor: isDark ? '#333' : '#EEE' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Partner Login</Text>
              <TouchableOpacity onPress={() => setShowPartnerLogin(false)}>
                <Ionicons name="close" size={24} color={colors.subText} />
              </TouchableOpacity>
            </View>

            {/* LOGIN FORM ONLY */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>Username</Text>
              <TextInput
                style={[styles.partnerInput, { color: colors.text, borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                placeholder="e.g. admin_parking"
                placeholderTextColor={colors.subText}
                autoCapitalize="none"
                value={partnerUsername}
                onChangeText={setPartnerUsername}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.subText }]}>Password</Text>
              <TextInput
                style={[styles.partnerInput, { color: colors.text, borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                placeholder="••••••"
                placeholderTextColor={colors.subText}
                secureTextEntry
                value={partnerPassword}
                onChangeText={setPartnerPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.partnerLoginBtn, { backgroundColor: colors.primary }]}
              onPress={handlePartnerLogin}
              disabled={partnerLoading}
            >
              {partnerLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.partnerLoginText}>Login to Dashboard</Text>
              )}
            </TouchableOpacity>

            {/* LINK TO REGISTRATION WIZARD */}
            <TouchableOpacity
              style={{ marginTop: 15, alignSelf: 'center' }}
              onPress={() => {
                setShowPartnerLogin(false);
                router.push('/partner/register' as any);
              }}
            >
              <Text style={{ color: colors.subText }}>
                New Partner? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Register Here</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("login")}</Text>

          <View style={{ width: 44 }} />
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={[styles.title, { color: colors.primary }]}>{t("enterMobile")}</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>{t("otpMessage")}</Text>

            <Text style={[styles.label, { color: colors.text }]}>{t("phoneNumber")}</Text>

            <View style={[styles.phoneInputContainer, {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F9F9F9',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#EEE'
            }]}>
              <View style={styles.countryCodeContainer}>
                <Image
                  source={require("../assets/images/srilanka_flag.png")}
                  style={styles.flag}
                />
                <Text style={[styles.countryCode, { color: colors.text }]}>+94</Text>
                <Ionicons name="caret-down" size={12} color={colors.subText} style={{ marginLeft: 4 }} />
              </View>
              <View style={[styles.verticalDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#DDD' }]} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="7XXXXXXXX"
                placeholderTextColor={colors.subText}
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={setPhoneNumber}
                editable={!loading}
                selectionColor={colors.primary}
              />
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={[
                styles.mainButton,
                (!isValid || loading) && styles.disabledButton
              ]}
              activeOpacity={0.8}
              onPress={handleSendOTP}
              disabled={!isValid || loading}
            >
              <LinearGradient
                colors={isValid && !loading ? [colors.primary, '#D60000'] : [isDark ? '#333' : '#DDD', isDark ? '#333' : '#DDD']}
                style={styles.mainButtonGradient}
              >
                <Text style={[
                  styles.mainButtonText,
                  { color: '#FFF' },
                  (!isValid || loading) && { color: isDark ? '#666' : '#999' }
                ]}>
                  {loading ? "Sending..." : t("sendOtp")}
                </Text>
                {!loading && (
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={isValid ? "#FFF" : (isDark ? '#666' : '#999')}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.subText }]}>{t("termsAgree")} </Text>
              <Text style={[styles.linkText, { color: colors.primary }]}>{t("terms")}</Text>
              <Text style={[styles.termsText, { color: colors.subText }]}> & </Text>
              <Text style={[styles.linkText, { color: colors.primary }]}>{t("privacyPolicy")}</Text>
            </View>

            <TouchableOpacity
              style={styles.devButton}
              onPress={() =>
                router.push({ pathname: "/otp", params: { phone: "+94700000000" } })
              }
            >
              <Text style={[styles.devText, { color: colors.subText }]}>DEV: Skip to OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20, alignSelf: 'center', paddingBottom: 20 }}
              onPress={() => setShowPartnerLogin(true)}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 14 }}>Do you want to do business with us?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

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
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 30,
    zIndex: 999,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 60,
    paddingHorizontal: 16,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: '50%',
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  mainButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  mainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
  },
  linkText: {
    fontWeight: '600',
    fontSize: 13,
  },
  devButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
  },
  devText: {
    fontSize: 12,
    fontWeight: '600',
  },
  partnerSwitch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 25,
  },
  modalContent: {
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  partnerInput: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  partnerLoginBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  partnerLoginText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 5
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888'
  }
});
