# 🎓 Vigyana Frontend

This is the **frontend** for **Vigyana**, a full-stack online learning platform built with **Next.js**. It allows users to browse courses, enroll with payments, watch course videos, and track their learning progress.

---

## 🚀 Tech Stack

- **Next.js (App Router)**
- **Tailwind CSS** – modern utility-first styling
- **React Player** – for course video playback
- **Zustand** – global auth state
- **React Hot Toast** – for clean notifications
- **Cloudinary** – video & image hosting
- **Razorpay** – payment gateway integration

---

## 📁 Project Structure

vigyana-frontend/
├── app/ # App Router structure
│ ├── courses/ # Course detail pages
│ ├── dashboard/ # Student dashboard & course player
│ ├── instructor/ # Instructor panel
│ ├── admin/ # Admin approval panel
│ ├── login/ # Auth routes
│ ├── register/
│ └── layout.js # Global layout with navbar, script
├── components/ # Shared UI components
├── lib/ # API helpers & auth store (Zustand)
├── styles/ # Global CSS
├── public/ # Static assets
└── .env # Razorpay & backend URL config





---

## 🔐 Auth System

- Secure login with **httpOnly cookies**
- Global state managed via **Zustand**
- Session persistence with `/auth/me` API
- Route protection via `<ProtectedRoute />` component
- Roles: `STUDENT`, `INSTRUCTOR`, `ADMIN`

---

## 🎯 Core Features

| Area            | Features Included                                                   |
|-----------------|----------------------------------------------------------------------|
| 🌐 Public        | Homepage, featured courses, testimonials                             |
| 👤 Auth          | Register, login, logout                                              |
| 🎓 Student       | Enroll with Razorpay, dashboard, track progress, video player        |
| 🧑‍🏫 Instructor   | Create course, upload sections, manage own courses                   |
| 🛡️ Admin         | View all courses, approve/unpublish/delete                          |
| 💳 Payments      | Razorpay popup → verify → enroll → update progress                  |
| 🎥 Player        | `react-player` based, responsive, with sidebar + progress tracking  |
| 🏅 Certificates  | Auto-generated on 100% course completion                             |

---

## 📦 Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_test_key_id
🧰 Scripts
bash
Copy
Edit
npm install       # Install dependencies
npm run dev       # Start dev server on localhost:3000




🧠 Zustand Store (lib/store.js)
Tracks user, setUser, logout

Loads user from backend on app startup (/auth/me)

🔁 API Helper (lib/api.js)
Simple wrapper functions:

js
Copy
Edit
getRequest('/courses')
postRequest('/payment/order', { courseId })
All requests include credentials: 'include' for cookie-based auth.

💡 UI Features
Feature	Status
Fully responsive	✅
Conditional nav links	✅
Course “Enrolled” tag	✅
Home course badge	✅
Testimonials	✅

🧪 Optional Improvements
 Dark mode toggle

 User profile (name/avatar)

 Instructor earnings dashboard

 Course search & filters

 Loading skeletons / spinners

🔐 Role-Based Route Access
Route	Access
/instructor	INSTRUCTOR
/dashboard	STUDENT
/admin	ADMIN
/courses/:id	PUBLIC
/dashboard/course/:id	ENROLLED

Handled via <ProtectedRoute allowedRoles={['STUDENT']} />