# 🚀 Launch Action Checklist - Budget App (Updated for Firebase)

This document provides a clear checklist to follow for the MVP launch and early growth phase, after switching to Firebase Authentication.

---

## 🎯 Pre-Launch Phase (Before MVP Launch)

### Backend
- [ ] Set up Firebase Project (Console)
- [ ] Install Firebase Admin SDK in Go backend
- [ ] Secure backend APIs with Firebase ID Token verification
- [ ] Remove previous custom JWT authentication code
- [ ] Finalize backend polishing (pagination, validations, timestamps)
- [ ] Implement Expense Filtering (by Category and Date Range)
- [ ] Implement Dashboard API for Monthly Spending Chart
- [ ] Create backend Stripe integration ("Support Development ❤️" feature)
- [ ] Create `support_feedback` table for storing user ratings/comments

### Frontend
- [ ] Install Firebase SDK in React frontend
- [ ] Replace Login/Register pages with Firebase Authentication flows (Email/Password + Google Login)
- [ ] Handle session token (getIdToken) and attach it to protected API calls
- [ ] Add Category System (preset categories for expenses)
- [ ] Add Filtering Controls (Category + Date Range filters)
- [ ] Implement Monthly Spending Chart (Pie/Bar)
- [ ] Add "Support Development ❤️" button (Stripe integration)
- [ ] Create Thank You page (post-payment): Collect star rating + optional comment

### General
- [ ] Add Authorized Domains to Firebase project (frontend production URL + localhost for testing)
- [ ] Test full user flow (register → login → add/edit/delete expenses → filter → view charts)
- [ ] Test Stripe support flow (support payment → thank you feedback)
- [ ] Set up production backend deployment (e.g., Render, Fly.io)
- [ ] Set up frontend deployment (e.g., Vercel, Netlify)
- [ ] Finalize environment variables for production
- [ ] Test app on desktop and mobile browsers
- [ ] Set up basic analytics tracking
- [ ] Prepare Landing Page with CTA ("Get Started" + "Support Development ❤️")
- [ ] Write basic FAQ / Help page (covering Sign-In methods, Stripe support donations)

---

## 🎯 Launch Week Actions

- [ ] Announce soft launch on personal social media accounts
- [ ] Post "Launch Story" across Instagram, LinkedIn, Twitter
- [ ] Email early testers and trusted contacts
- [ ] Enable Referral Program (invite friends reward system)
- [ ] Open early access to community server (Discord/Reddit optional)
- [ ] Monitor early feedback (first 50 users closely)
