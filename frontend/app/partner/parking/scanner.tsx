import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

export default function Scanner() {
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        Alert.alert(
            "Vehicle Detected",
            `Scanned Data: ${data}`,
            [
                { text: "Check-in Vehicle", onPress: () => router.push('/partner/parking/bookings' as any) }, // Should detect type (Check-in vs Check-out)
                { text: "Cancel", onPress: () => setScanned(false), style: 'cancel' }
            ]
        );
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text style={{ color: '#FFF' }}>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text style={{ color: '#FFF' }}>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
            {/* CAMERA SIMULATION (Or Real Camera if device supports) */}
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* OVERLAY */}
            <SafeAreaView style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Scan QR Code</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.scanFrameContainer}>
                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.tl]} />
                        <View style={[styles.corner, styles.tr]} />
                        <View style={[styles.corner, styles.bl]} />
                        <View style={[styles.corner, styles.br]} />
                    </View>
                    <Text style={styles.scanText}>Align QR code within the frame</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.manualBtn}
                        onPress={() => {
                            setScanned(true);
                            Alert.alert("Manual Entry", "Booking ID: BK-12345", [{ text: "Confirm", onPress: () => router.push('/partner/parking/bookings' as any) }]);
                        }}
                    >
                        <Text style={styles.manualText}>Enter Code Manually</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    overlay: { flex: 1, width: '100%', justifyContent: 'space-between' },

    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    backBtn: { width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    scanFrameContainer: { alignItems: 'center', justifyContent: 'center' },
    scanFrame: { width: 250, height: 250, borderColor: 'transparent', position: 'relative' },
    scanText: { color: '#FFF', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 },

    corner: { position: 'absolute', width: 40, height: 40, borderColor: '#FFD700', borderWidth: 4 },
    tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

    footer: { padding: 30, alignItems: 'center' },
    manualBtn: { paddingVertical: 15, paddingHorizontal: 30, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 30 },
    manualText: { color: '#FFF', fontWeight: 'bold' }
});
