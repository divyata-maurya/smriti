from pydantic import BaseModel


class GameResult(BaseModel):
    patient_id: str
    game_type: str
    difficulty: str
    score: float
    accuracy: float
    response_time: float
    moves: int
    hints: int