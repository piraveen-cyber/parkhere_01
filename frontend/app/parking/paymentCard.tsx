import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function PaymentCard() {
  const { t } = useTranslation();
  const [method, setMethod] = useState("card"); // card | cash | upi
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    if (method === "card") {
      if (!cardNumber || !expiry || !cvv) {
        alert("Please enter all card details!");
        return;
      }
      router.push("../parking/successBook"); // ✔ Credit card → success page
    } else {
      router.push("../parking/QR"); // ✔ Cash or UPI → QR page
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <Text style={styles.title}>{t('cityCenterParking')}</Text>
        <Text style={styles.subText}>{t('today')}, 11:00 am</Text>
        <Text style={styles.subText}>{t('totalDuration')}: 6 hr</Text>

        <Text style={styles.price}>RS. 200</Text>
      </View>

      {/* METHOD TITLE */}
      <Text style={styles.sectionTitle}>{t('selectPaymentMethod')}</Text>

      {/* PAYMENT OPTIONS */}

      {/* CREDIT CARD */}
      <Pressable
        style={({ pressed }) => [
          styles.methodBox,
          method === "card" && styles.methodSelected,
          pressed && styles.methodPressed,
        ]}
        onPress={() => setMethod("card")}
      >
        <MaterialIcons name="credit-card" size={32} color="#555" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.methodTitle}>{t('creditDebitCard')}</Text>
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            <View style={styles.visaTag}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 10 }}>VISA</Text>
            </View>
            <View style={styles.masterTag}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 10 }}>MC</Text>
            </View>
          </View>
        </View>

        {method === "card" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </Pressable>

      {/* CASH OPTION */}
      <Pressable
        style={({ pressed }) => [
          styles.methodBox,
          method === "cash" && styles.methodSelected,
          pressed && styles.methodPressed,
        ]}
        onPress={() => setMethod("cash")}
      >
        <MaterialIcons name="payments" size={32} color="#555" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.methodTitle}>{t('cashAtLocation')}</Text>
          <Text style={styles.methodSub}>{t('payOnArrival')}</Text>
        </View>

        {method === "cash" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </Pressable>

      {/* UPI OPTION */}
      <Pressable
        style={({ pressed }) => [
          styles.methodBox,
          method === "upi" && styles.methodSelected,
          pressed && styles.methodPressed,
        ]}
        onPress={() => setMethod("upi")}
      >
        <Ionicons name="wallet" size={25} color="#555" />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.methodTitle}>{t('upiWallet')}</Text>
          <Text style={styles.methodSub}>{t('upiDesc')}</Text>
        </View>

        {method === "upi" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </Pressable>

      {/* CARD DETAILS — only when Credit/Debit Card selected */}
      {method === "card" && (
        <>
          <Text style={styles.sectionTitle}>{t('addCardDetails')}</Text>

          <Text style={styles.label}>{t('cardNumber')}</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t('expiry')}</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#aaa"
                value={expiry}
                onChangeText={setExpiry}
              />
            </View>

            <View style={{ width: 120, marginLeft: 10 }}>
              <Text style={styles.label}>{t('cvv')}</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                secureTextEntry
              />
            </View>
          </View>
        </>
      )}

      {/* PAY BUTTON */}
      <Pressable
        style={({ pressed }) => [
          styles.payBtn,
          pressed && {
            backgroundColor: "#FFE04D",
            shadowColor: "#FFD400",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
            elevation: 15,
          },
        ]}
        onPress={handlePayment}
      >
        <Text style={styles.payText}>{t('payReserve')}</Text>
      </Pressable>

      {/* CANCEL */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>{t('cancelBooking')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ------------ STYLES ------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginLeft: 15, color: "#333", letterSpacing: 0.5 },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  title: { fontSize: 18, fontWeight: "800", color: "#333" },
  subText: { color: "#666", marginTop: 4, fontWeight: "500" },
  price: { fontSize: 24, fontWeight: "900", color: "#FFD400" },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 15, marginBottom: 15, color: "#333" },

  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  methodSelected: {
    borderWidth: 2,
    borderColor: "#FFD400",
    backgroundColor: "#FFFDF0",
  },

  methodPressed: {
    borderColor: "#FFD400",
    borderWidth: 2,
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },

  methodTitle: { fontSize: 17, fontWeight: "700", color: "#333" },
  methodSub: { color: "#888", marginTop: 4, fontSize: 13 },

  visaTag: {
    backgroundColor: "#1A237E",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  masterTag: {
    backgroundColor: "#d50000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  label: { fontSize: 15, marginTop: 8, marginBottom: 6, color: "#555", fontWeight: "600" },

  input: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#333",
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

  payBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 18,
    borderRadius: 30, // Gold Pill
    marginTop: 30,
    marginBottom: 20,
    shadowColor: "#FFD400",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  payText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  cancelText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginBottom: 40,
    fontWeight: "600",
  },
});
