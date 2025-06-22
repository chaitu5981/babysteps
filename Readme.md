# BabySteps – Milestone Tracker & Community Tips

A full-stack web application built as part of assignment for BabySteps, a modern, inclusive parenting companion. This app allows users to log pregnancy milestones, contribute community tips, receive personalized weekly guidance, and view real-time updates and analytics.

Features

Milestone Tracking

- Add, edit, and delete pregnancy milestones (title, date, notes)
- All users can view milestones created by everyone (not just their own)
- Only the creator can edit or delete their own milestones

Community Tips

- View and add tips to each milestone
- Tips update in real-time across all users
- Users can "like" tips once; likes are tracked and shown
- Most liked tips appear in analytics

Analytics

- Most common milestone titles (across all users)
- Most liked community tips

Personalization

- Users provide pregnancy **start date** on registration
- Weekly pregnancy messages are shown based on current week (calculated dynamically on each load)

Authentication

- JWT-based auth for login, register, and protected routes
- Username is shown on all pages and next to each milestone

---

Tech Stack

Frontend

- Vite + React
- Tailwind CSS for styling
- React Router
- Axios
- Socket.IO client

Backend

- Node.js + Express
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- CORS + dotenv

---

Installation & Setup

Prerequisites

- Node.js and npm
- MongoDB (Atlas or local)
  Clone the Repository

- git clone https://github.com/chaitu5981/babysteps
- cd babysteps

-Backend setup
--- cd backend
--- npm install

-Create a .env file inside backend/
--- PORT=5000
--- MONGO_URI=<your_mongodb_uri>
--- JWT_SECRET=<your_jwt_secret>

-Then run npm start

-Frontend setup
--- cd ../frontend
--- npm install

-Create a .env file inside frontend/
--- VITE_API_URL=http://localhost:5000

--- npm run dev

- Frontend will run on http://localhost:5173
