import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function PaymentCard() {
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <Text style={styles.title}>City Center Parking</Text>
        <Text style={styles.subText}>Today, 11:00 am</Text>
        <Text style={styles.subText}>Total Duration: 6 hr</Text>

        <Text style={styles.price}>RS. 200</Text>
      </View>

      {/* METHOD TITLE */}
      <Text style={styles.sectionTitle}>Select Payment Method</Text>

      {/* PAYMENT OPTIONS */}

      {/* CREDIT CARD */}
      <TouchableOpacity
        style={[
          styles.methodBox,
          method === "card" && styles.methodSelected,
        ]}
        onPress={() => setMethod("card")}
      >
        <MaterialIcons name="credit-card" size={32} color="#555" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.methodTitle}>Credit / Debit Card</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <View style={styles.visaTag}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>VISA</Text>
            </View>
            <View style={styles.masterTag}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>MC</Text>
            </View>
          </View>
        </View>

        {method === "card" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </TouchableOpacity>

      {/* CASH OPTION */}
      <TouchableOpacity
        style={[
          styles.methodBox,
          method === "cash" && styles.methodSelected,
        ]}
        onPress={() => setMethod("cash")}
      >
        <MaterialIcons name="payments" size={32} color="#555" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.methodTitle}>Cash at Location</Text>
          <Text style={styles.methodSub}>Pay when you arrive</Text>
        </View>

        {method === "cash" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </TouchableOpacity>

      {/* UPI OPTION */}
      <TouchableOpacity
        style={[
          styles.methodBox,
          method === "upi" && styles.methodSelected,
        ]}
        onPress={() => setMethod("upi")}
      >
        <Ionicons name="wallet" size={32} color="#555" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.methodTitle}>UPI / Wallet / Online Payment</Text>
          <Text style={styles.methodSub}>PhonePe, GPay, Paytm & more</Text>
        </View>

        {method === "upi" && (
          <Ionicons name="checkmark-circle" size={28} color="#FFD400" style={{ marginLeft: "auto" }} />
        )}
      </TouchableOpacity>

      {/* CARD DETAILS — only when Credit/Debit Card selected */}
      {method === "card" && (
        <>
          <Text style={styles.sectionTitle}>Add Card Details</Text>

          <Text style={styles.label}>Card Number</Text>
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
              <Text style={styles.label}>Expiry</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#aaa"
                value={expiry}
                onChangeText={setExpiry}
              />
            </View>

            <View style={{ width: 120, marginLeft: 10 }}>
              <Text style={styles.label}>CVV</Text>
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
      <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
        <Text style={styles.payText}>Pay & Reserve</Text>
      </TouchableOpacity>

      {/* CANCEL */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ------------ STYLES ------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 10 },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: { fontSize: 18, fontWeight: "700" },
  subText: { color: "#777", marginTop: 3 },
  price: { fontSize: 22, fontWeight: "900", color: "#FFD400" },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 10, marginBottom: 10 },

  methodBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    elevation: 3,
  },

  methodSelected: {
    borderWidth: 2,
    borderColor: "#FFD400",
  },

  methodTitle: { fontSize: 16, fontWeight: "600" },
  methodSub: { color: "#777", marginTop: 4 },

  visaTag: {
    backgroundColor: "#1A237E",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  masterTag: {
    backgroundColor: "#d50000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  label: { fontSize: 14, marginTop: 6, marginBottom: 4 },

  input: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

  payBtn: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  payText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  cancelText: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginBottom: 40,
  },
});
