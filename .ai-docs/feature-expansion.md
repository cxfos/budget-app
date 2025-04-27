# ✨ Feature Expansion Plan - Budget App

This document lists features to expand the MVP functionality for a more competitive and valuable free version of Budget App.

---

## 🎯 Must-Have for MVP Launch

- [ ] **Category System**
  - Add preset default categories (e.g., Food, Transport, Rent, Utilities, Entertainment)
  - Allow user to select category when adding expense
  - Display category name/icon/emoji in expense list

- [ ] **Expense Filtering**
  - Allow filtering expenses by:
    - Category
    - Date range (e.g., this month, last month, custom)
  - Backend API to accept filter parameters
  - Frontend UI: Dropdowns or simple filter controls

- [ ] **Simple Dashboard Chart**
  - Visualize monthly expenses by category
  - Suggested: Pie Chart (e.g., Recharts or Chart.js in React)
  - Backend endpoint: Return total spent per category for current cycle
  - Frontend: Show a clear, beautiful chart on Dashboard

- [ ] **"Support Development ❤️" Button**
  - Add "Pay Me a Drink" support button via Stripe (see separate Stripe doc)

---

## 🎯 Optional for Post-MVP (MVP+1)

- [ ] **Export to CSV**
  - Allow users to export expenses for a selected period
- [ ] **Simple Budget Limits per Category**
  - Allow users to set a budget goal for a category (e.g., $300 on Food)
- [ ] **Dark Mode**
  - Theme toggle (Dark/Light) using Tailwind or CSS Variables

---

# 📂 Notes

This file is stored under `.ai-docs/feature-expansion.md` to guide AI-assisted feature development expansion planning for Budget App.
