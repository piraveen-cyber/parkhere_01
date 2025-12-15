import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PartnerRegistrationWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // FORM STATE
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    // Verification State (Simple boolean simulation for now)
    const [docsUploaded, setDocsUploaded] = useState<Record<string, boolean>>({});

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleNext = async () => {
        setLoading(true);

        // Simulating network delays
        setTimeout(async () => {
            setLoading(false);

            if (step === 1) {
                if (phone.length < 9) {
                    Alert.alert("Error", "Please enter a valid phone number");
                    return;
                }
                // Mock OTP Send
                Alert.alert("OTP Sent", "Code: 1234");
                setStep(1.5); // OTP Step
            }
            else if (step === 1.5) {
                if (otp !== '1234') {
                    Alert.alert("Error", "Invalid OTP");
                    return;
                }
                setStep(2);
            }
            else if (step === 2) {
                if (!username || !password) {
                    Alert.alert("Error", "Please fill all fields");
                    return;
                }
                setStep(3);
            }
            else if (step === 3) {
                if (selectedRoles.length === 0) {
                    Alert.alert("Error", "Please select at least one business type");
                    return;
                }
                setStep(4);
            }
            else if (step === 4) {
                // Final Submission
                await AsyncStorage.setItem('PARTNER_ROLES', JSON.stringify(selectedRoles));
                await AsyncStorage.setItem('PARTNER_USERNAME', username);
                Alert.alert("Registration Complete", "Your businesses have been registered and are pending review.");
                router.replace('/partner/hub' as any);
            }
        }, 1000);
    };

    const renderStep1 = () => (
        <View>
            <Text style={styles.stepTitle}>Let's get started</Text>
            <Text style={styles.stepSub}>Enter your mobile number to verify your identity.</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.prefix}>+94</Text>
                <TextInput
                    style={styles.input}
                    placeholder="7XXXXXXXX"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>
        </View>
    );

    const renderStep1_5 = () => (
        <View>
            <Text style={styles.stepTitle}>Enter Verification Code</Text>
            <Text style={styles.stepSub}>We sent a code to +94 {phone}</Text>
            <TextInput
                style={[styles.input, { textAlign: 'center', letterSpacing: 5, fontSize: 24 }]}
                placeholder="0000"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
            />
        </View>
    );

    const renderStep2 = () => (
        <View>
            <Text style={styles.stepTitle}>Create Account</Text>
            <Text style={styles.stepSub}>Set up your login credentials.</Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Business Name or Username"
                placeholderTextColor="#666"
                value={username}
                onChangeText={setUsername}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>
    );

    const renderStep3 = () => (
        <View>
            <Text style={styles.stepTitle}>Select Business Type</Text>
            <Text style={styles.stepSub}>Select all that apply to you. You can manage multiple businesses from one account.</Text>

            <TouchableOpacity
                style={[styles.roleCard, selectedRoles.includes('parking') && styles.roleCardActive]}
                onPress={() => toggleRole('parking')}
            >
                <View style={styles.roleIcon}>
                    <Ionicons name="car" size={30} color={selectedRoles.includes('parking') ? '#000' : '#FFD700'} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, selectedRoles.includes('parking') && { color: '#000' }]}>Parking Owner</Text>
                    <Text style={[styles.roleDesc, selectedRoles.includes('parking') && { color: '#333' }]}>Rent out parking spaces.</Text>
                </View>
                {selectedRoles.includes('parking') && <Ionicons name="checkmark-circle" size={24} color="#000" />}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.roleCard, selectedRoles.includes('mechanic') && styles.roleCardActive]}
                onPress={() => toggleRole('mechanic')}
            >
                <View style={styles.roleIcon}>
                    <Ionicons name="build" size={30} color={selectedRoles.includes('mechanic') ? '#000' : '#FFD700'} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, selectedRoles.includes('mechanic') && { color: '#000' }]}>Mechanic</Text>
                    <Text style={[styles.roleDesc, selectedRoles.includes('mechanic') && { color: '#333' }]}>Offer on-demand repairs.</Text>
                </View>
                {selectedRoles.includes('mechanic') && <Ionicons name="checkmark-circle" size={24} color="#000" />}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.roleCard, selectedRoles.includes('garage') && styles.roleCardActive]}
                onPress={() => toggleRole('garage')}
            >
                <View style={styles.roleIcon}>
                    <Ionicons name="business" size={30} color={selectedRoles.includes('garage') ? '#000' : '#FFD700'} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, selectedRoles.includes('garage') && { color: '#000' }]}>Service Center</Text>
                    <Text style={[styles.roleDesc, selectedRoles.includes('garage') && { color: '#333' }]}>Manage garage appointments.</Text>
                </View>
                {selectedRoles.includes('garage') && <Ionicons name="checkmark-circle" size={24} color="#000" />}
            </TouchableOpacity>
        </View>
    );

    const renderStep4 = () => (
        <View>
            <Text style={styles.stepTitle}>Verify Businesses</Text>
            <Text style={styles.stepSub}>Please upload required documents for your selected businesses.</Text>

            {selectedRoles.map(role => (
                <View key={role} style={styles.docCard}>
                    <Text style={styles.docTitle}>
                        {role === 'parking' ? 'Parking Lot' : role === 'mechanic' ? 'Mechanic ID' : 'Garage License'}
                    </Text>
                    <TouchableOpacity
                        style={styles.uploadBtn}
                        onPress={() => setDocsUploaded({ ...docsUploaded, [role]: true })}
                    >
                        {docsUploaded[role] ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <Ionicons name="checkmark" size={18} color="#00C851" />
                                <Text style={{ color: '#00C851', fontWeight: 'bold' }}>Uploaded</Text>
                            </View>
                        ) : (
                            <Text style={{ color: '#000', fontWeight: 'bold' }}>Upload Document</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1c']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(step > 2 ? step - 1 : 1)} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${(step / 4) * 100}%` }]} />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {step === 1 && renderStep1()}
                    {step === 1.5 && renderStep1_5()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handleNext}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.nextText}>{step === 4 ? 'Submit Registration' : 'Continue'}</Text>}
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 15 },
    backBtn: { padding: 5 },
    progressContainer: { flex: 1, height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
    progressBar: { height: '100%', backgroundColor: '#FFD700' },

    content: { padding: 25 },
    stepTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
    stepSub: { fontSize: 16, color: '#AAA', marginBottom: 30 },

    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', borderRadius: 12, paddingHorizontal: 15 },
    prefix: { color: '#FFF', fontSize: 18, marginRight: 10, fontWeight: 'bold' },
    input: { flex: 1, color: '#FFF', fontSize: 18, paddingVertical: 15, borderRadius: 12, backgroundColor: '#1F1F1F', paddingHorizontal: 15, marginBottom: 20 },
    label: { color: '#BBB', marginBottom: 8, marginLeft: 5 },

    roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', padding: 20, borderRadius: 16, marginBottom: 15, gap: 15, borderWidth: 1, borderColor: '#333' },
    roleCardActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
    roleIcon: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.2)' },
    roleTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    roleDesc: { color: '#888', fontSize: 13 },

    docCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F1F1F', padding: 20, borderRadius: 12, marginBottom: 15 },
    docTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    uploadBtn: { backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },

    footer: { padding: 20 },
    nextBtn: { backgroundColor: '#FFD700', padding: 18, borderRadius: 16, alignItems: 'center' },
    nextText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
