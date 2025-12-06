import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const currentLanguage = i18n.language;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, currentLanguage === 'en' && styles.activeButton]}
                onPress={() => changeLanguage('en')}
            >
                <Text style={[styles.text, currentLanguage === 'en' && styles.activeText]}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, currentLanguage === 'ta' && styles.activeButton]}
                onPress={() => changeLanguage('ta')}
            >
                <Text style={[styles.text, currentLanguage === 'ta' && styles.activeText]}>தமிழ்</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, currentLanguage === 'si' && styles.activeButton]}
                onPress={() => changeLanguage('si')}
            >
                <Text style={[styles.text, currentLanguage === 'si' && styles.activeText]}>සිංහල</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    activeButton: {
        backgroundColor: '#007AFF', // Or your app's primary color
        borderColor: '#007AFF',
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LanguageSwitcher;
