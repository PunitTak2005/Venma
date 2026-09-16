# VENMA — Modern Multi-Vendor Marketplace (MERN)

> VENMA is a modern multi-vendor marketplace where multiple vendors can create stores, manage products, receive orders, and grow their business while customers enjoy a seamless shopping experience.

**Tagline:** *Buy. Sell. Grow Together.*

---

## 🚀 Live Services & Ports

* **Frontend**: `http://localhost:3257` (React + Vite + Tailwind CSS)
* **Backend**: `http://localhost:9006` (Node.js + Express + Mongoose)
* **Health Check**: `http://localhost:9006/health`

---

## 🏢 Official Platform Headquarters & Contact

* **Registered Office**: 184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India
* **Legal Entity**: VENMA Multi-Vendor Marketplace Inc.
* **Helpline**: +91 6367088841
* **Support Email**: support@venma.com
* **Business Hours**: Monday – Saturday (9:00 AM – 7:00 PM IST)

---

## 🔑 Platform Demonstration Credentials
 
| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@venma.com` | `password123` | Master Console (`/admin/dashboard`) |
| **Vendor** | `vendor@venma.com` | `password123` | Merchant Portal (`/vendor/dashboard`) |
| **Buyer** | `buyer@venma.com` | `password123` | Storefront & Checkout (`/`) |

**Shared Demo Password:** `password123` *(Works for all three demo accounts)*

*Note: The VENMA login page includes interactive 1-click quick-login buttons for all 3 demo roles.*

---

## 📦 Database Seeding Metrics

* **10 Verified Vendors** (*TechNova Electronics, Urban Fashion, HomeCraft Studio, BeautyBloom, SportsPro, Apex Gaming, ChronoLux, Culinary Masterworks, Velocity Auto, BookWorm*)
* **15 Standard Categories** (*Electronics, Fashion, Home, Beauty, Sports, Books, Gaming, Accessories, Kitchen, etc.*)
* **200 Realistic Products** with multi-image galleries, specifications, stock levels, and ratings
* **100 Customers** with address details
* **250 Historic Orders** with timeline logs
* **400 Verified Customer Reviews**
* **Promotional Coupons** (`WELCOME20` for 20% off, `SAVE10`, `FLASH50`)

---

## 🛠️ Tech Stack & Highlights

* **Frontend**:
  * React 18 with Vite
  * Tailwind CSS with VENMA Palette (Primary: `#0B1F4A`, Secondary: `#16A34A`, Accent: `#F59E0B`, Background: `#F8FAFC`, Surface: `#FFFFFF`)
  * Lucide React Icons
  * Recharts Analytics Graphs
  * Dark Mode + Light Mode support
  * Canvas Confetti for checkout celebrations
* **Backend**:
  * Express.js REST APIs
  * MongoDB Atlas / Mongoose ORM
  * JWT (Access Token + Refresh Token flow)
  * PDFKit for A4 Invoice and Platform Report downloads
  * Helmet, Rate Limiting, and CORS Security Headers
  * Stripe Test payment intent integration

---

## 🏃‍♂️ How to Run Locally

### 1. Backend Server
```bash
cd server
npm install
npm run seed     # Seeds 10 vendors, 200 products, 250 orders
npm run dev      # Runs on port 9006
```

### 2. Frontend Client
```bash
cd client
npm install
npm run dev      # Runs on port 3257
```

---

## 🌐 Deployment Ready (Vercel + Render + MongoDB Atlas)

* **Vercel** (`client/`): Connect repo, set root directory to `client`, build command `npm run build`, output directory `dist`.
* **Render** (`server/`): Web Service, build command `npm install`, start command `npm start`. Set env vars `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
* **Atlas**: Use production URI in `MONGO_URI` and run `npm run seed`.
