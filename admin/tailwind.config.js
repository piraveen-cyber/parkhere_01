/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    850: '#151F32',
                    900: '#0B1121', // Enterprise Dark
                },
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb', // Enterprise Blue
                    900: '#1e3a8a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'in': 'animate-in 0.2s ease-out',
                'out': 'animate-out 0.2s ease-in',
            }
        },
    },
    plugins: [],
}
