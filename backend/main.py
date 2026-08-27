# =========================================================
# SMRITI BACKEND
# FastAPI + SQLite + Adaptive AI
# =========================================================


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

import sqlite3

from datetime import datetime

from pathlib import Path


# =========================================================
# AI ENGINE IMPORT
# =========================================================

# This works when running:
# uvicorn backend.main:app --reload
#
# Fallback also works if running from backend folder.

try:

    from backend.ai_engine import get_adaptive_recommendation

except ModuleNotFoundError:

    from ai_engine import get_adaptive_recommendation


# =========================================================
# APP
# =========================================================

app = FastAPI(

    title="SMRITI",

    description="AI-Powered Cognitive Companion for Elderly Care",

    version="1.0.0"
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

DATABASE = BASE_DIR / "smriti.db"

FRONTEND_DIR = BASE_DIR.parent / "frontend"


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db():

    conn = sqlite3.connect(
        str(DATABASE)
    )

    conn.row_factory = sqlite3.Row

    return conn


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def init_db():

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute("""
        CREATE TABLE IF NOT EXISTS game_results (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            patient_id TEXT NOT NULL,

            game_type TEXT NOT NULL,

            difficulty TEXT,

            score REAL,

            accuracy REAL,

            response_time REAL,

            moves INTEGER,

            hints INTEGER,

            created_at TEXT NOT NULL

        )
    """)


    conn.commit()

    conn.close()


# Initialize database
init_db()


# =========================================================
# REQUEST MODEL
# =========================================================

class GameResult(BaseModel):

    patient_id: str

    game_type: str

    difficulty: str

    score: float

    accuracy: float

    response_time: float

    moves: int

    hints: int


# =========================================================
# CORS
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health():

    return {

        "status":
            "healthy",

        "app":
            "SMRITI"

    }


# =========================================================
# APP INFO
# =========================================================

@app.get("/api/info")
def app_info():

    return {

        "name":
            "SMRITI",

        "version":
            "1.0.0",

        "description":
            "AI-Powered Cognitive Companion for Elderly Care"

    }


# =========================================================
# SUBMIT GAME RESULT
# =========================================================

@app.post("/api/game-results")
def submit_game_result(result: GameResult):

    conn = get_db()

    cursor = conn.cursor()


    # =====================================================
    # CURRENT TIME
    # =====================================================

    created_at = datetime.now().isoformat()


    # =====================================================
    # SAVE GAME RESULT
    # =====================================================

    cursor.execute(
        """
        INSERT INTO game_results
        (
            patient_id,
            game_type,
            difficulty,
            score,
            accuracy,
            response_time,
            moves,
            hints,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,

        (
            result.patient_id,
            result.game_type,
            result.difficulty,
            result.score,
            result.accuracy,
            result.response_time,
            result.moves,
            result.hints,
            created_at
        )
    )


    conn.commit()


    result_id = cursor.lastrowid


    # =====================================================
    # GET LAST 5 PERFORMANCE RESULTS
    # =====================================================

    cursor.execute(
        """
        SELECT

            score,

            accuracy,

            response_time,

            difficulty,

            game_type,

            created_at

        FROM game_results

        WHERE patient_id = ?

        ORDER BY created_at DESC

        LIMIT 5
        """,

        (
            result.patient_id,
        )
    )


    rows = cursor.fetchall()


    conn.close()


    # =====================================================
    # AI RECOMMENDATION
    # =====================================================

    # IMPORTANT:
    # We call the AI ENGINE function here.
    #
    # NOT:
    # get_patient_adaptive_recommendation(rows)
    #
    # Because that would call the API endpoint again.

    recommendation = get_adaptive_recommendation(
        rows
    )


    # =====================================================
    # FINAL RESPONSE
    # =====================================================

    return {

        "status":
            "success",

        "result_id":
            result_id,

        "game_result":
            result.model_dump(),

        "recommendation":
            recommendation

    }


# =========================================================
# PATIENT HISTORY
# =========================================================

@app.get("/api/patient/{patient_id}/history")
def get_patient_history(
    patient_id: str
):

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT *

        FROM game_results

        WHERE patient_id = ?

        ORDER BY created_at DESC

        LIMIT 30
        """,

        (
            patient_id,
        )
    )


    rows = cursor.fetchall()

    conn.close()


    history = [

        dict(row)

        for row in rows

    ]


    return {

        "status":
            "success",

        "patient_id":
            patient_id,

        "history":
            history

    }


# =========================================================
# PATIENT SUMMARY
# =========================================================

@app.get("/api/patient/{patient_id}/summary")
def get_patient_summary(
    patient_id: str
):

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT

            COUNT(*) AS total_sessions,

            AVG(score) AS average_score,

            AVG(accuracy) AS average_accuracy,

            MAX(score) AS best_score

        FROM game_results

        WHERE patient_id = ?
        """,

        (
            patient_id,
        )
    )


    summary = cursor.fetchone()

    conn.close()


    # =====================================================
    # NO DATA
    # =====================================================

    if summary["total_sessions"] == 0:

        return {

            "status":
                "success",

            "total_sessions":
                0,

            "average_score":
                0,

            "average_accuracy":
                0,

            "best_score":
                0

        }


    # =====================================================
    # SUMMARY RESPONSE
    # =====================================================

    return {

        "status":
            "success",

        "total_sessions":
            summary["total_sessions"],

        "average_score":
            round(
                summary["average_score"],
                1
            ),

        "average_accuracy":
            round(
                summary["average_accuracy"],
                1
            ),

        "best_score":
            round(
                summary["best_score"],
                1
            )

    }


# =========================================================
# PATIENT TREND
# =========================================================

@app.get("/api/patient/{patient_id}/trend")
def get_patient_trend(
    patient_id: str
):

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT

            score,

            accuracy,

            game_type,

            created_at

        FROM game_results

        WHERE patient_id = ?

        ORDER BY created_at ASC

        LIMIT 10
        """,

        (
            patient_id,
        )
    )


    rows = cursor.fetchall()

    conn.close()


    trend = []


    for row in rows:

        trend.append({

            "score":
                row["score"],

            "accuracy":
                row["accuracy"],

            "game_type":
                row["game_type"],

            "created_at":
                row["created_at"]

        })


    return {

        "status":
            "success",

        "patient_id":
            patient_id,

        "trend":
            trend

    }


# =========================================================
# ADAPTIVE RECOMMENDATION
# =========================================================

@app.get("/api/patient/{patient_id}/adaptive")
def get_patient_adaptive_recommendation(
    patient_id: str
):

    conn = get_db()

    cursor = conn.cursor()


    # =====================================================
    # GET LAST 5 RESULTS
    # =====================================================

    cursor.execute(
        """
        SELECT

            score,

            accuracy,

            response_time,

            difficulty,

            game_type,

            created_at

        FROM game_results

        WHERE patient_id = ?

        ORDER BY created_at DESC

        LIMIT 5
        """,

        (
            patient_id,
        )
    )


    rows = cursor.fetchall()

    conn.close()


    # =====================================================
    # SEND ROWS TO AI ENGINE
    # =====================================================

    # IMPORTANT:
    #
    # The endpoint has the name:
    # get_patient_adaptive_recommendation
    #
    # The AI function has the name:
    # get_adaptive_recommendation
    #
    # We MUST call the AI function here.

    recommendation = get_adaptive_recommendation(
        rows
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "status":
            "success",

        "patient_id":
            patient_id,

        "recommendation":
            recommendation

    }


# =========================================================
# FRONTEND
# =========================================================

app.mount(

    "/",

    StaticFiles(

        directory=str(FRONTEND_DIR),

        html=True

    ),

    name="frontend"

)