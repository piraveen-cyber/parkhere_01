import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  LayoutChangeEvent,
  Keyboard,
  Image,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { supabase } from "../../config/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from "../../context/themeContext";

// --- CUSTOM TOAST (Reused) ---
const Toast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 20, friction: 6, useNativeDriver: true })
      ]).start();
      const timer = setTimeout(hide, 2000);
      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true })
    ]).start(() => { if (visible) onHide(); });
  };
  if (!visible) return null;
  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.toastContent}>
        <Ionicons name="warning" size={20} color="#FF4444" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

// --- INPUT FIELD (Reused) ---
const InputField = ({
  icon, label, placeholder, value, onChange, optional = false, isSelector = false, onSelect, t, error, onLayout,
  inputRef, onSubmitEditing, returnKeyType, blurOnSubmit = false
}: any) => (
  <View style={styles.inputGroup} onLayout={onLayout}>
    <Text style={styles.label}>
      {label} {optional && <Text style={styles.optionalText}>({t ? t("optional") : "Optional"})</Text>}
    </Text>

    {isSelector ? (
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
        <View style={[styles.inputContainer, error && styles.inputError]}>
          <Ionicons name={icon} size={20} color={error ? "#FF4444" : "#FFD400"} style={{ marginRight: 10 }} />
          <Text style={[styles.input, { lineHeight: 50, color: value ? "#FFF" : "#666" }]}>
            {value || placeholder}
          </Text>
          <Ionicons name="caret-down" size={16} color="#666" />
        </View>
      </TouchableOpacity>
    ) : (
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color={error ? "#FF4444" : "#FFD400"} style={{ marginRight: 10 }} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChange}
          autoCapitalize={label === "Email" ? "none" : (label === "Vehicle Plate" ? "characters" : "words")}
          keyboardType={label === "Email" ? "email-address" : "default"}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
      </View>
    )}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function ProfileTab() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, colors } = useTheme();

  // Data State
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>({
    name: "", email: "", gender: "", vehiclePlate: "", vehicleModel: "", vehicleType: "", avatarUrl: ""
  });

  // UI State
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modals
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);

  // Vehicle Modal State
  const [newPlate, setNewPlate] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newType, setNewType] = useState<string>("Car"); // Default
  const [vehicleError, setVehicleError] = useState("");

  // Validation & Toast
  const [errors, setErrors] = useState({ name: "", email: "", gender: "" });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const emailRef = useRef<TextInput>(null);
  const plateRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSupabaseId(user.id);
        const profile = await getUserProfile(user.id);
        if (profile) {
          setProfileData({
            name: profile.name || "",
            email: profile.email || user.email || "",
            gender: profile.gender || "",
            vehiclePlate: profile.vehiclePlate || "",
            vehicleModel: profile.vehicleModel || "",
            vehicleType: profile.vehicleType || "Car",
            avatarUrl: profile.avatarUrl || ""
          });
          setNewPlate(profile.vehiclePlate || "");
          setNewModel(profile.vehicleModel || "");
          setNewType(profile.vehicleType || "Car");
        } else {
          setProfileData((prev: any) => ({ ...prev, email: user.email }));
        }
      }
    } catch (e) {
      console.log("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  // Image Picker
  const pickImage = async () => {
    if (!isEditing) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) uploadAvatar(result.assets[0].uri);
    } catch (e) { Alert.alert("Error", "Failed to pick image"); }
  };

  const uploadAvatar = async (uri: string) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop();
      const fileName = `${supabaseId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, blob);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const newAvatarUrl = data.publicUrl;
      setProfileData((prev: any) => ({ ...prev, avatarUrl: newAvatarUrl }));

      if (supabaseId) {
        await updateUserProfile({
          supabaseId,
          ...profileData,
          avatarUrl: newAvatarUrl
        });
      }
      showToast("Avatar updated!");

    } catch (e) {
      console.log("Upload Error", e);
      Alert.alert("Upload Failed", "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };


  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", gender: "" };
    if (!profileData.name.trim()) newErrors.name = t("enterName");
    if (!profileData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) newErrors.email = "Valid email required";
    if (!profileData.gender) newErrors.gender = "Required";
    if (newErrors.name || newErrors.email || newErrors.gender) isValid = false;
    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await updateUserProfile({
        supabaseId: supabaseId!,
        ...profileData
      });
      setIsEditing(false);
      Alert.alert(t("success"), "Profile updated successfully!");
    } catch (e) {
      Alert.alert(t("error"), "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Vehicle Logic
  const handleSaveVehicle = async () => {
    if (newPlate && newPlate.length < 4) {
      setVehicleError("Invalid Plate (min 4 chars)");
      return;
    }
    if (newPlate && !newModel.trim()) {
      setVehicleError("Please enter Vehicle Model");
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = {
        ...profileData,
        vehiclePlate: newPlate,
        vehicleModel: newModel,
        vehicleType: newType,
        supabaseId: supabaseId!
      };
      await updateUserProfile(updatedProfile);

      setProfileData(updatedProfile);
      setVehicleModalVisible(false);
      setVehicleError("");
      showToast(newPlate ? "Vehicle Saved!" : "Vehicle details updated");
    } catch (e) {
      setVehicleError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async () => {
    Alert.alert("Remove Vehicle", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive", onPress: async () => {
          setSaving(true);
          try {
            const updatedProfile = {
              ...profileData,
              vehiclePlate: "",
              vehicleModel: "",
              vehicleType: "",
              supabaseId: supabaseId!
            };
            await updateUserProfile(updatedProfile);
            setProfileData(updatedProfile);
            setNewPlate("");
            setNewModel("");
            setNewType("Car");
            setVehicleModalVisible(false);
            showToast("Vehicle Removed");
          } catch (e) { Alert.alert("Error", "Failed to remove"); } finally { setSaving(false); }
        }
      }
    ]);
  };


  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/onboarding1");
  }

  // --- HELPER COMPONENTS ---
  const VehicleTypeOption = ({ type, icon, selected, onSelect }: any) => (
    <TouchableOpacity
      style={[styles.typeOption, selected ? { backgroundColor: 'rgba(255, 212, 0, 0.2)', borderColor: '#FFD400' } : {}]}
      onPress={onSelect}
    >
      <Ionicons name={icon} size={24} color={selected ? "#FFD400" : "#666"} />
      <Text style={[styles.typeText, { color: selected ? "#FFD400" : "#666" }]}>{type}</Text>
    </TouchableOpacity>
  );

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Car': return 'car-sport-outline';
      case 'Bike': return 'bicycle-outline';
      case 'Van': return 'bus-outline'; // Closest to van
      case 'Truck': return 'bus-outline'; // Placeholder or custom
      default: return 'car-sport-outline';
    }
  }

  // --- RENDER ---
  const MenuItem = ({ icon, title, isDestructive = false, showArrow = true, onPress, rightElement, subtext }: any) => (
    <TouchableOpacity activeOpacity={0.7} style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? "rgba(255, 68, 68, 0.1)" : "rgba(255, 212, 0, 0.1)" }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? colors.error : colors.primary} />
        </View>
        <View>
          <Text style={[styles.menuText, { color: isDestructive ? colors.error : colors.text }]}>{title}</Text>
          {subtext && <Text style={{ fontSize: 12, color: colors.subText }}>{subtext}</Text>}
        </View>
      </View>
      {rightElement ? rightElement : (showArrow && <Ionicons name="chevron-forward" size={18} color={colors.subText} />)}
    </TouchableOpacity>
  );

  const COLORS = colors;

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            {isEditing ? t("editProfile") : t("myProfile")}
          </Text>
          {isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={{ color: COLORS.subText, fontSize: 16 }}>{t("cancel")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => Alert.alert("Settings", "Coming soon!")}>
              <Ionicons name="settings-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {isEditing ? (
              // --- EDIT FORM ---
              <View style={styles.editForm}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <TouchableOpacity onPress={pickImage} style={styles.avatarEditContainer} disabled={uploading}>
                    {uploading ? (<ActivityIndicator color="#FFD400" />) : (
                      profileData.avatarUrl ? <Image source={{ uri: profileData.avatarUrl }} style={styles.avatarImage} />
                        : <View style={[styles.avatarPlaceholder, { backgroundColor: "rgba(255, 212, 0, 0.1)" }]}><Ionicons name="person" size={40} color={COLORS.primary} /></View>
                    )}
                    <View style={styles.editBadge}><Ionicons name="camera" size={14} color="#000" /></View>
                  </TouchableOpacity>
                  <Text style={{ color: COLORS.subText, fontSize: 13, marginTop: 8 }}>Tap to change photo</Text>
                </View>

                <InputField
                  icon="person-outline" label={t("name")} placeholder="Name"
                  value={profileData.name} onChange={(t: string) => setProfileData({ ...profileData, name: t })}
                  t={t} error={errors.name}
                  returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
                />

                <InputField
                  icon="mail-outline" label={t("emailLabel")} placeholder="Email"
                  value={profileData.email} onChange={(t: string) => setProfileData({ ...profileData, email: t })}
                  t={t} error={errors.email} inputRef={emailRef}
                  returnKeyType="next" onSubmitEditing={() => { Keyboard.dismiss(); setTimeout(() => setGenderModalVisible(true), 100); }}
                />

                <InputField
                  icon="male-female-outline" label={t("gender")} placeholder="Select Gender"
                  value={profileData.gender} isSelector onSelect={() => setGenderModalVisible(true)}
                  t={t} error={errors.gender}
                />

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: COLORS.primary }]}
                  onPress={handleSaveProfile} disabled={saving}
                >
                  <Text style={styles.saveBtnText}>{saving ? "Saving..." : t("save")}</Text>
                </TouchableOpacity>

              </View>
            ) : (
              // --- READ ONLY VIEW ---
              <>
                {/* USER INFO CARD */}
                <View style={[styles.profileCard, { backgroundColor: COLORS.card }]}>
                  <View style={[styles.avatarContainer, { borderColor: COLORS.primary }]}>
                    {profileData.avatarUrl ? (
                      <Image source={{ uri: profileData.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <Ionicons name="person" size={40} color={COLORS.primary} />
                    )}
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.userName, { color: COLORS.text }]}>{profileData.name || "Guest User"}</Text>
                    <Text style={[styles.userEmail, { color: COLORS.subText }]}>{profileData.email || "No email"}</Text>
                  </View>
                  <View style={styles.badge}><Text style={styles.badgeText}>{t("goldMember")}</Text></View>
                </View>

                {/* SWITCH TO HOSTING */}
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255, 212, 0, 0.1)',
                    borderColor: 'rgba(255, 212, 0, 0.3)',
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 25
                  }}
                  onPress={() => router.replace("/(owner)/dashboard")}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFD400', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="business" size={20} color="#000" />
                    </View>
                    <View>
                      <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700' }}>Switch to Hosting</Text>
                      <Text style={{ color: COLORS.subText, fontSize: 12 }}>Earn by renting your space</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.subText} />
                </TouchableOpacity>

                {/* MENUS */}
                <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("account")}</Text>
                <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
                  <MenuItem icon="person-outline" title={t("editProfile")} onPress={() => setIsEditing(true)} />

                  {/* MY VEHICLES */}
                  <MenuItem
                    icon={getVehicleIcon(profileData.vehicleType)}
                    title="My Vehicles"
                    subtext={profileData.vehiclePlate ? `${profileData.vehicleType} - ${profileData.vehicleModel}` : "Add your vehicle"}
                    onPress={() => {
                      setNewPlate(profileData.vehiclePlate || "");
                      setNewModel(profileData.vehicleModel || "");
                      setNewType(profileData.vehicleType || "Car");
                      setVehicleModalVisible(true);
                    }}
                  />

                  <MenuItem icon="card-outline" title={t("paymentMethods")} onPress={() => Alert.alert("Coming soon")} />
                </View>

                {/* (Preferences and Support sections omitted for brevity if unchanged - actually keeping them for full file correctness) */}
                <Text style={[styles.sectionTitle, { color: COLORS.subText }]}>{t("preferences")}</Text>
                <View style={[styles.menuGroup, { backgroundColor: COLORS.card }]}>
                  <MenuItem icon="language-outline" title={t("language")} onPress={() => setLangModalVisible(true)} />
                  <MenuItem icon="moon-outline" title={t("darkMode")} showArrow={false} onPress={toggleTheme}
                    rightElement={<Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: "#333", true: COLORS.primary }} />} />
                </View>

                <View style={[styles.menuGroup, { backgroundColor: COLORS.card, marginTop: 20 }]}>
                  <MenuItem icon="log-out-outline" title={t("logOut")} isDestructive onPress={() => Alert.alert("Logout", "Confirm?", [{ text: "Cancel" }, { text: "Logout", style: 'destructive', onPress: logout }])} showArrow={false} />
                </View>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} />

        {/* MODALS */}
        <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: COLORS.card }]}>
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>{t("chooseLanguage")}</Text>
              {['en', 'ta', 'si'].map(lang => (
                <TouchableOpacity key={lang} style={[styles.langOption, { borderColor: COLORS.border }]} onPress={async () => {
                  await i18n.changeLanguage(lang);
                  await AsyncStorage.setItem('user-language', lang);
                  setLangModalVisible(false);
                }}>
                  <Text style={[styles.langText, { color: COLORS.text }]}>{lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : 'සිංහල'}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[styles.closeBtn, { backgroundColor: COLORS.border }]} onPress={() => setLangModalVisible(false)}>
                <Text style={[styles.closeBtnText, { color: COLORS.text }]}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={genderModalVisible} transparent animationType="fade" onRequestClose={() => setGenderModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setGenderModalVisible(false)}>
            <View style={[styles.modalContent, { backgroundColor: '#1B263B', minWidth: 280 }]}>
              <Text style={[styles.modalTitle, { color: '#FFF' }]}>{t("selectGender")}</Text>
              {["Male", "Female", "Other"].map((opt) => (
                <TouchableOpacity key={opt} style={styles.genderOption} onPress={() => { setProfileData({ ...profileData, gender: opt }); setGenderModalVisible(false); }}>
                  <Text style={{ fontSize: 16, color: profileData.gender === opt ? '#FFD400' : '#FFF' }}>{opt}</Text>
                  {profileData.gender === opt && <Ionicons name="checkmark" size={20} color="#FFD400" />}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* VEHICLE MODAL */}
        <Modal visible={vehicleModalVisible} transparent animationType="slide" onRequestClose={() => setVehicleModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setVehicleModalVisible(false)} />
              <View style={[styles.bottomSheet, { backgroundColor: COLORS.card }]}>
                <View style={styles.sheetHeader}>
                  <Text style={[styles.sheetTitle, { color: COLORS.text }]}>{profileData.vehiclePlate ? "Manage Vehicle" : "Add Vehicle"}</Text>
                  <TouchableOpacity onPress={() => setVehicleModalVisible(false)}><Ionicons name="close" size={24} color={COLORS.subText} /></TouchableOpacity>
                </View>

                <View style={{ marginVertical: 20 }}>
                  {/* Vehicle Type Row */}
                  <Text style={[styles.label, { color: COLORS.text, marginBottom: 8 }]}>Vehicle Type</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <VehicleTypeOption type="Car" icon="car-sport-outline" selected={newType === 'Car'} onSelect={() => setNewType('Car')} />
                    <VehicleTypeOption type="Bike" icon="bicycle-outline" selected={newType === 'Bike'} onSelect={() => setNewType('Bike')} />
                    <VehicleTypeOption type="Van" icon="bus-outline" selected={newType === 'Van'} onSelect={() => setNewType('Van')} />
                    <VehicleTypeOption type="Truck" icon="bus-outline" selected={newType === 'Truck'} onSelect={() => setNewType('Truck')} />
                  </View>

                  {/* Vehicle Model Input */}
                  <Text style={[styles.label, { color: COLORS.text, marginBottom: 8 }]}>Vehicle Model</Text>
                  <View style={[styles.inputContainer, { marginBottom: 15 }]}>
                    <Ionicons name="car-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: COLORS.text }]}
                      placeholder="e.g. Toyota Prius"
                      placeholderTextColor={COLORS.subText}
                      value={newModel}
                      onChangeText={setNewModel}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => plateRef.current?.focus()}
                    />
                  </View>

                  {/* Vehicle Plate Input */}
                  <Text style={[styles.label, { color: COLORS.text, marginBottom: 8 }]}>{t("vehiclePlate")}</Text>
                  <View style={[styles.inputContainer, vehicleError ? styles.inputError : {}, { marginBottom: 5 }]}>
                    <Ionicons name="card-outline" size={20} color={vehicleError ? "#FF4444" : COLORS.primary} style={{ marginRight: 10 }} />
                    <TextInput
                      ref={plateRef}
                      style={[styles.input, { color: COLORS.text }]}
                      placeholder="ABC-1234"
                      placeholderTextColor={COLORS.subText}
                      value={newPlate}
                      onChangeText={(t) => { setNewPlate(t.toUpperCase()); setVehicleError(""); }}
                      autoCapitalize="characters"
                    />
                  </View>
                  {vehicleError ? <Text style={styles.errorText}>{vehicleError}</Text> : null}
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: COLORS.primary }]}
                  onPress={handleSaveVehicle} disabled={saving}
                >
                  <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Vehicle"}</Text>
                </TouchableOpacity>

                {profileData.vehiclePlate ? (
                  <TouchableOpacity
                    style={{ padding: 15, alignItems: 'center', marginTop: 10 }}
                    onPress={handleDeleteVehicle}
                    disabled={saving}
                  >
                    <Text style={{ color: "#FF4444", fontWeight: "600" }}>Remove Vehicle</Text>
                  </TouchableOpacity>
                ) : null}

                <View style={{ height: 30 }} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: "700" },
  scrollContent: { padding: 20 },

  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 20 },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, marginRight: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  profileInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  userEmail: { fontSize: 13, marginBottom: 8 },
  badge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', backgroundColor: "rgba(255, 212, 0, 0.15)" },
  badgeText: { color: "#FFD400", fontSize: 10, fontWeight: "700" },

  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10, marginLeft: 10, lineHeight: 22 },
  menuGroup: { borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 15, fontWeight: "600", lineHeight: 22, flexShrink: 1 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: "80%", borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  langOption: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, width: "100%", borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  langText: { fontSize: 16, fontWeight: "600", flex: 1 },
  closeBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, marginTop: 10 },
  closeBtnText: { fontWeight: "600" },

  editForm: { gap: 15 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", marginLeft: 4 },
  optionalText: { color: "#666", fontSize: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 15 },
  inputError: { borderColor: '#FF4444', borderWidth: 1 },
  errorText: { color: '#FF4444', fontSize: 12, marginLeft: 4 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  saveBtn: { marginTop: 20, borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#000', fontSize: 18, fontWeight: '800' },

  avatarEditContainer: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: '#FFD400', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, width: '100%', height: 30, backgroundColor: 'rgba(255,212,0,0.8)', justifyContent: 'center', alignItems: 'center' },

  toastContainer: { position: 'absolute', top: 50, alignSelf: 'center', zIndex: 9999 },
  toastContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  genderOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', width: '100%' },

  bottomSheet: { width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, paddingBottom: 40, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 20 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sheetTitle: { fontSize: 20, fontWeight: "700" },

  // New Type Option Styles
  typeOption: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', width: 60, height: 60, justifyContent: 'center' },
  typeText: { fontSize: 10, marginTop: 4, fontWeight: '600' }
});