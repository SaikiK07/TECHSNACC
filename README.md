# TECHSNACC

TECHSNACC is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It includes a user-facing storefront, backend API, and an admin dashboard to manage products, users, and orders.

---

## 🌐 What the Website Provides

- Browse computer accessories (products)
- User registration and login (JWT auth)
- Product filtering, search, and detail view
- Add to cart and place orders (COD & Stripe)
- Order tracking for users
- Admin dashboard for:
  - Adding/editing/deleting products
  - Viewing and updating orders
  - Managing users and analytics

---

## 📁 Folder Structure

```
TECHSNACC/
├── client/     # User-facing frontend (React + Vite)
├── server/     # Backend API (Node.js + Express + MongoDB)
├── admin/      # Admin dashboard (React)
├── README.md   # Project documentation
```

---

## 📦 Installation

Install dependencies in each folder:

```bash
cd client && npm install
cd ../server && npm install
cd ../admin && npm install
```

---

## 🚀 Running the Project

Use separate terminals for each service:

```bash
# Start Backend
cd server
nodemon index.js

# Start Frontend
cd client
npm run dev

# Start Admin Panel
cd admin
npm run dev
```

---

## 🔐 Environment Variables

### server/.env

```env
PORT=4001
MongoDBURI=your_mongodb_connection_string
JWT_SECERT=your_jwt_secret
NODE_ENV=development

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name

SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SENDER_EMAIL=your_sender_email

STRIPE_SECRET_KEY=your_stripe_secret_key
```

### admin & client/.env

```env
VITE_BACKEND_URI=http://localhost:4001
```

---

## 👤 Author

**Saiki K**  
---

