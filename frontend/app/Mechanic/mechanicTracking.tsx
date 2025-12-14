import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Animated, Share, Dimensions, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../context/themeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Status Steps
const STEPS = [
    { title: 'Accepted', icon: 'check-circle' },
    { title: 'On the Way', icon: 'car' },
    { title: 'Arrived', icon: 'location-arrow' },
    { title: 'Repairing', icon: 'tools' }
];

export default function MechanicTracking() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const accent = colors.primary;

    const mechanic = params.mechanic ? JSON.parse(params.mechanic as string) : {
        name: 'Kamal Perera',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    // State
    const [currentStep, setCurrentStep] = useState(0); // 0: Accepted, 1: On Way, 2: Arrived, 3: Repairing
    const [eta, setEta] = useState(15);

    // Locations
    const [userLoc, setUserLoc] = useState({ latitude: 6.9271, longitude: 79.8612 });
    const [mechLoc, setMechLoc] = useState({ latitude: 6.9200, longitude: 79.8550 });

    const mapRef = useRef<MapView>(null);

    // Simulate flow
    useEffect(() => {
        const timer1 = setTimeout(() => setCurrentStep(1), 3000); // On the way
        const timer2 = setTimeout(() => {
            setCurrentStep(2);
            setEta(0);
        }, 8000); // Arrived
        const timer3 = setTimeout(() => setCurrentStep(3), 12000); // Repairing

        // Simulate Mechanic Movement
        const interval = setInterval(() => {
            if (currentStep < 2) {
                setMechLoc(prev => ({
                    latitude: prev.latitude + 0.0002,
                    longitude: prev.longitude + 0.0002
                }));
                if (eta > 0) setEta(e => Math.max(0, e - 1));
            }
        }, 1000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearInterval(interval);
        };
    }, [currentStep]);

    // Fit Map
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.fitToCoordinates([userLoc, mechLoc], {
                edgePadding: { top: 50, right: 50, bottom: 250, left: 50 },
                animated: true
            });
        }
    }, [mechLoc]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Track my mechanic ${mechanic.name}: https://parkhere.com/track/12345`,
            });
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleSOS = () => {
        Alert.alert("SOS Emergency", "Contacting Emergency Services...", [
            { text: "Call 119", onPress: () => console.log("Calling 119") },
            { text: "Cancel", style: "cancel" }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* MAP */}
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                customMapStyle={isDark ? [
                    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
                    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#404040' }] },
                    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
                    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#111111' }] },
                    { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
                    { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#333333' }] },
                    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#f7af05' }] },
                    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#000000' }] },
                ] : []}
                initialRegion={{
                    ...userLoc,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={userLoc} title="You">
                    <View style={[styles.markerRing, { borderColor: accent, backgroundColor: isDark ? 'rgba(247, 175, 5, 0.2)' : 'rgba(57, 255, 20, 0.1)' }]}>
                        <View style={[styles.markerDot, { backgroundColor: accent }]} />
                    </View>
                </Marker>

                <Marker coordinate={mechLoc} title={mechanic.name}>
                    <View style={{ backgroundColor: '#FFF', padding: 5, borderRadius: 20, borderWidth: 2, borderColor: accent }}>
                        <MaterialIcons name="handyman" size={24} color={accent} />
                    </View>
                </Marker>

                <Polyline
                    coordinates={[userLoc, mechLoc]}
                    strokeColor={accent}
                    strokeWidth={4}
                    lineDashPattern={[10, 5]}
                />
            </MapView>

            {/* FLOATING ACTION BUTTONS */}
            <View style={styles.floatingButtons}>
                <TouchableOpacity style={styles.floatBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={[styles.floatBtn, { backgroundColor: '#FFF' }]} onPress={handleShare}>
                    <Ionicons name="share-social" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.floatBtn, { backgroundColor: '#E50914' }]} onPress={handleSOS}>
                    <Text style={styles.sosText}>SOS</Text>
                </TouchableOpacity>
            </View>

            {/* BOTTOM CARD */}
            <View style={[styles.card, { backgroundColor: isDark ? '#141414' : '#FFF', borderTopColor: isDark ? '#333' : 'transparent', borderTopWidth: isDark ? 1 : 0 }]}>
                {/* DRAG HANDLE */}
                <View style={[styles.dragHandle, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />

                {/* STATUS HEADER */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={[styles.statusTitle, { color: colors.text }]}>
                            {STEPS[currentStep]?.title || 'Unknown'}
                        </Text>
                        <Text style={{ color: colors.subText }}>
                            {currentStep < 2 ? `Arriving in ${eta} min` : 'Mechanic is here'}
                        </Text>
                    </View>
                    <Image source={{ uri: mechanic.photo }} style={styles.avatar} />
                </View>

                {/* TIMELINE */}
                <View style={[styles.timeline, { backgroundColor: isDark ? '#000' : '#F5F5F5', borderColor: isDark ? '#333' : 'transparent', borderWidth: isDark ? 1 : 0 }]}>
                    {STEPS.map((step, index) => {
                        const active = index <= currentStep;
                        return (
                            <View key={index} style={styles.stepItem}>
                                <View style={[styles.stepIcon, { backgroundColor: active ? accent : (isDark ? '#333' : '#DDD') }]}>
                                    <FontAwesome5 name={step.icon as any} size={14} color={active ? (isDark ? '#FFF' : '#000') : (isDark ? '#555' : '#888')} />
                                </View>
                                {index < STEPS.length - 1 && (
                                    <View style={[styles.stepLine, { backgroundColor: active ? accent : (isDark ? '#333' : '#DDD') }]} />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* DETAILS */}
                <View style={styles.detailsBox}>
                    <Text style={{ color: colors.subText, fontSize: 12, marginBottom: 5, fontWeight: '700', letterSpacing: 0.5 }}>VEHICLE</Text>
                    <Text style={[styles.detailText, { color: colors.text }]}>Toyota Prius (CAB-1234)</Text>

                    <View style={{ height: 15 }} />

                    <Text style={{ color: colors.subText, fontSize: 12, marginBottom: 5, fontWeight: '700', letterSpacing: 0.5 }}>CONTACT</Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, { borderColor: isDark ? '#333' : '#DDD' }]}>
                            <Ionicons name="call" size={20} color={colors.text} />
                            <Text style={{ color: colors.text, fontWeight: '600' }}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { borderColor: isDark ? '#333' : '#DDD' }]}>
                            <Ionicons name="chatbubble" size={20} color={colors.text} />
                            <Text style={{ color: colors.text, fontWeight: '600' }}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FINISH JOB BUTTON (Demo) */}
                {currentStep === 3 && (
                    <TouchableOpacity
                        style={[styles.finishBtn, { backgroundColor: accent, shadowColor: accent }]}
                        onPress={() => router.push({
                            pathname: '/Mechanic/jobCompletion',
                            params: {
                                mechanic: JSON.stringify(mechanic),
                                price: params.price
                            }
                        })}
                    >
                        <Text style={[styles.finishText, { color: isDark ? '#FFF' : '#000' }]}>FINISH JOB (DEMO)</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },

    markerRing: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 2,
        alignItems: 'center', justifyContent: 'center'
    },
    markerDot: { width: 10, height: 10, borderRadius: 5 },

    floatingButtons: {
        position: 'absolute', top: 50, left: 20, right: 20,
        flexDirection: 'row', gap: 15
    },
    floatBtn: {
        width: 45, height: 45, borderRadius: 22.5,
        backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
    },
    sosText: { fontWeight: '800', color: '#FFF', fontSize: 12 },

    card: {
        position: 'absolute', bottom: 0, width: '100%',
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: 25, paddingBottom: 40,
        shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 10
    },
    dragHandle: {
        width: 40, height: 4, borderRadius: 2,
        alignSelf: 'center', marginBottom: 20, opacity: 0.5
    },

    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    statusTitle: { fontSize: 22, fontWeight: '800' },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#333' },

    timeline: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 15, borderRadius: 16, marginBottom: 20
    },
    stepItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    stepIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    stepLine: { flex: 1, height: 3, marginHorizontal: -2 },

    detailsBox: {},
    detailText: { fontSize: 16, fontWeight: '600' },

    actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
    actionBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: 12, borderRadius: 12, borderWidth: 1
    },
    finishBtn: {
        marginTop: 20, height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowOpacity: 0.4, shadowRadius: 10
    },
    finishText: { fontWeight: '800', color: '#FFF', fontSize: 16, letterSpacing: 1 }
});
