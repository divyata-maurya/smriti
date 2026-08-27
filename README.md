🧠 SMRITI — AI Cognitive Companion

SMRITI is a cognitive wellness companion designed to support elderly users through simple, engaging, and familiar daily activities.

The application provides gentle cognitive exercises that encourage memory, attention, focus, and daily routine recall in an easy-to-use interface.

✨ Features

🧩 Memory Garden

A simple memory-based activity that helps users remember familiar objects and strengthen recall.

👀 Focus & Find

An attention-based activity designed to encourage focus and visual attention.

🌸 My Daily Story

A routine-based activity where users arrange familiar daily activities in the correct order.

🎙️ Voice Assistance

Voice assistance makes the application easier and more accessible for elderly users.

😊 Mood & Wellbeing

Users can share how they are feeling, helping the application provide a more personalized experience.

🤖 SMRITI AI

The application provides activity recommendations based on the user's recent activity and progress.

👵 Elder Mode

A simple, accessible interface designed especially for elderly users with clear navigation and easy-to-understand activities.

👨‍👩‍👧 Caregiver Support

A caregiver-oriented experience can help family members stay connected with the user's daily cognitive activities and wellbeing.

🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python, FastAPI
- Server: Uvicorn
- Database: SQLite
- Version Control: Git & GitHub
- Deployment: Render

📁 Project Structure

SMRITI/
│
├── backend/
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── elder.html
│   ├── elder.css
│   ├── elder.js
│   └── ...
│
├── data/
├── docs/
├── .gitignore
└── README.md

⚙️ Local Setup

1. Clone the repository

git clone https://github.com/divyata-maurya/smriti.git
cd smriti

2. Create and activate a virtual environment

Windows PowerShell:

python -m venv venv
.\venv\Scripts\Activate.ps1

3. Install dependencies

python -m pip install fastapi uvicorn

4. Start the backend

cd backend
uvicorn main:app --reload

The application will be available locally at:

http://127.0.0.1:8000

🚀 Deployment

SMRITI can be deployed as a Python web service using Render.

Typical production start command:

uvicorn backend.main:app --host 0.0.0.0 --port $PORT

🎯 Vision

SMRITI aims to make cognitive wellness activities more accessible, familiar, engaging, and comfortable for elderly users, while also helping caregivers understand and support their daily wellbeing.

🔮 Future Scope

- Personalized AI-generated cognitive activities
- More memory and attention games
- Improved caregiver dashboard
- Progress tracking and analytics
- Multilingual and regional-language support
- Better voice-based interaction
- Personalized activity recommendations
- Secure cloud-based user profiles

👥 Team

Built with ❤️ by the SMRITI Team for the hackathon.

---

«SMRITI — Helping memories stay connected. 🧠❤️»