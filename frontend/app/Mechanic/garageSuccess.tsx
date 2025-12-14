import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';
import QRCode from 'react-native-qrcode-svg';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function GarageSuccess() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const [scale] = useState(new Animated.Value(0));

    const garage = params.garage ? JSON.parse(params.garage as string) : { name: 'Garage' };
    const timeSlot = params.timeSlot || '09:00 AM';

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true
        }).start();

        saveBooking();
    }, []);

    const saveBooking = async () => {
        try {
            const newBooking = {
                id: `G-${Date.now()}`,
                type: 'garage',
                title: garage.name,
                subtitle: garage.address,
                date: new Date().toISOString(),
                time: timeSlot,
                price: '15.00',
                status: 'Confirmed',
                image: garage.image
            };

            const existing = await AsyncStorage.getItem('LOCAL_BOOKINGS');
            const bookings = existing ? JSON.parse(existing) : [];
            bookings.unshift(newBooking);
            await AsyncStorage.setItem('LOCAL_BOOKINGS', JSON.stringify(bookings));
        } catch (e) {
            console.error("Failed to save booking locally", e);
        }
    };

    const handleDone = () => {
        router.dismissAll();
        router.replace('/(tabs)/home'); // Or /Mechanic/serviceType
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            <View style={styles.content}>

                {/* SUCCESS ANIMATION (Simple checkmark) */}
                <Animated.View style={[styles.successIcon, { transform: [{ scale }], backgroundColor: accent }]}>
                    <Ionicons name="checkmark" size={50} color={isDark ? '#FFF' : '#000'} />
                </Animated.View>

                <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed!</Text>
                <Text style={[styles.subtitle, { color: colors.subText }]}>
                    Your appointment with {garage.name} is confirmed for {timeSlot}.
                </Text>

                {/* TICKET / QR */}
                <View style={[styles.ticket, { backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9', borderColor: isDark ? '#333' : '#EEE' }]}>
                    <Text style={[styles.scanText, { color: colors.subText }]}>Scan this at the garage</Text>

                    <View style={styles.qrContainer}>
                        <QRCode
                            value={`GARAGE-${garage.id}-${timeSlot}-${Date.now()}`}
                            size={180}
                            color={isDark ? '#FFF' : '#000'}
                            backgroundColor={isDark ? '#1A1A1A' : '#F9F9F9'}
                        />
                    </View>

                    <Text style={[styles.ticketId, { color: accent }]}>ID: #G-{Math.floor(Math.random() * 10000)}</Text>
                </View>

            </View>

            <TouchableOpacity style={[styles.doneBtn, { backgroundColor: accent }]} onPress={handleDone}>
                <Text style={[styles.doneText, { color: isDark ? '#FFF' : '#000' }]}>DONE</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 30 },
    content: { alignItems: 'center' },

    successIcon: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 30,
        shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10
    },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 24 },

    ticket: {
        width: '100%', padding: 30, borderRadius: 20,
        alignItems: 'center', borderWidth: 2, borderStyle: 'dashed'
    },
    scanText: { marginBottom: 20, fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    qrContainer: { padding: 10, backgroundColor: 'transparent', marginBottom: 20 },
    ticketId: { fontSize: 18, fontWeight: '800', letterSpacing: 2 },

    doneBtn: {
        position: 'absolute', bottom: 50, left: 30, right: 30,
        height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowOpacity: 0.3, shadowRadius: 10
    },
    doneText: { fontSize: 18, fontWeight: '800', letterSpacing: 1 }
});
