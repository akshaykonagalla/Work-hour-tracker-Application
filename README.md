# 🚀 Workpulse — AI-Powered Productivity Analytics Platform

*“The pulse of your work”*

Workpulse is a full-stack productivity analytics platform that tracks user work sessions and leverages AI-driven insights to analyze behavioral patterns, improve focus, and enhance overall productivity.

---

## ✨ Features

* 🔐 Secure authentication with JWT (Login/Register)
* ⏱ Real-time work session tracking (Start/End timer)
* 📊 Interactive analytics dashboard

  * Line charts & bar charts (Recharts)
  * Weekly performance tracking
* 🔥 Productivity insights

  * Streak tracking
  * Focus score calculation
  * Session analysis
* 📅 Timeline visualization of daily work sessions
* 🎯 Daily goal tracking with progress indicator
* 🧠 AI-powered productivity insights (OpenAI API)
* 🔍 Search & filtering of work logs
* 🏆 Leaderboard simulation for performance comparison

---

## 🧠 AI Feature

Workpulse integrates OpenAI APIs to analyze user work patterns and generate structured productivity insights, including:

* Productivity summary
* Key behavioral insights
* Best working time identification
* Actionable focus improvement suggestions

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts (Data Visualization)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### AI Integration

* OpenAI API

---

## 📂 Project Structure

/client → React frontend
/server → Node.js backend

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/akshaykonagalla/Work-hour-tracker-Application.git
cd Work-hour-tracker-Application
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `/server`:

```env
OPENAI_API_KEY=your_api_key_here
```

Run server:

```bash
nodemon server.js
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 📊 Key Highlights

* Built a **production-ready full-stack system**
* Designed a **data-driven analytics dashboard**
* Implemented **AI-powered behavioral insights**
* Focused on **real-world productivity use case**

---

## 🚀 Future Enhancements

* Multi-user leaderboard with real backend data
* Email-based weekly productivity reports
* Advanced AI recommendations with scoring system
* Cloud deployment (AWS / Vercel / Render)

---

## 👨‍💻 Author

**Akshay Konagalla**
Master’s in Computer Science
Aspiring Software Engineer | Full-Stack & AI Systems

---

## 📌 Note

This project demonstrates end-to-end software engineering, including backend development, frontend UI/UX, data visualization, and AI integration.
