import React, { useState, useEffect, useRef } from "react";
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
  Modal,
  Image,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  Easing,
  Keyboard
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../config/supabaseClient";
import { updateUserProfile, getUserProfile } from "../services/userService";

// --- CUSTOM TOAST COMPONENT ---
const Toast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 20, friction: 6, useNativeDriver: true })
      ]).start();

      const timer = setTimeout(() => {
        hide();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true })
    ]).start(() => {
      if (visible) onHide();
    });
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

// Extracted InputField component with Ref Forwarding support
interface InputFieldProps {
  icon: any;
  label: string;
  placeholder: string;
  value: string;
  onChange?: (text: string) => void;
  optional?: boolean;
  isSelector?: boolean;
  onSelect?: () => void;
  t: (key: string) => string;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  inputRef?: React.RefObject<TextInput>;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  blurOnSubmit?: boolean;
}

const InputField = ({
  icon,
  label,
  placeholder,
  value,
  onChange,
  optional = false,
  isSelector = false,
  onSelect,
  t,
  error,
  onLayout,
  inputRef,
  onSubmitEditing,
  returnKeyType,
  blurOnSubmit = false
}: InputFieldProps) => (
  <View style={styles.inputGroup} onLayout={onLayout}>
    <Text style={styles.label}>
      {label} {optional && <Text style={styles.optionalText}>({t("optional")})</Text>}
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
          autoCapitalize={label === t("emailLabel") ? "none" : (label === t("vehiclePlate") ? "characters" : "sentences")}
          keyboardType={label === t("emailLabel") ? "email-address" : "default"}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
      </View>
    )}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function Detail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Refs for auto-focus chain
  const emailInputRef = useRef<TextInput>(null);
  const plateInputRef = useRef<TextInput>(null);

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const fieldY = useRef<{ [key: string]: number }>({});
  const formY = useRef(0);

  // Form State
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");

  const [originalPlate, setOriginalPlate] = useState(""); // Track initial plate to detect changes

  const [loading, setLoading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showVehicleConfirmModal, setShowVehicleConfirmModal] = useState(false);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Validation State
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    gender: "",
    plate: ""
  });

  // Derived State
  const isBasicFilled = name.trim().length > 0 && email.trim().length > 0 && gender.length > 0;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const btnOpacity = useRef(new Animated.Value(0.4)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true })
    ]).start();

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSupabaseId(user.id);
        setEmail(user.email || "");
        setPhone(user.phone || "");

        // Check if profile exists
        const profile = await getUserProfile(user.id);
        if (profile) {
          setName(profile.name || "");
          setGender(profile.gender || "");
          setPlate(profile.vehiclePlate || "");
          setOriginalPlate(profile.vehiclePlate || ""); // Set original
        }
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (isBasicFilled) {
      Animated.timing(btnOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ])
      ).start();
    } else {
      Animated.timing(btnOpacity, { toValue: 0.4, duration: 300, useNativeDriver: true }).start();
      glowAnim.setValue(0);
    }
  }, [isBasicFilled]);

  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const glowShadow = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", gender: "", plate: "" };
    let firstErrorField = null;

    if (!name.trim()) {
      newErrors.name = t("enterName");
      isValid = false;
      if (!firstErrorField) firstErrorField = "name";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
      if (!firstErrorField) firstErrorField = "name";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "gender";
    }

    if (plate.trim().length > 0 && plate.trim().length < 4) {
      newErrors.plate = "Invalid vehicle plate number";
      isValid = false;
      if (!firstErrorField) firstErrorField = "plate";
    }

    setErrors(newErrors);

    if (firstErrorField && scrollViewRef.current) {
      const fieldPosition = fieldY.current[firstErrorField] || 0;
      const totalY = formY.current + fieldPosition;
      scrollViewRef.current.scrollTo({ y: totalY - 20, animated: true });
    }

    return isValid;
  };

  const handleInitialSaveClick = () => {
    if (!validateForm()) return;

    // Check if user entered a plate AND it's new (different from DB)
    // If originalPlate is empty and current plate is not empty -> New Vehicle
    // If originalPlate exists and current plate is different -> Changed Vehicle
    // If current plate is empty -> No vehicle, just save standard
    if (plate.trim().length > 0 && plate.trim() !== originalPlate) {
      setShowVehicleConfirmModal(true);
    } else {
      // Just save normally
      finalizeSave(plate);
    }
  }

  const finalizeSave = async (plateToSave: string) => {
    setShowVehicleConfirmModal(false);
    setLoading(true);
    try {
      const userProfile = {
        supabaseId: supabaseId!,
        name,
        email,
        gender,
        vehiclePlate: plateToSave, // Save either the new plate or empty/original based on choice
        phone,
      };
      await updateUserProfile(userProfile);
      router.replace("/(tabs)/home");
    } catch {
      router.replace("/(tabs)/home");
    } finally {
      setLoading(false);
    }
  };

  const updateName = (text: string) => {
    if (/[^a-zA-Z\s]/.test(text)) {
      showToast("Only letters define who you are!");
      return;
    }
    setName(text);
    if (errors.name) setErrors({ ...errors, name: "" });
  }

  const updateEmail = (text: string) => { setEmail(text); if (errors.email) setErrors({ ...errors, email: "" }); }
  const updatePlate = (text: string) => { setPlate(text.toUpperCase()); if (errors.plate) setErrors({ ...errors, plate: "" }); }

  // Updated Gender Logic for Auto-Flow
  const updateGender = (text: string) => {
    setGender(text);
    if (errors.gender) setErrors({ ...errors, gender: "" });

    // Auto flow logic
    setTimeout(() => {
      setShowGenderModal(false);
      // Wait for modal to close then focus plate
      setTimeout(() => {
        plateInputRef.current?.focus();
      }, 400);
    }, 250);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0D1B2A', '#1B263B', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >

            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={32} color="#000" />
                </View>
                <Text style={styles.title}>{t("welcomeTitle")}</Text>
                <Text style={styles.subtitle}>{t("setupProfile")}</Text>
              </View>

              <View
                style={styles.formContainer}
                onLayout={(e) => formY.current = e.nativeEvent.layout.y}
              >
                {/* 1. Name Input */}
                <InputField
                  icon="person-outline"
                  label={t("name")}
                  placeholder="Ex. John Doe"
                  value={name}
                  onChange={updateName}
                  t={t}
                  error={errors.name}
                  onLayout={(e: LayoutChangeEvent) => fieldY.current["name"] = e.nativeEvent.layout.y}
                  // AUTO FOCUS PROPS
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  blurOnSubmit={false}
                />

                {/* 2. Email Input */}
                <InputField
                  icon="mail-outline"
                  label={t("emailLabel")}
                  placeholder="Ex. john@example.com"
                  value={email}
                  onChange={updateEmail}
                  t={t}
                  error={errors.email}
                  onLayout={(e: LayoutChangeEvent) => fieldY.current["email"] = e.nativeEvent.layout.y}
                  // AUTO FOCUS PROPS
                  inputRef={emailInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                    setTimeout(() => setShowGenderModal(true), 100);
                  }}
                  blurOnSubmit={true}
                />

                {/* 3. Gender (Selector) */}
                <InputField
                  icon="male-female-outline"
                  label={t("gender")}
                  placeholder={t("selectGender")}
                  value={gender}
                  isSelector
                  onSelect={() => {
                    Keyboard.dismiss(); // Ensure KB is down before modal
                    setShowGenderModal(true);
                  }}
                  t={t}
                  error={errors.gender}
                  onLayout={(e: LayoutChangeEvent) => fieldY.current["gender"] = e.nativeEvent.layout.y}
                />

                <View style={styles.divider}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>{t("vehicleDetails")}</Text>
                </View>

                {/* 4. Plate Input */}
                <InputField
                  icon="car-sport-outline"
                  label={t("vehiclePlate")}
                  placeholder="Ex. ABC-1234"
                  value={plate}
                  onChange={updatePlate}
                  optional
                  t={t}
                  error={errors.plate}
                  onLayout={(e: LayoutChangeEvent) => fieldY.current["plate"] = e.nativeEvent.layout.y}
                  // AUTO FOCUS PROPS
                  inputRef={plateInputRef}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              <View style={{ marginTop: 40, alignItems: 'center' }}>
                <Animated.View style={{
                  width: '100%',
                  opacity: btnOpacity,
                  transform: [{ scale: glowScale }],
                  shadowColor: "#FFD400",
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 10,
                  shadowOpacity: glowShadow,
                }}>
                  <TouchableOpacity
                    style={[
                      styles.mainButton,
                      loading && { opacity: 0.7 }
                    ]}
                    activeOpacity={0.8}
                    onPress={handleInitialSaveClick}
                    disabled={!isBasicFilled || loading}
                  >
                    <LinearGradient
                      colors={isBasicFilled ? ['#FFD400', '#FFEA00'] : ['#333', '#333']}
                      style={styles.mainButtonGradient}
                    >
                      <Text style={[
                        styles.mainButtonText,
                        !isBasicFilled && { color: '#666' }
                      ]}>
                        {loading ? "Saving..." : t("saveContinue")}
                      </Text>
                      {!loading && (
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={isBasicFilled ? "#000" : "#666"}
                        />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={() => router.replace("/(tabs)/home")}
                >
                  <Text style={styles.skipText}>{t("skipNow")}</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>

        <Toast
          message={toastMessage}
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />

      </SafeAreaView>

      {/* GENDER MODAL */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("selectGender")}</Text>
            {["Male", "Female", "Other"].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.modalOption}
                onPress={() => updateGender(opt)}
              >
                <Text style={[styles.modalOptionText, gender === opt && { color: '#FFD400' }]}>{opt}</Text>
                {gender === opt && <Ionicons name="checkmark" size={20} color="#FFD400" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* VEHICLE SAVE CONFIRM MODAL */}
      <Modal
        visible={showVehicleConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVehicleConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#1B263B', borderColor: '#FFD400', borderWidth: 1 }]}>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Ionicons name="car-sport" size={50} color="#FFD400" />
            </View>
            <Text style={[styles.modalTitle, { fontSize: 20 }]}>Save Vehicle?</Text>
            <Text style={{ color: '#DDD', textAlign: 'center', marginBottom: 20, fontSize: 16 }}>
              You entered a new vehicle plate <Text style={{ fontWeight: 'bold', color: '#FFF' }}>{plate}</Text>.{"\n"}
              Add this to your profile?
            </Text>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#666' }]}
                onPress={() => {
                  // User said NO - continue without saving vehicle
                  finalizeSave(originalPlate); // Keep old plate (or empty)
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>No, Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: '#FFD400' }]}
                onPress={() => {
                  // User said YES - save with new plate
                  finalizeSave(plate);
                }}
              >
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Yes, Add it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 4,
  },
  optionalText: {
    color: "#666",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    color: "#FFF",
  },
  divider: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#A0A0A0",
    backgroundColor: '#0D1B2A',
  },
  mainButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
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
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  skipBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 25,
  },
  modalContent: {
    backgroundColor: '#1B263B',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 10,
    minWidth: 250,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  }
});
