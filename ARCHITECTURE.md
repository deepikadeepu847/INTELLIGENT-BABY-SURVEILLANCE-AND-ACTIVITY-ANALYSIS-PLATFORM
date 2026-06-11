# Guardian AI - Project Architecture

## 🚀 High-Level Architecture
The system follows a distributed architecture designed for low latency and high reliability.

### 1. Frontend (Next.js)
- **UI/UX**: Built with Tailwind CSS, Framer Motion, and Shadcn UI. Features a glassmorphism theme with "Apple-quality" aesthetics.
- **Monitoring**: Uses WebRTC for peer-to-peer video streaming.
- **AI Core**: Client-side inference using `onnxruntime-web` for real-time threat detection (falls, strangers, emotional distress).
- **State**: Zustand for global state management.

### 2. Backend (Express.js)
- **Signaling**: Socket.io server for WebRTC handshakes and real-time event broadcasting.
- **Alerting**: A powerful escalation engine integrated with Twilio.
  - **Level 1**: Instant push notifications.
  - **Level 2**: SMS alerts to all family members.
  - **Level 3**: Automated AI voice calls with incident summaries.
- **Database**: PostgreSQL with Prisma ORM for storing user data, camera settings, and event logs.

### 3. Monitoring Sources
- **Laptop Webcam**: Primary high-resolution source for AI monitoring. Best used for portable or temporary nursery setups with edge-based AI processing.
- **ESP32-CAM**: Secondary dedicated hardware for permanent monitoring. Streams MJPEG and reports sensor events (PIR motion, sound levels) via WebSockets.

### 4. AI Pipelines
- **Computer Vision**: Handled on the edge (browser) to ensure privacy and low latency.
- **Audio Analysis**: Noise/crying detection logic integrated into the stream processor.

## 🔐 Privacy & Security
- **End-to-End Encryption**: WebRTC (DTLS/SRTP) for all video streams.
- **Secure Storage**: AES-256 for event logs and snapshots.
- **Privacy Mode**: One-click local-only mode that stops all cloud synchronization.

## 🛠️ Deployment
- **Client**: Vercel
- **Server**: Railway / Render
- **Database**: Supabase / PlanetScale
