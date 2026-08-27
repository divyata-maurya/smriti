import sqlite3
from datetime import datetime


DATABASE = "backend/smriti.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


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


def save_game_result(result):

    conn = get_db()
    cursor = conn.cursor()

    created_at = datetime.now().isoformat()

    cursor.execute("""
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
    """, (
        result.patient_id,
        result.game_type,
        result.difficulty,
        result.score,
        result.accuracy,
        result.response_time,
        result.moves,
        result.hints,
        created_at
    ))

    conn.commit()

    result_id = cursor.lastrowid

    conn.close()

    return result_id


def get_recent_results(patient_id, limit=5):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
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
        LIMIT ?
    """, (patient_id, limit))

    rows = cursor.fetchall()

    conn.close()

    return rows