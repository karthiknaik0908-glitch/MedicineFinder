# MedicineFinder – Smart Medicine Availability & Pharmacy Locator

**MedicineFinder** is a full-stack, healthcare web application designed to eliminate the frustration of searching for essential prescriptions. Patients can search for any medication and instantly see which nearby licensed pharmacies have it in stock, compare prices, check operating hours, view live stock levels, and navigate directly with turn-by-turn Google Maps directions.

Pharmacy owners have a dedicated management portal to maintain their inventory, adjust prices and stock quantities in real time, monitor low-stock items, and update store profiles.

---

## 🚀 Live Demo & Features Overview

### A. Customer Experience (Zero Login Required)
- **Instant Medicine Search:** Search by brand name (e.g. *Augmentin, Lipitor, Tylenol*) or generic active ingredient (*Amoxicillin, Atorvastatin, Paracetamol*).
- **Physical GPS Distance Calculation:** Uses browser Geolocation API and true mathematical **Haversine formula** to compute physical distance from user to pharmacy.
- **Manual Area Selection Fallback:** If device GPS permission is denied or patient wants to search another city, easily select NYC neighborhoods or type a custom area.
- **Stock Availability Categorization:**
  - 🟢 **In Stock:** Quantity &gt; 10 units
  - 🟡 **Low Stock:** Quantity between 1 and 10 units
  - 🔴 **Out of Stock:** Quantity = 0 units
- **Pharmacy Storefront Profiles:** View operating hours, phone numbers, verified state license numbers, and special facilities (drive-through, vaccination center, etc.).
- **One-Click Google Maps Navigation:** Generates direct Google Maps directions URL (`https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`).
- **Comprehensive Filtering & Sorting:** Filter by Therapeutic Category, Availability, Max Distance (5km, 10km, 25km), and sort by Distance or Price.

### B. Pharmacy Owner Portal
- **Owner Authentication:** Secure registration and login powered by Firebase Authentication (with immediate local fallback demo mode).
- **Executive Dashboard:** Live metrics for Total Catalog Items, In-Stock Medicines, Low-Stock Alerts, Out-of-Stock warnings, and Total Store Inventory Value.
- **Full Inventory CRUD:** Add, edit, delete, and adjust prices and quantities.
- **Rapid Inline Stock Adjuster:** Quickly audit and adjust stock (+1, -1, +10 units) without opening full edit modals.
- **Priority Low-Stock Alerts:** Filtered view highlighting items needing immediate distributor reorders with fast one-click restock actions (+20, +50 units).
- **Pharmacy Profile Customization:** Edit pharmacy business name, operating hours, phone, facilities, and auto-detect GPS coordinates from device location.
- **Sample Data Seeder:** One-click button in the owner navigation bar to seed/reset realistic pharmacy and medicine data.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 6 |
| **Routing** | React Router DOM v6 |
| **Styling & Theme** | Tailwind CSS v3, PostCSS, Autoprefixer (Healthcare Blue & Medical Emerald theme) |
| **Icons** | Lucide React |
| **Backend & Database** | Firebase Firestore (Real-time NoSQL) |
| **Authentication** | Firebase Authentication (Email/Password) |
| **Hosting Deployment** | Firebase Hosting (`firebase.json`) |
| **Geolocation** | HTML5 Geolocation API + Haversine Formula |

---

## 📁 Project Architecture

```
MedicineFinder/
├── dist/                          # Production build output
├── public/
│   └── favicon.svg                # Medical cross SVG icon
├── src/
│   ├── assets/                    # Static assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx         # Global navigation with location pill
│   │   │   ├── Footer.jsx         # Footer with medical notices & helpline
│   │   │   ├── Modal.jsx          # Reusable accessible dialog modal
│   │   │   ├── StockBadge.jsx     # In Stock / Low Stock / Out of Stock badge
│   │   │   ├── LocationPickerModal.jsx # GPS & City preset selector
│   │   │   ├── LoadingSkeleton.jsx# Animated skeletons
│   │   │   └── EmptyState.jsx     # Friendly empty state display
│   │   ├── customer/
│   │   │   ├── MedicineCard.jsx   # Medicine card with pharmacy & distance
│   │   │   ├── PharmacyCard.jsx   # Pharmacy directory card
│   │   │   └── DirectionsModal.jsx# Google Maps routing & details modal
│   │   └── owner/
│   │       ├── OwnerNavbar.jsx    # Owner top bar with seeder & refresh
│   │       ├── OwnerSidebar.jsx   # Owner dashboard sidebar navigation
│   │       ├── MedicineFormModal.jsx # Add/Edit medicine form with validation
│   │       ├── StockUpdateModal.jsx # Fast quantity & price updater
│   │       └── DeleteConfirmModal.jsx # Safety deletion confirmation
│   ├── context/
│   │   ├── AuthContext.jsx        # Owner authentication & active pharmacy
│   │   ├── LocationContext.jsx    # Customer GPS coords & manual city selector
│   │   └── DataContext.jsx        # Global medicines & pharmacies data layer
│   ├── firebase/
│   │   ├── config.js              # Firebase SDK initialization & keys detection
│   │   ├── auth.js                # Firebase Auth methods & local fallback
│   │   └── firestore.js           # Firestore CRUD collections & seeder
│   ├── hooks/
│   │   ├── useGeolocation.js      # Device location hook
│   │   └── useDebounce.js         # Input debouncing hook
│   ├── layouts/
│   │   ├── CustomerLayout.jsx     # Public layout (Navbar + Page + Footer)
│   │   └── OwnerLayout.jsx        # Protected owner dashboard layout
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing page with hero & search bar
│   │   ├── SearchPage.jsx         # Medicine availability search & filters
│   │   ├── PharmaciesListPage.jsx # Browse nearby pharmacies
│   │   ├── PharmacyDetailsPage.jsx# Pharmacy profile & complete inventory
│   │   ├── AboutPage.jsx          # Mission & healthcare problem statement
│   │   ├── ContactPage.jsx        # Patient & pharmacy support form
│   │   ├── LoginPage.jsx          # Owner login (with 1-click demo accounts)
│   │   ├── RegisterPage.jsx       # Pharmacy owner registration
│   │   ├── NotFoundPage.jsx       # 404 page
│   │   └── owner/
│   │       ├── DashboardPage.jsx  # Metrics, recent updates & quick actions
│   │       ├── ManageMedicinesPage.jsx # Full inventory CRUD table
│   │       ├── AddMedicinePage.jsx# Dedicated add medicine page
│   │       ├── InventoryPage.jsx  # Rapid stock adjusters table
│   │       ├── LowStockPage.jsx   # Priority depleted items (<10 units)
│   │       └── PharmacyProfilePage.jsx # Edit pharmacy address, GPS & hours
│   ├── services/
│   │   ├── medicineService.js     # Medicine operations service
│   │   ├── pharmacyService.js     # Pharmacy operations service
│   │   └── geoService.js          # Geolocation & maps calculations
│   ├── utils/
│   │   ├── distance.js            # Haversine formula & maps URLs
│   │   ├── formatters.js          # Stock status, currency & relative time
│   │   └── seedData.js            # Authentic sample pharmacies & medicines
│   ├── App.jsx                    # Routing configuration
│   ├── index.css                  # Tailwind styles
│   └── main.jsx                   # React DOM root entry
├── .env.example                   # Environment variable template
├── firebase.json                  # Firebase Hosting & Firestore config
├── firestore.rules                # Production security rules
├── package.json                   # Dependencies & build scripts
├── tailwind.config.js             # Tailwind configuration
└── vite.config.js                 # Vite bundler & vendor chunking
```

---

## ⚡ Quick Start (Run Locally)

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20 & v26)
- **npm** v9+

### 2. Clone and Install
```bash
# Navigate to the project root
cd MedicineFinder

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
Production output will be generated inside the `dist/` directory.

---

## 🧪 Testing the Application (Fast Demo Credentials)

The app comes ready to test immediately out-of-the-box. When run without Firebase keys, it automatically initializes a **Local Storage Sandbox** with realistic pharmacies, real GPS coordinates, medicines, and prices.

### 1-Click Fast Login Demo Accounts:
On the `/owner/login` page, you can click either demo button:
- **Metro Health Pharmacy**: `metro@medicinefinder.com` / `demoPass123!`
- **CarePoint Community Rx**: `carepoint@medicinefinder.com` / `demoPass123!`
- Or register your own brand new pharmacy on `/owner/register`.

### Seed / Reset Data:
At any point, click the **"Seed Sample Data"** button in the top navigation bar of the Owner Dashboard to reset initial inventory.

---

## 🔒 Firebase Configuration & Deployment

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g., `medicine-finder-prod`).
3. Under **Build**, enable **Authentication** and turn on the **Email/Password** sign-in provider.
4. Under **Build**, enable **Cloud Firestore** and choose a location (e.g., `nam5 (us-central)`). Start in **Test mode** or deploy the included `firestore.rules`.

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
```

### Step 3: Deploy Firestore Security Rules
Install the Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase use --add your-project-id
firebase deploy --only firestore:rules
```

The provided `firestore.rules`:
- Allows **public read** of `/pharmacies` and `/medicines` so customers can search without logging in.
- Restricts **write, update, and delete** permissions on `/medicines` and `/pharmacies` to authenticated pharmacy owners matching `request.auth.uid`.

### Step 4: Deploy to Firebase Hosting
```bash
# Build the optimized production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```
Your application will be live at `https://your-project.web.app`!

---

## 📐 Location & Distance Calculation (Haversine Formula)

MedicineFinder computes physical distance using the **Haversine formula**:

$$\Delta\sigma = 2 \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
$$d = R \cdot \Delta\sigma$$

Where:
- $R$ is the Earth's radius ($6,371 \text{ km}$)
- $\phi_1, \phi_2$ are latitudes of the patient and pharmacy in radians
- $\lambda_1, \lambda_2$ are longitudes in radians

Direct Google Maps navigation is built via standard universal link:
`https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`
No paid Google Maps API key is required for customers to view routes and open directions.

---

## 📄 License
MIT License. Built for healthcare access and community wellness.
