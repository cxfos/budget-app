# 🔐 Authentication Upgrade Plan - Budget App

This document outlines the plan to upgrade user authentication from custom JWT to Firebase Authentication before MVP launch, avoiding future migration issues and enabling better scalability.

---

## 🎯 Reason for the Upgrade

- Smooth future-proof login and account management
- Avoid difficult user migration later (password resets, confusion)
- Enable Social Logins (Google, Apple) from the start
- Simplify future features like Family Accounts (using Custom Claims)
- Improve user trust with professionally managed authentication

---

## 🎯 Migration Strategy

- Implement Firebase Authentication **before MVP launch**
- Do not launch with current custom JWT system
- Fully replace backend session validation with Firebase ID Tokens
- Fully replace frontend login/register forms to use Firebase flows
- Delete old user auth code (JWT generation, password hashing, etc.) after full switch

---

## 🎯 Firebase Setup Plan

- [ ] Create Firebase Project in Google Cloud Console
- [ ] Enable Email/Password Authentication
- [ ] Enable Google Sign-In Authentication
- [ ] (Optional) Enable Apple Sign-In (after MVP if needed)
- [ ] Add Authorized Domains (e.g., production frontend domain)

---

## 🎯 Frontend Changes

- [ ] Install Firebase React SDK (`firebase`)
- [ ] Replace login and registration screens to call Firebase Auth API
- [ ] Handle token acquisition (`getIdToken()`) and store it safely (in memory or HttpOnly cookies if possible)
- [ ] Automatically handle login persistence across sessions (Firebase handles this easily)

---

## 🎯 Backend Changes (Go)

- [ ] Install Firebase Admin SDK for Go (`firebase.google.com/go`)
- [ ] On every protected API request:
  - Verify Firebase ID Token
  - Extract User UID from token
  - Use UID as authenticated user identity
- [ ] Remove custom JWT handling completely

---

## 🎯 Launch Strategy

- Test full new auth flow end-to-end (register → login → logout → protected APIs)
- Make sure token expiration/refresh works smoothly
- Update Landing Page and FAQ to reflect "Secure Sign-In with Google and Email"

---

## 🎯 Risk Mitigation

- No old users needing migration (clean fresh launch)
- Firebase provides excellent free tier (up to millions of authentications per month)
- Easy to scale with Firebase Identity Platform if needed later

---

# 📂 Notes

This file is stored under `.ai-docs/auth-upgrade-plan.md` to guide authentication upgrade planning for Budget App before MVP launch.
