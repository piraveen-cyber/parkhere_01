import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Modal
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../context/themeContext";
import { useTranslation } from "react-i18next";
import { Ionicons, Feather } from "@expo/vector-icons";

import { supabase } from "../config/supabaseClient";
import { updateUserProfile } from "../services/userService";
import CustomButton from "../components/CustomButton";

export default function Detail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";
  const THEME = colors;

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Display only if fetched
  const [gender, setGender] = useState("");
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true })
    ]).start();

    // Auto-fetch basic info if available (e.g. phone)
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.phone) setPhone(session.user.phone);
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      alert(t("enterName"));
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        alert(t("loginRequired"));
        return;
      }

      const userProfile = {
        supabaseId: session.user.id,
        name,
        email,
        gender,
        vehiclePlate: plate,
        phone: session.user.phone,
      };

      await updateUserProfile(userProfile);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon, label, placeholder, value, onChange, optional = false }: any) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: THEME.text }]}>
        {label} {optional && <Text style={{ color: THEME.subText, fontSize: 12 }}>({t("optional")})</Text>}
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: THEME.card, borderColor: THEME.border }]}>
        <Ionicons name={icon} size={20} color={THEME.subText} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { color: THEME.text }]}
          placeholder={placeholder}
          placeholderTextColor={THEME.subText}
          value={value}
          onChangeText={onChange}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: THEME.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(255, 212, 0, 0.1)" }]}>
                <Ionicons name="person" size={32} color={THEME.primary} />
              </View>
              <Text style={[styles.title, { color: THEME.text }]}>{t("welcomeTitle")}</Text>
              <Text style={[styles.subtitle, { color: THEME.subText }]}>{t("setupProfile")}</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <InputField
                icon="person-outline"
                label={t("name")}
                placeholder="Ex. John Doe"
                value={name}
                onChange={setName}
              />

              <InputField
                icon="mail-outline"
                label={t("emailLabel")}
                placeholder="Ex. john@example.com"
                value={email}
                onChange={setEmail}
                optional
              />

              <InputField
                icon="male-female-outline"
                label={t("gender")}
                placeholder={t("selectGender")}
                value={gender}
                onChange={setGender}
                optional
              />

              <View style={styles.divider}>
                <View style={[styles.line, { backgroundColor: THEME.border }]} />
                <Text style={[styles.dividerText, { color: THEME.subText, backgroundColor: THEME.background }]}>{t("vehicleDetails")}</Text>
              </View>

              <InputField
                icon="car-sport-outline"
                label={t("vehiclePlate")}
                placeholder="Ex. ABC-1234"
                value={plate}
                onChange={setPlate}
              />
            </View>

            {/* Actions */}
            <View style={{ marginTop: 30 }}>
              <CustomButton
                title={t("saveContinue")}
                onPress={handleSave}
                loading={loading}
              />

              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => router.replace("/(tabs)/home")}
              >
                <Text style={[styles.skipText, { color: THEME.subText }]}>{t("skipNow")}</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20 },

  header: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16 },

  formContainer: { gap: 15 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 15
  },
  input: { flex: 1, fontSize: 16, height: '100%' },

  divider: { position: 'relative', marginTop: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center' },
  line: { position: 'absolute', width: '100%', height: 1 },
  dividerText: { paddingHorizontal: 10, fontSize: 14, fontWeight: "600" },

  skipBtn: { marginTop: 20, alignItems: 'center', padding: 10 },
  skipText: { fontSize: 15, fontWeight: "500" },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalContent: { borderRadius: 20, padding: 25, borderWidth: 1, gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1 },
  modalOptionText: { fontSize: 16, fontWeight: "500" }
});
