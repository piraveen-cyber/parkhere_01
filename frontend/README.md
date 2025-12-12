# ParkHere - Premium Smart Parking App 🚗✨

ParkHere is a modern, premium mobile application designed to streamline the parking experience. It features a high-end "Gold & Black" aesthetic, advanced animations, and a seamless booking flow.

## 🌟 Key Features

### 1. Premium UI/UX
- **Theme**: distinct "Dark Mode" with Gold Accents (`#FFD400`) and Glassmorphism effects.
- **Animations**:
  - **Radar Scan**: `ParkMapScanUpgraded.tsx` features a rotating radar sweep with particle effects.
  - **Pulse Effects**: Used on slots, payment, and QR generation.
  - **Transitions**: Smooth fade and slide entry animations for all screens.

### 2. Advanced Booking Flow
The app features a connected, linear booking journey:
1.  **Radar Scan**: Scans for nearby spots.
2.  **Select Parking**: List/Map view of available garages.
3.  **Select Slot**:
    - Visual grid layout (Level 1, Zone B).
    - Status indicators (Available, Occupied, Reserved).
    - **Logic**: Enforces slot selection before continuing.
4.  **Set Time & Services (`setTime.tsx`)**:
    - **Custom Time Picker**: A vertical, physics-based scrolling wheel (implemented via `Animated.ScrollView` for performance and to avoid nesting errors).
    - **Dynamic Pricing**: Real-time calculation of Duration * Price + Services (EV, Car Wash).
    - **Smart Check-In**: Defaults to the current system time.
5.  **Payment**:
    - Supports Card and Cash flows.
    - Validates inputs (Luhn algorithm for cards).
6.  **Success & QR**:
    - Generates a **Dynamic QR Ticket**.
    - Displays actual booking details (Slot, Time, Price, Unique ID).

### 3. Technical Highlights
- **Navigation**: Built with **Expo Router**. verified absolute paths (e.g., `/parking/selectSlot`) for reliability.
- **Data Flow**: Booking parameters (`slot`, `price`, `time`) represent a robust chain passed from screen to screen.
- **Performance**:
  - `Animated.ScrollView` used for the time picker to correct `VirtualizedList` nesting warnings.
  - Optimized layouts with `SafeAreaView`.

---

## 🚀 Get Started

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Start the app**
    ```bash
    npx expo start
    ```

3.  **Test the Parking Flow**
    - Navigate to **"Parking"** tab.
    - Let the **Radar Scan** finish (3s).
    - Pick a Spot -> Pick a Slot (e.g., B20).
    - Scroll the **Time Picker** to set duration.
    - Add Services (optional).
    - Pay -> View your **QR Ticket**.

---

## 🛠 Project Structure
- **`/app/parking/`**: Core booking flow components.
  - `ParkMapScanUpgraded.tsx`: Animation logic.
  - `selectSlot.tsx`: Grid logic.
  - `setTime.tsx`: Pricing & Time Picker logic.
  - `paymentCard.tsx`: Form validation.
  - `QR.tsx`: Final ticket generation.
