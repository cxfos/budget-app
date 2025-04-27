# 🎯 Backend Next Steps - Budget App

This document outlines the backend improvements planned after the initial MVP functionalities were completed.

---

## 📋 Immediate Backend Enhancements

- [ ] Add `created_at` and `updated_at` timestamps to the Expense model
- [ ] Add pagination support to `GET /api/expenses` endpoint
- [ ] Add basic input validation for:
  - Registration (valid email, password length)
  - Login (valid email, password non-empty)
  - Expenses (positive amount, required description/category)
- [ ] Create a `/api/health` endpoint to check API status

---

## 🧹 Code Improvements and Best Practices

- [ ] Improve error handling for database operations (return clean API errors)
- [ ] Add soft delete functionality to expenses (optional)
- [ ] Create custom error responses (consistent format across all API errors)

---

## 🚀 Future Enhancements (After MVP Launch)

- [ ] Implement refresh token authentication flow
- [ ] Add "forgot password" endpoint (send email link to reset)
- [ ] Add support for categorizing expenses (expand categories dynamically)
- [ ] Add basic analytics endpoint (e.g., total expenses per category for a month)

---

## ⚙️ Deployment Enhancements

- [ ] Add automatic migrations on server startup (safe for initial production)
- [ ] Create production-ready Dockerfile (multi-stage build for smaller image)
- [ ] Configure CI/CD pipeline for easy deploy (optional for v1)

---

# ⚡ Task Priorities

| Priority | Task |
|:--------:|:-----|
| High | Add timestamps, pagination, and validations |
| High | Health check endpoint |
| Medium | Error handling improvements |
| Low | Refresh token, forgot password, analytics endpoints (after launch)

---

# 📂 Notes

This file is stored under `.ai-docs/backend-next-steps.md` to guide AI-assisted backend development tasks via Cursor prompts.

