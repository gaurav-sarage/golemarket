# 🛒 Gole Market Hub

*Building this project simply using Google's Antigravity.*

A comprehensive, production-ready, and scalable e-commerce web application representing a physical marketplace with multiple shops operating within a unified platform. 

## 🌟 Key Features

- **Multi-Vendor Marketplace:** A unified platform where multiple shop owners can sell their products, providing a rich physical marketplace experience online.
- **Role-Based Access Control (RBAC):** Distinct authentication flows and features for Shop Owners (Admins/Sellers) and Customers (Users), secured via JWT and secure cookies.
- **🛍️ Customer Experience:** A sleek, modern frontend allowing users to browse, search, and purchase products seamlessly from various shops.
- **📊 Merchant Dashboard:** A dedicated space for shop owners with rich analytics, product management, and beautiful statistic charts with Framer animations limitlessly customizable.
- **Integrated Payments:** Secure and swift checkout experience powered by **Razorpay**.
- **Modern UI/UX:** Built with Tailwind CSS and Framer Motion, ensuring highly responsive layouts and pleasing micro-interactions fully optimized for light and dark modes.

## 💻 Technology Stack

### Frontend
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS 
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query) & Axios
- **Icons:** Lucide React

### Backend
- **Server Environment:** Node.js with Express.js (Located in `/server` directory)
- **Database:** MongoDB via Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Payment Gateway:** Razorpay
- **Security:** Helmet, CORS, and Joi for validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- MongoDB instance (local or MongoDB Atlas)
- Razorpay API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gaurav-sarage/golemarket.git
   cd golemarket/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `frontend` directory with the required variables:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication Secret
   JWT_SECRET=your_jwt_secret

   # Razorpay Credentials
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure Overview

```text
golemarket/
├── frontend/
│   ├── app/                # Next.js App Router folders (pages, layouts)
│   ├── components/         # Reusable React components (UI, layout, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── public/             # Static assets
│   ├── server/             # Express backend server routes & controllers integration
│   └── store/              # Zustand state management slices
└── README.md
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/gaurav-sarage/golemarket/issues).

## 📄 License
This project is licensed under the MIT License.
