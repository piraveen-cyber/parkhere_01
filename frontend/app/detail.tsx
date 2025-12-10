import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../context/themeContext";
import { useTranslation } from "react-i18next";

import { supabase } from "../config/supabaseClient";
import { updateUserProfile } from "../services/userService";
import CustomButton from "../components/CustomButton";

export default function Detail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  const bg = isDark ? "#0D1B2A" : "#FAFAFA";
  const textColor = isDark ? "#FFFFFF" : "#111";
  const descColor = isDark ? "#C7D1D9" : "#555";
  const inputBg = isDark ? "#1B263B" : "#FFFFFF";
  const borderColor = isDark ? "#415A77" : "#E2E2E2";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        alert(t("loginRequired") || "Login required");
        return;
      }

      const userProfile = {
        supabaseId: session.user.id,
        name,
        email,
        gender,
        vehiclePlate: plate,
        phone: session.user.phone, // Include phone from auth
      };

      await updateUserProfile(userProfile);

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Failed to save profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.container}>

        {/* Title */}
        <Text style={[styles.title, { color: textColor }]}>{t("welcomeTitle")}</Text>
        <Text style={[styles.subtitle, { color: descColor }]}>
          {t("setupProfile")}
        </Text>

        {/* Name */}
        <Text style={[styles.label, { color: textColor }]}>{t("name")}</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder={t("enterName")}
          placeholderTextColor={descColor}
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <Text style={[styles.label, { color: textColor }]}>
          {t("emailLabel")} <Text style={{ color: descColor }}>{t("optional")}</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder={t("enterEmail")}
          placeholderTextColor={descColor}
          value={email}
          onChangeText={setEmail}
        />

        {/* Gender */}
        <Text style={[styles.label, { color: textColor }]}>{t("gender")}</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder={t("selectGender")}
          placeholderTextColor={descColor}
          value={gender}
          onChangeText={setGender}
        />

        {/* Vehicle Details */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {t("vehicleDetails")}
        </Text>

        <Text style={[styles.label, { color: textColor }]}>
          {t("vehiclePlate")}
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBg, borderColor, color: textColor },
          ]}
          placeholder={t("enterPlate")}
          placeholderTextColor={descColor}
          value={plate}
          onChangeText={setPlate}
        />


        {/* Save Button */}
        <CustomButton
          title={t("saveContinue")}
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: 30 }}
        />

        {/* Skip */}
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Text style={[styles.skip, { color: descColor }]}>{t("skipNow")}</Text>
        </TouchableOpacity>

        {/* Bottom safe padding */}
        <View style={{ height: insets.bottom + 10 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 17,
    marginTop: 4,
    marginBottom: 25,
  },

  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "700",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    fontSize: 16,
  },

  button: {
    width: "100%",
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700",
  },

  skip: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
});
