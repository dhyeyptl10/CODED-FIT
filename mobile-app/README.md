# CODED-FIT ✦ React Native & Expo Mobile App
### Hybrid Custom-Curated Apparel & Generative AI Virtual Try-On Platform

> **CODED-FIT Mobile** is a full-featured React Native / Expo application for Nova Street's fashion startup, integrating **Perfect Corp YouCam Generative AI API** ([https://yce.perfectcorp.com/ai-api](https://yce.perfectcorp.com/ai-api)) and all **Unit 4 Native Mobile Features** (Camera, Location, Notifications, Contacts, Clipboard, Share, Biometric Auth).

---

## 📱 Mobile Architecture & Screens

```
nova-street-app/
├── app/
│   ├── _layout.tsx               # Root Navigation shell (Dark Luxury Theme)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Custom 5-Tab Bar with dynamic cart count badge
│   │   ├── index.tsx             # Home: Hero Split, Location ETA, Tech highlights
│   │   ├── shop.tsx              # Shop: Dual-Funnel (24H / Bespoke) + Gender & Category filters
│   │   ├── tryon.tsx             # AI Try-On Studio: Camera + YouCam AI + Body Visualizer
│   │   ├── dashboard.tsx         # UR PICKS: 3-Piece Outfit Mixer + Drop Countdown Timer
│   │   └── cart.tsx              # Bag: Biometric Checkout (FaceID/Fingerprint) + Location ETA
│   └── product/
│       └── [id].tsx              # Product Detail: Multi-Image Gallery + AI Try-On launcher
├── components/
│   ├── ui/
│   │   ├── GoldButton.tsx        # Reusable luxury button with haptic feedback
│   │   └── Badge.tsx             # Micro status badges (Gold, Green, Rust, Purple)
│   ├── ProductCard.tsx           # 4:5 aspect ratio card with quick-add
│   ├── GarmentCard.tsx           # Garment selector card for AI Try-On
│   └── CartItem.tsx              # Shopping bag row with quantity and size indicators
├── services/
│   ├── products.ts               # 16 Men & Women products with Ahmedabad mill specs
│   ├── cart.ts                   # AsyncStorage persistent cart with promo codes
│   └── youcam.ts                 # Perfect Corp YouCam Generative AI API wrapper
├── hooks/
│   ├── useCamera.ts              # Unit 4: 1.Camera (expo-camera & expo-image-picker)
│   ├── useLocation.ts            # Unit 4: 2.Location (expo-location & dispatch ETA)
│   ├── useContacts.ts            # Unit 4: 3.Contacts (expo-contacts)
│   ├── useShare.ts               # Unit 4: 4.Clipboard & 5.Share (expo-sharing)
│   ├── useNotifications.ts       # Unit 4: 6.Notifications (expo-notifications)
│   └── useAuth.ts                # Unit 4: 7.Authentication (expo-local-authentication)
├── constants/
│   └── theme.ts                  # Dark Luxury tokens (#0A0A0A & Gold #C9A84C)
├── app.json                      # Comprehensive iOS InfoPlist & Android permissions
└── package.json                  # Expo SDK 52 dependencies
```

---

## 🚀 Native Features Implemented (Unit 4 Reference)

All features from your reference repository ([`CGxSU_Semester_1/Semester_3/react-native/Unit 4_Native Features`](https://github.com/dhyeyptl10/CGxSU_Semester_1/tree/main/Semester_3/react-native/Unit%204_Native%20Features)) are fully integrated:

| Native Module | Implementation Hook | Where It Is Used |
|---|---|---|
| **1. Camera** | [`useCamera.ts`](./hooks/useCamera.ts) | Real-time body photo capture & gallery upload in AI Try-On Studio |
| **2. Location** | [`useLocation.ts`](./hooks/useLocation.ts) | GPS reverse geocoding to calculate same-day Ahmedabad & metro dispatch ETA |
| **3. Contacts** | [`useContacts.ts`](./hooks/useContacts.ts) | Share custom bespoke looks and invite friends with VIP ₹500 credits |
| **4. Clipboard** | [`useShare.ts`](./hooks/useShare.ts) | 1-tap copy of promo code `NOVA10` with haptic feedback |
| **5. Share** | [`useShare.ts`](./hooks/useShare.ts) | Native OS share sheet for outfits to WhatsApp, Instagram & Messages |
| **6. Notifications** | [`useNotifications.ts`](./hooks/useNotifications.ts) | Push alerts for Order Confirmation, Bespoke Tailoring progress, and Drop radar alarms |
| **7. Authentication** | [`useAuth.ts`](./hooks/useAuth.ts) | Biometric Face ID, Touch ID, and Fingerprint security for 1-touch high-value checkout |

---

## 🤖 Perfect Corp YouCam AI Integration

The app connects to **[Perfect Corp YouCam Generative AI API](https://yce.perfectcorp.com/ai-api)**:
- **AI Clothes Virtual Try-On (`POST /ai/vto/clothes`)**: AI neural drape of dresses, tops, outerwear, and pants onto real human models.
- **AI Body Reshape (`POST /ai/body/reshape`)**: Dynamically scales body dimensions based on BMI, height, and weight.
- **Before / After Split Comparison Slider**: Real-time slider with interactive handle to compare base model vs dressed output.
- **Full Fallback / Demo Mode**: The app runs smoothly out-of-the-box with pre-configured high-fashion supermodels even before entering a live API key.

---

## ⚡ How to Run the App

1. **Navigate to the app directory**:
   ```bash
   cd "c:\Users\DHYEY PATEL\Downloads\nova-street-app"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your YouCam API Key** *(Optional)*:
   Copy `.env.example` to `.env` and insert your API key:
   ```env
   EXPO_PUBLIC_YOUCAM_API_KEY=your_api_key_from_perfectcorp
   ```

4. **Start the Expo Development Server**:
   ```bash
   npx expo start
   ```

5. **Scan QR Code in Expo Go**:
   - **Android**: Scan the QR code using the **Expo Go** app from Google Play Store.
   - **iOS**: Scan the QR code using your iPhone Camera to launch Expo Go.
