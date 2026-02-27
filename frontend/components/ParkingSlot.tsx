import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/themeContext';

interface ParkingSlotProps {
    label: string;
    status: 'available' | 'reserved' | 'occupied';
    type?: 'standard' | 'disabled' | 'ev'; // New Prop
    isSelected?: boolean;
    isAccessible?: boolean; // Deprecated, mapping to type='disabled' internally if needed
    onPress?: () => void;
    style?: any;
}

const ParkingSlot: React.FC<ParkingSlotProps> = ({ label, status, type = 'standard', isSelected = false, isAccessible = false, onPress, style }) => {
    const { colors } = useTheme();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const carAnim = useRef(new Animated.Value(50)).current; // Start from bottom (50)

    // Real-time Pulse Animation for Available Slots
    useEffect(() => {
        if (status === 'available' && !isSelected) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [status, isSelected]);

    // Car Drive-In Animation
    useEffect(() => {
        if (isSelected) {
            Animated.spring(carAnim, {
                toValue: 0,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            carAnim.setValue(50); // Reset off-screen
        }
    }, [isSelected]);

    const getStatusColor = () => {
        if (isSelected) return colors.primary; // Gold when selected
        if (status === 'available') {
            if (type === 'disabled' || isAccessible) return colors.accessibleSlot;
            if (type === 'ev') return colors.evSlot;
        }
        switch (status) {
            case 'available': return colors.success;
            case 'reserved': return colors.info;
            case 'occupied': return colors.error;
            default: return colors.subText;
        }
    };

    const statusColor = getStatusColor();

    return (
        <TouchableOpacity onPress={onPress} disabled={status === 'occupied' || status === 'reserved'} style={[style]}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        borderColor: statusColor,
                        backgroundColor: status === 'available'
                            ? (type === 'disabled' || isAccessible ? 'rgba(59, 130, 246, 0.15)'
                                : type === 'ev' ? 'rgba(224, 255, 34, 0.15)'
                                    : 'rgba(57, 255, 20, 0.05)')
                            : colors.card,
                        transform: [{ scale: status === 'available' ? pulseAnim : 1 }]
                    }
                ]}
            >
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

                {/* Status Dot (Hidden if selected to show car) */}
                {!isSelected && <View style={[styles.dot, { backgroundColor: statusColor }]} />}
                {!isSelected && (
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {status.toUpperCase()}
                    </Text>
                )}

                {/* Icons based on Type */}
                {!isSelected && (type === 'disabled' || isAccessible) && (
                    <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <Ionicons name="accessibility" size={16} color={colors.accessibleSlot} />
                    </View>
                )}
                {!isSelected && type === 'ev' && (
                    <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <Ionicons name="flash" size={16} color={colors.text} />
                    </View>
                )}

                {/* Animated Car Icon for Selection */}
                {isSelected && (
                    <Animated.View style={{ transform: [{ translateY: carAnim }] }}>
                        <Ionicons name="car-sport" size={32} color={colors.primary} />
                    </Animated.View>
                )}

                {/* Static Car Icon for Occupied/Booked Slots */}
                {!isSelected && (status === 'occupied' || status === 'reserved') && (
                    <View>
                        <Ionicons name="car-sport" size={32} color="#FFFFFF" style={{ opacity: 0.9 }} />
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 120,
        borderWidth: 2,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        overflow: 'hidden', // Clip the car when it slides in
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        position: 'absolute',
        top: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 20,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    }
});

export default ParkingSlot;
