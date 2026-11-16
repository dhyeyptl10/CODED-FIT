# &lt;CF/&gt; CODED FIT
### Precision Engineered For The Connected Self.

> India's first AI-powered fashion-tech platform combining **Bespoke 3D Tailoring**, **Generative AI Virtual Try-On**, and **Cross-Platform Commerce**.

---

## 🌟 Platform Overview

CODED FIT is a full-stack monorepo fashion platform with three tightly integrated layers:

| Layer | Stack | Purpose |
|-------|-------|---------|
| **Web (Next.js)** | Next.js 15, React 19, TypeScript, Tailwind | Storefront, Bespoke Studio, Try-On, Checkout |
| **Backend (Express)** | Node.js, Express, MongoDB, Mongoose, Razorpay | REST API, auth, orders, payments, AI tools |
| **Mobile (Expo)** | Expo 54, React Native 0.86, Expo Router | iOS & Android app with native try-on |

---

## 🔥 Key Features

### 1. 3D Bespoke Print Design Studio
- 6 procedural 3D garment previews (T-shirt, oversized tee, hoodie, shirt, jacket, pants)
- Front / back text and artwork placement with scaling, rotation, and 8 layers
- Raster image upload — validated on the client, priced server-authoritatively
- Pricing: base garment + fabric surcharge + ₹199 per printed side
- Undo / redo, local draft save, account design history

### 2. AI Virtual Try-On
- **Live AR Camera**: WebRTC viewfinder with biometric AR silhouette guidelines
- **Photo Drape**: Neural drape applied directly to user's uploaded photo
- **YouCam Generative AI Engine**: Integrated with Perfect Corp API
- **Before/After slider**: Draggable comparison of original photo vs. outfit
- Status polling architecture — no fake responses

### 3. AI Body Visualizer (BMI & Anthropometrics)
- Real-time anatomical silhouette that adapts to Height, Weight, Chest, Waist, Hips
- 6 one-click archetypes: Athletic V-Taper, Hourglass, Rectangle, Pear, Inverted Triangle, Plus
- Live BMI Radial Gauge with size recommendations (XS → Bespoke 3D)
- Auto-embeds 3D metrics into bespoke CPQ specification

### 4. Full E-Commerce Flow
- Product catalogue with gender/category filters
- Shopping bag with cart-level bespoke design editing (Edit → Update → no duplicates)
- Razorpay checkout with HMAC signature validation (fails closed on forgery)
- Order tracking and account history

### 5. Jarvis AI Assistant
- Voice + text fashion assistant
- Hindi-English bilingual intents
- Page-aware actions (navigate, filter, add to cart)

---

## 📁 Monorepo Structure

```
CF-CODED FIT/
├── backend/                # Express REST API + MongoDB
│   ├── catalog/            # Studio blank garment data
│   ├── config/             # DB and env config
│   ├── controllers/        # Auth, cart, orders, try-on, customization
│   ├── middleware/         # JWT auth, rate-limit, error handler, upload guard
│   ├── models/             # Mongoose schemas (User, Product, Order, Fabric, FitProfile)
│   ├── routes/             # Express API routers (v1)
│   ├── services/           # Razorpay, YouCam, virtual try-on, AI tools, quote engine
│   ├── tests/              # Node native test runner (6 tests, all passing)
│   └── utils/              # JWT helpers, env validator
│
├── frontend/               # Next.js 15 web application
│   ├── app/                # App Router pages (/shop /bespoke /studio /cart /checkout …)
│   ├── components/         # UI components (PrintStudio, TryOnViewer, CartDrawer, AIChat …)
│   ├── lib/                # Checkout, catalogue data, hooks
│   ├── services/           # API client
│   ├── shared/             # Shared TypeScript types and design tokens
│   ├── store/              # Zustand state (cart, auth, fit, customizer)
│   ├── public/             # Brand assets, studio-catalog SVGs, campaign video
│   └── legacy/             # Archived original HTML/CSS/JS static site
│
├── mobile-app/             # Expo 54 / React Native app
│   ├── app/                # Expo Router screens and tabs
│   ├── assets/             # App icon, splash screen, adaptive icon, brand logo
│   ├── components/         # Storefront webview bridge, native widgets
│   ├── constants/          # Design tokens (colors, spacing, shadows)
│   ├── hooks/              # Auth, biometrics, location
│   ├── legacy/             # Archived native screen implementations
│   └── services/           # API client, cart persistence
│
├── package.json            # Workspace scripts
├── README.md               # This file
└── STUDIO-NOTES.md         # Bespoke studio technical notes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas URI)
- Expo CLI (`npm install -g @expo/cli`)

### 1. Backend
```bash
cp backend/.env.example backend/.env
# Fill in MONGODB_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm run backend          # starts nodemon on :5000
npm run seed             # seeds product catalogue
npm --prefix backend run seed:studio  # adds 18 studio blank garments
```

### 2. Frontend (Web)
```bash
cp frontend/.env.example frontend/.env.local
npm run frontend         # starts Next.js dev on :3000
```

### 3. Mobile App
```bash
cp mobile-app/.env.example mobile-app/.env
# Set EXPO_PUBLIC_WEB_URL=http://<YOUR_LAN_IP>:3000
npm run mobile           # starts Expo Go
```

### 4. Run All Tests
```bash
npm test                 # 6 backend tests (auth, pricing, signatures)
npm run typecheck        # frontend TypeScript check
```

---

## ✅ Build Verification (Last Validated)

| Check | Result |
|-------|--------|
| `npm test` (backend) | **6 / 6 pass** |
| `npm run typecheck` (frontend) | **0 errors** |
| `next build` (production) | **15 routes built** |
| `tsc --noEmit` (mobile) | **0 errors** |

---

## 🏗️ Architecture Notes

- **Server-authoritative pricing**: Backend independently validates and prices print layers — client price is never trusted.
- **Secure payments**: Razorpay HMAC signature verified on backend; forged order IDs are rejected.
- **Secret hygiene**: `.env` files are gitignored. Only `.env.example` templates are committed.
- **Mobile bridge**: Mobile app uses a Storefront WebView component to synchronize the full web store while native screens handle device hardware (camera, biometrics, haptics).

---

## 📱 APK Build

```bash
cd mobile-app
npx eas build --platform android --profile preview
```
Requires an [Expo EAS account](https://expo.dev). After build, download the `.apk` from the EAS dashboard.

---

© 2026 CODED FIT. All Rights Reserved.  
Precision Engineered For The Connected Self.
