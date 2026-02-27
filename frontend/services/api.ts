import axios from 'axios';
import { Platform } from 'react-native';

// Replace with your actual backend URL:
// - Android Emulator: 'http://10.0.2.2:5000/api'
// - Physical Device: 'http://<YOUR_PC_IP>:5000/api'
// - iOS Simulator: 'http://localhost:5000/api'
// - Web: 'http://localhost:5000/api'
const API_BASE_URL = Platform.select({
    android: 'http://10.0.2.2:5000/api',
    ios: 'http://localhost:5000/api',
    web: 'http://localhost:5000/api',
    default: 'http://10.0.2.2:5000/api',
});

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
