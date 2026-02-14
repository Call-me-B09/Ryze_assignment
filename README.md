# Ryze - AI UI Generator

Ryze is an AI-powered UI generator that helps developers create stunning, production-ready React components instantly. Describe your interface, and Ryze generates the code for you.

## 🚀 Features

-   **AI-Powered Code Generation**: Uses Groq (Llama 3) to generate React + Tailwind CSS code.
-   **Live Preview**: Instantly see your generated UI.
-   **Interactive Editing**: Chat with the AI to refine your design.
-   **Version Control**: Save and restore previous versions of your generated UI.
-   **Modern Tech Stack**: Built with React, Vite, Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express, MongoDB, Mongoose
-   **AI**: Groq SDK (Llama 3), Google Generative AI (Gemini - Optional)

## 📋 Prerequisites

-   Node.js (v18+)
-   MongoDB (running locally or Atlas URI)
-   Groq API Key (for Llama 3 models)

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Call-me-B09/Ryze_assignment.git
cd Ryze_assignment
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ryze_db  # Or your MongoDB Atlas URI
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here      # Optional
```

Start the backend server:

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`.

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📂 Project Structure

```
Ryze_assignment/
├── backend/                 # Node.js + Express Server
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose models (Generation, Version)
│   ├── routes/              # API routes
│   ├── services/            # AI generation logic
│   ├── utils/               # Helper functions (Groq/Gemini client)
│   └── server.js            # Entry point
│
├── frontend/                # React + Vite Client
│   ├── src/
│   │   ├── components/ui/   # Reusable UI components (Card, Button, etc.)
│   │   ├── panels/          # Main application panels (Chat, Code, Preview)
│   │   ├── App.jsx          # Main logic & State management
│   │   └── LandingPage.jsx  # Glassmorphism Landing Page
│   └── index.html
└── README.md
```
