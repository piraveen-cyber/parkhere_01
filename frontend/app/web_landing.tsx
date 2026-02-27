import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WebLanding() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>ParkHere Web Landing</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    text: {
        color: '#FFD400',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
