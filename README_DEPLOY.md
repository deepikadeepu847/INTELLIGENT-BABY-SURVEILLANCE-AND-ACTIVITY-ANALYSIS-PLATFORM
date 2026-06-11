# Guardian AI - Environment Configuration

## 📂 Server (.env)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/guardian_ai?schema=public"
JWT_SECRET="your_ultra_secure_secret_key_here"

# Twilio Configuration
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# WhatsApp Configuration (Optional)
WHATSAPP_API_KEY="your_whatsapp_api_key"
```

## 📂 Client (.env.local)
```env
NEXT_PUBLIC_SIGNALING_SERVER="http://localhost:5000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

# 🚀 Deployment Guide

## 1. Backend (Docker)
We recommend deploying the Express server as a Docker container.
```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 2. Frontend (Vercel)
The Next.js application is optimized for Vercel. 
- Connect your GitHub repo.
- Set the environment variables in the Vercel Dashboard.
- Build command: `npm run build`.

## 4. Laptop-Only Setup
If you don't have an ESP32-CAM, you can use your laptop's built-in webcam as the primary monitoring source:
- Open the dashboard at `http://localhost:3000/dashboard`.
- In the Live Monitor, ensure the **"Laptop"** source is selected.
- The AI will automatically start running locally on your browser's video stream.
- All alerts and escalation rules will function the same as they would with dedicated hardware.
## 5. Monorepo Management
You can manage the entire project from the root directory:
- **Install all dependencies**: `npm run install-all`
- **Run in development mode**: `npm run dev`
- **Start production builds**: `npm run start`

The root level `docker-compose.yml` can also be used to spin up the entire stack with a single command:
```bash
docker-compose up --build
```
