import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function GarageServices() {
    const router = useRouter();
    const [services, setServices] = useState([
        { id: '1', name: 'Full Service', price: '15000', duration: '120' },
        { id: '2', name: 'Oil Change', price: '5000', duration: '30' },
        { id: '3', name: 'Wash & Wax', price: '3500', duration: '45' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration: '' });

    const handleAddService = () => {
        if (!newService.name || !newService.price) return;
        setServices([...services, { id: Date.now().toString(), ...newService }]);
        setModalVisible(false);
        setNewService({ name: '', price: '', duration: '' });
    };

    const deleteService = (id: string) => {
        setServices(services.filter(s => s.id !== id));
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#000000', '#1c1c1c']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Service Menu</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
                        <Ionicons name="add" size={28} color="#000" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="wrench" size={24} color="#FFD700" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.serviceName}>{item.name}</Text>
                                <Text style={styles.serviceMeta}>{item.duration} mins • Heavy/Light</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.price}>LKR {item.price}</Text>
                                <TouchableOpacity onPress={() => deleteService(item.id)}>
                                    <Text style={styles.deleteText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />

                {/* ADD SERVICE MODAL */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Service</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Service Name"
                                placeholderTextColor="#666"
                                value={newService.name}
                                onChangeText={(t) => setNewService({ ...newService, name: t })}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Price (LKR)"
                                    keyboardType="numeric"
                                    placeholderTextColor="#666"
                                    value={newService.price}
                                    onChangeText={(t) => setNewService({ ...newService, price: t })}
                                />
                                <View style={{ width: 10 }} />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Duration (mins)"
                                    keyboardType="numeric"
                                    placeholderTextColor="#666"
                                    value={newService.duration}
                                    onChangeText={(t) => setNewService({ ...newService, duration: t })}
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                    <Text style={styles.btnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAddService} style={styles.saveBtn}>
                                    <Text style={[styles.btnText, { color: '#000' }]}>Save Service</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { padding: 5 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' },

    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F1F', padding: 15, borderRadius: 16, marginBottom: 15, gap: 15 },
    iconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 215, 0, 0.1)', justifyContent: 'center', alignItems: 'center' },
    serviceName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    serviceMeta: { color: '#888', fontSize: 12, marginTop: 4 },
    price: { color: '#00C851', fontWeight: 'bold', fontSize: 16 },
    deleteText: { color: '#FF4444', fontSize: 12, marginTop: 5 },

    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
    modalContent: { backgroundColor: '#1F1F1F', padding: 25, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
    modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: '#333', color: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15 },
    row: { flexDirection: 'row' },
    modalActions: { flexDirection: 'row', marginTop: 10, gap: 15 },
    cancelBtn: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 12, backgroundColor: '#333' },
    saveBtn: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 12, backgroundColor: '#FFD700' },
    btnText: { color: '#FFF', fontWeight: 'bold' }
});
