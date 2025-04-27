# 🌐 Cloudflare Tunnel Setup - Budget App

This document outlines the setup for using Cloudflare Tunnel (cloudflared) to expose local development environments under a custom subdomain, allowing Firebase Authentication to work correctly during development.

---

## 🎯 Goal

Expose local React frontend and/or Go backend to a public HTTPS subdomain under `felipedossantos.com`, so Firebase Authentication redirects properly.

Example Subdomain:
- `dev-budget.felipedossantos.com`

---

## 🎯 Requirements

- Cloudflare account (free)
- Access to manage DNS records of `felipedossantos.com`
- Local machine with terminal access
- Installed `cloudflared` binary

---

## 🎯 Setup Steps

### 1. Point Your Domain to Cloudflare
- Sign into Cloudflare
- Add your domain (`felipedossantos.com`) if not already
- Update your domain registrar's nameservers to Cloudflare nameservers (this step is required for tunnel configuration)

---

### 2. Install Cloudflared

```bash
# On Ubuntu/Debian
sudo apt install cloudflared

# On macOS (Homebrew)
brew install cloudflared

```

Or download directly from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

---

### 3. Authenticate Cloudflared

```bash
cloudflared tunnel login
```

- This will open a browser window asking you to authenticate to Cloudflare.

---

### 4. Create and Start the Tunnel

```bash
cloudflared tunnel create budget-dev-tunnel
```

Then run:

```bash
cloudflared tunnel route dns budget-dev-tunnel dev-budget.felipedossantos.com
```

Finally, start your tunnel mapping to localhost:

```bash
cloudflared tunnel run budget-dev-tunnel --url http://localhost:3000
```

(Assuming your React app runs on port 3000)

---

### 5. Update Firebase Authorized Domains

In your Firebase Console:
- Go to Authentication → Settings → Authorized Domains
- Add:
    - `localhost`
    - `127.0.0.1`
    - `dev-budget.felipedossantos.com`

This allows Firebase Auth redirects to succeed during development.

---

### 🎯 Optional: Expose Backend Too (Separate Tunnel)
If needed, you can create a second tunnel to expose your backend (e.g., `api-dev-budget.felipedossantos.com` → localhost:8080).

---

### 🎯 Best Practices
- Use a strong local dev password in case tunnels are accidentally left open.
- Only run tunnels during active development.
- Shut down tunnels when not needed to avoid unwanted exposure.

---

### 📂 Notes
This file is stored under `.ai-docs/cloudflare-tunnel-setup.md` to guide secure and reliable development access for Budget App with Firebase Authentication working over HTTPS.
