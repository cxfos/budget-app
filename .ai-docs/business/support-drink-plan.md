# ☕ "Pay Me a Drink" Support Plan - Budget App

This document outlines the plan for adding a simple "Support the Developer" feature using Stripe.

---

## 🎯 Purpose

Allow users (even free tier testers) to easily support the project with small contributions (e.g., "Buy Me a Drink") directly, without using third-party platforms like Buy Me a Coffee (saving on commissions).

---

## 🎯 Stripe Integration Plan

- [ ] Set up Stripe account (if not already)
- [ ] Create a Stripe Checkout session for fixed-amount donations (e.g., $5, $10, $20 CAD)
- [ ] Use Stripe's official React SDK for frontend button/integration
- [ ] Use Go backend to securely create the session server-side
- [ ] Redirect user to Stripe Checkout page
- [ ] After payment, redirect back to Thank You page

---

## 🎯 Thank You Page Plan

- [ ] Thank You message: "Thanks for supporting Budget App!"
- [ ] Star Rating (1 to 5 stars)
- [ ] Optional text input: "Leave a positive comment about the app!"
- [ ] Save the star rating + comment to database (new simple table: `support_feedback`)

---

## 🎯 Placement of "Support" Button

- [ ] Home/Landing Page (visible but not intrusive)
- [ ] Inside user Dashboard (small button or link)
- [ ] Optional: Toast message after big actions ("Enjoying the app? Support development ❤️")

---

## 🎯 Legal/Compliance

- [ ] Add a simple disclaimer: "These payments are voluntary and do not grant access to any premium features."

---

# 📂 Notes

This file is stored under `.ai-docs/support-drink-plan.md` to guide the Stripe integration and user support flow for Budget App.
