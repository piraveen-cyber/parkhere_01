import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/themeContext';
import { supabase } from '../../config/supabaseClient';
import api from '../../services/api';

export default function MechanicPayment() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    // Params
    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {};
    const price = params.price ? Number(params.price) : 0;

    // State
    const [method, setMethod] = useState<'card' | 'wallet' | 'cash'>('card');
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const processBooking = async () => {
        setLoading(true);
        try {
            // DEMO MODE: Bypass Auth
            // const { data: { session } } = await supabase.auth.getSession();
            // if (!session?.user) {
            //     Alert.alert("Login Required", "Please login.");
            //     return;
            // }

            // Calls API to create service request
            // DEMO MODE: Mock API Call
            // await api.post('/services', {
            //     userId: "demo_user_123", // session.user.id,
            //     mechanicId: mechanic.id,
            //     serviceType: params.serviceType,
            //     bookingType: params.bookingType,
            //     scheduleTime: params.scheduleTime,
            //     location: params.location,
            //     gps_coordinates: params.gps_coordinates ? JSON.parse(params.gps_coordinates as string) : null,
            //     notes: params.notes,
            //     price: price,
            //     paymentMethod: method,
            //     paymentStatus: method === 'cash' ? 'pending' : 'paid'
            // });
            console.log("Demo Mode: Simulating API Success");

            // Delay for UX
            await new Promise(r => setTimeout(r, 1000));

            // Success Navigation
            router.push({
                pathname: '/Mechanic/mechanicSuccess',
                params: {
                    mechanic: JSON.stringify(mechanic),
                    gps_coordinates: params.gps_coordinates,
                    status: 'booked'
                }
            });

        } catch (e) {
            console.error(e);
            // Alert.alert("Error", "Booking processing failed.");
            // DEMO MODE: Navigate even if error (fallback)
            router.push({
                pathname: '/Mechanic/mechanicSuccess',
                params: {
                    mechanic: JSON.stringify(mechanic),
                    gps_coordinates: params.gps_coordinates,
                    status: 'booked'
                }
            });
        } finally {
            setLoading(false);
            setShowOtp(false);
        }
    };

    const handlePay = () => {
        if (method === 'cash') {
            processBooking();
        } else if (method === 'card') {
            if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) {
                Alert.alert("Invalid Card", "Please enter valid card details.");
                return;
            }
            // Show OTP Modal
            setShowOtp(true);
        } else {
            // Wallet (Simulated)
            processBooking();
        }
    };

    const handleOtpVerify = () => {
        if (otp.length !== 4) {
            Alert.alert("Invalid code", "Enter 4-digit OTP.");
            return;
        }
        processBooking();
    };

    const PaymentOption = ({ id, icon, title, subtitle, lib }: any) => {
        const IconLib = lib;
        const isSelected = method === id;
        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF',
                        borderColor: isSelected ? accent : 'transparent',
                        borderWidth: 1.5
                    }
                ]}
                onPress={() => setMethod(id)}
            >
                <View style={[styles.iconBox, { backgroundColor: isSelected ? accent : (isDark ? '#333' : '#F0F0F0') }]}>
                    <IconLib name={icon} size={24} color={isSelected ? '#000' : (isDark ? '#FFF' : '#666')} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>{title}</Text>
                    {subtitle && <Text style={{ color: colors.subText, fontSize: 12 }}>{subtitle}</Text>}
                </View>
                <View style={[styles.radio, { borderColor: isSelected ? accent : '#666' }]}>
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: accent }]} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <LinearGradient
                colors={isDark ? ['#000000', '#141414', '#000000'] : ['#FFFFFF', '#F0F2F5', '#E1E5EA']}
                style={StyleSheet.absoluteFill}
            />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }]}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Payment Method</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 120 }}>

                {/* AMOUNT CARD */}
                <View style={[styles.amountCard, { backgroundColor: accent, shadowColor: accent }]}>
                    <Text style={[styles.amountLabel, { color: isDark ? '#FFF' : '#000' }]}>Total to Pay</Text>
                    <Text style={[styles.amountValue, { color: isDark ? '#FFF' : '#000' }]}>LKR {price}</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.subText }]}>SELECT METHOD</Text>

                <PaymentOption
                    id="card"
                    title="Credit / Debit Card"
                    subtitle="Visa, Mastercard, Amex"
                    icon="card-outline"
                    lib={Ionicons}
                />

                {method === 'card' && (
                    <View style={[styles.cardForm, { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text, borderColor: isDark ? '#333' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                            placeholder="Card Number"
                            placeholderTextColor={colors.subText}
                            keyboardType="numeric"
                            maxLength={16}
                            value={cardNumber}
                            onChangeText={setCardNumber}
                        />
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                style={[styles.input, { flex: 1, color: colors.text, borderColor: isDark ? '#333' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                                placeholder="MM/YY"
                                placeholderTextColor={colors.subText}
                                maxLength={5}
                                value={expiry}
                                onChangeText={setExpiry}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1, color: colors.text, borderColor: isDark ? '#333' : '#DDD', backgroundColor: isDark ? '#111' : '#F9F9F9' }]}
                                placeholder="CVC"
                                placeholderTextColor={colors.subText}
                                keyboardType="numeric"
                                maxLength={3}
                                secureTextEntry
                                value={cvc}
                                onChangeText={setCvc}
                            />
                        </View>
                    </View>
                )}

                <PaymentOption
                    id="wallet"
                    title="UPI / Wallet"
                    subtitle="GPay, Apple Pay"
                    icon="wallet-outline"
                    lib={Ionicons}
                />

                <PaymentOption
                    id="cash"
                    title="Cash on Service"
                    subtitle="Pay after job is done"
                    icon="cash-multiple"
                    lib={MaterialCommunityIcons}
                />

            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#141414' : '#FFF', borderTopColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity
                    style={[styles.payBtn, { backgroundColor: accent, shadowColor: accent }]}
                    onPress={handlePay}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={isDark ? "#FFF" : "#000"} />
                    ) : (
                        <>
                            <Text style={[styles.payText, { color: isDark ? '#FFF' : '#000' }]}>
                                {method === 'cash' ? 'CONFIRM BOOKING' : `PAY LKR ${price}`}
                            </Text>
                            <Ionicons name={method === 'cash' ? "checkmark-circle" : "lock-closed"} size={20} color={isDark ? "#FFF" : "#000"} />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* OTP MODAL */}
            <Modal visible={showOtp} transparent animationType="slide">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFF' }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Verify Payment</Text>
                        <Text style={{ color: colors.subText, marginBottom: 20 }}>
                            Enter the OTP sent to your mobile
                        </Text>

                        <TextInput
                            style={[styles.otpInput, { color: colors.text, borderColor: '#333' }]}
                            placeholder="0000"
                            placeholderTextColor={colors.subText}
                            keyboardType="numeric"
                            maxLength={4}
                            textAlign="center"
                            value={otp}
                            onChangeText={setOtp}
                        />

                        <TouchableOpacity style={[styles.payBtn, { backgroundColor: accent, width: '100%', marginTop: 20 }]} onPress={handleOtpVerify}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payText}>VERIFY & PAY</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setShowOtp(false)}>
                            <Text style={{ color: colors.subText }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center', gap: 15
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center'
    },
    title: { fontSize: 20, fontWeight: '700' },

    amountCard: {
        padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 30,
        shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    },
    amountLabel: { fontSize: 14, fontWeight: '600', opacity: 0.8, textTransform: 'uppercase' },
    amountValue: { fontSize: 32, fontWeight: '800', marginTop: 5 },

    sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 15, letterSpacing: 1 },

    option: {
        flexDirection: 'row', alignItems: 'center',
        padding: 16, borderRadius: 16, marginBottom: 12, gap: 15
    },
    iconBox: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center'
    },
    optionTitle: { fontSize: 16, fontWeight: '700' },

    radio: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
        justifyContent: 'center', alignItems: 'center'
    },
    radioDot: { width: 12, height: 12, borderRadius: 6 },

    cardForm: {
        marginBottom: 20, marginTop: -5, padding: 15,
        borderWidth: 1,
        borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopWidth: 0
    },
    input: {
        height: 50, borderRadius: 12, borderWidth: 1,
        paddingHorizontal: 15, marginBottom: 10, fontSize: 16
    },

    footer: {
        position: 'absolute', bottom: 0, width: '100%',
        padding: 25, paddingBottom: 40, borderTopWidth: 1,
        // BG Color set in inline styles to adapt to theme footer area
    },
    payBtn: {
        height: 56, borderRadius: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    payText: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center', padding: 25
    },
    modalContent: {
        width: '100%', borderRadius: 25, padding: 30, alignItems: 'center'
    },
    modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10 },
    otpInput: {
        width: '100%', height: 60, borderRadius: 16, borderWidth: 1,
        fontSize: 24, fontWeight: '800', letterSpacing: 5
    }
});
