# SoberGuard Project Context & Documentation

SoberGuard is a real-time alcohol monitoring system. This document provides a complete overview of the architecture, hardware, and software components for developers and contributors.

## 🏗️ System Architecture

The project follows a modern full-stack architecture with real-time capabilities:

1.  **Hardware (Edge):** ESP8266 + MQ135 sensor (Analog readings sent via HTTPS POST).
2.  **Backend (API):** Bun + ElysiaJS (High-performance TS framework).
    *   **Database:** MongoDB (via Mongoose).
    *   **Real-time:** WebSockets for live data broadcasting.
    *   **Auth:** JWT-based authentication.
3.  **Frontend (UI):** SvelteKit + TailwindCSS.
    *   **Live Updates:** WebSocket client for real-time dashboard updates.
    *   **Visuals:** Chart.js or similar for historical data visualization.

---

## 🔧 Hardware: ESP8266 + MQ135

The sensor detects alcohol/gas levels and sends them to the cloud.

-   **Pinout:**
    -   VCC -> 3.3V / 5V
    -   GND -> GND
    -   A0 (Analog) -> A0 (ESP8266)
-   **Firmware:** `esp8266_mq135.ino`
-   **Security:** Uses `WiFiClientSecure` with `setInsecure()` to communicate with Render's HTTPS endpoints.

---

## 🚀 Backend Configuration

The API is deployed on **Render** at: `https://sober-guard.onrender.com`

-   **Main Endpoints:**
    -   `POST /api/sensor`: Receives readings from the ESP8266.
    -   `GET /api/dashboard/stats`: Returns aggregated data for the UI.
    -   `WS /ws`: WebSocket endpoint for live monitoring.
    -   `POST /api/auth/login`: User authentication.
-   **Tech Stack:** TypeScript, ElysiaJS, MongoDB, Bun.

---

## 🎨 Frontend Dashboard

The UI provides a real-time view of all connected sensors.

-   **Routes:**
    -   `/`: Landing page.
    -   `/login` / `/signup`: User access.
    -   `/dashboard`: Main real-time monitoring interface.
-   **Tech Stack:** SvelteKit, TypeScript, Bun.

---

## 🛠️ Development & Deployment

### Local Setup
Run the entire stack with Docker:
```bash
docker-compose up --build
```

### Production Environment
-   **Backend:** Render (Automatic deploys from GitHub).
-   **Frontend:** Render (Static/Node adapter).
-   **Database:** MongoDB Atlas (Cloud database).

---

## 👥 Team
-   **Sebastian Pulido**
-   **Juan Camilo Reyes**
-   **Randy Zapata**
-   **Group:** 13
