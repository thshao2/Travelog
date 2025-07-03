# 🌍 **Travelog** — *Turn every journey into a story*
[![🎬 Demo Video](https://img.shields.io/badge/Demo-YouTube-red?style=flat&logo=youtube)](https://youtu.be/UQwqEmWsVHc)

> A seamless web/mobile app to pin, journal, and share your travel adventures on a real-time 3D map.

---

**Travelog** is a responsive web and mobile-friendly application that empowers travelers to capture, organize, and share their journeys on an interactive 3D map—powered by **Mapbox**.

Whether you're backpacking across continents or road-tripping through your state, Travelog allows you to:

- Drop pins on a 3D map to mark memorable locations
- Write rich journal entries for each pin
- Upload photos from your phone or device
- Organize your experiences by folders and categories
- View travel stats (countries, cities, and continents visited)
- Share your adventures to a public board with fellow explorers

## ✨ Features
- **🌍 Real-Time 3D Map**  
  Navigate an interactive globe powered by Mapbox, scaling from continents down to city streets.
- **📍 Pin & Reflect**  
  Drop pins anywhere and write rich journal entries to capture your memories.
- **📸 Instant Photo Upload**  
  Snap and upload photos directly from your device.
- **📊 Travel Tracker**  
  Track continents, countries, and cities you’ve visited over your lifetime.
- **📂 Smart Organization**  
  Organize trips by year, theme, or bucket-list using custom folders and categories.
- **🤝 Community Sharing**  
  Publish your favorite pins to a public board and inspire fellow travelers.
- **📱 Responsive Design**  
  Optimized for phones, tablets, and widescreen monitors.

---
## 🎬 Demo
Watch the Travelog walkthrough:  
👉 [View Demo Video](https://youtu.be/UQwqEmWsVHc)

## 🛠️ Tech Stack

| Frontend                         | Backend            | Database     | Storage    | Authentication |
| -------------------------------- | ------------------ | ------------ | ---------- | -------------- |
| React • TypeScript • Mapbox GL JS | Spring Boot • Java | PostgreSQL   | AWS S3     | JWT |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20+  
- **npm** v10+  
- **AWS account** with S3 access

### Installation
```bash
# 1. Clone the repo
git clone https://github.com/thshao2/Travelog.git
cd Travelog

# 2. Install dependencies
npm run installs
```
To build and start the entire web application, run

```bash
npm start
```

### Configuration

To enable S3 integration, create a .env file in your /backend directory and add your credentials:

```bash

AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_REGION=us-west-1

```

## ☁️ Deployment

### Option 1: Single Command

```bash
cd /app/Travelog
git pull origin main
npm run deploy

```

### Option 2: Separate Services

```bash
cd /app/Travelog
git pull origin main

# Backend
npm run restart-backend-prod

# Frontend
npm run deploy-frontend
```

## ✈️ Why Travelog?
Too often, memories fade or get buried in cluttered photo albums. Travelog reimagines the digital travel journal—visual, structured, and shareable—so you can revisit every step of your journey and inspire others to explore.
