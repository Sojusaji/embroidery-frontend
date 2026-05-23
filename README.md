# Embroidery & Premium Jewellery E-Commerce Platform

An interactive, full-stack web application designed for a dual-revenue business model: a bespoke custom embroidery & stitching service, alongside a curated marketplace for premium rolled gold ornaments. This platform allows users to browse collections, input custom sizing, and complete secure checkouts.

---

## 🚀 Key Features

### 🛒 Customer Experience & Dual-Marketplace
* **Bespoke Embroidery Showcase:** Browse high-quality custom embroidery portfolios and stitching designs.
* **Rolled Gold Jewellery Storefront:** A dedicated e-commerce catalog showcasing premium, tarnish-resistant rolled gold ornaments with high-resolution visual previews.
* **Flexible Payments:** Integrated secure checkout supporting both online and offline payment methods.
* **Payment Gateway:** Fully integrated with **Razorpay** for safe, fast, and real-time online transaction processing.

---

### 🛒 Customer Experience & Storefront
* **Product Showcase:** Browse high-quality custom embroidery works and stitching designs.
* **Flexible Payments:** Integrated secure checkout supporting both online and offline payment methods.
* **Payment Gateway:** Fully integrated with **Razorpay** for safe, fast, and real-time online transaction processing.

### 📊 Comprehensive Admin Dashboard
* **Financial Analytics:** Features interactive data visualization charts tracking **Total Orders**, **Sales Performance**, and **Profit/Loss trends**.
* **Product Insights:** Granular analytical breakdowns to easily identify top-selling products.
* **Geographical Distribution:** Visual location mapping to identify and track sales volume across specific regions.
* **Customer Management:** Dynamic lists and interactive charts showcasing **Total Customer metrics** and **Top-Tier Customer** performance.

* ## 🌟 Upcoming & Advanced Implementations

### 🤖 1. Automated AI Image Optimization Pipeline (Admin-Side)
To streamline product updates, the admin panel features an automated image processing pipeline:
* **Capture & Upload:** Admins can instantly capture raw product photos via a live device camera or upload high-resolution files.
* **AI-Driven Optimization:** A single-click trigger passes the asset to an AI processing service that automatically crops the subject, enhances visual quality, and generates optimized dual-format variants (`.webp` for speed, `.png` for fallback compatibility).
* **Smart Confirmation Interceptor:** The client-side application catches the optimized assets and prompts a validation dialogue (*"The image is ready for uploading, may I proceed?"*). Upon confirmation, the assets are securely pushed to the database and instantly rendered live for global customers.

### 📐 2. Interactive Digital Tailoring & Material Preview (Client-Side)
To provide a premium, bespoke custom-clothing experience, the application includes a digital measurement suite:
* **Digital Measurement Input:** Customers input exact anatomical body dimensions and select their preferred fabric type and texture.
* **Real-Time Dynamic Mockup:** The UI intercepts these dimensions and instantly renders an accurate visual preview (e.g., a custom-tailored shirt) matching the user’s unique size configuration and selected textile material.
* **Tailored Checkout:** Provides an intuitive bridge allowing users to visually inspect and confidently confirm their custom order before finalized placement.
